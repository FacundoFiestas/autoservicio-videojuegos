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
    contenedor.innerHTML = `
        <p class="mensaje ${tipo}">${mensaje}</p>
    `;
}

function mostrarListaErrores(contenedor, array) {
    let htmlErrores = "";
    array.forEach(error => {
        htmlErrores += `<p class="mensaje error">${error}</p>`;
    });
    contenedor.innerHTML = htmlErrores;
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

// Cerrar modal con X
btnCerrarModal.addEventListener("click", cerrarModal);

// Cerrar modal al hacer clic afuera
modalEditar.addEventListener("click", (event) => {
    if (event.target === modalEditar) {
        cerrarModal();
    }
});

// Cerrar modal con Esc
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalEditar.hidden) {
        cerrarModal();
    }
});

// Buscar producto por ID y abrir cuadro flotante
formBuscarProducto.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensajes(contMensaje);
    limpiarMensajes(contModalMensaje);

    const id = inputId.value ? inputId.value.trim() : "";

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return mostrarMensaje(contMensaje, "error", "El ID del producto no es válido");
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${id}`);
        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje(
                contMensaje,
                "error",
                data.message || `No se encontró ningún producto con ID ${id}`
            );
        }

        const prod = data.data || data.producto || data;
        idProductoActual = id;
        productoActual = prod;

        modalProdId.textContent = id;
        inputNombre.value = prod.nombre ?? "";
        inputPrecio.value = prod.precio ?? "";
        inputImagen.value = prod.imagen ?? "";
        selectTipo.value = prod.tipo ?? "";
        selectActivo.value = prod.activo !== undefined ? String(Boolean(prod.activo)) : "";

        abrirModal();
    } catch (error) {
        console.error("Error al buscar producto:", error);
        mostrarMensaje(contMensaje, "error", "Error de conexión con el servidor");
    }
});

// Actualizar datos del producto desde el cuadro flotante
formUpdateProduct.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarMensajes(contModalMensaje);

    if (!idProductoActual) {
        return mostrarMensaje(contModalMensaje, "error", "No hay un ID de producto seleccionado");
    }

    const formData = new FormData(event.target);
    const rawObj = Object.fromEntries(formData.entries());

    const errores = [];
    const payload = {};

    const nombreLimpio = rawObj.nombre ? rawObj.nombre.trim() : "";
    if (nombreLimpio !== "") {
        if (!productoActual || nombreLimpio !== String(productoActual.nombre)) {
            payload.nombre = nombreLimpio;
        }
    }

    const precioTexto = rawObj.precio ? String(rawObj.precio).trim() : "";
    if (precioTexto !== "") {
        const precioLimpio = parseFloat(precioTexto.replace(",", "."));
        if (Number.isNaN(precioLimpio) || precioLimpio < 0) {
            errores.push("El precio no es válido");
        } else if (!productoActual || precioLimpio !== Number(productoActual.precio)) {
            payload.precio = precioLimpio;
        }
    }

    const imagenLimpia = rawObj.imagen ? rawObj.imagen.trim() : "";
    if (imagenLimpia !== "") {
        if (!productoActual || imagenLimpia !== String(productoActual.imagen)) {
            payload.imagen = imagenLimpia;
        }
    }

    const tipoLimpio = rawObj.tipo ? rawObj.tipo.trim() : "";
    if (tipoLimpio !== "") {
        if (!productoActual || tipoLimpio !== String(productoActual.tipo)) {
            payload.tipo = tipoLimpio;
        }
    }

    if (rawObj.activo === "true" || rawObj.activo === "false") {
        const nuevoActivo = rawObj.activo === "true";
        if (!productoActual || nuevoActivo !== Boolean(productoActual.activo)) {
            payload.activo = nuevoActivo;
        }
    }

    const camposEditables = ["nombre", "precio", "imagen", "tipo", "activo"];
    const tieneAlgunCampo = camposEditables.some((campo) => campo in payload);

    if (!tieneAlgunCampo) {
        errores.push("Modifique al menos un campo antes de guardar");
    }

    if (errores.length > 0) {
        return mostrarListaErrores(contModalMensaje, errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${idProductoActual}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
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