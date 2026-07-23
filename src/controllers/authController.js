// En este controlador se manejarán las operaciones relacionadas con la autenticación y 
// gestión de usuarios, incluyendo la actualización de contraseñas.

import pool from '../config/db.js';
//piedad profe francis

//Funcion de inicio de sesionnnnn
export async function login(req, res) {
    const { email, contra } = req.body;

    //Si falta algun campo
    if (!email || !contra) {
        return res.status(400).json({ 
            error: "Ingrese email y contraseña." 
        });
    }

    try {
        //Se busca el usuario
        const query = "SELECT id, nombre, email FROM usuarios WHERE email = '" + email + "' AND contra = '" + contra + "'";
        const result = await pool.query(query);

        //Si no hubo coincidencias
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: "Credenciales inválidas (correo o contraseña incorrectos)." 
            });
        }

        //Si se logro acceder
        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            usuario: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({ 
            error: "Error interno del servidor al iniciar sesión." 
        });
    }
}


//Funcion de Registro para los usuarios
export async function register(req, res) {
    const { nombre, email, contra } = req.body;

    //Validación básica de campos requeridos
    if (!nombre || !email || !contra) {
        return res.status(400).json({ 
            error: "Todos los campos son obligatorios." 
        });
    }

    try {
        //Inserción en la tabla usuarios
        const query = "INSERT INTO usuarios (nombre, email, contra) VALUES ('" + nombre + "', '" + email + "', '" + contra + "') RETURNING id, nombre, email";
        const result = await pool.query(query);

        return res.status(201).json({
            message: "Usuario registrado exitosamente.",
            usuario: result.rows[0]
        });

    } catch (error) {
        //Error si el correo ya existe
        if (error.code === '23505') {
            return res.status(400).json({ 
                error: "El correo electrónico ya se encuentra registrado." 
            });
        }
        return res.status(500).json({ 
            error: "Error interno del servidor al registrar el usuario." 
        });
    }
}

//Funcion Vulnerable y donde va la logica de la actualizacion de contraseña
export async function updatePassword(req, res) {
    const { email, nuevacontra } = req.body;

    //Se confia plenamente en las variables del cliente y se asume q el emisor 
    //de la solicitud de cambio es el dueño de la cuenta al no haber autenticacion

    try {
        //Se consulta a la tabla usuarios con los datos dados
        const query = "UPDATE usuarios SET contra = '" + nuevacontra + "' WHERE email = '" + email + "' RETURNING id, email, nombre";
        
        const result = await pool.query(query);

        //Si el correo suministrado no existe 
        if (result.rowCount === 0) {
            return res.status(404).json({ 
                error: "El usuario especificado no existe en el sistema." 
            });
        }

        //Ruptura de autenticacion al actualizar la contraseña sin validar la identidad
        return res.status(200).json({ 
            message: "Contraseña actualizada exitosamente.",
            usuario_modificado: result.rows.email
        });

    } catch (error) {
        return res.status(500).json({ 
            error: "Error interno del servidor al procesar la solicitud." 
        });
    }
}