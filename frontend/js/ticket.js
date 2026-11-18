document.addEventListener("DOMContentLoaded", () => {
    const ticketData = JSON.parse(localStorage.getItem("autogames_ultimo_ticket"));

    // Si no hay compra confirmada, redirigir al inicio
    if (!ticketData) {
        window.location.href = "index.html";
        return;
    }

    const fechaFormateada = new Date(ticketData.fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    // Completar datos en pantalla
    document.getElementById("ticket-id").textContent = `#${ticketData.id_venta}`;
    document.getElementById("ticket-cliente").textContent = ticketData.nombre_usuario;
    document.getElementById("ticket-fecha").textContent = fechaFormateada;
    document.getElementById("ticket-total").textContent = ticketData.precio_total.toLocaleString("es-AR");

    const tbody = document.getElementById("ticket-items");
    tbody.innerHTML = ticketData.productos.map(prod => {
        const subtotal = prod.precio * prod.cantidad;
        return `
            <tr>
                <td>${prod.nombre} (${prod.categoria})</td>
                <td>${prod.cantidad}</td>
                <td class="col-derecha">$ ${subtotal.toLocaleString("es-AR")}</td>
            </tr>
        `;
    }).join("");

    // Generar y descargar PDF con jsPDF
    document.getElementById("btn-descargar-pdf").addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("AutoGames - Ticket de Compra", 20, 25);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Operación N°: #${ticketData.id_venta}`, 20, 40);
        doc.text(`Cliente: ${ticketData.nombre_usuario}`, 20, 48);
        doc.text(`Fecha: ${fechaFormateada}`, 20, 56);

        doc.line(20, 63, 190, 63);

        doc.setFont("helvetica", "bold");
        doc.text("Detalle de productos:", 20, 73);

        doc.setFont("helvetica", "normal");
        let y = 83;
        ticketData.productos.forEach(prod => {
            const subtotal = prod.precio * prod.cantidad;
            const linea = `${prod.cantidad}x ${prod.nombre} (${prod.categoria}) - $ ${subtotal.toLocaleString("es-AR")}`;
            doc.text(linea, 20, y);
            y += 10;
        });

        doc.line(20, y, 190, y);
        y += 12;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`TOTAL: $ ${ticketData.precio_total.toLocaleString("es-AR")}`, 20, y);

        doc.save(`Ticket_AutoGames_${ticketData.nombre_usuario}.pdf`);
    });

    // Función para reiniciar el sistema de autoservicio
    function reiniciarSistema() {
        localStorage.removeItem("autogames_cliente");
        localStorage.removeItem("autogames_carrito");
        localStorage.removeItem("autogames_ultimo_ticket");
        window.location.href = "index.html";
    }

    document.getElementById("btn-finalizar-salir").addEventListener("click", reiniciarSistema);
    document.getElementById("btn-salir-header").addEventListener("click", reiniciarSistema);
});