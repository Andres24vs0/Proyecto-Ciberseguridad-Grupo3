import { Router } from 'express';
import { updatePassword, register, login } from '../controllers/authController.js';
import { requireSession } from '../middleware/sessionManual.js';
// Puntos de entrada para la gestión de identidades separando rutas de acceso público de las rutas protegidas
const router = Router();

// Rutas públicas sin autenticación previa
// Autentica credenciales (email y clave) y devuelve un token de sesión
router.post('/login', login);
// Registra nuevo usuario con hashing seguro de contraseña
router.post('/register', register);

// Ruta protegida
// Middleware requireSession, extrae y valida el token Bearer antes de ejecutar el controlador
// COntrolador updatePassword, valida la coincidencia de identidad para mitigar IDOR
router.post('/update-password', requireSession, updatePassword);

export default router;
