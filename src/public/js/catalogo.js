document.addEventListener("DOMContentLoaded", async () => {
    requireLogin();

    const grid = document.getElementById("product-grid");
    const modal = document.getElementById("product-modal");
    const modalClose = document.getElementById("modal-close");

    modalClose.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    async function abrirDetalle(id) {
        try {
            const res = await fetch(`/api/products/details?id=${id}`);
            const data = await res.json();
            const producto = Array.isArray(data) ? data[0] : data;

            document.getElementById("modal-nombre").textContent = producto.nombre;
            document.getElementById("modal-descripcion").textContent = producto.descripcion;
            document.getElementById("modal-precio").textContent = producto.precio;
            document.getElementById("modal-stock").textContent = producto.stock;

            modal.classList.remove("hidden");
        } catch (error) {
            alert("No se pudo cargar el detalle del producto");
        }
    }

    try {
        const res = await fetch("/api/products/");
        const productos = await res.json();

        productos.forEach((producto) => {
            const card = document.createElement("article");
            card.className = "product-card";
            card.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p class="price">$${producto.precio}</p>
            `;
            card.addEventListener("click", () => abrirDetalle(producto.id));
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = "<p>No se pudo cargar el catálogo.</p>";
    }
});
