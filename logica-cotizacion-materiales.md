# Lógica de Cotización de Materiales para Corte Láser

## Introducción

Este documento explica la lógica utilizada para calcular la cotización de materiales en el sistema de corte láser. La función principal se encuentra en `src/lib/laserCalculations.ts` y maneja el cálculo de costos para piezas cortadas con láser.

## Unidades Utilizadas

- **Dimensiones**: Todas las medidas se manejan en centímetros (cm).
- **Área**: Se calcula en centímetros cuadrados (cm²).
- **Moneda**: Pesos Mexicanos (MXN).

## Estructura de Datos

### Material Láser (`LaserMaterial`)
- `sheet_width`: Ancho de la lámina en cm
- `sheet_height`: Alto de la lámina en cm
- `usable_width`: Ancho utilizable en cm (después de márgenes)
- `usable_height`: Alto utilizable en cm (después de márgenes)
- `price_per_sheet`: Precio por lámina completa en MXN

### Entrada de Cotización (`LaserQuoteInput`)
- `piece_width`: Ancho de la pieza en cm
- `piece_height`: Alto de la pieza en cm
- `cutting_minutes`: Minutos de corte requeridos
- `material_id`: ID del material seleccionado

## Pasos del Cálculo

### Paso 1: Calcular Área y Material Necesario

```typescript
const pieceArea = input.piece_width * input.piece_height; // cm² por pieza
const totalAreaNeeded = pieceArea; // cm² total (sin multiplicar por cantidad)
const sheetArea = material.sheet_width * material.sheet_height; // cm² de lámina completa
```

- Se calcula el área de una pieza individual.
- Se obtiene el área total requerida (sin considerar cantidad por ahora).
- Se obtiene el área total de una lámina.

### Paso 2: Calcular Precio por Centímetro Cuadrado

```typescript
const pricePerCm2 = material.price_per_sheet / sheetArea;
```

- El precio por cm² se obtiene dividiendo el precio de la lámina entre su área total.
- Esto da el costo base por unidad de área.

### Paso 3: Calcular Número de Láminas Necesarias

```typescript
const usableArea = material.usable_width * material.usable_height; // cm² utilizable
const sheetsNeeded = Math.ceil(totalAreaNeeded / usableArea); // Para una pieza
```

- Se calcula el área utilizable (después de restar márgenes de corte).
- Se divide el área total necesaria entre el área utilizable y se redondea hacia arriba (para una pieza).

### Paso 4: Calcular Costos Directos

```typescript
const materialCost = totalAreaNeeded * pricePerCm2; // Costo del material usado
const cuttingCost = input.cutting_minutes * cuttingRatePerMinute; // $8 MXN por minuto
const assemblyCost = input.requires_assembly
  ? input.quantity * (input.assembly_cost_per_piece || assemblyCostPerPiece)
  : 0;
```

- **Costo de material**: Área total × precio por cm²
- **Costo de corte**: Minutos de corte × tarifa por minuto ($8 MXN por defecto)
- **Costo de ensamblaje**: Si aplica, costo por pieza (sin multiplicar por cantidad)

### Paso 5: Subtotal de Costos Directos

```typescript
const directCostsSubtotal = materialCost + cuttingCost + assemblyCost;
```

- Suma de todos los costos directos.

### Paso 6: Aplicar Margen de Utilidad

```typescript
const profit = directCostsSubtotal * profitMargin; // 50% por defecto
```

- Se aplica un margen de utilidad del 50% sobre los costos directos.

### Paso 7: Precio de Venta sin IVA

```typescript
const priceWithoutIVA = directCostsSubtotal + profit;
```

- Costos directos + utilidad.

### Paso 8: Calcular IVA

```typescript
const iva = priceWithoutIVA * 0.16; // 16% IVA
```

- IVA sobre el precio de venta sin IVA.

### Paso 9: Total Final

```typescript
const total = priceWithoutIVA + iva;
```

- Precio final incluyendo IVA.

## Consideraciones Importantes

1. **Área Utilizable**: Se utiliza el área utilizable en lugar del área total de la lámina para calcular la cantidad de láminas necesarias, considerando márgenes de seguridad.

2. **Rotación de Piezas**: La función `calculatePiecesPerSheet` considera tanto la orientación normal como la rotada 90° para maximizar el uso de material.

3. **Unidades Consistentes**: Todas las dimensiones deben estar en centímetros para evitar errores de conversión.

4. **Margen de Utilidad**: Actualmente fijo en 50%, pero puede ser configurable.

## Ejemplo de Cálculo

Supongamos:
- Pieza: 10cm × 15cm
- Lámina: 120cm × 80cm (área utilizable: 115cm × 75cm)
- Precio por lámina: $500 MXN
- Minutos de corte: 50
- Tarifa de corte: $8/min

Cálculo:
1. Área por pieza: 10 × 15 = 150 cm²
2. Área total: 150 cm² (sin multiplicar por cantidad)
3. Área lámina: 120 × 80 = 9,600 cm²
4. Precio por cm²: 500 / 9,600 ≈ $0.0521
5. Área utilizable: 115 × 75 = 8,625 cm²
6. Láminas necesarias: ceil(150 / 8,625) = 1 lámina
7. Costo material: 150 × 0.0521 ≈ $7.81
8. Costo corte: 50 × 8 = $400
9. Subtotal costos directos: 7.81 + 400 = $407.81
10. Utilidad (50%): 407.81 × 0.5 = $203.905
11. Precio sin IVA: 407.81 + 203.905 = $611.715
12. IVA (16%): 611.715 × 0.16 ≈ $97.87
13. Total: 611.715 + 97.87 ≈ $709.585

## Notas sobre Unidades

- Anteriormente se manejaban decímetros, pero se cambió a centímetros para mayor precisión.
- 1 decímetro cuadrado = 100 cm²
- Asegurarse de que todas las entradas estén en las unidades correctas para evitar errores de cálculo.