const urlBase = "http://localhost:3000";
const formUpdateProduct = document.getElementById("form-updateProduct");
const contUpdateProduct = document.getElementById("cont-updateProduct");

function mostrarMensaje(tipo, mensaje) {
    contUpdateProduct.innerHTML = `
        <p class="mensaje ${tipo}">${mensaje}</p>
    `;
}

function mostrarListaErrores(array) {
    let htmlErrores = "";
    array.forEach(error => {
        htmlErrores += `<p class="mensaje">${error}</p>`;
    });
    contUpdateProduct.innerHTML = htmlErrores;
}

function validarActualizacion(data) {
    const errores = [];

    if (!data.id || Number(data.id) <= 0) {
        errores.push("El ID del producto no es válido");
    }

    if (!data.nombre || !data.imagen || !data.tipo || Number.isNaN(data.precio)) {
        errores.push("Hay campos incompletos o inválidos");
    }

    if (data.precio < 0) {
        errores.push("El precio no puede ser negativo");
    }

    return errores;
}

// Actualizar datos del producto (completos o parciales)
formUpdateProduct.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const rawObj = Object.fromEntries(formData.entries());

    const id = rawObj.id ? rawObj.id.trim() : "";
    const errores = [];

    if (!id || Number(id) <= 0) {
        errores.push("El ID del producto no es válido");
    }

    const payload = {};

    const nombreLimpio = rawObj.nombre ? rawObj.nombre.trim() : "";
    if (nombreLimpio !== "") {
        payload.nombre = nombreLimpio;
    }

    const precioTexto = rawObj.precio ? rawObj.precio.trim() : "";
    if (precioTexto !== "") {
        const precioLimpio = parseFloat(precioTexto.replace(",", "."));
        if (Number.isNaN(precioLimpio) || precioLimpio < 0) {
            errores.push("El precio no es válido");
        } else {
            payload.precio = precioLimpio;
        }
    }

    const imagenLimpia = rawObj.imagen ? rawObj.imagen.trim() : "";
    if (imagenLimpia !== "") {
        payload.imagen = imagenLimpia;
    }

    const tipoLimpio = rawObj.tipo ? rawObj.tipo.trim() : "";
    if (tipoLimpio !== "") {
        payload.tipo = tipoLimpio;
    }

    if (rawObj.activo === "true" || rawObj.activo === "false") {
        payload.activo = rawObj.activo === "true";
    }

    const camposEditables = ["nombre", "precio", "imagen", "tipo", "activo"];
    const tieneAlgunCampo = camposEditables.some((campo) => campo in payload);

    if (!tieneAlgunCampo) {
        errores.push("Completá al menos un campo para modificar");
    }

    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/productos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.listaErrores) {
                return mostrarListaErrores(data.listaErrores);
            }
            return mostrarMensaje("error", data.message || "No se pudo actualizar el producto");
        }

        const mensaje = data.message || `Producto con ID ${id} actualizado con éxito`;
        return mostrarMensaje("exito", mensaje);

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return mostrarMensaje("error", "Error de conexión con el servidor");
    }
});