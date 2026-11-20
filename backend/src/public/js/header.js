const btnMenu = document.getElementById("btn-menu");
const navMenu = document.getElementById("nav-menu");

if (btnMenu && navMenu) {
    btnMenu.addEventListener("click", () => {
        const estaAbierto = navMenu.style.display === "flex";

        if (estaAbierto) {
            navMenu.style.display = "none";
            btnMenu.textContent = "☰";
        } else {
            navMenu.style.display = "flex";
            btnMenu.textContent = "✕";
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            navMenu.style.display = "";
            btnMenu.textContent = "☰";
        }
    });
}