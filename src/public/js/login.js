document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            tabBtns.forEach((b) => b.classList.remove("active"));
            panels.forEach((p) => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`${btn.dataset.tab}-form`).classList.add("active");
        });
    });

    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const contra = document.getElementById("login-pass").value;

        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, contra }),
            });
            const data = await res.json();

            if (!res.ok) {
                loginMessage.textContent = data.error || "Credenciales incorrectas";
                return;
            }

            setSession(data.usuario);
            window.location.href = "catalogo.html";
        } catch (error) {
            loginMessage.textContent = "No se pudo conectar con el servidor";
        }
    });

    const registerForm = document.getElementById("register-form");
    const registerMessage = document.getElementById("register-message");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("reg-nombre").value;
        const email = document.getElementById("reg-email").value;
        const contra = document.getElementById("reg-pass").value;

        try {
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, contra }),
            });
            const data = await res.json();

            if (!res.ok) {
                registerMessage.textContent = data.error || "No se pudo completar el registro";
                return;
            }

            registerMessage.textContent = "Cuenta creada. Ahora puedes iniciar sesión.";
            registerForm.reset();
        } catch (error) {
            registerMessage.textContent = "No se pudo conectar con el servidor";
        }
    });
});
