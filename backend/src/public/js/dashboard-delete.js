const urlBase = "http://localhost:3000";

const contMensaje = document.getElementById("cont-mensaje");
const modalConfirmar = document.getElementById("modal-confirmar");
const confirmAccionTexto = document.getElementById("confirm-accionTexto");
const confirmProdId = document.getElementById("confirm-prodId");
const confirmProdNombre = document.getElementById("confirm-prodNombre");
const btnConfirmarEliminar = document.getElementById("btn-confirmarEliminar");
const btnCancelarEliminar = document.getElementById("btn-cancelarEliminar");

let pendienteCambioEstado = null;

function mostrarMensaje(tipo, mensaje) {
    contMensaje.innerHTML = `<p class="mensaje ${tipo}">${mensaje}</p>`;
    contMensaje.style.display = "block";
}

function ocultarMensaje() {
    contMensaje.innerHTML = "";
    contMensaje.style.display = "none";
}

function abrirConfirmacion(id, nombre, estaActivo) {
    ocultarMensaje();
    const nuevoEstado = !estaActivo;
    pendienteCambioEstado = { id, nombre, nuevoEstado };

    confirmAccionTexto.textContent = estaActivo ? "Dar de baja" : "Activar";
    btnConfirmarEliminar.textContent = estaActivo ? "Si, dar de baja" : "Si, activar";
    confirmProdId.textContent = id;
    confirmProdNombre.textContent = nombre;
    modalConfirmar.hidden = false;
}

function cerrarConfirmacion() {
    pendienteCambioEstado = null;
    modalConfirmar.hidden = true;
}

document.addEventListener("click", (event) => {
    const boton = event.target.closest(".btn-estado-card");
    if (!boton) return;

    const id = boton.dataset.id;
    const nombre = boton.dataset.nombre;
    const estaActivo = boton.dataset.activo === "true";

    abrirConfirmacion(id, nombre, estaActivo);
});

btnCancelarEliminar.addEventListener("click", cerrarConfirmacion);

modalConfirmar.addEventListener("click", (event) => {
    if (event.target === modalConfirmar) {
        cerrarConfirmacion();
    }
});

btnConfirmarEliminar.addEventListener("click", async () => {
    if (!pendienteCambioEstado) return;

    const { id, nuevoEstado } = pendienteCambioEstado;
    cerrarConfirmacion();

    try {
        const response = await fetch(`${urlBase}/api/productos/${id}/estado`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ activo: nuevoEstado })
        });

        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje("error", data.message || "No se pudo actualizar el estado del producto");
        }

        const estadoFinal = Boolean(data.data?.activo ?? nuevoEstado);

        const card = document.querySelector(`.card-producto[data-id="${id}"]`);
        if (card) {
            const estadoEl = card.querySelector(".estado-producto");
            if (estadoEl) {
                estadoEl.textContent = `Activo: ${estadoFinal}`;
            }

            const botonCard = card.querySelector(".btn-estado-card");
            if (botonCard) {
                botonCard.dataset.activo = String(estadoFinal);
                botonCard.textContent = estadoFinal ? "Dar de baja" : "Activar";
            }
        }

        return mostrarMensaje(
            "exito",
            data.message || (estadoFinal
                ? `Producto #${id} activado correctamente`
                : `Producto #${id} dado de baja correctamente`)
        );
    } catch (error) {
        console.error("Error al cambiar el estado del producto:", error);
        return mostrarMensaje("error", "Error de conexión con el servidor");
    }
});