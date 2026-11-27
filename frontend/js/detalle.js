const API_BASE = "http://localhost:3000";
const contenedorDetalle = document.getElementById("contenedor-detalle");

const resolverUrlImagen = (imagen) => {
    if (!imagen) return "";
    return imagen.startsWith("http") ? imagen : `${API_BASE}${imagen}`;
};

const mostrarError = (mensaje) => {
    contenedorDetalle.innerHTML = `
        <div class="mensaje-estado">
            <p>${mensaje}</p>
            <a href="productos.html" class="btn-volver">Volver al catálogo</a>
        </div>
    `;
};

const cargarDetalleProducto = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id || isNaN(Number(id))) {
        mostrarError("No se especificó un ID de producto válido en la ruta.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_BASE}/api/productos/${id}`);
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarError(resultado.message || "No se pudo encontrar el producto solicitado.");
            return;
        }

        // Soporta tanto { payload: {...} } como { data: {...} } o el objeto directo
        const producto = resultado.payload || resultado.data || resultado;

        if (!producto || !producto.id) {
            mostrarError("El producto no existe o fue eliminado.");
            return;
        }

        const estadoTexto = producto.activo ? "Disponible" : "No disponible";

        contenedorDetalle.innerHTML = `
            <article class="detalle-card">
                <div>
                    <img
                        class="detalle-img"
                        src="${resolverUrlImagen(producto.imagen)}"
                        alt="${producto.nombre}"
                    >
                </div>
                <div class="detalle-info">
                    <span class="detalle-badge">${producto.tipo}</span>
                    <h2>${producto.nombre}</h2>
                    <p><strong>Código de producto:</strong> #${producto.id}</p>
                    <p><strong>Estado:</strong> ${estadoTexto}</p>
                    <p class="detalle-precio">$ ${Number(producto.precio).toLocaleString("es-AR")}</p>

                    <div class="detalle-acciones">
                        <a href="productos.html" class="btn-secundario">Volver al catálogo</a>
                    </div>
                </div>
            </article>
        `;
    } catch (error) {
        console.error("Error al cargar el detalle del producto:", error);
        mostrarError("Ocurrió un error de conexión al obtener los datos del producto.");
    }
};

document.addEventListener("DOMContentLoaded", cargarDetalleProducto);