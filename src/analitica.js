function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function esVentaValida(venta) {
  return Number.isFinite(venta?.cantidad)
    && venta.cantidad > 0
    && Number.isFinite(venta.precio)
    && venta.precio >= 0;
}

function normalizarCiudad(ciudad) {
  return typeof ciudad === "string"
    ? ciudad.trim().replace(/\s+/g, " ").toLowerCase()
    : "";
}

function totalVendido(ventas) {
  let total = 0;

  for (const venta of ventas) {
    if (esVentaValida(venta)) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function unidadesVendidas(ventas) {
  let total = 0;

  for (const venta of ventas) {
    if (esVentaValida(venta)) {
      total += venta.cantidad;
    }
  }

  return total;
}

function ventaMayor(ventas) {
  let registroMayor = null;
  let valorMayor = null;

  for (const venta of ventas) {
    if (!esVentaValida(venta)) {
      continue;
    }

    const valor = valorVenta(venta);
    if (valorMayor === null || valor > valorMayor) {
      valorMayor = valor;
      registroMayor = venta;
    }
  }

  return registroMayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let cantidadVentasValidas = 0;

  for (const venta of ventas) {
    if (esVentaValida(venta)) {
      total += valorVenta(venta);
      cantidadVentasValidas += 1;
    }
  }

  if (cantidadVentasValidas === 0) {
    return null;
  }

  return total / cantidadVentasValidas;
}

function ventasPorCiudad(ventas, ciudad) {
  const ciudadBuscada = normalizarCiudad(ciudad);
  let total = 0;

  if (!ciudadBuscada) {
    return total;
  }

  for (const venta of ventas) {
    if (
      esVentaValida(venta)
      && normalizarCiudad(venta.ciudad) === ciudadBuscada
    ) {
      total += valorVenta(venta);
    }
  }

  return total;
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
};
