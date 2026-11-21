const urlBase = "http://localhost:3000";
const urlDashboard = "/dashboard/principal";

const contProductos = document.getElementById("cont-createProduct");
const formCreateProduct = document.getElementById("form-createProduct");
const inputImagen = document.getElementById("prodImagen");

function validarFormulario(formData) {
    const errores = [];

    const nombre = (formData.get("nombre") || "").toString().trim();
    const tipo = (formData.get("tipo") || "").toString().trim();
    const precio = Number(formData.get("precio"));
    const archivo = formData.get("imagen");

    if (!nombre || !tipo || Number.isNaN(precio) || !archivo || archivo.size === 0) {
        errores.push("Hay campos incompletos");
    }

    if (precio <= 0) {
        errores.push("El precio no es válido");
    }

    if (archivo && archivo.size > 0 && !archivo.type.startsWith("image/")) {
        errores.push("El archivo seleccionado debe ser una imagen");
    }

    return errores;
}

function mostrarMensaje(tipo, mensaje) {
    contProductos.innerHTML = `
        <p class="mensaje ${tipo}">${mensaje}</p>
    `;
}

function mostrarListaErrores(array) {
    contProductos.innerHTML = array
        .map(error => `<p class="mensaje error">${error}</p>`)
        .join("");
}

formCreateProduct.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const nombreLimpio = (formData.get("nombre") || "").toString().trim();
    formData.set("nombre", nombreLimpio);

    const errores = validarFormulario(formData);
    if (errores.length > 0) {
        console.error(errores);
        return mostrarListaErrores(errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/productos`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.listaErrores) {
                return mostrarListaErrores(data.listaErrores);
            }
            return mostrarMensaje("error", data.message || "No se pudo crear el producto");
        }

        window.location.href = urlDashboard;
    } catch (error) {
        console.error("Error al crear producto:", error);
        return mostrarMensaje("error", "Error de conexión con el servidor");
    }
});