const { ventas } = require("./datos");
const {
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventasPorCiudad,
  ventasPorCiudadM,
} = require("./analitica");

let todasCoinciden = true;

function verificarPar(nombre, versionCiclo, versionMetodos, datos) {
  const resultadoCiclo = versionCiclo(datos);
  const resultadoMetodos = versionMetodos(datos);
  const coinciden = Object.is(resultadoCiclo, resultadoMetodos);

  console.log(
    `${nombre}: ${coinciden ? "OK" : "DIFERENTE"}`,
    `(ciclo: ${resultadoCiclo}, métodos: ${resultadoMetodos})`,
  );

  if (!coinciden) {
    todasCoinciden = false;
  }
}

const entradas = [
  ["ventas completas", ventas],
  ["una venta", [ventas[0]]],
  ["sin ventas", []],
];

for (const [nombreEntrada, datos] of entradas) {
  console.log(`\n${nombreEntrada}:`);
  verificarPar("totalVendido", totalVendido, totalVendidoM, datos);
  verificarPar("unidadesVendidas", unidadesVendidas, unidadesVendidasM, datos);

  for (const ciudad of ["Medellín", "  MEDELLÍN  ", "Bogotá", "Cali", "Pereira"]) {
    verificarPar(
      `ventasPorCiudad (${ciudad.trim()})`,
      (registros) => ventasPorCiudad(registros, ciudad),
      (registros) => ventasPorCiudadM(registros, ciudad),
      datos,
    );
  }
}

if (!todasCoinciden) {
  process.exitCode = 1;
}