document.addEventListener("DOMContentLoaded", () => {
    requireLogin();

    const sesion = getSession();
    document.getElementById("info-nombre").textContent = sesion.nombre || "-";
    document.getElementById("info-email").textContent = sesion.email || "-";

    const form = document.getElementById("password-form");
    const message = document.getElementById("password-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById("new-pass").value;
        const confirmPassword = document.getElementById("confirm-pass").value;

        if (newPassword !== confirmPassword) {
            message.textContent = "Las contraseñas no coinciden";
            return;
        }

        try {
            const res = await fetch("/api/users/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: sesion.email, nuevacontra: newPassword }),
            });
            const data = await res.json();

            message.textContent = data.message || data.error || "Contraseña actualizada";
            form.reset();
        } catch (error) {
            message.textContent = "No se pudo conectar con el servidor";
        }
    });
});
