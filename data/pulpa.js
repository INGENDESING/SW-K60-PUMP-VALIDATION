/**
 * BASE DE DATOS DE PULPA - P2603 SW-K60
 * Características de diferentes tipos de pulpa de papel
 * Basado en TAPPI TIP 0410-14 y Duffy-Möller correlations
 */

const PULP_DATABASE = {
    // KRAFT BLANQUEADA DE PINO
    kraft_bleached_pine: {
        name: "Kraft Blanqueada de Pino",
        category: "Kraft",
        origin: "Pino (Softwood)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.05,
        alpha: -0.18,
        beta: 1.20,
        gamma: 0.10,
        // Velocidad de arrastre: Vw = a * C^b * D^c
        Vw_a: 1.35,
        Vw_b: 1.15,
        Vw_c: 0.40,
        // Rangos típicos
        consistency_min: 1.5,
        consistency_max: 5.0,
        consistency_typical: 3.0,
        freeness_min: 500,
        freeness_max: 700,
        sr_min: 25,
        sr_max: 40,
        // Propiedades físicas
        fiber_length_mm: 2.5,
        fiber_length_coarseness: 0.15,
        bulk_cm3_g: 2.5,
        // Aplicaciones
        applications: ["Tissue", "Papel fino", "Papel imprenta"]
    },

    // KRAFT BLANQUEADA DE EUCALIPTO
    kraft_bleached_eucalyptus: {
        name: "Kraft Blanqueada de Eucalipto",
        category: "Kraft",
        origin: "Eucalipto (Hardwood)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 0.95,
        alpha: -0.20,
        beta: 1.15,
        gamma: 0.08,
        // Velocidad de arrastre
        Vw_a: 1.30,
        Vw_b: 1.10,
        Vw_c: 0.35,
        // Rangos típicos
        consistency_min: 1.5,
        consistency_max: 5.0,
        consistency_typical: 3.0,
        freeness_min: 400,
        freeness_max: 600,
        sr_min: 30,
        sr_max: 45,
        // Propiedades físicas
        fiber_length_mm: 0.9,
        fiber_length_coarseness: 0.09,
        bulk_cm3_g: 1.8,
        // Aplicaciones
        applications: ["Papel imprenta", "Papel de escritura", "Cartulina"]
    },

    // KRAFT NO BLANQUEADA DE PINO
    kraft_unbleached_pine: {
        name: "Kraft No Blanqueada de Pino",
        category: "Kraft",
        origin: "Pino (Softwood)",
        color: "Marrón",
        // Coeficientes Duffy-Möller
        K: 1.15,
        alpha: -0.15,
        beta: 1.25,
        gamma: 0.12,
        // Velocidad de arrastre
        Vw_a: 1.58,
        Vw_b: 1.20,
        Vw_c: 0.45,
        // Rangos típicos
        consistency_min: 2.0,
        consistency_max: 6.0,
        consistency_typical: 3.5,
        freeness_min: 600,
        freeness_max: 750,
        sr_min: 15,
        sr_max: 30,
        // Propiedades físicas
        fiber_length_mm: 3.0,
        fiber_length_coarseness: 0.20,
        bulk_cm3_g: 2.8,
        // Aplicaciones
        applications: ["Liner", "Sacos", "Cartón kraft"]
    },

    // TMP (Termomecánica) - Mixto
    tmp_mixed: {
        name: "TMP Mixto",
        category: "Mecánica",
        origin: "Mixto (HW/SW)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.25,
        alpha: -0.12,
        beta: 1.30,
        gamma: 0.15,
        // Velocidad de arrastre
        Vw_a: 1.65,
        Vw_b: 1.22,
        Vw_c: 0.48,
        // Rangos típicos
        consistency_min: 2.5,
        consistency_max: 5.5,
        consistency_typical: 4.0,
        freeness_min: 100,
        freeness_max: 200,
        sr_min: 60,
        sr_max: 90,
        // Propiedades físicas
        fiber_length_mm: 1.8,
        fiber_length_coarseness: 0.25,
        bulk_cm3_g: 3.2,
        // Aplicaciones
        applications: ["Periódico", "Revistas", "Catálogos"]
    },

    // TMP de Pino
    tmp_pine: {
        name: "TMP Pino",
        category: "Mecánica",
        origin: "Pino (Softwood)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.30,
        alpha: -0.10,
        beta: 1.32,
        gamma: 0.16,
        // Velocidad de arrastre
        Vw_a: 1.70,
        Vw_b: 1.25,
        Vw_c: 0.50,
        // Rangos típicos
        consistency_min: 2.5,
        consistency_max: 5.5,
        consistency_typical: 4.0,
        freeness_min: 100,
        freeness_max: 200,
        sr_min: 65,
        sr_max: 95,
        // Propiedades físicas
        fiber_length_mm: 2.2,
        fiber_length_coarseness: 0.28,
        bulk_cm3_g: 3.5,
        // Aplicaciones
        applications: ["Periódico", "Directorio"]
    },

    // OCC (Old Corrugated Containers) - Reciclada
    occ_recycled: {
        name: "OCC/Reciclada",
        category: "Reciclada",
        origin: "Reciclado (Mixto)",
        color: "Marrón",
        // Coeficientes Duffy-Möller
        K: 1.35,
        alpha: -0.10,
        beta: 1.35,
        gamma: 0.18,
        // Velocidad de arrastre
        Vw_a: 1.42,
        Vw_b: 1.18,
        Vw_c: 0.42,
        // Rangos típicos
        consistency_min: 3.0,
        consistency_max: 6.5,
        consistency_typical: 4.5,
        freeness_min: 300,
        freeness_max: 500,
        sr_min: 40,
        sr_max: 60,
        // Propiedades físicas
        fiber_length_mm: 1.5,
        fiber_length_coarseness: 0.18,
        bulk_cm3_g: 2.2,
        // Aplicaciones
        applications: ["Cartón corrugado", "Cajas", "Embalajes"]
    },

    // ONP (Old Newspapers) - Reciclada
    onp_recycled: {
        name: "ONP/Periódico Reciclado",
        category: "Reciclada",
        origin: "Reciclado (Periódico)",
        color: "Grisácea",
        // Coeficientes Duffy-Möller
        K: 1.30,
        alpha: -0.11,
        beta: 1.32,
        gamma: 0.16,
        // Velocidad de arrastre
        Vw_a: 1.45,
        Vw_b: 1.20,
        Vw_c: 0.44,
        // Rangos típicos
        consistency_min: 2.5,
        consistency_max: 5.5,
        consistency_typical: 4.0,
        freeness_min: 200,
        freeness_max: 400,
        sr_min: 50,
        sr_max: 70,
        // Propiedades físicas
        fiber_length_mm: 1.3,
        fiber_length_coarseness: 0.22,
        bulk_cm3_g: 2.8,
        // Aplicaciones
        applications: ["Cartón reciclado", "Cajas economy", "Papel periódico reciclado"]
    },

    // BSP (Bisulfito) - Mixto
    bisulfite_mixed: {
        name: "Pulpa Bisulfito",
        category: "Química",
        origin: "Mixto (HW/SW)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.10,
        alpha: -0.16,
        beta: 1.22,
        gamma: 0.11,
        // Velocidad de arrastre
        Vw_a: 1.32,
        Vw_b: 1.12,
        Vw_c: 0.38,
        // Rangos típicos
        consistency_min: 2.0,
        consistency_max: 5.0,
        consistency_typical: 3.0,
        freeness_min: 500,
        freeness_max: 650,
        sr_min: 20,
        sr_max: 35,
        // Propiedades físicas
        fiber_length_mm: 1.8,
        fiber_length_coarseness: 0.12,
        bulk_cm3_g: 2.2,
        // Aplicaciones
        applications: ["Papel fino", "Tissue", "Papel absorberente"]
    },

    // NSSC (Semiquímica) - Mixto
    nssc_mixed: {
        name: "NSSC Semiquímica",
        category: "Semiquímica",
        origin: "Mixto (HW/SW)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.18,
        alpha: -0.13,
        beta: 1.26,
        gamma: 0.14,
        // Velocidad de arrastre
        Vw_a: 1.40,
        Vw_b: 1.18,
        Vw_c: 0.41,
        // Rangos típicos
        consistency_min: 2.5,
        consistency_max: 5.0,
        consistency_typical: 3.5,
        freeness_min: 400,
        freeness_max: 600,
        sr_min: 30,
        sr_max: 50,
        // Propiedades físicas
        fiber_length_mm: 1.6,
        fiber_length_coarseness: 0.16,
        bulk_cm3_g: 2.6,
        // Aplicaciones
        applications: ["Cartón linerboard", "Cartón medium", "Papel cartulina"]
    },

    // CTMP (Quimiotermomecánica)
    ctmp_mixed: {
        name: "CTMP Mixto",
        category: "Quimiotermomecánica",
        origin: "Mixto (HW/SW)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.22,
        alpha: -0.14,
        beta: 1.28,
        gamma: 0.13,
        // Velocidad de arrastre
        Vw_a: 1.50,
        Vw_b: 1.20,
        Vw_c: 0.45,
        // Rangos típicos
        consistency_min: 2.5,
        consistency_max: 5.5,
        consistency_typical: 4.0,
        freeness_min: 250,
        freeness_max: 450,
        sr_min: 45,
        sr_max: 65,
        // Propiedades físicas
        fiber_length_mm: 1.9,
        fiber_length_coarseness: 0.22,
        bulk_cm3_g: 3.0,
        // Aplicaciones
        applications: ["Cartón折叠", "Papel revistado", "Catálogos"]
    },

    // Fluff Pulp
    fluff_pulp: {
        name: "Fluff Pulp",
        category: "Kraft",
        origin: "Pino (Softwood)",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 1.40,
        alpha: -0.08,
        beta: 1.38,
        gamma: 0.20,
        // Velocidad de arrastre
        Vw_a: 1.55,
        Vw_b: 1.25,
        Vw_c: 0.48,
        // Rangos típicos
        consistency_min: 3.0,
        consistency_max: 6.0,
        consistency_typical: 4.5,
        freeness_min: 500,
        freeness_max: 700,
        sr_min: 15,
        sr_max: 25,
        // Propiedades físicas
        fiber_length_mm: 2.8,
        fiber_length_coarseness: 0.22,
        bulk_cm3_g: 4.5,
        // Aplicaciones
        applications: ["Pañales", "Productos higiénicos", "Absorbentes"]
    },

    // Dissolving Pulp
    dissolving_pulp: {
        name: "Pulpa Disolvente",
        category: "Kraft",
        origin: "Eucalipto/Pino",
        color: "Blanca",
        // Coeficientes Duffy-Möller
        K: 0.90,
        alpha: -0.22,
        beta: 1.10,
        gamma: 0.06,
        // Velocidad de arrastre
        Vw_a: 1.25,
        Vw_b: 1.08,
        Vw_c: 0.32,
        // Rangos típicos
        consistency_min: 2.0,
        consistency_max: 5.0,
        consistency_typical: 3.0,
        freeness_min: 450,
        freeness_max: 600,
        sr_min: 18,
        sr_max: 28,
        // Propiedades físicas
        fiber_length_mm: 2.0,
        fiber_length_coarseness: 0.10,
        bulk_cm3_g: 1.5,
        // Aplicaciones
        applications: ["Rayón", "Acetato", "Celulosa regenerada"]
    }
};

// Función para obtener datos de pulpa
function getPulpData(pulpType) {
    return PULP_DATABASE[pulpType] || null;
}

// Función para obtener todas las pulpas
function getAllPulpTypes() {
    return Object.keys(PULP_DATABASE).map(key => ({
        key: key,
        ...PULP_DATABASE[key]
    }));
}

// Función para obtener pulpas por categoría
function getPulpByCategory(category) {
    return Object.keys(PULP_DATABASE)
        .filter(key => PULP_DATABASE[key].category === category)
        .map(key => ({
            key: key,
            ...PULP_DATABASE[key]
        }));
}

// Función para calcular densidad de pulpa
function calculatePulpDensity(consistency_percent) {
    // Densidad del agua a 20°C = 998.2 kg/m³
    const rho_water = 998.2;
    const C = consistency_percent / 100; // Convertir a fracción

    // Ecuación: ρpulp = ρwater * (1 + 0.006 * C)
    // CORREGIDO: Se eliminó el factor 100 duplicado
    return rho_water * (1 + 0.006 * consistency_percent);
}

// Función para calcular viscosidad aparente de pulpa (Región 1)
function calculatePulpViscosity(pulpType, consistency_percent, temperature_c = 20) {
    const pulp = getPulpData(pulpType);
    if (!pulp) return 0.001; // Retornar viscosidad del agua

    // Viscosidad del agua a temperatura dada
    const mu_water = getWaterViscosity(temperature_c);

    const C = consistency_percent / 100;

    // Ecuación para régimen de red de fibra:
    // μap = μwater * (1 + 2.5*C + 10.05*C² + 0.00273*e^(20*C))
    return mu_water * (1 + 2.5 * C + 10.05 * C * C + 0.00273 * Math.exp(20 * C));
}

// Función para calcular velocidad de arrastre (Vw) - Duffy & Möller
function calculateDragVelocity(pulpType, consistency_percent, diameter_m) {
    const pulp = getPulpData(pulpType);
    if (!pulp) return 0;

    const C = consistency_percent / 100;

    // Vw = a * C^b * D^c
    return pulp.Vw_a * Math.pow(C, pulp.Vw_b) * Math.pow(diameter_m, pulp.Vw_c);
}

// Función para calcular velocidad de transición (V1)
function calculateTransitionVelocity(pulpType, consistency_percent, diameter_m) {
    const Vw = calculateDragVelocity(pulpType, consistency_percent, diameter_m);

    // V1 típicamente es 0.3 - 0.35 de Vw
    const pulp = getPulpData(pulpType);
    const ratio = pulp && pulp.category === "Reciclada" ? 0.25 :
                  pulp && pulp.category === "Kraft" ? 0.35 : 0.30;

    return Vw * ratio;
}

// Función para calcular velocidad al punto de mínimo (Vg)
function calculateMinimumVelocity(pulpType, consistency_percent, diameter_m) {
    const Vw = calculateDragVelocity(pulpType, consistency_percent, diameter_m);

    // Vg típicamente es 0.55 - 0.65 de Vw
    const pulp = getPulpData(pulpType);
    const ratio = pulp && pulp.category === "Reciclada" ? 0.55 :
                  pulp && pulp.category === "Kraft" ? 0.65 : 0.60;

    return Vw * ratio;
}

// Función para determinar región de flujo
function determineFlowRegion(pulpType, velocity, consistency_percent, diameter_m) {
    const V1 = calculateTransitionVelocity(pulpType, consistency_percent, diameter_m);
    const Vg = calculateMinimumVelocity(pulpType, consistency_percent, diameter_m);
    const Vw = calculateDragVelocity(pulpType, consistency_percent, diameter_m);

    if (velocity < V1) {
        return {
            region: 1,
            name: "Región 1: Red de Fibra",
            description: "Flujo laminar con red fibrosa interconectada. Alta resistencia.",
            V1, Vg, Vw,
            regime: "network_flow"
        };
    } else if (velocity < Vg) {
        return {
            region: 2,
            subregion: "2a",
            name: "Región 2a: Transición Inicial",
            description: "Red desorganizándose. Pérdidas decreciendo.",
            V1, Vg, Vw,
            regime: "transition_early"
        };
    } else if (velocity < Vw) {
        return {
            region: 2,
            subregion: "2b",
            name: "Región 2b: Punto de Mínimo",
            description: "Mínimo en curva de pérdidas. Operación óptima económica.",
            V1, Vg, Vw,
            regime: "transition_optimal"
        };
    } else {
        return {
            region: 3,
            name: "Región 3: Turbulento/Arrastre",
            description: "Fibras suspendidas individualmente. Comportamiento similar al agua.",
            V1, Vg, Vw,
            regime: "turbulent_drag"
        };
    }
}

// Función para calcular factor de corrección Kmod
function calculateKmod(pulpType, region, consistency_percent, sr_degrees = 30, velocity_ratio = null) {
    const pulp = getPulpData(pulpType);
    if (!pulp) return 1.0;

    const C = consistency_percent;

    let Kmod = 1.0;

    // Modelo basado en V/Vw (relación velocidad actual / velocidad de arrastre)
    if (velocity_ratio !== null) {
        // Modelo Duffy-Möller con corrección por velocidad
        if (region === 1) {
            // Región de red: V/Vw < 0.3
            Kmod = 2.5 + (C / 10) + (0.3 - velocity_ratio) * 2;
        } else if (region === 2) {
            // Región de transición: 0.3 ≤ V/Vw < 1.0
            const flowInfo = determineFlowRegion(pulpType, velocity_ratio * 100, consistency_percent, 0.1); // Approximation
            if (flowInfo.subregion === "2a") {
                // Transición inicial
                Kmod = 1.8 - (velocity_ratio - 0.3) * 2;
            } else {
                // Cerca del mínimo (2b)
                Kmod = 0.7 + (velocity_ratio - 0.6) * 0.5;
            }
        } else {
            // Región turbulenta: V/Vw ≥ 1.0
            Kmod = 1.0 + (velocity_ratio - 1.0) * 0.1;
        }
    } else {
        // Fallback al modelo simplificado
        switch (region) {
            case 1:
                Kmod = 2.0 + (C / 10);
                break;
            case 2:
                Kmod = 0.8 + (C / 20);
                break;
            case 3:
                Kmod = 1.0;
                break;
        }
    }

    // Ajuste por grado de refinación (°SR)
    const Fref = 1 + (0.006 * sr_degrees);
    Kmod *= Fref;

    // Ajuste por tipo de pulpa (coeficiente K de Duffy-Möller)
    Kmod *= pulp.K;

    return Math.max(0.5, Math.min(5.0, Kmod)); // Limitar entre 0.5 y 5.0
}

// Función auxiliar para obtener viscosidad del agua
function getWaterViscosity(temperature_c) {
    // Ecuación aproximada para viscosidad del agua en Pa·s
    // μ = μ20 * exp[-0.024*(T-20)]
    const mu20 = 0.001002; // Viscosidad del agua a 20°C en Pa·s
    return mu20 * Math.exp(-0.024 * (temperature_c - 20));
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.getPulpData = getPulpData;
    window.getAllPulpTypes = getAllPulpTypes;
    window.getPulpByCategory = getPulpByCategory;
    window.calculatePulpDensity = calculatePulpDensity;
    window.calculatePulpViscosity = calculatePulpViscosity;
    window.calculateDragVelocity = calculateDragVelocity;
    window.calculateTransitionVelocity = calculateTransitionVelocity;
    window.calculateMinimumVelocity = calculateMinimumVelocity;
    window.determineFlowRegion = determineFlowRegion;
    window.calculateKmod = calculateKmod;
    window.PULP_DATABASE = PULP_DATABASE;
}
