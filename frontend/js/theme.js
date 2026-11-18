document.addEventListener("DOMContentLoaded", () => {
    const btnTema = document.getElementById("btn-tema");
    const temaGuardado = localStorage.getItem("autogames_tema");

    if (temaGuardado === "claro") {
        document.body.classList.add("light-theme");
        if (btnTema) btnTema.textContent = "Tema Oscuro";
    }

    if (btnTema) {
        btnTema.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const esClaro = document.body.classList.contains("light-theme");
            
            localStorage.setItem("autogames_tema", esClaro ? "claro" : "oscuro");
            btnTema.textContent = esClaro ? "Tema Oscuro" : "Tema Claro";
        });
    }
});