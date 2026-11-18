# Bitácora de trabajo

## 2026-11-17
## Minireto 1: Primer tueste: el repositorio y los datos
- Se creó esta bitácora para registrar cada cambio del proyecto.
- Se revisó la estructura inicial del repositorio y se confirmó que el proyecto está en un estado base con archivos principales en `src/`.
- `src/datos.js`: se representaron las 12 ventas de la tabla y se exportaron como `ventas`.
- `src/explorar.js`: se importaron las ventas y se agregó la salida de la cantidad de registros, el primer y último registro, el producto del elemento en el índice 4 y la tabla completa con `console.table`.


## Diccionario de datos

| Propiedad | Tipo | Significado |
|---|---|---|
| `id` | Número (`number`) | Identificador numérico de cada registro de venta. |
| `fecha` | Cadena de texto (`string`) | Fecha de la venta en formato `AAAA-MM-DD`. |
| `cliente` | Cadena de texto (`string`) | Código que identifica al cliente, por ejemplo `C01`. |
| `producto` | Cadena de texto (`string`) | Nombre o descripción del producto vendido. |
| `ciudad` | Cadena de texto (`string`) | Ciudad asociada a la venta. |
| `cantidad` | Número (`number`) | Cantidad de unidades registradas en la venta; incluye un registro con valor `0`. |
| `precio` | Número (`number`) | Precio registrado para el producto. La moneda no está especificada en los datos. |

## Casos borde detectados

- **Inconsistencia en el formato de ciudad:** aparecen `Medellín` y `medellín`, que probablemente representan la misma ciudad. **Decisión:** normalizar las ciudades a una forma canónica (por ejemplo, `Medellín`) antes de agrupar o comparar; conservar el valor original si se requiere trazabilidad.
- **Cantidad igual a cero:** el registro con `id` 8 tiene `cantidad: 0`, por lo que no representa unidades vendidas aunque esté en la tabla de ventas. **Decisión:** no eliminar ni cambiar el dato sin confirmar la fuente; marcarlo para revisión y excluirlo de cálculos de unidades efectivamente vendidas hasta aclararlo.
- **Códigos de cliente repetidos:** `C01`, `C02` y `C03` aparecen en más de una venta. Esto puede ser legítimo porque un cliente puede comprar varias veces, pero podría confundirse con duplicación de registros. **Decisión:** mantener cada venta como registro independiente y no deduplicar por `cliente`; verificar duplicados usando el identificador de venta (`id`) y el resto de los datos.
- **Clientes sin catálogo de referencia:** los códigos `C01`–`C08` no incluyen información que permita validar a qué cliente corresponde cada código. **Decisión:** conservarlos como identificadores opacos y solicitar un catálogo de referencia solo si se necesita validar o enriquecer la identidad del cliente.

## Minireto 2: Los números del día: recorrer, filtrar y acumular

**Regla de validación:** recorrer cada registro de `ventas`. Si `cantidad` no es numérica o es negativa, o `precio` no es numérico o es negativo, marcar el registro para revisión y no incluirlo en los indicadores. Si `cantidad` es `0`, marcarlo para revisión y excluirlo de los cálculos como venta sin unidades. Una fila válida con cantidad mayor que cero cuenta como una compra, incluso si comparte código de cliente con otra fila.

### Venta total (ingresos)

```text
iniciar totalVentas en 0
recorrer cada venta con un ciclo
  si la venta pasa la regla de validación
    calcular subtotal = cantidad * precio
    acumular subtotal en totalVentas
mostrar totalVentas
```

### Unidades vendidas

```text
iniciar totalUnidades en 0
recorrer cada venta con un ciclo
  si la venta pasa la regla de validación
    acumular cantidad en totalUnidades
mostrar totalUnidades
```

### Venta más grande por transacción

```text
iniciar ventaMayor en null
iniciar registroVentaMayor en null
recorrer cada venta con un ciclo
  si la venta pasa la regla de validación
    calcular subtotal = cantidad * precio
    si ventaMayor es null o subtotal > ventaMayor
      asignar subtotal a ventaMayor
      guardar la venta actual en registroVentaMayor
si ventaMayor sigue en null
  informar que no hay ventas válidas para comparar
si no
  mostrar ventaMayor y registroVentaMayor
```

### Ticket promedio por compra

```text
iniciar totalTickets en 0
iniciar cantidadCompras en 0
recorrer cada venta con un ciclo
  si la venta pasa la regla de validación
    calcular subtotal = cantidad * precio
    acumular subtotal en totalTickets
    incrementar cantidadCompras en 1
si cantidadCompras es mayor que 0
  calcular ticketPromedio = totalTickets / cantidadCompras
  mostrar ticketPromedio
si no
  informar que no se puede calcular porque no hay compras válidas
```

**Criterio del ticket promedio:** cada fila válida representa una compra; no se agrupan ni se cuentan clientes únicos. La venta más grande se compara por el subtotal de la transacción (`cantidad * precio`), no solo por el precio unitario.

- `src/analitica.js`: se creó y exportó `valorVenta(venta)`, que calcula el subtotal de una venta multiplicando `cantidad` por `precio`, como función reutilizable para los indicadores.
- `src/analitica.js`: se añadieron `totalVendido(ventas)`, `unidadesVendidas(ventas)` y `ventaMayor(ventas)` usando ciclos `for...of`. Las tres excluyen registros con cantidad cero, cantidades o precios no numéricos y valores negativos; `ventaMayor` devuelve el registro completo o `null` si no encuentra ventas válidas.
- `src/analitica.js`: se añadió y exportó `ticketPromedio(ventas)`, que acumula el valor de cada venta válida y lo divide entre la cantidad de ventas válidas (cantidad mayor que cero); devuelve `null` cuando no hay ventas válidas para evitar división por cero.
- `src/analitica.js`: se añadió y exportó `ventasPorCiudad(ventas, ciudad)`, que suma el valor de las ventas válidas de la ciudad solicitada. La comparación ignora diferencias de mayúsculas, espacios al inicio o al final y espacios consecutivos; si la ciudad buscada no es texto o queda vacía, devuelve `0`.

### Pruebas por tamaño de entrada y criterio para arreglo vacío

Se probaron las funciones que reciben el arreglo de ventas con el arreglo completo, un arreglo de un solo elemento (`ventas[0]`) y un arreglo vacío. Para `ventasPorCiudad` se consultó `Medellín` en los tres casos.

| Entrada | `totalVendido` | `unidadesVendidas` | `ventaMayor` | `ticketPromedio` | `ventasPorCiudad(..., "Medellín")` |
|---|---:|---:|---|---:|---:|
| Arreglo completo | `985000` | `21` | Registro `id: 10` | `89545.45` aprox. | `356000` |
| Un elemento (`id: 1`) | `84000` | `2` | Registro `id: 1` | `84000` | `84000` |
| Arreglo vacío | `0` | `0` | `null` | `null` | `0` |

**Decisión para entradas vacías:** los acumuladores (`totalVendido`, `unidadesVendidas` y `ventasPorCiudad`) devuelven `0`; `ventaMayor` devuelve `null` porque no hay un registro que retornar; `ticketPromedio` devuelve `null` porque el promedio no está definido sin ventas y no se debe dividir entre cero. `valorVenta` recibe una venta individual, no un arreglo, por lo que se probó aparte con `ventas[0]` y devolvió `84000`.

### Verificación manual con tabla de traza

Se recorrieron las ventas en orden. Para cada cantidad mayor que cero se calculó `cantidad × precio`, se sumó al acumulado y se contó una venta válida. El registro `id: 8`, con cantidad `0`, se excluye según la regla definida.

| ID | Operación manual | Subtotal incluido | Acumulado de ventas | Ventas válidas acumuladas |
|---:|---|---:|---:|---:|
| 1 | `2 × 42000` | `84000` | `84000` | 1 |
| 2 | `1 × 26000` | `26000` | `110000` | 2 |
| 3 | `1 × 95000` | `95000` | `205000` | 3 |
| 4 | `1 × 42000` | `42000` | `247000` | 4 |
| 5 | `3 × 45000` | `135000` | `382000` | 5 |
| 6 | `2 × 26000` | `52000` | `434000` | 6 |
| 7 | `1 × 120000` | `120000` | `554000` | 7 |
| 8 | Cantidad `0`: se excluye | `—` | `554000` | 7 |
| 9 | `2 × 45000` | `90000` | `644000` | 8 |
| 10 | `4 × 42000` | `168000` | `812000` | 9 |
| 11 | `1 × 95000` | `95000` | `907000` | 10 |
| 12 | `3 × 26000` | `78000` | `985000` | 11 |

El cálculo manual da **total vendido = 985000** y **11 ventas válidas**; por tanto, `ticketPromedio = 985000 / 11 = 89545.4545…` (aprox. `89545.45`). La ejecución del programa devolvió `totalVendido(ventas) = 985000` y `ticketPromedio(ventas) = 89545.45454545454`, coincidiendo con la traza manual.

## 2026-11-18
## Minireto 3: indicadores con métodos de arreglo

- Antes de modificar, se verificó que las versiones con ciclos `totalVendido`, `unidadesVendidas` y `ventasPorCiudad` ya existían, pero sus equivalentes con sufijo `M` no estaban implementados.
- `src/analitica.js`: se añadieron y exportaron `totalVendidoM`, `unidadesVendidasM` y `ventasPorCiudadM`, construidas con `filter`, `map` y `reduce`. Reutilizan la misma validación de venta y, en el caso de ciudad, la misma normalización que las funciones con ciclos.
- Se compararon, con igualdad estricta, cada versión `M` y su ciclo para el arreglo completo, un arreglo de un elemento y un arreglo vacío. También se compararon ventas por ciudad para `Medellín`, incluyendo espacios sobrantes y variación de mayúsculas. Todos los pares devolvieron exactamente el mismo resultado: total general `985000`, unidades `21`, total de Medellín `356000`; para arreglo vacío, `0` en los tres indicadores.
- `src/verificar.js`: se creó un ejecutable que invoca ambas versiones de cada indicador con los mismos datos y muestra `OK` o `DIFERENTE`. Compara total y unidades, además de ventas por ciudad para Medellín (incluyendo espacios y mayúsculas), Bogotá, Cali y Pereira; ejecuta los casos con ventas completas, una venta y arreglo vacío, y termina con código de error si algún par no coincide.

### Agrupaciones y rankings de ventas

- `totalPorCiudad(ventas)`
  - **¿Qué recorro?** Cada registro de venta.
  - **¿Qué filtro?** Solo ventas válidas con ciudad de texto no vacía.
  - **¿Qué transformo?** Normalizo la ciudad quitando espacios sobrantes, reduciendo espacios consecutivos e ignorando mayúsculas; el nombre de salida conserva la primera forma legible encontrada.
  - **¿Qué acumulo?** El subtotal (`cantidad × precio`) de cada venta válida.
  - **¿Cómo agrupo?** En un objeto diccionario por ciudad normalizada, para que diferencias como `Bogotá` y `Bogotá ` pertenezcan al mismo grupo.
- `unidadesPorProducto(ventas)`
  - **¿Qué recorro?** Cada registro de venta.
  - **¿Qué filtro?** Solo ventas válidas con nombre de producto de texto no vacío.
  - **¿Qué transformo?** Tomo el nombre del producto y su cantidad; conservo el nombre tal como está en los datos.
  - **¿Qué acumulo?** Las unidades (`cantidad`) vendidas.
  - **¿Cómo agrupo?** En un objeto diccionario usando el nombre del producto como clave.
- `topProductosPorValor(ventas, k)`
  - **¿Qué recorro?** Cada registro de venta para construir los totales por producto.
  - **¿Qué filtro?** Solo ventas válidas con nombre de producto de texto no vacío.
  - **¿Qué transformo?** Cada venta válida a su subtotal (`cantidad × precio`) y los acumulados a elementos `{ producto, total }`.
  - **¿Qué acumulo?** El dinero generado por las ventas de cada producto.
  - **¿Cómo agrupo?** En un objeto diccionario por producto; después ordeno una lista nueva de mayor a menor total y tomo los primeros `k`, sin modificar el arreglo recibido. En empates, ordeno alfabéticamente por producto. `k` debe ser un entero no negativo; de lo contrario, se lanza `RangeError`.
- Resultados comprobados con los datos actuales: por ciudad, Medellín `356000`, Bogotá `276000`, Cali `185000` y Pereira `168000`; por unidades, Huila `7`, Nariño `6`, Sierra `5`, Prensa francesa `2` y Molino manual `1`. El top 3 por valor es Huila (`294000`), Sierra (`225000`) y Prensa francesa (`190000`).
- Se comprobó que `topProductosPorValor` no modifica el arreglo original, que `k = 0` devuelve una lista vacía, que un `k` mayor al número de productos devuelve todos y que `k` negativo o fraccionario produce `RangeError`.
- Se ejecutó `node src/verificar.js`: todos los pares ciclo/métodos mostraron `OK` para los datos completos, una venta y el arreglo vacío.
