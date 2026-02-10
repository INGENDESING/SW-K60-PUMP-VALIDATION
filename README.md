# P2603 SW-K60 - Cálculo Hidráulico de Bombas de Pulpa

## Descripción

Aplicación web profesional para la evaluación de bombas existentes y especificación de bombas nuevas en sistemas de bombeo de pulpa de papel.

**Cliente:** Smurfit Westrock Colombia
**Consultor:** DML INGENIEROS
**Autores:** Ing. Jonathan Arboleda Genes, Ing. Herminsul Rosero
**Versión:** 1.0
**Fecha:** 2025

## Características

- ✅ Cálculo de pérdidas de presión en succión y descarga
- ✅ Determinación de NPSH disponible vs requerido
- ✅ Análisis de curvas de operación de bombas (TDH vs Flujo)
- ✅ Validación contra cavitación
- ✅ Base de datos de tuberías (ANSI B36.10/19, PVC)
- ✅ Base de datos de accesorios con coeficientes K y L/D
- ✅ Base de datos de tipos de pulpa con correlaciones Duffy-Möller
- ✅ Interfaz oscura profesional
- ✅ Reportes técnicos imprimibles
- ✅ Exportación de datos JSON

## Fundamentos Técnicos

### Metodología

La aplicación implementa la metodología del **TAPPI TIP 0410-14** para el cálculo de pérdidas de fricción en tuberías de pulpa, incluyendo:

- **Tres regiones de flujo:**
  - Región 1: Flujo de red de fibra (V < V₁)
  - Región 2: Flujo de transición (V₁ ≤ V < Vw)
  - Región 3: Flujo turbulento/arrastre (V ≥ Vw)

- **Correlaciones de Duffy y Möller** para velocidades críticas

- **Factor de fricción modificado (Kmod)** según tipo de pulpa y región de flujo

### Ecuaciones Implementadas

```
Vw = a × C^b × D^c    (Velocidad de arrastre)

NPSHd = Ps/γ + V²/2g - Pv/γ - hf

TDH = Hd - Hs + hfd + hfs + (Vd² - Vs²)/2g

f_pulp = f_water × Kmod
```

## Estructura del Proyecto

```
/sw-k60/
│
├── index.html              # Página principal
│
├── styles/
│   ├── theme.css          # Variables CSS y tema oscuro
│   ├── main.css           # Estilos principales
│   ├── components.css     # Componentes UI
│   └── print.css          # Estilos de impresión
│
├── scripts/
│   ├── utils.js           # Utilidades y conversiones
│   ├── calculations.js    # Motor de cálculos hidráulicos
│   ├── validation.js      # Validación de datos
│   ├── state.js           # Gestión de estado
│   ├── ui.js              # Controladores de UI
│   └── main.js            # Punto de entrada
│
├── data/
│   ├── tuberias.js        # Base de datos de tuberías
│   ├── accesorios.js      # Base de datos de accesorios
│   ├── pulpa.js           # Base de datos de pulpa
│   └── propiedades.js     # Propiedades físicas del agua
│
├── assets/
│   └── images/
│       ├── DML.png        # Logo DML Ingenieros
│       └── SW.png         # Logo Smurfit Westrock
│
└── README.md              # Este archivo
```

## Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **Gráficos:** Chart.js 4.4.0
- **Hospedaje:** GitHub Pages

## Instalación y Uso

### Desarrollo Local

1. Clonar o descargar el repositorio
2. Abrir `index.html` en un navegador web

No se requiere servidor web para desarrollo. La aplicación funciona completamente en el cliente.

### Producción (GitHub Pages)

1. Crear repositorio en GitHub
2. Subir archivos a la rama `main`
3. Habilitar GitHub Pages en Settings
4. URL generada: `https://usuario.github.io/repo/`

## Uso de la Aplicación

### Paso 1: Datos del Proceso

Seleccione el tipo de pulpa e ingrese:
- Consistencia (%)
- Temperatura (°C)
- pH (opcional)
- Grado de refinación °SR (opcional)
- Contenido de aire % (opcional)

### Paso 2: Tubería de Succión

Especifique:
- Norma (ANSI, DIN, PVC)
- Diámetro nominal (2" - 24")
- Cédula (10, 20, 40, 80, 10S, 40S, 80S)
- Longitud (m)
- Accesorios (con coeficientes K)

### Paso 3: Tubería de Descarga

[Mismos campos que succión]

### Paso 4: Datos de la Bomba

- Fabricante y modelo
- Tipo de bomba
- Diámetro de impulsor (mm)
- Velocidad de rotación (RPM)
- Flujo de diseño (L/s)

### Paso 5: Curva Característica

Ingrese al menos 3 puntos de la curva H-Q:
- Flujo Q (L/s)
- Altura TDH (m)
- NPSH requerido (m)
- Eficiencia (%)
- Potencia (kW, opcional)

### Paso 6: Condiciones de Operación

- Presión en tanque de succión (bar)
- Elevación de succión (m)
- Presión en descarga (bar)
- Elevación de descarga (m)

### Paso 7: Resultados

Revise:
- Estado general (semáforo)
- NPSH disponible vs requerido
- TDH del sistema vs TDH de bomba
- Potencia requerida
- Gráficos de curvas
- Recomendaciones

## Validación

La aplicación valida:

- ✅ Rangos de entrada (consistencia, temperatura, etc.)
- ✅ Integridad técnica (diámetros, velocidades)
- ✅ Riesgo de cavitación (NPSHd < NPSHr + margen)
- ✅ Capacidad de bomba (TDH disponible ≥ TDH requerida)

## Referencias Técnicas

1. TAPPI TIP 0410-14: "Generalized Method for Determining the Pipe Friction Loss of Flowing Pulp Suspensions"
2. Duffy, G.G., "Flow Dynamics of Pulp Fiber Suspensions", Nordic Pulp and Paper Research Journal
3. Möller, K., "Pressure Drop in Pulp Pipe Flow", Pulp and Paper Canada
4. Hydraulic Institute Engineering Data Book
5. Pump Handbook, Karassik et al.

## Autores

**Desarrollado por:**

- Ing. Jonathan Arboleda Genes
- Ing. Herminsul Rosero

**DML INGENIEROS**
Consultores en Ingeniería de Procesos
proyectos2@dmlsas.com

**Para:**
Smurfit Westrock Colombia

## Licencia

Confidencial - Propiedad de Smurfit Westrock Colombia y DML INGENIEROS

---

**Proyecto:** P2603 SW-K60
**Fecha:** 2025
**Versión:** 1.0
