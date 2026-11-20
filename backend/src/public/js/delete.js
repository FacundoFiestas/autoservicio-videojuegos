const urlBase = "http://localhost:3000";
const formDeleteProduct = document.getElementById("form-deleteProduct");
const inputId = document.getElementById("prodId");
const contMensaje = document.getElementById("cont-mensaje");

const modalConfirmar = document.getElementById("modal-confirmar");
const confirmProdId = document.getElementById("confirm-prodId");
const btnConfirmarEliminar = document.getElementById("btn-confirmarEliminar");
const btnCancelarEliminar = document.getElementById("btn-cancelarEliminar");

let idPendienteEliminar = null;

function mostrarMensaje(tipo, mensaje) {
    contMensaje.innerHTML = `
        <p class="mensaje ${tipo}">${mensaje}</p>
    `;
}

function limpiarMensaje() {
    contMensaje.innerHTML = "";
}

function abrirConfirmacion(id) {
    idPendienteEliminar = id;
    confirmProdId.textContent = id;
    modalConfirmar.hidden = false;
}

function cerrarConfirmacion() {
    idPendienteEliminar = null;
    modalConfirmar.hidden = true;
}

btnCancelarEliminar.addEventListener("click", cerrarConfirmacion);

modalConfirmar.addEventListener("click", (event) => {
    if (event.target === modalConfirmar) {
        cerrarConfirmacion();
    }
});

formDeleteProduct.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensaje();

    const id = inputId.value.trim();

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return mostrarMensaje("error", "Número de ID inválido");
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${id}`);
        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje(
                "error",
                data.message || `No se encontró ningún producto con ID ${id}`
            );
        }

        abrirConfirmacion(id);
    } catch (error) {
        console.error("Error al verificar producto:", error);
        return mostrarMensaje("error", "Error de conexión con el servidor");
    }
});

btnConfirmarEliminar.addEventListener("click", async () => {
    if (!idPendienteEliminar) return;

    const id = idPendienteEliminar;
    cerrarConfirmacion();

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