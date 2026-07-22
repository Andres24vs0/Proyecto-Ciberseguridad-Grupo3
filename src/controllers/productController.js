import pool from '../config/db.js'; 

/* En este controlador se manejarán las operaciones relacionadas con los productos 
incluyendo la consulta de detalles a través de parámetros en la URL */

// Endpoint básico para obtener todo el catálogo de productos
export async function getAllProducts(req, res) {
    try {
        const query = "SELECT id, nombre, precio FROM productos ORDER BY id ASC"; 
        const result = await pool.query(query);

        return res.status(200).json(result.rows);

    } catch (error) {
        const timestamp = new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' });

        console.error(`ERROR LOG - [${timestamp}] Error al cargar el catálogo:`, error.message);
        return res.status(500).json({ 
            error: "No se pudo cargar el catálogo de productos." 
        });
    }
}

// Función Vulnerable | Vulnerabilidad A10:2025 Gestión Deficiente de Condiciones de Excepción
export async function getProductDetails(req, res) {
    try {
        const productId = req.query.id;  // Obtenemos el id introducido en el request

        const idProcesado = productId.trim(); //Usamos la función trim, asumiendo que el id es un string, para quitarle espacios en blanco que pueda poseer
        /*La línea superior es vulnerable ya que si un atacante inyecta un tipo de dato diferente al un string, como un array,
        al realizar la función trim ocurrirá un TypeError*/

        const query = "SELECT * FROM productos WHERE id = " + idProcesado; //Realiza la consulta a la base de datos con el id procesado
        const result = await pool.query(query);

        return res.status(200).json(result.rows);   //Devuelve la consulta

    } catch (error) {
        return res.status(500).json({
            message: "Error interno del servidor",
            detalle_tecnico: error.stack 
        }); /*El catch al fallar al producirse el TypeError expone todo el stack del error directamente al cliente
            lo que le permite al atacate poder observar rutas y librerías de la estructura del servidor*/
    }
}