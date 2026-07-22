import pool from '../config/db.js';
import {
    validarEmail,
    validarContra,
    validarNombre,
    hashContraManual,
    verificarContraManual,
    generarTokenSesion,
} from '../utils/securityManual.js';

// Controlador de autenticación y gestión de cuentas
    // Manejo de errores silencioso OWASP A01:A07
        // Se evitan mensajes explícitos y se utilizan respuestas genéricas
    // Control de acceso basado en contexto Anti-IDOR / CWE-306
        // En operaciones como cambio de contraseña, se valida que la identidad del payload
        // contra la identidad validada en el token de sesión

// Maneja el inicio de sesión del usuario y la emisión de tokens de sesión
    // Limpia espacios y normaliza a minúsculas
    // Si la sintaxis de email o contraseña falla responde 400 sin ir a la BD
    // Consultas parametrizadas '$1' evita SQL Injection
    // Verifica el hash en tiempo constante
    // Gestión segura de sesiones, emite token aleatorio de alta entropía con ventana de expiración fija
    // en la tabla de sesiones


export async function login(req, res) {
    const { email, contra } = req.body;
    // Validación precia , ahorra recursos de la BD
    if (!validarEmail(email) || !validarContra(contra)) {
        return res.status(400).json({ error: 'Ingrese email y contraseña válidos.' });
    }

    try {
        // Búsqueda parametrizada del usuario por correo
        const result = await pool.query(
            'SELECT id, nombre, email, contra FROM usuarios WHERE email = $1',
            [email.trim().toLowerCase()]
        );
        // Anti-enumeración, envía el mismo mensaje si el correo no existe o si la contraseña es incorrecta
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos).' });
        }

        const usuario = result.rows[0];

        // Comparación del hash mediante key stretching + timingSafeEqual 
        if (!verificarContraManual(contra, usuario.contra)) {
            return res.status(401).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos).' });
        }
        // Generación de token único de sesión
        const token = generarTokenSesion();
        const expiraEn = new Date(Date.now() + 2 * 60 * 60 * 1000);
        // Registrar la sesión actia en la BD para control stateful
        await pool.query(
            'INSERT INTO sesiones (usuario_id, token, expira_en) VALUES ($1, $2, $3)',
            [usuario.id, token, expiraEn]
        );
        // Retorino seguro, excluye el hash de la contraseña de la respuesta JSON
        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
            },
        });
    } catch (error) {
        // Captura de excepciones, previene un crash del servidor y fuga de stack trace
        return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
    }
}

// Registra un nuevo usuario en el sistema 
    // Validación del formato
    // Hash seguro de contraseña, no se almacenan claves en texto plano
    // Manejo de duplicados en BD
export async function register(req, res) {
    const { nombre, email, contra } = req.body;
    // Control de entradas
    if (!validarNombre(nombre) || !validarEmail(email) || !validarContra(contra)) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y deben ser válidos.' });
    }

    try {
        // Cómputo del hash con salting
        const contraHash = hashContraManual(contra);
        // Insersión con la cláusulaRETURNING  que omite la clave cifrada
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, contra) VALUES ($1, $2, $3) RETURNING id, nombre, email',
            [nombre.trim(), email.trim().toLowerCase(), contraHash]
        );

        return res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            usuario: result.rows[0],
        });
    } catch (error) {
        // Código de error de PostgreSQL para violación de unicidad (correo duplicado)
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El correo electrónico ya se encuentra registrado.' });
        }
        return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
    }
}

// Permite a un usuario autenticado actualizar su contraseña
    // Mitigación IDOR / Broken Object Level Authorization (OWASP A01:2025)
        // Valida que el email proporcionado coincida con el email extraído y autenticado
        // Impide que un usuario A cambie la clave de B enviando el correo de B
    // UPDATE restringe los cambios aplicando WHERE id = $2 AND email = $3, previene cambios de otros usuarios
    // Retorna 403 genérico en cualquier intento de alteración de identidades
export async function updatePassword(req, res) {
    const { email, nuevacontra } = req.body;
    // Validar tipo y formato antes de procesar 
    if (!validarEmail(email) || !validarContra(nuevacontra)) {
        return res.status(403).json({ error: 'Acceso denegado.' });
    }

    const emailPayload = email.trim().toLowerCase();
    const emailSesion = req.usuarioSesion.email.trim().toLowerCase();

    // Mitigación IDOR (A01 / CWE-306)
    // El usuario solo actualiza su propia contraseña
    if (emailPayload !== emailSesion) {
        return res.status(403).json({ error: 'Acceso denegado.' });
    }

    try {
        // Generar nuevo salt y hash con key stretching
        const nuevoHash = hashContraManual(nuevacontra);
        // Inserción condicional por los datos validados en el middleware
        const result = await pool.query(
            `UPDATE usuarios
             SET contra = $1
             WHERE id = $2 AND email = $3
             RETURNING id, email, nombre`,
            [nuevoHash, req.usuarioSesion.id, req.usuarioSesion.email]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({ error: 'Acceso denegado.' });
        }

        return res.status(200).json({
            message: 'Contraseña actualizada exitosamente.',
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    }
}