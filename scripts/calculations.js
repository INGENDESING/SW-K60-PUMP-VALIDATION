/**
 * MOTOR DE CÁLCULOS HIDRÁULICOS - P2603 SW-K60
 * Basado en TAPPI TIP 0410-14 y metodología Duffy-Möller
 */

// ===== FACTOR DE FRICCIÓN =====

/**
 * Calcular factor de fricción usando ecuación de Colebrook-White
 * @param {number} Re - Número de Reynolds
 * @param {number} epsilon_mm - Rugosidad absoluta (mm)
 * @param {number} D_mm - Diámetro interno (mm)
 * @returns {number} Factor de fricción f
 */
function calculateFrictionFactor(Re, epsilon_mm, D_mm) {
    if (Re < 2000) {
        // Régimen laminar: f = 64/Re
        return 64 / Re;
    }

    // Convertir rugosidad a metros
    const epsilon_m = epsilon_mm / 1000;
    const D_m = D_mm / 1000;
    const epsilon_D = epsilon_m / D_m;

    // Para turbulento, resolver ecuación de Colebrook-White iterativamente
    // 1/sqrt(f) = -2*log10((epsilon_D/3.7) + (2.51/(Re*sqrt(f))))

    // Estimación inicial usando Swamee-Jain (más rápido)
    let f;
    if (Re > 4000) {
        f = 0.25 / Math.pow(Math.log10(epsilon_D / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2);
    } else {
        // Transición: usar interpolación
        const f_laminar = 64 / 2000;
        const f_turbulent = 0.25 / Math.pow(Math.log10(epsilon_D / 3.7 + 5.74 / Math.pow(4000, 0.9)), 2);
        f = f_laminar + (f_turbulent - f_laminar) * (Re - 2000) / 2000;
    }

    // Refinar con iteración de Newton-Raphson (máximo 5 iteraciones)
    for (let i = 0; i < 5; i++) {
        const sqrt_f = Math.sqrt(f);
        const term = epsilon_D / 3.7 + 2.51 / (Re * sqrt_f);
        const f_new = 1 / (4 * Math.pow(Math.log10(term), 2));

        if (Math.abs(f_new - f) < 1e-6) {
            return f_new;
        }

        f = f_new;
    }

    return f;
}

/**
 * Calcular factor de fricción para pulpa
 * @param {number} f_water - Factor de fricción del agua
 * @param {number} Kmod - Coeficiente modificador
 * @returns {number} Factor de fricción de pulpa
 */
function calculatePulpFrictionFactor(f_water, Kmod) {
    return f_water * Kmod;
}

// ===== NÚMERO DE REYNOLDS =====

/**
 * Calcular número de Reynolds para agua
 * @param {number} velocity - Velocidad (m/s)
 * @param {number} D_mm - Diámetro interno (mm)
 * @param {number} viscosity - Viscosidad (Pa·s)
 * @param {number} density - Densidad (kg/m³)
 * @returns {number} Número de Reynolds
 */
function calculateReynolds(velocity, D_mm, viscosity, density) {
    const D_m = D_mm / 1000;
    return (density * velocity * D_m) / viscosity;
}

/**
 * Calcular número de Reynolds modificado para pulpa (TAPPI TIP 0410-14)
 * El Reynolds modificado considera el comportamiento no newtoniano de la pulpa
 * @param {number} velocity - Velocidad (m/s)
 * @param {number} D_mm - Diámetro interno (mm)
 * @param {number} mu_water - Viscosidad del agua (Pa·s)
 * @param {number} consistency_percent - Consistencia de pulpa (%)
 * @returns {number} Reynolds modificado
 */
function calculateModifiedReynolds(velocity, D_mm, mu_water, consistency_percent) {
    const D_m = D_mm / 1000;
    const C = consistency_percent / 100;

    // Factor de corrección de viscosidad para régimen de red de fibra
    // Según TAPPI TIP 0410-14
    const viscosity_factor = 1 + 2.5 * C + 10.05 * C * C;

    // Reynolds estándar con agua
    const Re_standard = (998.2 * velocity * D_m) / mu_water;

    // Reynolds modificado para pulpa
    const Re_modified = Re_standard / viscosity_factor;

    return Re_modified;
}

/**
 * Calcular viscosidad aparente de pulpa
 * @param {number} consistency - Consistencia (%)
 * @param {number} mu_water - Viscosidad del agua (Pa·s)
 * @returns {number} Viscosidad aparente (Pa·s)
 */
function calculateApparentViscosity(consistency, mu_water) {
    const C = consistency / 100;
    return mu_water * (1 + 2.5 * C + 10.05 * C * C + 0.00273 * Math.exp(20 * C));
}

/**
 * Calcular velocidad en tubería circular
 * @param {number} flow_L_s - Flujo volumétrico (L/s)
 * @param {number} D_mm - Diámetro interno (mm)
 * @returns {number} Velocidad (m/s)
 */
function calculateVelocity(flow_L_s, D_mm) {
    // Validación defensiva
    if (D_mm <= 0) {
        throw new Error('Diámetro debe ser mayor que cero');
    }
    if (flow_L_s < 0) {
        throw new Error('Flujo no puede ser negativo');
    }

    const D_m = D_mm / 1000;
    const A = Math.PI * D_m * D_m / 4; // Área en m²
    const velocity = (flow_L_s / 1000) / A; // Convertir L/s a m³/s

    return velocity;
}

// ===== PÉRDIDAS EN TUBERÍAS =====

/**
 * Calcular pérdidas por fricción (Darcy-Weisbach)
 * @param {number} f - Factor de fricción
 * @param {number} L - Longitud (m)
 * @param {number} D_mm - Diámetro interno (mm)
 * @param {number} velocity - Velocidad (m/s)
 * @param {number} g - Gravedad (m/s²)
 * @returns {number} Pérdidas de altura (m)
 */
function calculateFrictionLoss(f, L, D_mm, velocity, g = 9.80665) {
    // Validación defensiva
    if (D_mm <= 0) {
        throw new Error('Diámetro debe ser mayor que cero');
    }
    if (velocity < 0) {
        throw new Error('Velocidad no puede ser negativa');
    }

    const D_m = D_mm / 1000;
    return f * (L / D_m) * (velocity * velocity) / (2 * g);
}

/**
 * Calcular pérdidas menores en accesorios
 * @param {Array} fittings - Array de accesorios {type, quantity, K}
 * @param {number} velocity - Velocidad (m/s)
 * @param {number} g - Gravedad (m/s²)
 * @returns {number} Pérdidas totales de accesorios (m)
 */
function calculateMinorLosses(fittings, velocity, g = 9.80665) {
    let totalK = 0;

    fittings.forEach(fitting => {
        totalK += (fitting.K || fitting.L_D * 0.02) * fitting.quantity;
    });

    return totalK * (velocity * velocity) / (2 * g);
}

/**
 * Calcular longitud equivalente de accesorios
 * @param {Array} fittings - Array de accesorios
 * @param {number} D_mm - Diámetro (mm)
 * @returns {number} Longitud equivalente total (m)
 */
function calculateEquivalentLength(fittings, D_mm) {
    let Leq = 0;

    fittings.forEach(fitting => {
        const L_D = fitting.L_D || 0;
        Leq += L_D * D_mm / 1000 * fitting.quantity;
    });

    return Leq;
}

// ===== NPSH =====

/**
 * Calcular NPSH disponible
 * @param {number} P_suction - Presión en succión (kPa abs)
 * @param {number} velocity - Velocidad en succión (m/s)
 * @param {number} Pv - Presión de vapor (kPa)
 * @param {number} h_losses - Pérdidas en succión (m)
 * @param {number} density - Densidad (kg/m³)
 * @param {number} g - Gravedad (m/s²)
 * @returns {number} NPSH disponible (m)
 */
function calculateNPSHd(P_suction, velocity, Pv, h_losses, density, g = 9.80665) {
    const gamma = density * g; // Peso específico (N/m³)

    // Convertir presiones de kPa a Pa
    const P_suction_Pa = P_suction * 1000;
    const Pv_Pa = Pv * 1000;

    // NPSHd = Ps/γ + V²/2g - Pv/γ - hf
    const term1 = P_suction_Pa / gamma;
    const term2 = (velocity * velocity) / (2 * g);
    const term3 = Pv_Pa / gamma;

    return term1 + term2 - term3 - h_losses;
}

/**
 * Verificar condición de cavitación
 * @param {number} NPSHd - NPSH disponible (m)
 * @param {number} NPSHr - NPSH requerido (m)
 * @param {number} margin - Margen de seguridad (m)
 * @returns {Object} Estado de cavitación
 */
function checkCavitation(NPSHd, NPSHr, margin = 0.5) {
    // VALIDACIÓN CRÍTICA: NPSHd negativo = operación físicamente imposible
    if (NPSHd < 0) {
        return {
            safe: false,
            status: 'critical',
            message: 'NPSH DISPONIBLE NEGATIVO - Operación físicamente imposible',
            margin: NPSHd - NPSHr,
            NPSHd: NPSHd,
            consequences: [
                'La presión de succión está por debajo de la presión de vapor',
                'La bomba NO podrá operar bajo estas condiciones',
                'Cavitación inmediata y severa garantizada'
            ],
            recommendations: [
                'Aumentar presión de tanque de succión',
                'Reducir temperatura del fluido',
                'Elevar la bomba (reducir altura de elevación)',
                'Reducir pérdidas en succión (aumentar diámetro)'
            ]
        };
    }

    const available = NPSHd - margin;

    // Margen crítico: menos de 5% sobre NPSHr
    if (available < NPSHr * 1.05 && available >= NPSHr) {
        return {
            safe: false,
            status: 'critical',
            message: 'Margen de NPSH crítico (< 5%)',
            margin: NPSHd - NPSHr,
            consequences: ['Riesgo alto de cavitación con variaciones menores de operación'],
            recommendations: ['Aumentar NPSH disponible mínimamente']
        };
    }

    // Margen reducido: entre 5% y 11%
    if (available < NPSHr * 1.1 && available >= NPSHr * 1.05) {
        return {
            safe: true,
            status: 'warning',
            message: 'Margen de NPSH reducido (5-11%)',
            margin: NPSHd - NPSHr
        };
    }

    // Riesgo de cavitación
    if (available < NPSHr) {
        return {
            safe: false,
            status: 'critical',
            message: 'Riesgo de cavitación',
            margin: NPSHd - NPSHr
        };
    }

    // Operación segura
    return {
        safe: true,
        status: 'safe',
        message: 'Operación segura',
        margin: NPSHd - NPSHr
    };
}

// ===== TDH Y POTENCIA =====

/**
 * Calcular TDH del sistema
 * @param {number} H_discharge - Altura de presión en descarga (m)
 * @param {number} H_suction - Altura de presión en succión (m)
 * @param {number} h_discharge - Pérdidas en descarga (m)
 * @param {number} h_suction - Pérdidas en succión (m)
 * @param {number} Vd - Velocidad en descarga (m/s)
 * @param {number} Vs - Velocidad en succión (m/s)
 * @param {number} g - Gravedad (m/s²)
 * @returns {number} TDH (m)
 */
function calculateTDH(H_discharge, H_suction, h_discharge, h_suction, Vd, Vs, g = 9.80665) {
    const velocityHead = (Vd * Vd - Vs * Vs) / (2 * g);
    return H_discharge - H_suction + h_discharge + h_suction + velocityHead;
}

/**
 * Calcular potencia hidráulica
 * @param {number} flow_L_s - Flujo (L/s)
 * @param {number} TDH - TDH (m)
 * @param {number} density - Densidad (kg/m³)
 * @param {number} g - Gravedad (m/s²)
 * @returns {number} Potencia (W)
 */
function calculateHydraulicPower(flow_L_s, TDH, density, g = 9.80665) {
    const flow_m3_s = flow_L_s / 1000;
    return flow_m3_s * TDH * density * g;
}

/**
 * Calcular potencia del eje (shaft power)
 * @param {number} hydraulicPower - Potencia hidráulica (W)
 * @param {number} efficiency - Eficiencia (decimal)
 * @returns {number} Potencia del eje (W)
 */
function calculateShaftPower(hydraulicPower, efficiency) {
    return hydraulicPower / efficiency;
}

/**
 * Calcular potencia del motor
 * @param {number} shaftPower - Potencia del eje (W)
 * @param {number} safetyFactor - Factor de seguridad (1.1 - 1.25)
 * @returns {number} Potencia del motor (W)
 */
function calculateMotorPower(shaftPower, safetyFactor = 1.15) {
    return shaftPower * safetyFactor;
}

// ===== CÁLCULO COMPLETO DE SECCIÓN =====

/**
 * Calcular pérdidas totales en una sección (succión o descarga)
 * @param {Object} params - Parámetros de la sección
 * @returns {Object} Resultados del cálculo
 */
function calculateSectionLosses(params) {
    const {
        flow_L_s,
        D_mm,
        length_m,
        roughness_mm,
        fittings,
        consistency_percent,
        pulpType,
        temperature_c,
        elevation_gain_m
    } = params;

    // Obtener propiedades del fluido
    const fluidProps = getWaterProperties(temperature_c);
    const pulpData = getPulpData(pulpType);

    // Calcular densidad de pulpa
    const density = calculatePulpDensity(consistency_percent);

    // Calcular viscosidad
    const mu_water = fluidProps.viscosity;
    const mu_pulp = calculatePulpViscosity(pulpType, consistency_percent, temperature_c);

    // Calcular velocidad
    const velocity = calculateVelocity(flow_L_s, D_mm);

    // Calcular número de Reynolds
    const Re = calculateReynolds(velocity, D_mm, mu_pulp, density);

    // Determinar región de flujo
    const flowRegion = determineFlowRegion(pulpType, velocity, consistency_percent, D_mm / 1000);

    // Calcular factor de fricción del agua
    const f_water = calculateFrictionFactor(Re, roughness_mm, D_mm);

    // Calcular Kmod
    const Kmod = calculateKmod(pulpType, flowRegion.region, consistency_percent);

    // Calcular factor de fricción de pulpa
    const f_pulp = calculatePulpFrictionFactor(f_water, Kmod);

    // Calcular pérdidas por fricción en tubería
    const h_friction = calculateFrictionLoss(f_pulp, length_m, D_mm, velocity);

    // Calcular pérdidas menores en accesorios
    const h_minor = calculateMinorLosses(fittings, velocity);

    // Pérdidas totales
    const h_total = h_friction + h_minor;

    // Longitud equivalente
    const Leq = length_m + calculateEquivalentLength(fittings, D_mm);

    return {
        velocity,
        Re,
        flowRegion,
        f_water,
        Kmod,
        f_pulp,
        h_friction,
        h_minor,
        h_total,
        Leq,
        density,
        viscosity: mu_pulp
    };
}

// ===== CÁLCULO COMPLETO DEL SISTEMA =====

/**
 * Calcular sistema completo de bombeo
 * @param {Object} systemData - Datos completos del sistema
 * @returns {Object} Resultados completos
 */
function calculatePumpingSystem(systemData) {
    const {
        // Datos del proceso
        pulpType,
        consistency_percent,
        temperature_c,
        air_content_percent,

        // Datos de succión
        suction: {
            D_mm: D_suction,
            length_m: L_suction,
            roughness_mm: roughness_suction,
            fittings: fittings_suction
        },

        // Datos de descarga
        discharge: {
            D_mm: D_discharge,
            length_m: L_discharge,
            roughness_mm: roughness_discharge,
            fittings: fittings_discharge
        },

        // Condiciones de operación
        operatingConditions: {
            tank_pressure_suction_kPa,
            elevation_suction_m,
            tank_pressure_discharge_kPa,
            elevation_discharge_m
        },

        // Datos de bomba
        pump: {
            flow_L_s,
            impeller_diameter_mm,
            rpm,
            curve_points
        },

        // Factor de corrección por aire
        useAirCorrection = true
    } = systemData;

    // 1. CALCULAR PÉRDIDAS EN SUCCIÓN
    const suctionResults = calculateSectionLosses({
        flow_L_s,
        D_mm: D_suction,
        length_m: L_suction,
        roughness_mm: roughness_suction,
        fittings: fittings_suction,
        consistency_percent,
        pulpType,
        temperature_c
    });

    // 2. CALCULAR PÉRDIDAS EN DESCARGA
    const dischargeResults = calculateSectionLosses({
        flow_L_s,
        D_mm: D_discharge,
        length_m: L_discharge,
        roughness_mm: roughness_discharge,
        fittings: fittings_discharge,
        consistency_percent,
        pulpType,
        temperature_c
    });

    // 3. OBTENER PROPIEDADES DEL FLUIDO
    const fluidProps = getWaterProperties(temperature_c);
    const Pv = fluidProps.vapor_pressure;

    // 4. FACTOR DE CORRECCIÓN POR AIRE
    let Fair = 1.0;
    if (useAirCorrection && air_content_percent > 0) {
        Fair = 1 + (0.025 * air_content_percent);
    }

    // Aplicar corrección por aire a las pérdidas
    const h_suction_corrected = suctionResults.h_total * Fair;
    const h_discharge_corrected = dischargeResults.h_total * Fair;

    // 5. CALCULAR NPSH DISPONIBLE
    const P_suction_abs = tank_pressure_suction_kPa + PHYSICAL_CONSTANTS.P_atm;
    const NPSHd = calculateNPSHd(
        P_suction_abs,
        suctionResults.velocity,
        Pv,
        h_suction_corrected,
        suctionResults.density
    );

    // 6. CALCULAR NPSH REQUERIDO (desde curva de bomba)
    const NPSHr = interpolatePumpCurve(flow_L_s, curve_points, 'NPSHr');

    // 7. VERIFICAR CAVITACIÓN
    const cavitationCheck = checkCavitation(NPSHd, NPSHr);

    // 8. CALCULAR ALTURAS DE PRESIÓN
    const g = PHYSICAL_CONSTANTS.g;
    const H_suction = elevation_suction_m + (tank_pressure_suction_kPa * 1000) / (suctionResults.density * g);
    const H_discharge = elevation_discharge_m + (tank_pressure_discharge_kPa * 1000) / (dischargeResults.density * g);

    // 9. CALCULAR TDH DEL SISTEMA
    const TDH_system = calculateTDH(
        H_discharge,
        H_suction,
        h_discharge_corrected,
        h_suction_corrected,
        dischargeResults.velocity,
        suctionResults.velocity,
        g
    );

    // 10. CALCULAR TDH DE BOMBA (desde curva)
    const TDH_pump = interpolatePumpCurve(flow_L_s, curve_points, 'TDH');

    // 11. VERIFICAR OPERACIÓN DE BOMBA
    const pumpMatch = {
        TDH_available: TDH_pump,
        TDH_required: TDH_system,
        margin: TDH_pump - TDH_system,
        adequate: TDH_pump >= TDH_system,
        status: TDH_pump >= TDH_system ? 'adequate' : 'insufficient'
    };

    // 12. CALCULAR EFICIENCIA (desde curva)
    const efficiency = interpolatePumpCurve(flow_L_s, curve_points, 'efficiency');

    // 13. CALCULAR POTENCIAS
    const Ph = calculateHydraulicPower(flow_L_s, TDH_system, dischargeResults.density, g);
    const Pe = calculateShaftPower(Ph, efficiency / 100);
    const Pmotor = calculateMotorPower(Pe);

    // 14. DETERMINAR ESTADO GENERAL
    const overallStatus = determineOverallStatus(cavitationCheck, pumpMatch);

    return {
        // Succión
        suction: {
            ...suctionResults,
            h_total_corrected: h_suction_corrected
        },

        // Descarga
        discharge: {
            ...dischargeResults,
            h_total_corrected: h_discharge_corrected
        },

        // NPSH
        NPSH: {
            available: NPSHd,
            required: NPSHr,
            margin: NPSHd - NPSHr,
            check: cavitationCheck
        },

        // TDH
        TDH: {
            system: TDH_system,
            pump: TDH_pump,
            margin: TDH_pump - TDH_system,
            match: pumpMatch
        },

        // Potencia
        power: {
            hydraulic: Ph,
            shaft: Pe,
            motor: Pmotor,
            motor_kW: Pmotor / 1000,
            motor_HP: Pmotor / 1000 / 0.746
        },

        // Eficiencia
        efficiency,

        // Estado general
        overallStatus,

        // Factores de corrección
        corrections: {
            Fair,
            Kmod_suction: suctionResults.Kmod,
            Kmod_discharge: dischargeResults.Kmod
        }
    };
}

/**
 * Interpolar valor desde curva de bomba
 * @param {number} flow_L_s - Flujo (L/s)
 * @param {Array} curvePoints - Puntos de la curva [{flow, TDH, NPSHr, efficiency}]
 * @param {string} property - Propiedad a interpolar ('TDH', 'NPSHr', 'efficiency')
 * @returns {number} Valor interpolado
 */
function interpolatePumpCurve(flow_L_s, curvePoints, property) {
    if (!curvePoints || curvePoints.length === 0) {
        return 0;
    }

    // Extraer flujos y valores de la propiedad
    const flows = curvePoints.map(p => p.flow);
    const values = curvePoints.map(p => p[property]);

    return linearInterpolation(flow_L_s, flows, values);
}

/**
 * Determinar estado general del sistema
 * @param {Object} cavitationCheck - Verificación de cavitación
 * @param {Object} pumpMatch - Verificación de bomba
 * @returns {Object} Estado general
 */
function determineOverallStatus(cavitationCheck, pumpMatch) {
    if (!cavitationCheck.safe) {
        return {
            status: 'critical',
            color: 'red',
            message: 'Cavitación inminente',
            recommendations: ['Aumentar diámetro de succión', 'Reducir temperatura', 'Reducir pérdidas en succión']
        };
    }

    if (cavitationCheck.status === 'warning') {
        return {
            status: 'warning',
            color: 'yellow',
            message: 'Margen de NPSH reducido',
            recommendations: ['Monitorear NPSH continuamente', 'Considerar aumentar diámetro de succión']
        };
    }

    if (!pumpMatch.adequate) {
        return {
            status: 'warning',
            color: 'yellow',
            message: 'TDH de bomba insuficiente',
            recommendations: ['Aumentar diámetro de impulsor', 'Aumentar RPM', 'Considerar bomba de mayor capacidad']
        };
    }

    return {
        status: 'safe',
        color: 'green',
        message: 'Operación dentro de parámetros normales',
        recommendations: ['Continuar monitoreo periódico', 'Registrar parámetros de operación']
    };
}

// ===== CÁLCULO DE VELOCIDADES POR SECCIÓN =====

/**
 * Calcular velocidad y estado de una sección (succión o descarga)
 * @param {Object} sectionData - Datos de la sección de tubería
 * @param {number} flow_L_s - Flujo en L/s
 * @param {number} consistency_percent - Consistencia de pulpa en %
 * @returns {Object} Velocidad y estado de validación
 */
function calculateSectionVelocity(sectionData, flow_L_s, consistency_percent) {
    if (!sectionData || !sectionData.D_mm || !flow_L_s) {
        return {
            velocity: null,
            valid: false,
            error: 'Datos incompletos para calcular velocidad'
        };
    }

    const velocity = calculateVelocity(flow_L_s, sectionData.D_mm);
    const diameter_nominal = parseFloat(sectionData.nominal) || 6;
    const section = (sectionData.section || 'suction').toLowerCase();

    // Determinar si es succión o descarga
    const sectionType = section.includes('suc') ? 'suction' : 'discharge';

    const validation = validatePipeVelocity(sectionType, velocity, consistency_percent, diameter_nominal);

    return {
        velocity: velocity,
        level: validation.level,
        valid: validation.level !== 'error',
        messages: validation.messages,
        limits: validation.limits,
        section: sectionType
    };
}

/**
 * Calcular velocidades de ambas secciones
 * @param {Object} systemData - Datos completos del sistema
 * @returns {Object} Velocidades de succión y descarga con validación
 */
function calculateSystemVelocities(systemData) {
    const results = {
        suction: null,
        discharge: null,
        valid: true
    };

    const consistency = systemData.consistency_percent || 3.0;
    const flow = systemData.pump?.flow_L_s || 0;

    // Calcular velocidad de succión
    if (systemData.suction && systemData.suction.D_mm) {
        results.suction = calculateSectionVelocity(
            { ...systemData.suction, section: 'suction' },
            flow,
            consistency
        );
        if (!results.suction.valid) results.valid = false;
    }

    // Calcular velocidad de descarga
    if (systemData.discharge && systemData.discharge.D_mm) {
        results.discharge = calculateSectionVelocity(
            { ...systemData.discharge, section: 'discharge' },
            flow,
            consistency
        );
        if (!results.discharge.valid) results.valid = false;
    }

    return results;
}

// ===== ANÁLISIS DE SENSIBILIDAD =====

/**
 * Realizar análisis de sensibilidad
 * @param {Object} baseSystem - Datos base del sistema
 * @param {string} parameter - Parámetro a variar
 * @param {number} variation - Variación fraccional (ej. 0.1 para ±10%)
 * @returns {Object} Resultados del análisis
 */
function performSensitivityAnalysis(baseSystem, parameter, variation = 0.1) {
    const baseResult = calculatePumpingSystem(baseSystem);

    // Variación positiva
    const systemPlus = { ...baseSystem };
    applyVariation(systemPlus, parameter, 1 + variation);
    const resultPlus = calculatePumpingSystem(systemPlus);

    // Variación negativa
    const systemMinus = { ...baseSystem };
    applyVariation(systemMinus, parameter, 1 - variation);
    const resultMinus = calculatePumpingSystem(systemMinus);

    // Calcular sensibilidades
    const sensitivity = {
        parameter,
        variation: variation * 100,
        TDH_sensitivity: calculateSensitivity(
            baseResult.TDH.system,
            resultPlus.TDH.system,
            resultMinus.TDH.system,
            variation
        ),
        NPSH_sensitivity: calculateSensitivity(
            baseResult.NPSH.available,
            resultPlus.NPSH.available,
            resultMinus.NPSH.available,
            variation
        ),
        power_sensitivity: calculateSensitivity(
            baseResult.power.motor_kW,
            resultPlus.power.motor_kW,
            resultMinus.power.motor_kW,
            variation
        )
    };

    return {
        base: baseResult,
        plus: resultPlus,
        minus: resultMinus,
        sensitivity
    };
}

/**
 * Aplicar variación a un parámetro del sistema
 */
function applyVariation(system, parameter, factor) {
    switch (parameter) {
        case 'consistency':
            system.consistency_percent *= factor;
            break;
        case 'flow':
            system.pump.flow_L_s *= factor;
            break;
        case 'suction_diameter':
            system.suction.D_mm *= factor;
            break;
        case 'discharge_diameter':
            system.discharge.D_mm *= factor;
            break;
        case 'suction_length':
            system.suction.length_m *= factor;
            break;
        case 'discharge_length':
            system.discharge.length_m *= factor;
            break;
    }
}

/**
 * Calcular sensibilidad porcentual
 */
function calculateSensitivity(base, plus, minus, variation) {
    const deltaPlus = (plus - base) / base;
    const deltaMinus = (minus - base) / base;
    const avgDelta = (deltaPlus + Math.abs(deltaMinus)) / 2;

    return {
        per_percent: (avgDelta / variation) * 100,
        direction: avgDelta >= 0 ? 'direct' : 'inverse'
    };
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.calculateFrictionFactor = calculateFrictionFactor;
    window.calculatePulpFrictionFactor = calculatePulpFrictionFactor;
    window.calculateReynolds = calculateReynolds;
    window.calculateModifiedReynolds = calculateModifiedReynolds;
    window.calculateApparentViscosity = calculateApparentViscosity;
    window.calculateVelocity = calculateVelocity;
    window.calculateFrictionLoss = calculateFrictionLoss;
    window.calculateMinorLosses = calculateMinorLosses;
    window.calculateNPSHd = calculateNPSHd;
    window.checkCavitation = checkCavitation;
    window.calculateTDH = calculateTDH;
    window.calculatePumpingSystem = calculatePumpingSystem;
    window.interpolatePumpCurve = interpolatePumpCurve;
    window.performSensitivityAnalysis = performSensitivityAnalysis;
    window.calculateSensitivity = calculateSensitivity;
    window.calculateSectionVelocity = calculateSectionVelocity;
    window.calculateSystemVelocities = calculateSystemVelocities;
}
