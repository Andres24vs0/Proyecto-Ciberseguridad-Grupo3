// Gestión de sesión de usuario y navegación
    // Almacenamiento en local storage, permite mantener la sesión persistente al recargar la página
        // Estos datos son accesibles por js ejecutado en el mismo origen
    // Logout, se asegura la eliminación del token y datos de usuario en el navegador
    // evitando la reutilización no autorizada del token

const SESSION_KEY = 'usuario_sesion';
const TOKEN_KEY = 'session_token';

// Guarda los datos del usuario y el token de sesión en la memoria local del navegador
function setSession(usuario, token) {
    // Serialización a JSON para almacenar objetos estructurados
    localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    localStorage.setItem(TOKEN_KEY, token);
}

// Recupera el objeto de usuario desde LocalStorage
function getSession() {
    const data = localStorage.getItem(SESSION_KEY);
    // Evita fallos de ejecución si la clave de no existe
    return data ? JSON.parse(data) : null;
}

// Obtiene el token de sesión almacenado en el cliente 
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Construye los encabezados del HTTP para peticiones fetch
    // Formato estándar Bearer, incluye el token bajo el esquema
    // Solo adjunta el header de autorización si el token existe
function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// Borra el estado de la sesión activa en el almacenamiento del usuario
// Previene reutilización indebida de credenciales
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
}

// Redirige al login si no hay sesión o token activos
function requireLogin() {
    if (!getSession() || !getToken()) {
        window.location.href = 'index.html';
    }
}

// Ejecuta la limpieza de credenciales locales y la redirección a la vistade inicio
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearSession();
            window.location.href = 'index.html';
        });
    }
});