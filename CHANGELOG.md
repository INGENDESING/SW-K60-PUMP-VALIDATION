# CHANGELOG - P2603 SW-K60
Sistema de Cálculo Hidráulico para Bombas de Pulpa

Todos los cambios notables en este proyecto se documentarán en este archivo.

## [Versión 2.1.0] - 2026-02-10

### NUEVA FUNCIONALIDAD - Reglas de Afinidad de Bombas
- **Visualización del impulsor**: Agregada tarjeta en Paso 5 mostrando diámetro, RPM y tipo
- **Reglas de Afinidad**: Implementada funcionalidad para recalcular curva al cambiar diámetro del impulsor
- **Previsualización**: Gráfico muestra curva original y nueva curva calculada
- **Confirmación**: Usuario puede confirmar o cancelar antes de reemplazar la curva

### DETALLES TÉCNICOS
- **scripts/calculations.js**: Nueva función `applyAffinityLaws()` implementando fórmulas:
  - Q2 = Q1 × (D2/D1) - Flujo proporcional
  - H2 = H1 × (D2/D1)² - TDH proporcional al cuadrado
  - P2 = P1 × (D2/D1)³ - Potencia proporcional al cubo
- **scripts/ui.js**:
  - `getStep5Template()`: Agregadas tarjetas de información y control de reglas de afinidad
  - `initStep5Events()`: Event listeners para aplicar, confirmar y cancelar
  - `previewAffinityCurve()`: Función para previsualizar nueva curva en gráfico
- **scripts/validation.js**: Nueva función `validateImpellerDiameter()` para validar rangos

### REGLAS DE AFINIDAD IMPLEMENTADAS
- Cambio en diámetro del impulsor (D1 → D2) a RPM constantes
- Rango típico soportado: 70% - 120% del diámetro original
- Advertencias para cambios extremos (< 50% o > 150%)
- NPSHr y eficiencia se mantienen constantes (aproximación razonable)

---

## [Versión 2.0.8] - 2026-02-10

### CORREGIDO (SyntaxError - Error de sintaxis en ui.js)
- **Llave extra**: Eliminada llave de cierre sobrante en updateSummary()
- **Contexto**: Error de sintaxis impedía cargar la aplicación
- **Error**: `Uncaught SyntaxError: Missing initializer in const declaration`

### DETALLES TÉCNICOS
- `scripts/ui.js`: Eliminada llave extra en línea 1542
- El error fue introducido accidentalmente en la corrección v2.0.7

---

## [Versión 2.0.7] - 2026-02-10

### CORREGIDO (UX - Sidebar y Selectores de Tubería)
- **Problema 1**: El sidebar "Datos Ingresados" no se actualizaba al cambiar diámetros
- **Problema 2**: Al añadir accesorios, el diámetro seleccionado se reseteaba automáticamente

### DETALLES TÉCNICOS
- **Causa Problema 1**: `updateSummary()` solo se ejecutaba si `summary.pulpName` existía
  - **Solución**: Modificada la lógica para mostrar siempre los datos disponibles
- **Causa Problema 2**: Los selectores norm/nominal/schedule no guardaban valores en State
  - **Solución**: Agregadas llamadas a `State.set()` en los event listeners de cambio

### ARCHIVOS MODIFICADOS
- `scripts/ui.js`:
  - `updateSummary()`: Refactorizada para mostrar datos progresivamente
  - `initPipeEvents()`: Agregadas llamadas a `State.set()` para norm, nominal, schedule

---

## [Versión 2.0.6] - 2026-02-10

### CORREGIDO (ReferenceError - Variable flowUnitLabel)
- **Variable no definida**: Agregada definición de flowUnitLabel en renderCharts()
- **Contexto**: Error ocurría al mostrar gráficos en Paso 7 (Resultados)
- **Error**: `Uncaught ReferenceError: flowUnitLabel is not defined`

### DETALLES TÉCNICOS
- `scripts/ui.js`: Agregada `const flowUnitLabel = State.getFlowUnitLabel();` en renderCharts()
- La variable se usa para etiquetar el eje X de los gráficos TDH y NPSH
- Misma solución ya utilizada en otras funciones del mismo archivo

---

## [Versión 2.0.5] - 2026-02-10

### MEJORADO (UX - Actualización de Resumen)
- **Actualización de resumen**: Agregadas llamadas a updateSummary() al añadir/eliminar accesorios
- **Actualización de resumen**: Agregadas llamadas a updateSummary() al cambiar diámetro/norma/cédula
- **Contexto**: El resumen en el sidebar no se actualizaba automáticamente con los cambios

### DETALLES TÉCNICOS
- `scripts/ui.js`: showFittingDialog() - Agregada llamada a updateSummary() después de añadir accesorio
- `scripts/ui.js`: remove-fitting-btn event - Agregada llamada a updateSummary() después de eliminar
- `scripts/ui.js`: initPipeEvents() - Agregadas llamadas a updateSummary() en cambios de selectors

---

## [Versión 2.0.4] - 2026-02-10

### CORREGIDO (Crítico - Gráficos en Resultados)
- **Variable TDHs no definida**: Agregado cálculo de TDHs para curva de bomba
- **Variable NPSHrs no definida**: Agregado cálculo de NPSHrs para curva de bomba
- **Contexto**: Errores ocurrían al mostrar resultados en Paso 7
- **Solución**: Implementados cálculos de interpolación y fallback para ambas variables

### DETALLES TÉCNICOS
- `scripts/ui.js`: Agregada generación de array `TDHs` con interpolación desde curve_points
- `scripts/ui.js`: Agregada generación de array `NPSHrs` con interpolación desde curve_points
- Ambas implementaciones incluyen fallback a cálculos aproximados si no hay puntos de curva

---

## [Versión 2.0.3] - 2026-02-10

### CORREGIDO (Crítico - TypeError en UI)
- **Llamada a función inexistente**: Eliminada llamada a `this.validateStep(1)` que causaba TypeError
- **Contexto**: El error ocurría al ingresar el valor del flujo en el Paso 1
- **Causa**: La función `validateStep` no existe en `StepManager`
- **Solución**: Eliminada la llamada innecesaria en ui.js línea 845

### CAMBIOS TÉCNICOS
- `scripts/ui.js`: Eliminadas líneas 844-845 (comentario y llamada a validateStep)

---

## [Versión 2.0.2] - 2026-02-10

### CORREGIDO (Crítico - Dependencias Faltantes)
- **Funciones de conversión de flujo**: Agregadas `flowUnit_to_L_s` y `L_s_to_flowUnit` en utils.js
- **Chart.js global**: Asignado Chart a window.Chart para disponibilidad global
- **calculatePulpDensity**: Re-exportada desde pulpa.js en calculations.js
- **Dependencias faltantes**: Corregidas las 4 dependencias que impedían inicialización

### CAMBIOS TÉCNICOS
- `scripts/utils.js`: Agregadas 2 funciones de conversión de flujo y sus exportaciones
- `index.html`: Agregado script inline para asignar Chart globalmente
- `scripts/calculations.js`: Agregada re-exportación de calculatePulpDensity

---

## [Versión 2.0.1] - 2026-02-10

### CORREGIDO (Crítico - Errores de JavaScript)
- **Duplicación PHYSICAL_CONSTANTS**: Eliminada duplicación de constantes físicas entre utils.js y propiedades.js
- **Duplicación calculateVelocity()**: Eliminada función duplicada en propiedades.js
- **Exportaciones faltantes**: Agregada exportación de calculateModifiedReynolds y calculateVelocity en calculations.js
- **Referencias rotas**: Eliminadas referencias a PHYSICAL_CONSTANTS en exportaciones de propiedades.js

### CAMBIOS TÉCNICOS
- `data/propiedades.js`: Eliminadas líneas 204-270 (objeto PHYSICAL_CONSTANTS completo)
- `data/propiedades.js`: Eliminada función calculateVelocity() (duplicada)
- `data/propiedades.js`: Limpiadas exportaciones (eliminadas referencias a constantes eliminadas)
- `scripts/calculations.js`: Agregadas exportaciones faltantes (calculateModifiedReynolds, calculateVelocity)

---

## [Versión 2.0.0] - 2026-02-10

### CORREGIDO (Crítico)
- **Densidad de pulpa**: Corregido error de factor 100 duplicado en cálculo de densidad (línea 411, pulpa.js)
- **Reynolds modificado**: Implementado correctamente según TAPPI TIP 0410-14
- **Regiones de flujo**: Corregida determinación para incluir punto de mínimo Vg
- **Factor Kmod**: Mejorado con modelo Duffy-Möller completo considerando V/Vw
- **Expansión súbita**: Corregida fórmula en accesorios.js (sin exponente exterior)

### AGREGADO (Seguridad)
- Validación para consistencia = 0% (agua pura) con advertencias
- Validación de NPSH disponible negativo (operación físicamente imposible)
- Validación de división por cero en funciones críticas
- Validación de temperaturas extremas (<1°C, >95°C)
- Constantes físicas PHYSICAL_CONSTANTS en utils.js
- Función calculateVelocity() con validaciones defensivas

### MEJORADO (UX)
- Umbrales de NPSH ajustados: warning 5-11%, critical <5%
- Función checkCavitation() con mensajes más detallados
- Mensajes de error con consecuencias y recomendaciones
- Exportaciones actualizadas en calculations.js y utils.js

### DOCUMENTACIÓN
- Documentación de funciones mejorada con JSDoc
- Referencias a TAPPI TIP 0410-14 en comentarios

### TÉCNICO
- Reorganización de determineFlowRegion() con subregiones 2a y 2b
- calculateKmod() ahora acepta parámetro velocity_ratio opcional
- Mejor manejo de errores en cálculos críticos

---

## [Versión 1.0.0] - 2025

### LANZAMIENTO INICIAL
- Cálculo de pérdidas de presión según TAPPI TIP 0410-14
- Base de datos de tuberías ANSI B36.10/19 y PVC
- Base de datos de accesorios con coeficientes K
- Base de datos de tipos de pulpa (Kraft, TMP, OCC, etc.)
- Interfaz de usuario de 7 pasos
- Generación de reportes imprimibles
- Gráficos de curvas de bomba
- Exportación JSON

---

## REFERENCIAS

1. TAPPI TIP 0410-14 - Generalized Method for Determining Pipe Friction Loss
2. Duffy, G.G. - Flow Dynamics of Pulp Fiber Suspensions
3. Möller, K. - Pressure Drop in Pulp Pipe Flow
4. Crane Technical Paper 410 - Flow of Fluids
5. Hydraulic Institute Engineering Data Book

---

**Mantenido por:** DML INGENIEROS
**Contacto:** proyectos2@dmlsas.com
