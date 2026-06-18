import { Router } from 'express';
const router = Router();
import { getProductDetails } from '../controllers/productController.js';

// Superficie de ataque inicial: Consulta de detalles por Query String
router.get('/details', getProductDetails);

export default router;