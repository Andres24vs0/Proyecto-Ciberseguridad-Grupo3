import { Router } from "express";
const router = Router();
import { updatePassword, register, login } from "../controllers/authController.js";

// Superficie de ataque inicial: Modificación de contraseñas
router.post("/update-password", updatePassword);

//Ruta para el registro de nuevos usuarios
router.post("/register", register);

//Ruta para iniciar sesion
router.post("/login", login);

export default router;
