document.addEventListener('DOMContentLoaded', () => {
    requireLogin();

    const sesion = getSession();
    document.getElementById('info-nombre').textContent = sesion.nombre || '-';
    document.getElementById('info-email').textContent = sesion.email || '-';

    const form = document.getElementById('password-form');
    const message = document.getElementById('password-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-pass').value;
        const confirmPassword = document.getElementById('confirm-pass').value;

        if (newPassword !== confirmPassword) {
            message.textContent = 'Las contraseñas no coinciden';
            return;
        }

        try {
            // Endpoint protegido
                // Encabezados de autorización
                    // Envía el Authorization: Bearer <token> requerido por el middleware
                    // del servidor requireSession para validar la sesión activa
                // Transmisión cifrada en JSON
                    // Serializa el payload en JSON, incluyendo el correo de la sesión verificada
                    // y la nueva clave para validar la coincidencia anti-IDOR mediante el servidor
            const res = await fetch('/api/users/update-password', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    email: sesion.email,
                    nuevacontra: newPassword,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                message.textContent = data.error || 'No se pudo actualizar la contraseña';
                return;
            }

            message.textContent = data.message || 'Contraseña actualizada';
            form.reset();
        } catch (error) {
            message.textContent = 'No se pudo conectar con el servidor';
        }
    });
});