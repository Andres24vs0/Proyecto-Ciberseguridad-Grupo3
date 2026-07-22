import pool from '../config/db.js';

// Middleware para el control de acceso y autenticación
// Control de acceso rígido OWASP A01:2025
    // Verifica la validez y expiración de la sesión anter de permitir acceso
    // Devuelve respuestas de error uniformes (403) para no revelar información
    // en caso que el token no exista o haya expirado

// La función extrae y valida el token Bearer desde el encabezado
// Typeof evita la inyección de objetos o arreglos
// Exige el esquema "Bearer <token>"
// Whitelisting asegura que el token sea una cadena de 64 caracteres 
// si el formato no se cumple no se realiza la consulta en la BD

function extraerBearerToken(req) {
    const authHeader = req.headers.authorization;
    // Verifica la presencia del header y que sea un string
    if (!authHeader || typeof authHeader !== 'string') {
        return null;
    }
    // Dividir "Bearer <token>"
    const partes = authHeader.trim().split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return null;
    }

    const token = partes[1].trim();
    // Whitelisting: el token debe ser una cadena hexadecimal de 64 caracteres
    if (!/^[a-f0-9]{64}$/.test(token)) {
        return null;
    }

    return token;
}

// Validar la sesión activa en la BD
// Consultas parametrizadas ($1), previene la inyeccion SQL
// Validación triple de sesión, verifica la presencia del token, estado y fecha de expiración
// Menor privilegio en datos, SELECT solo extrae campos necesarios
// Manejo de excepciones no se expone el stack trace en caso de error interno de la BD
// , da un mensaje genérico

export async function requireSession(req, res, next) {
    const token = extraerBearerToken(req);
    // Si el token es inválido o no existe, rechaza sin ir a la BD
    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado.' });
    }

    try {
        // Consulta parametrizada segura contra SQL Injection
        const result = await pool.query(
            `SELECT u.id, u.nombre, u.email
             FROM sesiones s
             INNER JOIN usuarios u ON u.id = s.usuario_id
             WHERE s.token = $1
               AND s.activo = TRUE
               AND s.expira_en > NOW()`,
            [token]
        );
        // Si la sesión no existe está inactiva o expiró
        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }
        // Adjunta los datos de la sesión validada al objeto del request
        req.usuarioSesion = result.rows[0];
        req.sessionToken = token;
        // Continua a la ruta protegida
        next();
    } catch (error) {
        // Captura errores para evitar crash del servidor
        return res.status(403).json({ error: 'Acceso denegado.' });
    }
}