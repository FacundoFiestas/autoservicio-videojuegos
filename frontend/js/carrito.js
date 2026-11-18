document.addEventListener("DOMContentLoaded", () => {
    const nombreCliente = localStorage.getItem("autogames_cliente");
    if (!nombreCliente) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("titulo-carrito").textContent = `Carrito de ${nombreCliente}`;

    let carrito = JSON.parse(localStorage.getItem("autogames_carrito")) || [];

    const listaCarrito = document.getElementById("lista-carrito");
    const resumenCarrito = document.getElementById("resumen-carrito");
    const totalCompraSpan = document.getElementById("total-compra");

    const modal = document.getElementById("modal-confirmacion");
    const textoModal = document.getElementById("texto-modal");
    const btnAbrirModal = document.getElementById("btn-abrir-modal");
    const btnCancelarModal = document.getElementById("btn-cancelar-modal");
    const btnConfirmarCompra = document.getElementById("btn-confirmar-compra");

    function renderizarCarrito() {
        if (carrito.length === 0) {
            listaCarrito.innerHTML = `<p>No tenés videojuegos agregados en tu carrito.</p>`;
            resumenCarrito.style.display = "none";
            return;
        }

        resumenCarrito.style.display = "flex";
        let total = 0;

        listaCarrito.innerHTML = carrito.map(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            return `
                <article class="carrito-item">
                    <div class="carrito-item-info">
                        <img class="carrito-item-img" src="${item.imagen}" alt="${item.nombre}">
                        <div>
                            <h4>${item.nombre}</h4>
                            <span>Tipo: ${item.tipo} | Unitario: $ ${item.precio.toLocaleString("es-AR")}</span>
                        </div>
                    </div>

                    <div class="carrito-controles">
                        <button type="button" class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span class="cantidad-valor">${item.cantidad}</span>
                        <button type="button" class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>

                    <div class="carrito-subtotal">
                        $ ${subtotal.toLocaleString("es-AR")}
                    </div>

                    <button type="button" class="btn-quitar" onclick="eliminarItem(${item.id})">Eliminar</button>
                </article>
            `;
        }).join("");

        totalCompraSpan.textContent = total.toLocaleString("es-AR");
    }

    window.cambiarCantidad = (idProducto, delta) => {
        const item = carrito.find(p => p.id === idProducto);
        if (!item) return;

        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== idProducto);
        }

        guardarYActualizar();
    };

    window.eliminarItem = (idProducto) => {
        carrito = carrito.filter(p => p.id !== idProducto);
        guardarYActualizar();
    };

    function guardarYActualizar() {
        localStorage.setItem("autogames_carrito", JSON.stringify(carrito));
        renderizarCarrito();
    }

    // Manejo del modal de confirmación
    btnAbrirModal.addEventListener("click", () => {
        if (carrito.length === 0) return;
        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        textoModal.textContent = `¿Confirmás tu compra por un total de $ ${total.toLocaleString("es-AR")}?`;
        modal.classList.add("activo");
    });

    btnCancelarModal.addEventListener("click", () => {
        modal.classList.remove("activo");
    });

    // Confirmar y registrar venta
    btnConfirmarCompra.addEventListener("click", async () => {
        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

        const datosVenta = {
            nombre_usuario: nombreCliente,
            fecha: new Date().toISOString(),
            precio_total: total,
            productos: carrito.map(item => ({
                id_producto: item.id,
                nombre: item.nombre,
                tipo: item.tipo,
                precio: item.precio,
                cantidad: item.cantidad
            }))
        };

        try {
            // Intentamos enviar al backend (cuando esté levantado)
            const response = await fetch("http://localhost:3000/api/ventas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosVenta)
            });

            if (response.ok) {
                const resultado = await response.json();
                datosVenta.id_venta = resultado.data?.id || Date.now();
            } else {
                datosVenta.id_venta = Date.now();
            }
        } catch (error) {
            // Modo offline mientras desarrollan el backend
            datosVenta.id_venta = Date.now();
        }

        // Guardamos el último ticket para mostrarlo en ticket.html y vaciamos el carrito
        localStorage.setItem("autogames_ultimo_ticket", JSON.stringify(datosVenta));
        localStorage.removeItem("autogames_carrito");

        window.location.href = "ticket.html";
    });

    renderizarCarrito();
});