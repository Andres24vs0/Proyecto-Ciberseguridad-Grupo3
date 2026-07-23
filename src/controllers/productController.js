import pool from '../config/db.js';

/* En este controlador se manejarán las operaciones relacionadas con los productos 
incluyendo la consulta de detalles a través de parámetros en la URL */

// CONTROLADOR DE PRODUCTOS
// Mitigar el riesgo OWASP A10:2025 y el CWE-209 (Fuga de información mediante mensajes de error crudos y Stack Traces)
// Validar manualmente la variable `id` de la URL para verificar que sea una cadena numérica y NO un arreglo (`?id[]=1`)
// Rechazando con `400 Bad Request` si es un tipo de dato inválido

// Carga la lista completa de productos para la vista del catálogo
export const getAllProducts = async (req, res) => {
    try {
        // Consultamos la base de datos PostgreSQL para obtener todos los productos
        const result = await pool.query('SELECT * FROM productos');
        return res.json(result.rows);
    } catch (error) {
        console.error("Error interno al obtener productos:", error);
        
        return res.status(500).json({ error: "Ocurrió un error al cargar el catálogo de productos." });
    }
};

// Busca los detalles de UN solo producto por su ID en la URL (ej: /api/products/details?id=1)
    // Aquí el Red Team ataca enviando arreglos (?id[]=1&id[]=2) para romper Node.js
export const getProductDetails = async (req, res) => {
    // Se extrae la variable 'id' que viene en los parámetros de la URL
    const { id } = req.query;

    // CONTROL 1: Validación de Tipo de Dato (Neutraliza el Array Injection)
        // Se verifica que el parámetro no venga vacío
        // Se garantiza que lo recibido sea texto
        // Se detiene la inyección si el atacante manda ?id[]=1&id[]=2
    if (!id || typeof id !== 'string' || Array.isArray(id)) {
        return res.status(400).json({ 
            error: "Parámetro de búsqueda inválido. El ID debe ser un único valor numérico." 
        });
    }

    // CONTROL 2: Validación de Formato Numérico
        // Se convierte el texto enviado a un número entero base 10
    const productId = parseInt(id, 10);

        // Se rechaza si se mandan letras (ej: ?id=abc), números negativos o cero
    if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({ 
            error: "El ID del producto debe ser un número entero positivo." 
        });
    }

    try {
        // Se usa consultas parametrizadas ($1) para evitar inyecciones SQL en la BD
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [productId]);

        // Si la consulta no devuelve ningún registro en la tabla
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado." });
        }

        // Si el producto existe, se devuelve la fila en formato JSON
        return res.json(result.rows[0]);

    } catch (error) {
        // CONTROL 3: Manejo Seguro de Excepciones (Mitigación CWE-209)
            // Se registra el Stack Trace completo SOLO en el log del servidor
        console.error("LOG INTERNO - Error en consulta de producto:", error);

            // No se devuelve 'error' o 'error.stack', sino un JSON genérico con código 500 para proteger la infraestructura
        return res.status(500).json({ 
            error: "Ocurrió un error procesando la solicitud. Por favor intente más tarde." 
        });
    }
};


