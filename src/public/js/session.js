const SESSION_KEY = "usuario_sesion";

function setSession(usuario) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
}

function getSession() {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

function requireLogin() {
    if (!getSession()) {
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            clearSession();
            window.location.href = "index.html";
        });
    }
});
