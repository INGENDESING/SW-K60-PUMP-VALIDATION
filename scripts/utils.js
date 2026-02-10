/**
 * UTILIDADES Y FUNCIONES AUXILIARES - P2603 SW-K60
 * Funciones matemáticas, conversiones y helpers
 */

// ===== CONSTANTES FÍSICAS =====
const PHYSICAL_CONSTANTS = {
    g: 9.80665,              // Gravedad estándar (m/s²)
    P_atm: 101.325,          // Presión atmosférica (kPa)
    rho_water_20: 998.2,     // Densidad del agua a 20°C (kg/m³)
    mu_water_20: 0.001002,   // Viscosidad del agua a 20°C (Pa·s)
    T_standard: 20,          // Temperatura estándar (°C)
    P_atm_bar: 1.01325       // Presión atmosférica (bar)
};

// ===== FUNCIONES DE CONVERSIÓN DE FLUJO =====

/**
 * Convertir desde unidad de flujo a L/s
 * @param {number} value - Valor en unidad origen
 * @param {string} unit - Unidad origen ('m3_h', 'gpm', 'L_s')
 * @returns {number} Valor en L/s
 */
function flowUnit_to_L_s(value, unit) {
    switch(unit) {
        case 'm3_h': return value / 3.6;
        case 'gpm': return value / 15.8503;
        case 'L_s': return value;
        default: return value;
    }
}

/**
 * Convertir desde L/s a unidad de flujo
 * @param {number} value_L_s - Valor en L/s
 * @param {string} unit - Unidad destino ('m3_h', 'gpm', 'L_s')
 * @returns {number} Valor convertido
 */
function L_s_to_flowUnit(value_L_s, unit) {
    switch(unit) {
        case 'm3_h': return value_L_s * 3.6;
        case 'gpm': return value_L_s * 15.8503;
        case 'L_s': return value_L_s;
        default: return value_L_s;
    }
}

// ===== FUNCIONES MATEMÁTICAS =====

/**
 * Interpolación lineal
 * @param {number} x - Valor a interpolar
 * @param {Array} xValues - Array de valores x conocidos
 * @param {Array} yValues - Array de valores y conocidos
 * @returns {number} Valor interpolado de y
 */
function linearInterpolation(x, xValues, yValues) {
    // Validar que los arrays tengan el mismo tamaño
    if (xValues.length !== yValues.length) {
        throw new Error("Los arrays x e y deben tener el mismo tamaño");
    }

    // Si x está fuera del rango, extrapolar
    if (x <= xValues[0]) {
        return yValues[0];
    }
    if (x >= xValues[xValues.length - 1]) {
        return yValues[yValues.length - 1];
    }

    // Encontrar el intervalo donde está x
    for (let i = 0; i < xValues.length - 1; i++) {
        if (x >= xValues[i] && x <= xValues[i + 1]) {
            // Interpolar
            const t = (x - xValues[i]) / (xValues[i + 1] - xValues[i]);
            return yValues[i] + t * (yValues[i + 1] - yValues[i]);
        }
    }

    return NaN;
}

/**
 * Interpolación bilineal
 * @param {number} x - Valor x a interpolar
 * @param {number} y - Valor y a interpolar
 * @param {Array} xValues - Array de valores x conocidos
 * @param {Array} yValues - Array de valores y conocidos
 * @param {Array<Array>} zValues - Matriz de valores z (z[i][j] corresponde a x[i], y[j])
 * @returns {number} Valor interpolado de z
 */
function bilinearInterpolation(x, y, xValues, yValues, zValues) {
    // Encontrar índices
    let i = 0, j = 0;

    // Buscar i tal que xValues[i] <= x < xValues[i+1]
    for (let k = 0; k < xValues.length - 1; k++) {
        if (x >= xValues[k] && x <= xValues[k + 1]) {
            i = k;
            break;
        }
    }

    // Buscar j tal que yValues[j] <= y < yValues[j+1]
    for (let k = 0; k < yValues.length - 1; k++) {
        if (y >= yValues[k] && y <= yValues[k + 1]) {
            j = k;
            break;
        }
    }

    // Interpolación bilineal
    const x1 = xValues[i];
    const x2 = xValues[i + 1];
    const y1 = yValues[j];
    const y2 = yValues[j + 1];

    const Q11 = zValues[i][j];
    const Q12 = zValues[i][j + 1];
    const Q21 = zValues[i + 1][j];
    const Q22 = zValues[i + 1][j + 1];

    const R1 = ((x2 - x) / (x2 - x1)) * Q11 + ((x - x1) / (x2 - x1)) * Q21;
    const R2 = ((x2 - x) / (x2 - x1)) * Q12 + ((x - x1) / (x2 - x1)) * Q22;

    return ((y2 - y) / (y2 - y1)) * R1 + ((y - y1) / (y2 - y1)) * R2;
}

/**
 * Resolver ecuación no lineal usando método de bisección
 * @param {Function} f - Función a resolver
 * @param {number} a - Límite inferior
 * @param {number} b - Límite superior
 * @param {number} tolerance - Tolerancia (default: 1e-6)
 * @param {number} maxIter - Máximo de iteraciones (default: 100)
 * @returns {number} Raíz encontrada
 */
function solveBisection(f, a, b, tolerance = 1e-6, maxIter = 100) {
    let fa = f(a);
    let fb = f(b);

    // Verificar que hay una raíz en el intervalo
    if (fa * fb > 0) {
        throw new Error("No hay raíz en el intervalo dado");
    }

    for (let i = 0; i < maxIter; i++) {
        const c = (a + b) / 2;
        const fc = f(c);

        if (Math.abs(fc) < tolerance || (b - a) / 2 < tolerance) {
            return c;
        }

        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }
    }

    return (a + b) / 2;
}

/**
 * Resolver ecuación usando método de Newton-Raphson
 * @param {Function} f - Función a resolver
 * @param {Function} df - Derivada de la función
 * @param {number} x0 - Valor inicial
 * @param {number} tolerance - Tolerancia (default: 1e-6)
 * @param {number} maxIter - Máximo de iteraciones (default: 100)
 * @returns {number} Raíz encontrada
 */
function solveNewton(f, df, x0, tolerance = 1e-6, maxIter = 100) {
    let x = x0;

    for (let i = 0; i < maxIter; i++) {
        const fx = f(x);
        const dfx = df(x);

        if (Math.abs(dfx) < 1e-10) {
            throw new Error("Derivada muy cercana a cero");
        }

        const xNew = x - fx / dfx;

        if (Math.abs(xNew - x) < tolerance) {
            return xNew;
        }

        x = xNew;
    }

    return x;
}

/**
 * Calcular factorial
 */
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

/**
 * Calcular combinaciones (n choose k)
 */
function nChooseK(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}

/**
 * Redondear a decimales específicos
 */
function roundTo(value, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Formatear número con separadores de miles
 */
function formatNumber(value, decimals = 2) {
    return value.toLocaleString('es-CO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Limitar valor entre min y max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ===== FUNCIONES DE CONVERSIÓN DE UNIDADES =====

const UNITS = {
    // Temperatura
    temp: {
        C_to_K: (c) => c + 273.15,
        K_to_C: (k) => k - 273.15,
        C_to_F: (c) => c * 9/5 + 32,
        F_to_C: (f) => (f - 32) * 5/9
    },

    // Presión
    pressure: {
        Pa_to_kPa: (pa) => pa / 1000,
        kPa_to_Pa: (kpa) => kpa * 1000,
        Pa_to_bar: (pa) => pa / 100000,
        bar_to_Pa: (bar) => bar * 100000,
        kPa_to_bar: (kpa) => kpa / 100,
        bar_to_kPa: (bar) => bar * 100,
        kPa_to_psi: (kpa) => kpa * 0.145038,
        psi_to_kPa: (psi) => psi / 0.145038,
        kPa_to_mH2O: (kpa) => kpa / 9.80665,
        mH2O_to_kPa: (m) => m * 9.80665,
        kPa_to_mmHg: (kpa) => kpa * 7.50062,
        mmHg_to_kPa: (mmhg) => mmhg / 7.50062
    },

    // Flujo
    flow: {
        L_s_to_m3_h: (l_s) => l_s * 3.6,
        m3_h_to_L_s: (m3_h) => m3_h / 3.6,
        L_s_to_gpm: (l_s) => l_s * 15.8503,
        gpm_to_L_s: (gpm) => gpm / 15.8503,
        m3_h_to_gpm: (m3_h) => m3_h * 4.40287,
        gpm_to_m3_h: (gpm) => gpm / 4.40287
    },

    // Longitud
    length: {
        m_to_ft: (m) => m * 3.28084,
        ft_to_m: (ft) => ft / 3.28084,
        m_to_in: (m) => m * 39.3701,
        in_to_m: (inches) => inches / 39.3701,
        mm_to_in: (mm) => mm / 25.4,
        in_to_mm: (inches) => inches * 25.4
    },

    // Diámetro
    diameter: {
        mm_to_m: (mm) => mm / 1000,
        m_to_mm: (m) => m * 1000,
        in_to_mm: (inches) => inches * 25.4,
        mm_to_in: (mm) => mm / 25.4
    },

    // Velocidad
    velocity: {
        m_s_to_ft_s: (m_s) => m_s * 3.28084,
        ft_s_to_m_s: (ft_s) => ft_s / 3.28084,
        m_s_to_ft_min: (m_s) => m_s * 196.85,
        ft_min_to_m_s: (ft_min) => ft_min / 196.85
    },

    // Potencia
    power: {
        kW_to_HP: (kw) => kw * 1.34102,
        HP_to_kW: (hp) => hp / 1.34102,
        kW_to_BHP: (kw) => kw * 1.34102,
        BHP_to_kW: (bhp) => bhp / 1.34102
    },

    // Altura/cabeza
    head: {
        m_to_ft: (m) => m * 3.28084,
        ft_to_m: (ft) => ft / 3.28084,
        m_kPa_to_m: (m_kpa) => m_kpa / 9.80665,
        kPa_to_m: (kpa) => kPa_to_m(kpa / 9.80665)
    },

    // Densidad
    density: {
        kg_m3_to_lb_ft3: (kg_m3) => kg_m3 * 0.062428,
        lb_ft3_to_kg_m3: (lb_ft3) => lb_ft3 / 0.062428
    },

    // Viscosidad
    viscosity: {
        Pa_s_to_cP: (pa_s) => pa_s * 1000,
        cP_to_Pa_s: (cp) => cp / 1000
    }
};

// ===== FUNCIONES DE FORMATO =====

/**
 * Formatear valor con unidad
 */
function formatWithUnit(value, unit, decimals = 2) {
    return `${formatNumber(value, decimals)} ${unit}`;
}

/**
 * Formatear temperatura
 */
function formatTemperature(celsius, unit = 'C') {
    switch (unit) {
        case 'C':
            return formatNumber(celsius, 1) + ' °C';
        case 'F':
            return formatNumber(UNITS.temp.C_to_F(celsius), 1) + ' °F';
        case 'K':
            return formatNumber(UNITS.temp.C_to_K(celsius), 1) + ' K';
        default:
            return formatNumber(celsius, 1) + ' °C';
    }
}

/**
 * Formatear presión
 */
function formatPressure(kPa, unit = 'kPa') {
    switch (unit) {
        case 'kPa':
            return formatNumber(kPa, 2) + ' kPa';
        case 'bar':
            return formatNumber(UNITS.pressure.kPa_to_bar(kPa), 3) + ' bar';
        case 'psi':
            return formatNumber(UNITS.pressure.kPa_to_psi(kPa), 1) + ' psi';
        case 'mH2O':
            return formatNumber(UNITS.pressure.kPa_to_mH2O(kPa), 2) + ' m H₂O';
        default:
            return formatNumber(kPa, 2) + ' kPa';
    }
}

/**
 * Formatear flujo
 */
function formatFlow(L_s, unit = 'L/s') {
    switch (unit) {
        case 'L/s':
            return formatNumber(L_s, 2) + ' L/s';
        case 'm³/h':
            return formatNumber(UNITS.flow.L_s_to_m3_h(L_s), 1) + ' m³/h';
        case 'GPM':
            return formatNumber(UNITS.flow.L_s_to_gpm(L_s), 1) + ' GPM';
        default:
            return formatNumber(L_s, 2) + ' L/s';
    }
}

/**
 * Formatear potencia
 */
function formatPower(kW, unit = 'kW') {
    switch (unit) {
        case 'kW':
            return formatNumber(kW, 2) + ' kW';
        case 'HP':
            return formatNumber(UNITS.power.kW_to_HP(kW), 2) + ' HP';
        default:
            return formatNumber(kW, 2) + ' kW';
    }
}

/**
 * Formatear altura
 */
function formatHead(m, unit = 'm') {
    switch (unit) {
        case 'm':
            return formatNumber(m, 2) + ' m';
        case 'ft':
            return formatNumber(UNITS.length.m_to_ft(m), 1) + ' ft';
        default:
            return formatNumber(m, 2) + ' m';
    }
}

// ===== FUNCIONES DE VALIDACIÓN =====

/**
 * Validar si un valor está en rango
 */
function isInRange(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Validar si un valor es positivo
 */
function isPositive(value) {
    return value > 0;
}

/**
 * Validar si un valor es no negativo
 */
function isNonNegative(value) {
    return value >= 0;
}

/**
 * Validar número
 */
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Validar si es un array
 */
function isArray(value) {
    return Array.isArray(value);
}

/**
 * Validar si es un objeto
 */
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ===== FUNCIONES DE ALMACENAMIENTO LOCAL =====

/**
 * Guardar en localStorage
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error guardando en localStorage:', e);
        return false;
    }
}

/**
 * Cargar desde localStorage
 */
function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error cargando desde localStorage:', e);
        return defaultValue;
    }
}

/**
 * Eliminar de localStorage
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error eliminando de localStorage:', e);
        return false;
    }
}

// ===== FUNCIONES DE EXPORTACIÓN/IMPORTACIÓN =====

/**
 * Exportar datos a JSON
 */
function exportToJSON(data, filename = 'datos.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

/**
 * Importar datos desde JSON
 */
function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Error leyendo el archivo'));
        };

        reader.readAsText(file);
    });
}

// ===== FUNCIONES DE FECHA/HORA =====

/**
 * Formatear fecha y hora
 */
function formatDateTime(date = new Date()) {
    return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Formatear solo fecha
 */
function formatDate(date = new Date()) {
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// ===== UTILIDADES DE DOM =====

/**
 * Crear elemento con atributos
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);

    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'dataset') {
            Object.keys(attributes[key]).forEach(dataKey => {
                element.dataset[dataKey] = attributes[key][dataKey];
            });
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });

    if (content) {
        element.innerHTML = content;
    }

    return element;
}

/**
 * Query selector con verificación
 */
function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Query selector all
 */
function qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

/**
 * Event listener simple
 */
function on(element, event, handler) {
    element.addEventListener(event, handler);
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.PHYSICAL_CONSTANTS = PHYSICAL_CONSTANTS;
    window.flowUnit_to_L_s = flowUnit_to_L_s;
    window.L_s_to_flowUnit = L_s_to_flowUnit;
    window.linearInterpolation = linearInterpolation;
    window.bilinearInterpolation = bilinearInterpolation;
    window.solveBisection = solveBisection;
    window.solveNewton = solveNewton;
    window.factorial = factorial;
    window.nChooseK = nChooseK;
    window.roundTo = roundTo;
    window.formatNumber = formatNumber;
    window.clamp = clamp;
    window.formatTemperature = formatTemperature;
    window.formatPressure = formatPressure;
    window.formatFlow = formatFlow;
    window.formatPower = formatPower;
    window.formatHead = formatHead;
    window.isInRange = isInRange;
    window.isPositive = isPositive;
    window.isNonNegative = isNonNegative;
    window.isNumber = isNumber;
    window.isArray = isArray;
    window.isObject = isObject;
    window.saveToLocalStorage = saveToLocalStorage;
    window.loadFromLocalStorage = loadFromLocalStorage;
    window.removeFromLocalStorage = removeFromLocalStorage;
    window.exportToJSON = exportToJSON;
    window.importFromJSON = importFromJSON;
    window.formatDateTime = formatDateTime;
    window.formatDate = formatDate;
    window.createElement = createElement;
    window.qs = qs;
    window.qsa = qsa;
    window.on = on;
    window.UNITS = UNITS;
}
