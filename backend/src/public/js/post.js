const urlBase = "http://localhost:3000";
const contProductos = document.getElementById("cont-createProduct");
const formCreateProduct = document.getElementById("form-createProduct");


function validarFormulario(data) {
    const errores = [];

    if (!data.nombre || !data.precio || !data.imagen || !data.tipo) {
        errores.push("Hay campos incompletos");
    }

    if (data.precio < 0) {
        errores.push("El precio no es válido");
    }

    return errores;
}


function mostrarMensaje(tipo, mensaje) {
    contProductos.innerHTML = `
        <p class="mensaje ${tipo}">${mensaje}</p>
    `;
}

function mostrarListaErrores(array) {
    let htmlErrores = "";
    array.forEach(error => {
        htmlErrores += `<p class="mensaje">${error}</p>`
    });

    contProductos.innerHTML = htmlErrores;
}


formCreateProduct.addEventListener("submit", async event => {
    
    event.preventDefault();

    const formData = new FormData(event.target);

    const formObj = Object.fromEntries(formData.entries());
    
    formObj.precio = Number(formObj.precio);
    formObj.nombre = formObj.nombre.trim();
    
    const errores = validarFormulario(formObj);

    if (errores.length > 0) {
        console.error(errores);
        return mostrarListaErrores(errores)
    };
    
    console.log(JSON.stringify(formObj));

    try {
        const response = await fetch(`${urlBase}/api/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.listaErrores) {
                return mostrarListaErrores(data.listaErrores);
            }

            return mostrarMensaje("error", data.message);
        }

        let mensaje = `${data.message} (ID ${data.data.id})`;
        console.log(data);
        mostrarMensaje("exito", mensaje);

    } catch (error) {
        console.error("Error al obtener productos: ", error);
        return mostrarMensaje("error", "Error de conexion con el servidor");
    }
});