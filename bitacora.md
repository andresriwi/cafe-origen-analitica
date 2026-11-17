# Bitácora de trabajo

## 2026-11-17
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
