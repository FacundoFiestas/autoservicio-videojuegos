const urlBase = "http://localhost:3000";
const formDeleteProduct = document.getElementById("form-deleteProduct");
const contDeleteProduct = document.getElementById("cont-deleteProduct");

function mostrarMensaje(tipo, mensaje) {
    contDeleteProduct.innerHTML = `
        <p class="mensaje ${tipo}">${mensaje}</p>
    `;
}

formDeleteProduct.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("prodId").value.trim();

    if (!id || Number(id) <= 0) {
        return mostrarMensaje("error", "Número de ID inválido");
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje("error", data.message || "No se pudo eliminar el producto");
        }

        const mensaje = data.message || `Producto con ID ${id} eliminado correctamente`;
        formDeleteProduct.reset();
        return mostrarMensaje("exito", mensaje);

    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return mostrarMensaje("error", "Error de conexión con el servidor");
    }
});