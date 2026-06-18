import { Router } from "express";
const router = Router();
import { updatePassword } from "../controllers/authController.js";

// Superficie de ataque inicial: Modificación de contraseñas
router.post("/update-password", updatePassword);

export default router;
