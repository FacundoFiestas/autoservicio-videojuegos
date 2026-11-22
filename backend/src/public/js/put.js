const urlBase = "http://localhost:3000";

const formBuscarProducto = document.getElementById("form-buscarProducto");
const inputId = document.getElementById("prodId");
const contMensaje = document.getElementById("cont-mensaje");

const modalEditar = document.getElementById("modal-editar");
const btnCerrarModal = document.getElementById("btn-cerrarModal");
const modalProdId = document.getElementById("modal-prodId");
const formUpdateProduct = document.getElementById("form-updateProduct");
const contModalMensaje = document.getElementById("cont-modalMensaje");

const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputImagen = document.getElementById("imagen");
const selectTipo = document.getElementById("tipo");
const selectActivo = document.getElementById("activo");

let idProductoActual = null;
let productoActual = null;

function mostrarMensaje(contenedor, tipo, mensaje) {
    contenedor.innerHTML = `<p class="mensaje ${tipo}">${mensaje}</p>`;
}

function mostrarListaErrores(contenedor, array) {
    contenedor.innerHTML = array
        .map(error => `<p class="mensaje error">${error}</p>`)
        .join("");
}

function limpiarMensajes(contenedor) {
    contenedor.innerHTML = "";
}

function abrirModal() {
    modalEditar.hidden = false;
}

function cerrarModal() {
    modalEditar.hidden = true;
}

btnCerrarModal.addEventListener("click", cerrarModal);

modalEditar.addEventListener("click", (event) => {
    if (event.target === modalEditar) {
        cerrarModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalEditar.hidden) {
        cerrarModal();
    }
});

function cargarDatosEnModal(id, prod) {
    idProductoActual = id;
    productoActual = prod;

    modalProdId.textContent = id;
    inputNombre.value = prod.nombre ?? "";
    inputPrecio.value = prod.precio ?? "";
    inputImagen.value = "";
    selectTipo.value = prod.tipo ?? "";
    selectActivo.value = prod.activo !== undefined ? String(Boolean(prod.activo)) : "";

    abrirModal();
}

async function buscarYabrirModal(id) {
    limpiarMensajes(contMensaje);
    limpiarMensajes(contModalMensaje);

    const idLimpio = id ? String(id).trim() : "";
    if (!idLimpio || !Number.isInteger(Number(idLimpio)) || Number(idLimpio) <= 0) {
        return mostrarMensaje(contMensaje, "error", "El ID del producto no es válido");
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${idLimpio}`);
        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje(
                contMensaje,
                "error",
                data.message || `No se encontró ningún producto con ID ${idLimpio}`
            );
        }

        const prod = data.data || data.producto || data;
        cargarDatosEnModal(idLimpio, prod);
    } catch (error) {
        console.error("Error al buscar producto:", error);
        mostrarMensaje(contMensaje, "error", "Error de conexión con el servidor");
    }
}

formBuscarProducto.addEventListener("submit", async (event) => {
    event.preventDefault();
    await buscarYabrirModal(inputId.value);
});

formUpdateProduct.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensajes(contModalMensaje);

    if (!idProductoActual) {
        return mostrarMensaje(contModalMensaje, "error", "No hay un ID de producto seleccionado");
    }

    const errores = [];
    const formData = new FormData();
    let huboCambios = false;

    const nombreLimpio = inputNombre.value.trim();
    if (nombreLimpio !== "" && (!productoActual || nombreLimpio !== String(productoActual.nombre ?? ""))) {
        formData.append("nombre", nombreLimpio);
        huboCambios = true;
    }

    const precioTexto = inputPrecio.value.trim();
    if (precioTexto !== "") {
        const precioLimpio = parseFloat(precioTexto.replace(",", "."));
        if (Number.isNaN(precioLimpio) || precioLimpio < 0) {
            errores.push("El precio no es válido");
        } else if (!productoActual || precioLimpio !== Number(productoActual.precio)) {
            formData.append("precio", String(precioLimpio));
            huboCambios = true;
        }
    }

    const tipoLimpio = selectTipo.value.trim();
    if (tipoLimpio !== "" && (!productoActual || tipoLimpio !== String(productoActual.tipo ?? ""))) {
        formData.append("tipo", tipoLimpio);
        huboCambios = true;
    }

    if (selectActivo.value === "true" || selectActivo.value === "false") {
        const nuevoActivo = selectActivo.value === "true";
        if (!productoActual || nuevoActivo !== Boolean(productoActual.activo)) {
            formData.append("activo", String(nuevoActivo));
            huboCambios = true;
        }
    }

    const archivoImagen = inputImagen.files && inputImagen.files[0];
    if (archivoImagen) {
        formData.append("imagen", archivoImagen);
        huboCambios = true;
    }

    if (!huboCambios) {
        errores.push("Modifique al menos un campo antes de guardar");
    }

    if (errores.length > 0) {
        return mostrarListaErrores(contModalMensaje, errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${idProductoActual}`, {
            method: "PUT",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.listaErrores) {
                return mostrarListaErrores(contModalMensaje, data.listaErrores);
            }
            return mostrarMensaje(
                contModalMensaje,
                "error",
                data.message || "No se pudo actualizar el producto"
            );
        }

        const mensaje = data.message || `Producto con ID ${idProductoActual} actualizado con éxito`;
        mostrarMensaje(contMensaje, "exito", mensaje);
        cerrarModal();
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        mostrarMensaje(contModalMensaje, "error", "Error de conexión con el servidor");
    }
});

const params = new URLSearchParams(window.location.search);
const idDesdeUrl = params.get("id");
if (idDesdeUrl) {
    inputId.value = idDesdeUrl;
    buscarYabrirModal(idDesdeUrl);
}