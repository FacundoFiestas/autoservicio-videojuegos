document.addEventListener("DOMContentLoaded", () => {
    const URL_BASE = "http://localhost:3000";

    // 1. Verificar que exista un nombre de cliente cargado
    const nombreCliente = localStorage.getItem("autogames_cliente");
    if (!nombreCliente) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("saludo-cliente").textContent = `Hola, ${nombreCliente} — Elegí tus juegos`;

    // 2. Estado de la aplicación
    let todosLosProductos = [];
    let productosFiltrados = [];
    let tipoActual = "TODOS";
    let paginaActual = 1;
    const productosPorPagina = 4;

    let carrito = JSON.parse(localStorage.getItem("autogames_carrito")) || [];

    // Elementos del DOM
    const contenedor = document.getElementById("contenedor-productos");
    const contadorCarrito = document.getElementById("contador-carrito");
    const infoPagina = document.getElementById("info-pagina");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const botonesFiltro = document.querySelectorAll(".btn-filtro");

    // Helper para resolver rutas de imágenes (externas o subidas al backend)
    function resolverUrlImagen(imagen) {
        if (!imagen) return "https://placehold.co/300x360/19274E/f0f0f0?text=Sin+Imagen";
        if (imagen.startsWith("http")) return imagen;
        return `${URL_BASE}${imagen.startsWith("/") ? "" : "/"}${imagen}`;
    }

    // 3. Obtener productos desde la API REST del Backend
    async function cargarProductos() {
        try {
            const response = await fetch(`${URL_BASE}/api/productos`);
            const resultado = await response.json();

            if (!response.ok || !resultado.success) {
                throw new Error(resultado.message || "Error al obtener productos");
            }

            // Filtrar solo productos activos y normalizar el precio a número
            todosLosProductos = resultado.data
                .filter(prod => Boolean(prod.activo) === true)
                .map(prod => ({
                    ...prod,
                    precio: Number(prod.precio),
                    imagenUrl: resolverUrlImagen(prod.imagen)
                }));

            aplicarFiltroYRenderizar();
        } catch (error) {
            console.error("Error al cargar el catálogo:", error);
            contenedor.innerHTML = `<p class="mensaje">No se pudo conectar con el servidor (${error.message}).</p>`;
        }
    }

    function aplicarFiltroYRenderizar() {
        if (tipoActual === "TODOS") {
            productosFiltrados = [...todosLosProductos];
        } else {
            productosFiltrados = todosLosProductos.filter(
                prod => prod.tipo && prod.tipo.toLowerCase().includes(tipoActual.toLowerCase())
            );
        }

        paginaActual = 1;
        renderizarPagina();
    }

    function renderizarPagina() {
        const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
        if (paginaActual > totalPaginas) paginaActual = totalPaginas;

        const inicio = (paginaActual - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productosFiltrados.slice(inicio, fin);

        if (productosPagina.length === 0) {
            contenedor.innerHTML = `<p>No hay juegos disponibles en esta categoría.</p>`;
        } else {
            contenedor.innerHTML = productosPagina.map(producto => {
                const itemEnCarrito = carrito.find(item => item.id === producto.id);
                const cantidad = itemEnCarrito ? itemEnCarrito.cantidad : 0;

                return `
                    <article class="card-producto">
                        <div>
                            <img class="card-img" src="${producto.imagenUrl}" alt="${producto.nombre}">
                            <span class="card-badge">${producto.tipo}</span>
                            <h4>${producto.nombre}</h4>
                        </div>
                        <div>
                            <p class="card-precio">$ ${producto.precio.toLocaleString("es-AR")}</p>
                            <div class="card-acciones">
                                <button type="button" class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                                    ${cantidad > 0 ? `Agregar (+1) — En carrito: ${cantidad}` : "Agregar al carrito"}
                                </button>
                                ${cantidad > 0 
                                    ? `<button type="button" class="btn-quitar" onclick="quitarDelCarrito(${producto.id})">Quitar del carrito</button>` 
                                    : ""
                                }
                            </div>
                        </div>
                    </article>
                `;
            }).join("");
        }

        infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
        btnAnterior.disabled = paginaActual === 1;
        btnSiguiente.disabled = paginaActual === totalPaginas;
        actualizarContadorCarrito();
    }

    // 4. Funciones globales del carrito
    window.agregarAlCarrito = (idProducto) => {
        const producto = todosLosProductos.find(p => p.id === idProducto);
        if (!producto) return;

        const existente = carrito.find(item => item.id === idProducto);
        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                tipo: producto.tipo,
                precio: producto.precio,
                imagen: producto.imagenUrl,
                cantidad: 1
            });
        }

        guardarCarrito();
        renderizarPagina();
    };

    window.quitarDelCarrito = (idProducto) => {
        carrito = carrito.filter(item => item.id !== idProducto);
        guardarCarrito();
        renderizarPagina();
    };

    function guardarCarrito() {
        localStorage.setItem("autogames_carrito", JSON.stringify(carrito));
    }

    function actualizarContadorCarrito() {
        const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = totalUnidades;
    }

    // 5. Eventos de filtros y paginación
    botonesFiltro.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesFiltro.forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            tipoActual = btn.dataset.categoria;
            aplicarFiltroYRenderizar();
        });
    });

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarPagina();
        }
    });

    btnSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarPagina();
        }
    });

    cargarProductos();
});