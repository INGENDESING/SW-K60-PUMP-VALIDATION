/**
 * MÓDULO DE VALIDACIÓN - P2603 SW-K60
 * Validación de entradas y verificaciones técnicas
 */

// ===== DEFINICIONES DE VALIDACIÓN =====

const VALIDATION_RULES = {
    // Datos del proceso
    consistency: {
        min: 0.5,
        max: 8.0,
        required: true,
        unit: '%',
        name: 'Consistencia'
    },
    temperature: {
        min: 10,
        max: 90,
        required: true,
        unit: '°C',
        name: 'Temperatura'
    },
    pH: {
        min: 4.0,
        max: 10.0,
        required: false,
        unit: '',
        name: 'pH'
    },
    SR_degrees: {
        min: 0,
        max: 100,
        required: false,
        unit: '°SR',
        name: 'Grado de refinación'
    },
    air_content: {
        min: 0,
        max: 5.0,
        required: false,
        unit: '%',
        name: 'Contenido de aire'
    },

    // Tuberías
    diameter: {
        min: 2,
        max: 24,
        required: true,
        unit: 'in',
        name: 'Diámetro nominal'
    },
    pipe_length: {
        min: 0.5,
        max: 500,
        required: true,
        unit: 'm',
        name: 'Longitud de tubería'
    },
    roughness: {
        min: 0.001,
        max: 1.0,
        required: false,
        unit: 'mm',
        name: 'Rugosidad absoluta'
    },

    // Bomba
    flow: {
        min: 0.1,
        max: 20000,  // Soporta hasta 20000 m³/h (≈5555 L/s) o 317000 GPM
        required: true,
        unit: 'variable', // Depende de config.units.flow (m3_h, gpm, L_s)
        name: 'Flujo'
    },
    impeller_diameter: {
        min: 50,
        max: 1000,
        required: true,
        unit: 'mm',
        name: 'Diámetro de impulsor'
    },
    rpm: {
        min: 100,
        max: 6000,
        required: true,
        unit: 'RPM',
        name: 'Velocidad de rotación'
    },
    efficiency: {
        min: 10,
        max: 95,
        required: false,
        unit: '%',
        name: 'Eficiencia'
    },

    // Presiones
    pressure: {
        min: -1,
        max: 50,
        required: true,
        unit: 'bar',
        name: 'Presión'
    },
    elevation: {
        min: -50,
        max: 200,
        required: true,
        unit: 'm',
        name: 'Elevación'
    }
};

// ===== LÍMITES DE VELOCIDAD PARA TUBERÍAS DE PULPA =====

/**
 * Velocidades mínimas y máximas recomendadas para tuberías de pulpa
 * Basado en ANSI/HI 9.6.6, TAPPI y mejores prácticas de la industria
 */
const VELOCITY_LIMITS = {
    // Succión - velocidades más bajas para evitar cavitación
    suction: {
        byConsistency: [
            { maxConsistency: 2.0, min: 0.9, max: 1.8 },
            { maxConsistency: 4.0, min: 1.0, max: 1.5 },
            { maxConsistency: 6.0, min: 1.2, max: 1.3 },
            { maxConsistency: 100, min: 1.0, max: 1.2 } // > 6%
        ],
        general: { min: 1.0, max: 1.5 },
        warningThreshold: 0.2
    },

    // Descarga - velocidades más altas permitidas
    discharge: {
        byConsistency: [
            { maxConsistency: 2.0, min: 1.0, max: 3.0 },
            { maxConsistency: 4.0, min: 1.2, max: 2.5 },
            { maxConsistency: 6.0, min: 1.2, max: 2.0 },
            { maxConsistency: 100, min: 1.2, max: 1.5 } // > 6%
        ],
        general: { min: 1.2, max: 2.5 },
        warningThreshold: 0.2
    }
};

// ===== FUNCIONES DE VALIDACIÓN DE VELOCIDAD =====

/**
 * Validar velocidad en tubería de pulpa
 * @param {string} section - 'suction' o 'discharge'
 * @param {number} velocity - Velocidad actual en m/s
 * @param {number} consistency - Consistencia de pulpa en %
 * @param {number} diameter - Diámetro nominal en pulgadas
 * @returns {Object} Resultado con estado, mensajes y nivel de gravedad
 */
function validatePipeVelocity(section, velocity, consistency, diameter) {
    const result = {
        valid: true,
        level: 'info', // 'info', 'warning', 'error'
        messages: [],
        velocity: velocity,
        limits: { min: 0, max: 0 }
    };

    if (velocity === null || velocity === undefined || isNaN(velocity)) {
        result.valid = false;
        result.level = 'error';
        result.messages.push('Velocidad no calculada');
        return result;
    }

    const limits = VELOCITY_LIMITS[section];
    const warningThreshold = limits.warningThreshold;

    // Determinar límites según consistencia
    let minVel = limits.general.min;
    let maxVel = limits.general.max;

    if (limits.byConsistency) {
        const rule = limits.byConsistency.find(r => consistency <= r.maxConsistency);
        if (rule) {
            minVel = rule.min;
            maxVel = rule.max;
        }
    }

    result.limits = { min: minVel, max: maxVel };

    // Validar contra límites
    const minWarning = minVel * (1 + warningThreshold);
    const maxWarning = maxVel * (1 - warningThreshold);

    if (velocity < minVel) {
        result.valid = false;
        result.level = 'error';
        result.messages.push(
            `⚠️ VELOCIDAD DEMASIADO BAJA: ${velocity.toFixed(2)} m/s (mínimo recomendado: ${minVel.toFixed(2)} m/s)`
        );
        result.consequences = [
            '• Riesgo de sedimentación de fibras en el fondo de la tubería',
            '• Acumulación gradual de material que reduce el área de flujo',
            '• Posible obstrucción parcial o total con el tiempo',
            '• Pérdida de homogeneidad de la mezcla (separación de fases)',
            '• Arranques difíciles después de paradas prolongadas'
        ];
        result.recommendations = [
            '✓ Reducir el diámetro de la tubería',
            '✓ Aumentar el flujo de operación',
            '✓ Verificar que el punto de operación sea el correcto'
        ];
    } else if (velocity < minWarning) {
        result.level = 'warning';
        result.messages.push(
            `⚡ Velocidad cercana al mínimo: ${velocity.toFixed(2)} m/s (mínimo: ${minVel.toFixed(2)} m/s)`
        );
        result.consequences = [
            '• Monitorear para evitar sedimentación en operación prolongada'
        ];
        result.recommendations = [
            '✓ Considerar reducción de diámetro si hay problemas de sedimentación'
        ];
    } else if (velocity > maxVel) {
        result.valid = false;
        result.level = 'error';
        result.messages.push(
            `⚠️ VELOCIDAD DEMASIADO ALTA: ${velocity.toFixed(2)} m/s (máximo recomendado: ${maxVel.toFixed(2)} m/s)`
        );
        result.consequences = [
            '• Erosión acelerada de paredes internas de tubería y accesorios',
            '• Pérdida de carga excesiva que aumenta TDH requerido',
            '• Alto consumo de energía (potencia proporcional al cubo de la velocidad)',
            '• Desgaste prematuro de válvulas, codos y otros accesorios',
            '• Mayor nivel de ruido y vibraciones en el sistema',
            '• Posible cavitación en la succión de la bomba'
        ];
        result.recommendations = [
            '✓ Aumentar el diámetro de la tubería',
            '✓ Reducir el flujo de operación',
            '✓ Evaluar pérdidas de carga y seleccionar bomba adecuada'
        ];
    } else if (velocity > maxWarning) {
        result.level = 'warning';
        result.messages.push(
            `⚡ Velocidad cercana al máximo: ${velocity.toFixed(2)} m/s (máximo: ${maxVel.toFixed(2)} m/s)`
        );
        result.consequences = [
            '• Monitorear pérdida de carga y consumo de energía'
        ];
        result.recommendations = [
            '✓ Considerar aumento de diámetro si hay problemas de erosión o consumo'
        ];
    } else {
        result.level = 'success';
        result.messages.push(
            `✓ Velocidad óptima: ${velocity.toFixed(2)} m/s (rango recomendado: ${minVel.toFixed(2)} - ${maxVel.toFixed(2)} m/s)`
        );
        result.consequences = [];
        result.recommendations = [];
    }

    return result;
}

/**
 * Validar ambas secciones (succión y descarga)
 * @param {Object} systemData - Datos completos del sistema
 * @returns {Object} Resultados de validación de velocidad
 */
function validateSystemVelocities(systemData) {
    const results = {
        suction: null,
        discharge: null,
        valid: true
    };

    // Validar succión
    if (systemData.suction && systemData.suction.D_mm && systemData.pump && systemData.pump.flow_L_s) {
        const suctionVelocity = calculateVelocity(systemData.pump.flow_L_s, systemData.suction.D_mm);
        const suctionDiameter = parseFloat(systemData.suction.nominal) || 6;
        const consistency = systemData.consistency_percent || 3.0;

        results.suction = validatePipeVelocity('suction', suctionVelocity, consistency, suctionDiameter);
        if (results.suction.level === 'error') results.valid = false;
    }

    // Validar descarga
    if (systemData.discharge && systemData.discharge.D_mm && systemData.pump && systemData.pump.flow_L_s) {
        const dischargeVelocity = calculateVelocity(systemData.pump.flow_L_s, systemData.discharge.D_mm);
        const dischargeDiameter = parseFloat(systemData.discharge.nominal) || 4;
        const consistency = systemData.consistency_percent || 3.0;

        results.discharge = validatePipeVelocity('discharge', dischargeVelocity, consistency, dischargeDiameter);
        if (results.discharge.level === 'error') results.valid = false;
    }

    return results;
}

// ===== FUNCIONES DE VALIDACIÓN BÁSICAS =====

/**
 * Validar un valor contra reglas
 * @param {number} value - Valor a validar
 * @param {Object} rule - Regla de validación
 * @returns {Object} Resultado de validación
 */
function validateValue(value, rule) {
    const result = {
        valid: true,
        errors: [],
        warnings: []
    };

    // Verificar si es requerido
    if (rule.required && (value === null || value === undefined || value === '')) {
        result.valid = false;
        result.errors.push(`El campo ${rule.name} es requerido`);
        return result;
    }

    // Si no es requerido y está vacío, es válido
    if (!rule.required && (value === null || value === undefined || value === '')) {
        return result;
    }

    // Convertir a número
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
        result.valid = false;
        result.errors.push(`${rule.name} debe ser un número válido`);
        return result;
    }

    // Validar rango
    if (rule.min !== undefined && numValue < rule.min) {
        result.valid = false;
        result.errors.push(`${rule.name} debe ser mayor o igual a ${rule.min} ${rule.unit}`);
    }

    if (rule.max !== undefined && numValue > rule.max) {
        result.valid = false;
        result.errors.push(`${rule.name} debe ser menor o igual a ${rule.max} ${rule.unit}`);
    }

    // Advertencias para valores cercanos a los límites
    if (rule.min !== undefined && numValue < rule.min * 1.1 && numValue >= rule.min) {
        result.warnings.push(`${rule.name} está cerca del límite inferior (${rule.min} ${rule.unit})`);
    }

    if (rule.max !== undefined && numValue > rule.max * 0.9 && numValue <= rule.max) {
        result.warnings.push(`${rule.name} está cerca del límite superior (${rule.max} ${rule.unit})`);
    }

    return result;
}

/**
 * Validar múltiples campos
 * @param {Object} data - Objeto con datos a validar
 * @param {Object} rules - Objeto con reglas para cada campo
 * @returns {Object} Resultado de validación
 */
function validateFields(data, rules) {
    const result = {
        valid: true,
        errors: {},
        warnings: {}
    };

    for (const field in rules) {
        const rule = rules[field];
        const value = data[field];
        const validation = validateValue(value, rule);

        if (!validation.valid) {
            result.valid = false;
            result.errors[field] = validation.errors;
        }

        if (validation.warnings.length > 0) {
            result.warnings[field] = validation.warnings;
        }
    }

    return result;
}

// ===== VALIDACIONES ESPECÍFICAS =====

/**
 * Validar datos del proceso
 * @param {Object} processData - Datos del proceso
 * @returns {Object} Resultado de validación
 */
function validateProcessData(processData) {
    const rules = {
        pulpType: {
            required: true,
            name: 'Tipo de pulpa',
            validate: (value) => {
                const validTypes = Object.keys(PULP_DATABASE);
                return validTypes.includes(value);
            }
        },
        consistency: VALIDATION_RULES.consistency,
        temperature: VALIDATION_RULES.temperature,
        pH: VALIDATION_RULES.pH,
        SR_degrees: VALIDATION_RULES.SR_degrees,
        air_content: VALIDATION_RULES.air_content
    };

    const result = validateFields(processData, rules);

    // Validación específica de tipo de pulpa
    if (processData.pulpType && rules.pulpType.validate && !rules.pulpType.validate(processData.pulpType)) {
        result.valid = false;
        result.errors.pulpType = ['Tipo de pulpa no válido'];
    }

    // VALIDACIÓN CRÍTICA: Caso de agua pura (consistencia = 0%)
    if (processData.consistency !== undefined && processData.consistency !== null) {
        if (processData.consistency === 0 || processData.consistency < 0.1) {
            result.warnings.consistency = result.warnings.consistency || [];
            result.warnings.consistency.push(
                '⚠️ ADVERTENCIA: Consistencia detectada como 0% (agua pura). Los cálculos de pulpa NO aplican.'
            );
            result.warnings.consistency.push(
                'Los factores de fricción Kmod serán incorrectos para agua pura.'
            );
            result.warnings.consistency.push(
                'Recomendación: Si es agua, use métodos estándar para cálculo de bombas de agua.'
            );
        }
    }

    // Validaciones lógicas adicionales
    if (processData.consistency && processData.pulpType) {
        const pulp = getPulpData(processData.pulpType);
        if (pulp) {
            if (processData.consistency < pulp.consistency_min) {
                result.warnings.consistency = result.warnings.consistency || [];
                result.warnings.consistency.push(
                    `Consistencia por debajo del rango típico para ${pulp.name} (${pulp.consistency_min}% - ${pulp.consistency_max}%)`
                );
            }
            if (processData.consistency > pulp.consistency_max) {
                result.warnings.consistency = result.warnings.consistency || [];
                result.warnings.consistency.push(
                    `Consistencia por encima del rango típico para ${pulp.name} (${pulp.consistency_min}% - ${pulp.consistency_max}%)`
                );
            }
        }
    }

    // Validación de temperatura vs punto de ebullición
    if (processData.temperature !== undefined) {
        // VALIDACIÓN CRÍTICA: Temperaturas extremas
        if (processData.temperature < 1) {
            result.valid = false;
            result.errors.temperature = result.errors.temperature || [];
            result.errors.temperature.push(
                'Temperatura debajo de 1°C. Riesgo de congelamiento del fluido.'
            );
        }

        if (processData.temperature > 95) {
            result.valid = false;
            result.errors.temperature = result.errors.temperature || [];
            result.errors.temperature.push(
                'Temperatura excede 95°C. Demasiado cerca del punto de ebullición.'
            );
        }

        // Validación de punto de ebullición
        const vaporPressure = getWaterVaporPressure(processData.temperature);
        const atmosphericPressure = 101.325; // kPa

        if (vaporPressure > atmosphericPressure * 0.9) {
            result.warnings.temperature = result.warnings.temperature || [];
            result.warnings.temperature.push(
                `Temperatura cerca del punto de ebullición a presión atmosférica`
            );
        }
    }

    return result;
}

/**
 * Validar datos de tubería
 * @param {Object} pipeData - Datos de tubería
 * @returns {Object} Resultado de validación
 */
function validatePipeData(pipeData) {
    const rules = {
        norm: {
            required: true,
            name: 'Norma de tubería',
            validate: (value) => {
                const validNorms = ['ANSI_B36_10', 'ANSI_B36_19', 'PVC_40', 'PVC_80'];
                return validNorms.includes(value);
            }
        },
        nominal: VALIDATION_RULES.diameter,
        schedule: {
            required: true,
            name: 'Cédula',
            validate: (value) => {
                const validSchedules = ['10', '20', '40', '80', '10S', '40S', '80S', 'STD', 'XS'];
                return validSchedules.includes(value);
            }
        },
        length: VALIDATION_RULES.pipe_length,
        roughness: VALIDATION_RULES.roughness
    };

    const result = validateFields(pipeData, rules);

    // Validar que la combinación norma/schedule/nominal exista
    if (pipeData.norm && pipeData.nominal && pipeData.schedule) {
        const pipeDataResult = getPipeData(pipeData.norm, pipeData.nominal, pipeData.schedule);
        if (!pipeDataResult) {
            result.valid = false;
            result.errors.combination = [`La combinación ${pipeData.norm}/${pipeData.nominal}/${pipeData.schedule} no existe en la base de datos`];
        }
    }

    // Validar longitud vs número de accesorios
    if (pipeData.length && pipeData.fittings && pipeData.fittings.length > 0) {
        const totalFittings = pipeData.fittings.reduce((sum, f) => sum + (f.quantity || 0), 0);
        if (totalFittings > pipeData.length * 5) {
            result.warnings.fittings = result.warnings.fittings || [];
            result.warnings.fittings.push(
                'Número elevado de accesorios para la longitud de tubería. Verificar que los datos sean correctos.'
            );
        }
    }

    return result;
}

/**
 * Validar datos de bomba
 * @param {Object} pumpData - Datos de bomba
 * @returns {Object} Resultado de validación
 */
function validatePumpData(pumpData) {
    const rules = {
        manufacturer: { required: false, name: 'Fabricante' },
        model: { required: false, name: 'Modelo' },
        type: { required: false, name: 'Tipo' },
        serial_number: { required: false, name: 'Número de serie' },
        impeller_diameter: VALIDATION_RULES.impeller_diameter,
        rpm: VALIDATION_RULES.rpm,
        flow: VALIDATION_RULES.flow
    };

    const result = validateFields(pumpData, rules);

    // Validar curva característica
    if (pumpData.curve_points && pumpData.curve_points.length > 0) {
        const curveValidation = validatePumpCurve(pumpData.curve_points);
        if (!curveValidation.valid) {
            result.valid = false;
            result.errors.curve = curveValidation.errors;
        }

        if (curveValidation.warnings.length > 0) {
            result.warnings.curve = curveValidation.warnings;
        }

        // Verificar que el punto de operación esté dentro de la curva
        if (pumpData.flow) {
            const minFlow = Math.min(...pumpData.curve_points.map(p => p.flow));
            const maxFlow = Math.max(...pumpData.curve_points.map(p => p.flow));

            if (pumpData.flow < minFlow) {
                result.warnings.flow = result.warnings.flow || [];
                result.warnings.flow.push(`Flujo por debajo del mínimo de la curva (${minFlow.toFixed(2)} L/s)`);
            }

            if (pumpData.flow > maxFlow) {
                result.warnings.flow = result.warnings.flow || [];
                result.warnings.flow.push(`Flujo por encima del máximo de la curva (${maxFlow.toFixed(2)} L/s)`);
            }
        }
    }

    return result;
}

/**
 * Validar curva característica de bomba
 * @param {Array} curvePoints - Puntos de la curva
 * @returns {Object} Resultado de validación
 */
function validatePumpCurve(curvePoints) {
    const result = {
        valid: true,
        errors: [],
        warnings: []
    };

    if (curvePoints.length < 2) {
        result.valid = false;
        result.errors.push('La curva debe tener al menos 2 puntos');
        return result;
    }

    if (curvePoints.length < 3) {
        result.warnings.push('Se recomienda al menos 3 puntos para una interpolación precisa');
    }

    // Verificar que los puntos estén ordenados por flujo
    for (let i = 1; i < curvePoints.length; i++) {
        if (curvePoints[i].flow <= curvePoints[i - 1].flow) {
            result.warnings.push(`Los puntos de la curva deben estar ordenados por flujo (creciente). Punto ${i + 1} tiene flujo menor o igual al punto ${i}`);
        }
    }

    // Verificar campos requeridos en cada punto
    const requiredFields = ['flow', 'TDH', 'NPSHr', 'efficiency'];
    curvePoints.forEach((point, index) => {
        requiredFields.forEach(field => {
            if (point[field] === undefined || point[field] === null || isNaN(point[field])) {
                result.valid = false;
                result.errors.push(`Punto ${index + 1}: Campo ${field} faltante o inválido`);
            }
        });

        // Validar rangos de valores
        if (point.TDH !== undefined && (point.TDH < 0 || point.TDH > 500)) {
            result.warnings.push(`Punto ${index + 1}: TDH fuera de rango típico (0-500m)`);
        }

        if (point.NPSHr !== undefined && (point.NPSHr < 0 || point.NPSHr > 20)) {
            result.warnings.push(`Punto ${index + 1}: NPSHr fuera de rango típico (0-20m)`);
        }

        if (point.efficiency !== undefined && (point.efficiency < 10 || point.efficiency > 95)) {
            result.warnings.push(`Punto ${index + 1}: Eficiencia fuera de rango típico (10-95%)`);
        }
    });

    return result;
}

/**
 * Validar condiciones de operación
 * @param {Object} conditions - Condiciones de operación
 * @returns {Object} Resultado de validación
 */
function validateOperatingConditions(conditions) {
    const rules = {
        tank_pressure_suction: VALIDATION_RULES.pressure,
        elevation_suction: VALIDATION_RULES.elevation,
        tank_pressure_discharge: VALIDATION_RULES.pressure,
        elevation_discharge: VALIDATION_RULES.elevation
    };

    const result = validateFields(conditions, rules);

    // Validación lógica de presión de succión
    if (conditions.tank_pressure_suction !== undefined) {
        const vaporPressure = conditions.temperature ?
            getWaterVaporPressure(conditions.temperature) :
            getWaterVaporPressure(20);

        const absPressureSuction = conditions.tank_pressure_suction + 1.01325; // Convertir a abs (bar)
        const absPressureVapor = vaporPressure / 100; // kPa a bar

        if (absPressureSuction < absPressureVapor) {
            result.valid = false;
            result.errors.tank_pressure_suction = result.errors.tank_pressure_suction || [];
            result.errors.tank_pressure_suction.push(
                `Presión de tanque de succión (${conditions.tank_pressure_suction.toFixed(2)} bar) menor que la presión de vapor del fluido`
            );
        }
    }

    return result;
}

// ===== VALIDACIONES INTEGRIDAD DEL SISTEMA =====

/**
 * Validar integridad técnica del sistema completo
 * @param {Object} systemData - Datos completos del sistema
 * @returns {Object} Resultado de validación con recomendaciones
 */
function validateSystemIntegrity(systemData) {
    const result = {
        valid: true,
        errors: [],
        warnings: [],
        recommendations: []
    };

    // 1. Validar que diámetros sean lógicos
    if (systemData.suction && systemData.discharge) {
        const D_suction = systemData.suction.D_mm;
        const D_discharge = systemData.discharge.D_mm;

        if (D_suction > D_discharge) {
            result.warnings.push('Diámetro de succión mayor que diámetro de descarga. Esto es poco común.');
            result.recommendations.push('Considere usar diámetro de succión menor o igual al de descarga');
        }
    }

    // 2. Validar velocidad de operación
    if (systemData.pump && systemData.pump.flow_L_s && systemData.suction && systemData.suction.D_mm) {
        const velocity = calculateVelocity(systemData.pump.flow_L_s, systemData.suction.D_mm);

        // Velocidad mínima recomendada para evitar sedimentación
        if (velocity < 0.5) {
            result.warnings.push(`Velocidad en succión baja (${velocity.toFixed(2)} m/s). Riesgo de sedimentación.`);
            result.recommendations.push('Considere reducir diámetro de succión o aumentar flujo');
        }

        // Velocidad máxima recomendada para evitar erosión
        if (velocity > 4.5) {
            result.warnings.push(`Velocidad en succión alta (${velocity.toFixed(2)} m/s). Riesgo de erosión.`);
            result.recommendations.push('Considere aumentar diámetro de succión o reducir flujo');
        }

        // Verificar contra velocidad de arrastre
        if (systemData.processData && systemData.processData.pulpType && systemData.processData.consistency_percent) {
            const Vw = calculateDragVelocity(
                systemData.processData.pulpType,
                systemData.processData.consistency_percent,
                systemData.suction.D_mm / 1000
            );

            if (velocity > Vw * 0.95) {
                result.warnings.push(`Velocidad (${velocity.toFixed(2)} m/s) cerca de velocidad de arrastre (${Vw.toFixed(2)} m/s)`);
                result.recommendations.push('Considere operar a menor velocidad para evitar problemas de flujo');
            }

            if (velocity < Vw * 0.3) {
                result.warnings.push(`Velocidad (${velocity.toFixed(2)} m/s) en región de flujo de red de fibra (alta pérdida)`);
                result.recommendations.push('Considere aumentar velocidad para mejorar eficiencia');
            }
        }
    }

    // 3. Validar longitud de tubería vs accesorios
    if (systemData.suction && systemData.suction.length_m && systemData.suction.fittings) {
        const Leq = calculateEquivalentLength(systemData.suction.fittings, systemData.suction.D_mm);
        const L_total = systemData.suction.length_m + Leq;

        if (Leq > systemData.suction.length_m) {
            result.warnings.push(`Longitud equivalente de accesorios (${Leq.toFixed(2)} m) mayor que longitud de tubería (${systemData.suction.length_m.toFixed(2)} m) en succión`);
            result.recommendations.push('Considere reducir número de accesorios en succión o usar accesorios de menor pérdida');
        }
    }

    // 4. Validar relación de diámetros en reducciones
    if (systemData.suction && systemData.suction.fittings) {
        const reductions = systemData.suction.fittings.filter(f => f.type && f.type.includes('reduction'));

        reductions.forEach(reduction => {
            if (reduction.D1 && reduction.D2 && reduction.D2 < reduction.D1 * 0.5) {
                result.warnings.push(`Reducción abrupta detectada (${reduction.D1}mm → ${reduction.D2}mm)`);
                result.recommendations.push('Considere usar reducciones más graduales (D2 ≥ 0.5 × D1)');
            }
        });
    }

    // 5. Validar capacidad de bomba
    if (systemData.pump && systemData.pump.curve_points && systemData.pump.flow_L_s) {
        const curveFlows = systemData.pump.curve_points.map(p => p.flow);
        const minFlow = Math.min(...curveFlows);
        const maxFlow = Math.max(...curveFlows);

        if (systemData.pump.flow_L_s < minFlow * 0.7) {
            result.warnings.push(`Flujo de operación (${systemData.pump.flow_L_s.toFixed(2)} L/s) muy por debajo del mínimo de la curva (${minFlow.toFixed(2)} L/s)`);
            result.recommendations.push('Considere recircularización o seleccionar bomba más pequeña');
        }

        if (systemData.pump.flow_L_s > maxFlow * 1.1) {
            result.warnings.push(`Flujo de operación (${systemData.pump.flow_L_s.toFixed(2)} L/s) muy por encima del máximo de la curva (${maxFlow.toFixed(2)} L/s)`);
            result.recommendations.push('Considere seleccionar bomba más grande o usar bombas en paralelo');
        }
    }

    return result;
}

// ===== FORMATEO DE ERRORES =====

/**
 * Formatear errores para mostrar en UI
 * @param {Object} validationResult - Resultado de validación
 * @returns {Array} Array de errores formateados
 */
function formatValidationErrors(validationResult) {
    const errors = [];

    for (const field in validationResult.errors) {
        const fieldErrors = validationResult.errors[field];
        fieldErrors.forEach(error => {
            errors.push({
                field,
                message: error,
                type: 'error'
            });
        });
    }

    for (const field in validationResult.warnings) {
        const fieldWarnings = validationResult.warnings[field];
        fieldWarnings.forEach(warning => {
            errors.push({
                field,
                message: warning,
                type: 'warning'
            });
        });
    }

    return errors;
}

/**
 * Mostrar errores en un contenedor de UI
 * @param {Array} errors - Array de errores formateados
 * @param {HTMLElement} container - Contenedor donde mostrar errores
 */
function displayValidationErrors(errors, container) {
    container.innerHTML = '';

    if (errors.length === 0) {
        return;
    }

    errors.forEach(error => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${error.type === 'error' ? 'error' : 'warning'}`;

        const icon = error.type === 'error' ? '⚠' : '⚡';

        alertDiv.innerHTML = `
            <span class="alert-icon">${icon}</span>
            <div class="alert-content">
                <div class="alert-title">${error.type === 'error' ? 'Error' : 'Advertencia'}: ${error.field}</div>
                <div class="alert-message">${error.message}</div>
            </div>
        `;

        container.appendChild(alertDiv);
    });
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.Validator = {
        validateValue,
        validateFields,
        validateProcessData,
        validatePipeData,
        validatePumpData,
        validatePumpCurve,
        validateOperatingConditions,
        validateSystemIntegrity,
        validatePipeVelocity,
        validateSystemVelocities,
        formatValidationErrors,
        displayValidationErrors
    };
    window.VELOCITY_LIMITS = VELOCITY_LIMITS;
}
