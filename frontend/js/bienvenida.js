document.addEventListener("DOMContentLoaded", () => {
    // Al volver al inicio del autoservicio se reinician los datos previos
    localStorage.removeItem("autogames_cliente");
    localStorage.removeItem("autogames_carrito");

    const form = document.getElementById("form-bienvenida");
    const inputNombre = document.getElementById("input-nombre");
    const errorNombre = document.getElementById("error-nombre");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = inputNombre.value.trim();

        if (nombre.length < 2) {
            errorNombre.textContent = "Por favor, ingresá un nombre válido (mínimo 2 caracteres).";
            inputNombre.focus();
            return;
        }

        errorNombre.textContent = "";
        localStorage.setItem("autogames_cliente", nombre);
        window.location.href = "productos.html";
    });
});