# Café Origen: analítica de ventas

Proyecto de práctica para analizar las ventas de Café Origen con JavaScript. Incluye exploración de datos, indicadores de negocio, agrupaciones por ciudad y producto, rankings y un reporte legible por consola. Los datos de muestra están en `src/datos.js`.

## Cómo ejecutarlo

Desde la raíz del proyecto, con Node.js instalado:

```bash
node src/explorar.js
node src/verificar.js
node src/reporte.js
```

No se requieren dependencias externas.

## Preguntas que responde

- ¿Cuánto se vendió en total y cuántas unidades se vendieron?
- ¿Cuál fue la transacción de mayor valor y cuál es el ticket promedio por compra válida?
- ¿Cuánto se vendió por ciudad, tratando como iguales los nombres con diferencias de mayúsculas o espacios sobrantes?
- ¿Cuántas unidades se vendieron de cada producto y cuáles generaron más dinero?
- ¿Cómo se comportan el total, las unidades y el ticket promedio para un día con ventas o sin ventas?

Las ventas con cantidad cero o con cantidad/precio inválidos se excluyen de los indicadores, de acuerdo con la regla registrada en la bitácora.