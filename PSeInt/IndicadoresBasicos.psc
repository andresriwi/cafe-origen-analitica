Algoritmo IndicadoresBasicos
	Definir cantidades Como Entero
	Definir precios Como Real
	Definir i, totalUnidades, cantidadCompras, indiceVentaMayor Como Entero
	Definir totalVentas, subtotal, mayorVenta, ticketPromedio Como Real
	Definir hayVentasValidas Como Logico
	
	Dimension cantidades[12]
	Dimension precios[12]
	
	cantidades[1] <- 2
	cantidades[2] <- 1
	cantidades[3] <- 1
	cantidades[4] <- 1
	cantidades[5] <- 3
	cantidades[6] <- 2
	cantidades[7] <- 1
	cantidades[8] <- 0
	cantidades[9] <- 2
	cantidades[10] <- 4
	cantidades[11] <- 1
	cantidades[12] <- 3
	
	precios[1] <- 42000
	precios[2] <- 26000
	precios[3] <- 95000
	precios[4] <- 42000
	precios[5] <- 45000
	precios[6] <- 26000
	precios[7] <- 120000
	precios[8] <- 42000
	precios[9] <- 45000
	precios[10] <- 42000
	precios[11] <- 95000
	precios[12] <- 26000
	
	totalVentas <- 0
	totalUnidades <- 0
	cantidadCompras <- 0
	mayorVenta <- 0
	indiceVentaMayor <- 0
	hayVentasValidas <- Falso
	
	Para i <- 1 Hasta 12 Hacer
		Si cantidades[i] > 0 Y precios[i] >= 0 Entonces
			subtotal <- cantidades[i] * precios[i]
			totalVentas <- totalVentas + subtotal
			totalUnidades <- totalUnidades + cantidades[i]
			cantidadCompras <- cantidadCompras + 1
			
			Si No hayVentasValidas Entonces
				mayorVenta <- subtotal
				indiceVentaMayor <- i
				hayVentasValidas <- Verdadero
			SiNo
				Si subtotal > mayorVenta Entonces
					mayorVenta <- subtotal
					indiceVentaMayor <- i
				FinSi
			FinSi
		FinSi
	FinPara
	
	Escribir "Total vendido: ", totalVentas
	Escribir "Unidades vendidas: ", totalUnidades
	
	Si hayVentasValidas Entonces
		Escribir "Venta mayor: ", mayorVenta
		Escribir "Registro de venta mayor: ", indiceVentaMayor
	SiNo
		Escribir "No hay ventas validas para buscar una venta mayor."
	FinSi
	
	Si cantidadCompras > 0 Entonces
		ticketPromedio <- totalVentas / cantidadCompras
		Escribir "Ticket promedio: ", ticketPromedio
	SiNo
		Escribir "No se puede calcular el ticket promedio."
	FinSi
FinAlgoritmo
