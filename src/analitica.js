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

function totalVendidoM(ventas) {
  return ventas
    .filter(esVentaValida)
    .map(valorVenta)
    .reduce((total, subtotal) => total + subtotal, 0);
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

function unidadesVendidasM(ventas) {
  return ventas
    .filter(esVentaValida)
    .map((venta) => venta.cantidad)
    .reduce((total, cantidad) => total + cantidad, 0);
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

function ventasPorCiudadM(ventas, ciudad) {
  const ciudadBuscada = normalizarCiudad(ciudad);

  if (!ciudadBuscada) {
    return 0;
  }

  return ventas
    .filter((venta) => (
      esVentaValida(venta)
      && normalizarCiudad(venta.ciudad) === ciudadBuscada
    ))
    .map(valorVenta)
    .reduce((total, subtotal) => total + subtotal, 0);
}

function totalPorCiudad(ventas) {
  const totales = Object.create(null);
  const nombresCiudad = Object.create(null);

  for (const venta of ventas) {
    if (!esVentaValida(venta) || typeof venta.ciudad !== "string") {
      continue;
    }

    const ciudadNormalizada = normalizarCiudad(venta.ciudad);
    if (!ciudadNormalizada) {
      continue;
    }

    if (!Object.hasOwn(totales, ciudadNormalizada)) {
      totales[ciudadNormalizada] = 0;
      nombresCiudad[ciudadNormalizada] = venta.ciudad.trim().replace(/\s+/g, " ");
    }

    totales[ciudadNormalizada] += valorVenta(venta);
  }

  return Object.fromEntries(
    Object.entries(totales).map(([ciudad, total]) => [nombresCiudad[ciudad], total]),
  );
}

function agruparPorProducto(ventas, valorDeVenta) {
  const totales = Object.create(null);

  for (const venta of ventas) {
    if (
      !esVentaValida(venta)
      || typeof venta.producto !== "string"
      || venta.producto.trim() === ""
    ) {
      continue;
    }

    if (!Object.hasOwn(totales, venta.producto)) {
      totales[venta.producto] = 0;
    }

    totales[venta.producto] += valorDeVenta(venta);
  }

  return totales;
}

function unidadesPorProducto(ventas) {
  const unidades = agruparPorProducto(ventas, (venta) => venta.cantidad);
  return Object.fromEntries(Object.entries(unidades));
}

function topProductosPorValor(ventas, k) {
  if (!Number.isInteger(k) || k < 0) {
    throw new RangeError("k debe ser un entero no negativo.");
  }

  const valores = agruparPorProducto(ventas, valorVenta);

  return Object.entries(valores)
    .map(([producto, total]) => ({ producto, total }))
    .sort((a, b) => b.total - a.total || a.producto.localeCompare(b.producto))
    .slice(0, k);
}

function ventasDelDia(ventas, fecha) {
  if (typeof fecha !== "string" || fecha.trim() === "") {
    return [];
  }

  return ventas.filter((venta) => venta?.fecha === fecha);
}

module.exports = {
  valorVenta,
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
};
