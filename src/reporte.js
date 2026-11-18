const { ventas } = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  valorVenta,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
} = require("./analitica");

const anchoEtiqueta = 32;

function pesos(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function imprimirSeccion(titulo) {
  console.log(`\n${titulo}`);
  console.log("─".repeat(titulo.length));
}

function imprimirFila(etiqueta, valor) {
  console.log(`  ${etiqueta.padEnd(anchoEtiqueta)} ${valor}`);
}

function imprimirResumenDia(fecha) {
  const ventasDia = ventasDelDia(ventas, fecha);
  const promedio = ticketPromedio(ventasDia);

  imprimirSeccion(`RESUMEN DEL DÍA ${fecha}`);
  if (ventasDia.length === 0) {
    console.log("  Sin ventas registradas para esta fecha.");
  }

  imprimirFila("Registros encontrados", ventasDia.length.toLocaleString("es-CO"));
  imprimirFila("Total vendido", pesos(totalVendido(ventasDia)));
  imprimirFila("Unidades vendidas", unidadesVendidas(ventasDia).toLocaleString("es-CO"));
  imprimirFila("Ticket promedio", promedio === null ? "No aplica (sin ventas válidas)" : pesos(promedio));
}

console.log("CAFÉ ORIGEN | REPORTE DE VENTAS");
console.log("=".repeat(68));

imprimirSeccion("RESUMEN GENERAL");
const mayorVenta = ventaMayor(ventas);
imprimirFila("Total vendido", pesos(totalVendido(ventas)));
imprimirFila("Unidades vendidas", unidadesVendidas(ventas).toLocaleString("es-CO"));
imprimirFila(
  "Venta más grande",
  mayorVenta === null
    ? "No disponible (sin ventas válidas)"
    : `${pesos(valorVenta(mayorVenta))} (venta #${mayorVenta.id})`,
);
const promedioGeneral = ticketPromedio(ventas);
imprimirFila(
  "Ticket promedio",
  promedioGeneral === null ? "No aplica (sin ventas válidas)" : pesos(promedioGeneral),
);

imprimirSeccion("VENTAS POR CIUDAD");
for (const [ciudad, total] of Object.entries(totalPorCiudad(ventas))) {
  imprimirFila(ciudad, pesos(total));
}

imprimirSeccion("UNIDADES POR PRODUCTO");
for (const [producto, unidades] of Object.entries(unidadesPorProducto(ventas))) {
  const etiquetaUnidades = unidades === 1 ? "unidad" : "unidades";
  imprimirFila(producto, `${unidades.toLocaleString("es-CO")} ${etiquetaUnidades}`);
}

imprimirSeccion("TOP 3 PRODUCTOS POR VALOR");
for (const [indice, producto] of topProductosPorValor(ventas, 3).entries()) {
  imprimirFila(`${indice + 1}. ${producto.producto}`, pesos(producto.total));
}

imprimirResumenDia("2026-09-01");
imprimirResumenDia("2026-09-07");