import { Router } from 'express';
const router = Router();
import { getAllProducts, getProductDetails } from '../controllers/productController.js';

// Ruta para el catálogo completo
router.get('/', getAllProducts);

// Superficie de ataque inicial: Consulta de detalles por Query String
router.get('/details', getProductDetails);

export default router;