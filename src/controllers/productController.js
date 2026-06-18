//En este controlador se manejarán las operaciones relacionadas con los productos 
//incluyendo la consulta de detalles a través de parámetros en la URL (Query String).

export function getProductDetails(req, res) {
    const productId = req.query.id;

    // Aquí va la lógica

    return res.status(200).json({ 
        message: `Consulta del producto con id: ${productId} recibida` 
    });
}