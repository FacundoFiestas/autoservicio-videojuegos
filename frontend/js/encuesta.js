const API_URL_ENCUESTAS = "http://localhost:3000/api/encuestas";

const formEncuesta = document.getElementById("form-encuesta");
const inputEmail = document.getElementById("email");
const inputPuntuacion = document.getElementById("puntuacion");
const valorPuntuacion = document.getElementById("valor-puntuacion");
const inputOpinion = document.getElementById("opinion");
const inputRecomienda = document.getElementById("recomienda");
const inputImagen = document.getElementById("imagen");

const errorEmail = document.getElementById("error-email");
const errorPuntuacion = document.getElementById("error-puntuacion");
const errorOpinion = document.getElementById("error-opinion");
const errorImagen = document.getElementById("error-imagen");
const errorGeneral = document.getElementById("error-general");

const btnOmitir = document.getElementById("btn-omitir");
const btnEnviar = document.getElementById("btn-enviar");
const modalAgradecimiento = document.getElementById("modal-agradecimiento");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");

// Actualizar valor visual del slider en tiempo real
inputPuntuacion.addEventListener("input", () => {
    valorPuntuacion.textContent = `${inputPuntuacion.value} / 10`;
});

// Botón omitir encuesta -> redirige al inicio
btnOmitir.addEventListener("click", () => {
    window.location.href = "index.html";
});

// Botón del modal de agradecimiento -> redirige al inicio
btnCerrarModal.addEventListener("click", () => {
    window.location.href = "index.html";
});

const limpiarErrores = () => {
    errorEmail.textContent = "";
    errorPuntuacion.textContent = "";
    errorOpinion.textContent = "";
    errorImagen.textContent = "";
    errorGeneral.textContent = "";
};

const validarFormulario = () => {
    limpiarErrores();
    let esValido = true;

    const emailVal = inputEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
        errorEmail.textContent = "El correo electrónico es obligatorio.";
        esValido = false;
    } else if (!emailRegex.test(emailVal)) {
        errorEmail.textContent = "Ingresá un formato de correo válido (ej: nombre@dominio.com).";
        esValido = false;
    }

    const puntNum = Number(inputPuntuacion.value);
    if (!Number.isInteger(puntNum) || puntNum < 1 || puntNum > 10) {
        errorPuntuacion.textContent = "La puntuación debe estar entre 1 y 10.";
        esValido = false;
    }

    const opinionVal = inputOpinion.value.trim();
    if (!opinionVal) {
        errorOpinion.textContent = "Por favor escribí tu opinión.";
        esValido = false;
    } else if (opinionVal.length < 5) {
        errorOpinion.textContent = "La opinión debe tener al menos 5 caracteres.";
        esValido = false;
    }

    const archivo = inputImagen.files[0];
    if (!archivo) {
        errorImagen.textContent = "Debés seleccionar una imagen para enviar la encuesta.";
        esValido = false;
    } else if (!archivo.type.startsWith("image/")) {
        errorImagen.textContent = "El archivo seleccionado debe ser una imagen válida.";
        esValido = false;
    }

    return esValido;
};

formEncuesta.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const formData = new FormData();
    formData.append("email", inputEmail.value.trim());
    formData.append("puntuacion", inputPuntuacion.value);
    formData.append("opinion", inputOpinion.value.trim());
    formData.append("recomienda", inputRecomienda.checked);
    formData.append("imagen", inputImagen.files[0]);

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    try {
        const respuesta = await fetch(API_URL_ENCUESTAS, {
            method: "POST",
            body: formData
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.success) {
            errorGeneral.textContent = resultado.message || "No se pudo guardar la encuesta.";
            return;
        }

        // Mostrar modal de agradecimiento
        modalAgradecimiento.hidden = false;
    } catch (error) {
        console.error("Error al enviar encuesta:", error);
        errorGeneral.textContent = "Error de conexión con el servidor al enviar la encuesta.";
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar encuesta";
    }
});