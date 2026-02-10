/**
 * BASE DE DATOS DE PROPIEDADES FÍSICAS - P2603 SW-K60
 * Propiedades del agua, aire y otros fluidos a diferentes temperaturas
 */

// Propiedades del agua por temperatura
const WATER_PROPERTIES = {
    // Temperatura (°C) → Propiedades
    0: {
        temp_c: 0,
        density: 999.8,        // kg/m³
        viscosity: 0.001792,   // Pa·s (cP)
        vapor_pressure: 0.611, // kPa
        surface_tension: 75.6, // mN/m
        bulk_modulus: 2.04e9   // Pa
    },
    5: {
        temp_c: 5,
        density: 999.9,
        viscosity: 0.001519,
        vapor_pressure: 0.872,
        surface_tension: 74.9,
        bulk_modulus: 2.06e9
    },
    10: {
        temp_c: 10,
        density: 999.7,
        viscosity: 0.001308,
        vapor_pressure: 1.228,
        surface_tension: 74.2,
        bulk_modulus: 2.11e9
    },
    15: {
        temp_c: 15,
        density: 999.1,
        viscosity: 0.001139,
        vapor_pressure: 1.705,
        surface_tension: 73.5,
        bulk_modulus: 2.14e9
    },
    20: {
        temp_c: 20,
        density: 998.2,
        viscosity: 0.001002,
        vapor_pressure: 2.338,
        surface_tension: 72.8,
        bulk_modulus: 2.18e9
    },
    25: {
        temp_c: 25,
        density: 997.0,
        viscosity: 0.000890,
        vapor_pressure: 3.169,
        surface_tension: 72.0,
        bulk_modulus: 2.22e9
    },
    30: {
        temp_c: 30,
        density: 995.7,
        viscosity: 0.000798,
        vapor_pressure: 4.245,
        surface_tension: 71.2,
        bulk_modulus: 2.25e9
    },
    35: {
        temp_c: 35,
        density: 994.1,
        viscosity: 0.000720,
        vapor_pressure: 5.627,
        surface_tension: 70.4,
        bulk_modulus: 2.26e9
    },
    40: {
        temp_c: 40,
        density: 992.2,
        viscosity: 0.000653,
        vapor_pressure: 7.381,
        surface_tension: 69.6,
        bulk_modulus: 2.28e9
    },
    45: {
        temp_c: 45,
        density: 990.2,
        viscosity: 0.000596,
        vapor_pressure: 9.593,
        surface_tension: 68.7,
        bulk_modulus: 2.29e9
    },
    50: {
        temp_c: 50,
        density: 988.1,
        viscosity: 0.000547,
        vapor_pressure: 12.344,
        surface_tension: 67.9,
        bulk_modulus: 2.29e9
    },
    55: {
        temp_c: 55,
        density: 985.7,
        viscosity: 0.000504,
        vapor_pressure: 15.763,
        surface_tension: 67.0,
        bulk_modulus: 2.30e9
    },
    60: {
        temp_c: 60,
        density: 983.2,
        viscosity: 0.000467,
        vapor_pressure: 19.944,
        surface_tension: 66.2,
        bulk_modulus: 2.28e9
    },
    65: {
        temp_c: 65,
        density: 980.6,
        viscosity: 0.000434,
        vapor_pressure: 25.022,
        surface_tension: 65.4,
        bulk_modulus: 2.26e9
    },
    70: {
        temp_c: 70,
        density: 977.8,
        viscosity: 0.000404,
        vapor_pressure: 31.176,
        surface_tension: 64.4,
        bulk_modulus: 2.25e9
    },
    75: {
        temp_c: 75,
        density: 974.9,
        viscosity: 0.000378,
        vapor_pressure: 38.595,
        surface_tension: 63.5,
        bulk_modulus: 2.22e9
    },
    80: {
        temp_c: 80,
        density: 971.8,
        viscosity: 0.000355,
        vapor_pressure: 47.373,
        surface_tension: 62.6,
        bulk_modulus: 2.20e9
    },
    85: {
        temp_c: 85,
        density: 968.6,
        viscosity: 0.000334,
        vapor_pressure: 57.815,
        surface_tension: 61.7,
        bulk_modulus: 2.17e9
    },
    90: {
        temp_c: 90,
        density: 965.3,
        viscosity: 0.000315,
        vapor_pressure: 70.117,
        surface_tension: 60.8,
        bulk_modulus: 2.14e9
    },
    95: {
        temp_c: 95,
        density: 961.9,
        viscosity: 0.000298,
        vapor_pressure: 84.529,
        surface_tension: 59.9,
        bulk_modulus: 2.10e9
    },
    100: {
        temp_c: 100,
        density: 958.4,
        viscosity: 0.000282,
        vapor_pressure: 101.325,
        surface_tension: 58.9,
        bulk_modulus: 2.06e9
    }
};

// Solubilidad del aire en agua (mg/L a 1 atm)
const AIR_SOLUBILITY = {
    0: 37.9,
    5: 34.0,
    10: 30.5,
    15: 27.5,
    20: 24.8,
    25: 22.4,
    30: 20.3,
    35: 18.4,
    40: 16.7,
    45: 15.2,
    50: 13.8,
    55: 12.6,
    60: 11.5,
    65: 10.5,
    70: 9.6,
    75: 8.8,
    80: 8.1,
    85: 7.4,
    90: 6.8,
    95: 6.3,
    100: 5.8
};

// Constantes físicas
const PHYSICAL_CONSTANTS = {
    // Gravedad estándar
    g: 9.80665,              // m/s²

    // Presión atmosférica estándar
    P_atm: 101.325,          // kPa

    // Constante universal de los gases
    R: 8.31446,              // J/(mol·K)

    // Conversión de temperatura
    K_from_C: (temp_c) => temp_c + 273.15,
    C_from_K: (temp_k) => temp_k - 273.15,
    F_from_C: (temp_c) => temp_c * 9/5 + 32,
    C_from_F: (temp_f) => (temp_f - 32) * 5/9,

    // Conversiones de presión
    kPa_to_Pa: (kpa) => kpa * 1000,
    Pa_to_kPa: (pa) => pa / 1000,
    bar_to_kPa: (bar) => bar * 100,
    kPa_to_bar: (kpa) => kpa / 100,
    psi_to_kPa: (psi) => psi * 6.89476,
    kPa_to_psi: (kpa) => kpa / 6.89476,
    mmHg_to_kPa: (mmhg) => mmhg * 0.133322,
    kPa_to_mmHg: (kpa) => kpa / 0.133322,

    // Conversiones de flujo
    L_s_to_gpm: (l_s) => l_s * 15.8503,
    gpm_to_L_s: (gpm) => gpm / 15.8503,
    L_s_to_m3_h: (l_s) => l_s * 3.6,
    m3_h_to_L_s: (m3_h) => m3_h / 3.6,
    m3_h_to_gpm: (m3_h) => m3_h * 4.40287,
    gpm_to_m3_h: (gpm) => gpm / 4.40287,
    // Conversion desde L/s a cualquier unidad
    L_s_to_flowUnit: (l_s, unit) => {
        switch(unit) {
            case 'm3_h': return l_s * 3.6;
            case 'gpm': return l_s * 15.8503;
            case 'L_s': return l_s;
            default: return l_s;
        }
    },
    // Conversión desde cualquier unidad a L/s
    flowUnit_to_L_s: (value, unit) => {
        switch(unit) {
            case 'm3_h': return value / 3.6;
            case 'gpm': return value / 15.8503;
            case 'L_s': return value;
            default: return value;
        }
    },

    // Conversiones de longitud
    m_to_ft: (m) => m * 3.28084,
    ft_to_m: (ft) => ft / 3.28084,
    mm_to_in: (mm) => mm / 25.4,
    in_to_mm: (inches) => inches * 25.4,

    // Conversiones de potencia
    kW_to_HP: (kw) => kw * 1.34102,
    HP_to_kW: (hp) => hp / 1.34102,

    // Conversiones de energía/tensión
    N_m_to_ft_lbf: (nm) => nm * 0.737562,
    ft_lbf_to_N_m: (ftlbf) => ftlbf / 0.737562
};

// Función para obtener propiedades del agua a una temperatura dada
function getWaterProperties(temp_c) {
    // Si la temperatura exacta existe, retornar directamente
    if (WATER_PROPERTIES[temp_c]) {
        return WATER_PROPERTIES[temp_c];
    }

    // Si no existe, interpolar
    const temps = Object.keys(WATER_PROPERTIES).map(Number).sort((a, b) => a - b);

    // Encontrar temperaturas circundantes
    let temp_lower = temps[0];
    let temp_upper = temps[temps.length - 1];

    for (let i = 0; i < temps.length - 1; i++) {
        if (temp_c >= temps[i] && temp_c <= temps[i + 1]) {
            temp_lower = temps[i];
            temp_upper = temps[i + 1];
            break;
        }
    }

    // Interpolación lineal
    const prop_lower = WATER_PROPERTIES[temp_lower];
    const prop_upper = WATER_PROPERTIES[temp_upper];

    const fraction = (temp_c - temp_lower) / (temp_upper - temp_lower);

    return {
        temp_c: temp_c,
        density: prop_lower.density + fraction * (prop_upper.density - prop_lower.density),
        viscosity: prop_lower.viscosity + fraction * (prop_upper.viscosity - prop_lower.viscosity),
        vapor_pressure: prop_lower.vapor_pressure + fraction * (prop_upper.vapor_pressure - prop_lower.vapor_pressure),
        surface_tension: prop_lower.surface_tension + fraction * (prop_upper.surface_tension - prop_lower.surface_tension),
        bulk_modulus: prop_lower.bulk_modulus + fraction * (prop_upper.bulk_modulus - prop_lower.bulk_modulus)
    };
}

// Función para calcular presión de vapor del agua (ecuación de Antoine)
function calculateVaporPressure(temp_c) {
    // Ecuación de Antoine para agua:
    // log10(P) = A - B/(C+T)
    // P en mmHg, T en °C
    // Para agua: A=8.07131, B=1730.63, C=233.426 (1-100°C)

    const A = 8.07131;
    const B = 1730.63;
    const C = 233.426;

    const log10_P_mmHg = A - B / (C + temp_c);
    const P_mmHg = Math.pow(10, log10_P_mmHg);

    // Convertir a kPa
    return PHYSICAL_CONSTANTS.mmHg_to_kPa(P_mmHg);
}

// Función para obtener viscosidad del agua a una temperatura dada
function getWaterViscosity(temp_c) {
    const props = getWaterProperties(temp_c);
    return props.viscosity;
}

// Función para obtener densidad del agua a una temperatura dada
function getWaterDensity(temp_c) {
    const props = getWaterProperties(temp_c);
    return props.density;
}

// Función para obtener presión de vapor a una temperatura dada
function getWaterVaporPressure(temp_c) {
    const props = getWaterProperties(temp_c);
    return props.vapor_pressure;
}

// Función para obtener solubilidad del aire a una temperatura dada
function getAirSolubility(temp_c) {
    // Si la temperatura exacta existe, retornar directamente
    if (AIR_SOLUBILITY[temp_c] !== undefined) {
        return AIR_SOLUBILITY[temp_c];
    }

    // Interpolar
    const temps = Object.keys(AIR_SOLUBILITY).map(Number).sort((a, b) => a - b);

    let temp_lower = temps[0];
    let temp_upper = temps[temps.length - 1];

    for (let i = 0; i < temps.length - 1; i++) {
        if (temp_c >= temps[i] && temp_c <= temps[i + 1]) {
            temp_lower = temps[i];
            temp_upper = temps[i + 1];
            break;
        }
    }

    const sol_lower = AIR_SOLUBILITY[temp_lower];
    const sol_upper = AIR_SOLUBILITY[temp_upper];

    const fraction = (temp_c - temp_lower) / (temp_upper - temp_lower);

    return sol_lower + fraction * (sol_upper - sol_lower);
}

// Función para calcular peso específico (γ = ρ × g)
function calculateSpecificWeight(density, g = PHYSICAL_CONSTANTS.g) {
    return density * g; // N/m³
}

// Función para calcular número de Reynolds
function calculateReynolds(density, velocity, diameter, viscosity) {
    // Re = (ρ × V × D) / μ
    return (density * velocity * diameter) / viscosity;
}

// Función para calcular velocidad desde flujo y área
function calculateVelocity(flow_rate_L_s, diameter_mm) {
    const flow_m3_s = flow_rate_L_s / 1000;
    const diameter_m = diameter_mm / 1000;
    const area_m2 = Math.PI * Math.pow(diameter_m / 2, 2);

    return flow_m3_s / area_m2; // m/s
}

// Función para calcular flujo desde velocidad y área
function calculateFlowRate(velocity_m_s, diameter_mm) {
    const diameter_m = diameter_mm / 1000;
    const area_m2 = Math.PI * Math.pow(diameter_m / 2, 2);

    return velocity_m_s * area_m2 * 1000; // L/s
}

// Función para calcular área de tubería
function calculatePipeArea(diameter_mm) {
    const diameter_m = diameter_mm / 1000;
    return Math.PI * Math.pow(diameter_m / 2, 2); // m²
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.getWaterProperties = getWaterProperties;
    window.calculateVaporPressure = calculateVaporPressure;
    window.getWaterViscosity = getWaterViscosity;
    window.getWaterDensity = getWaterDensity;
    window.getWaterVaporPressure = getWaterVaporPressure;
    window.getAirSolubility = getAirSolubility;
    window.calculateSpecificWeight = calculateSpecificWeight;
    window.calculateReynolds = calculateReynolds;
    window.calculateVelocity = calculateVelocity;
    window.calculateFlowRate = calculateFlowRate;
    window.calculatePipeArea = calculatePipeArea;
    window.WATER_PROPERTIES = WATER_PROPERTIES;
    window.AIR_SOLUBILITY = AIR_SOLUBILITY;
    window.PHYSICAL_CONSTANTS = PHYSICAL_CONSTANTS;
    // Funciones de conversión de flujo
    window.L_s_to_flowUnit = PHYSICAL_CONSTANTS.L_s_to_flowUnit;
    window.flowUnit_to_L_s = PHYSICAL_CONSTANTS.flowUnit_to_L_s;
    window.L_s_to_m3_h = PHYSICAL_CONSTANTS.L_s_to_m3_h;
    window.m3_h_to_L_s = PHYSICAL_CONSTANTS.m3_h_to_L_s;
    window.L_s_to_gpm = PHYSICAL_CONSTANTS.L_s_to_gpm;
    window.gpm_to_L_s = PHYSICAL_CONSTANTS.gpm_to_L_s;
    window.m3_h_to_gpm = PHYSICAL_CONSTANTS.m3_h_to_gpm;
    window.gpm_to_m3_h = PHYSICAL_CONSTANTS.gpm_to_m3_h;
}
