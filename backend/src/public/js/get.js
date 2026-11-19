const urlBase = "http://localhost:3000";
const formGetProduct = document.getElementById("form-getProduct");
const contMensaje = document.getElementById("cont-mensaje");
const contResultado = document.getElementById("cont-resultado");

function mostrarMensaje(tipo, mensaje) {
    contMensaje.innerHTML = `<p class="mensaje ${tipo}">${mensaje}</p>`;
}

function limpiarMensajes() {
    contMensaje.innerHTML = "";
}

function renderizarProducto(producto) {
    contResultado.innerHTML = `
        <article class="card-producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <span>ID: ${producto.id}</span>
            <h4>${producto.nombre}</h4>
            <p>Precio: $${producto.precio}</p>
            <p>Tipo: ${producto.tipo}</p>
            <p>Activo: ${producto.activo}</p>
        </article>
    `;
}

formGetProduct.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensajes();
    contResultado.innerHTML = "";

    const id = document.getElementById("prodId").value.trim();

    if (!id || Number(id) <= 0) {
        return mostrarMensaje("error", "Número de ID inválido");
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${id}`);
        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje("error", data.message || "Producto no encontrado");
        }

        const producto = data.data;
        renderizarProducto(producto);

    } catch (error) {
        console.error("Error al consultar producto:", error);
        return mostrarMensaje("error", "Error de conexión con el servidor");
    }
});