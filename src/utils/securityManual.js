import crypto from 'crypto';

// Funciones de utilidades de seguridad
// Key stretching OWASP A02:2025
// Dificulta atques de fuerza bruta por CPU

const ITERACIONES = 10000;

// Valida estructura y límites del correo electrónico
    // Prevención de Inyección de Arrays
    // Control de longitud que evita DoS por memoria o cadenas infinitas

export function validarEmail(email) {
    if (typeof email !== 'string') return false;
    const limpio = email.trim().toLowerCase();
    if (limpio.length < 5 || limpio.length > 100) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio);
}

// Valida que la contraseña cumpla con los requisitos de seguridad
    // Mitiga fuerza bruta y ataques DoS

export function validarContra(contra) {
    if (typeof contra !== 'string') return false;
    return contra.length >= 8 && contra.length <= 72;
}

// Valida la entrada del nombre de usuario
    // Previene el envío de datos vacíos o tipos no esperados

export function validarNombre(nombre) {
    if (typeof nombre !== 'string') return false;
    const limpio = nombre.trim();
    return limpio.length >= 2 && limpio.length <= 100;
}

// Hash seguro de la contraseña con salting y key stretching

export function hashContraManual(contra) {
    // Genera Salt aleatorio 
    const salt = crypto.randomBytes(16).toString('hex');
    let hash = contra + salt;

    // Bucle de Key stretching (SHA-256)
    for (let i = 0; i < ITERACIONES; i++) {
        hash = crypto.createHash('sha256').update(hash).digest('hex');
    }

    return `${salt}:${hash}`;
}

// Verifica una contraseña contra el hash/salt almacenado
    // Control de formato para evitar excepciones
    // Prevención de timing attacks 

export function verificarContraManual(contra, almacenada) {
    if (typeof almacenada !== 'string' || !almacenada.includes(':')) {
        return false;
    }

    const partes = almacenada.split(':');
    if (partes.length !== 2) return false;

    const salt = partes[0];
    const hashEsperado = partes[1];

    let hash = contra + salt;
    // Recalcula el hash con el salt recuperado
    for (let i = 0; i < ITERACIONES; i++) {
        hash = crypto.createHash('sha256').update(hash).digest('hex');
    }
    // Conversión a buffers para comparación segura
    const a = Buffer.from(hash, 'utf8');
    const b = Buffer.from(hashEsperado, 'utf8');
    // Módulos con diferente longitud fallan
    if (a.length !== b.length) return false;
    // Comparación en tiempo constante 
    return crypto.timingSafeEqual(a, b);
}

//Genera un token aleatorio de alta entropía para gestión de sesiones

export function generarTokenSesion() {
    return crypto.randomBytes(32).toString('hex');
}