/**
 * BASE DE DATOS DE ACCESORIOS - P2603 SW-K60
 * Coeficientes K y longitudes equivalentes L/D para pérdidas menores
 */

const FITTINGS_DATABASE = {
    // CODOS
    elbows: {
        "90_std": {
            name: "Codo 90° Estándar",
            category: "Codos",
            L_D: 30,
            K_typical: 0.9,
            description: "Codo de radio estándar (R/D = 1)"
        },
        "90_long": {
            name: "Codo 90° Radio Largo",
            category: "Codos",
            L_D: 20,
            K_typical: 0.6,
            description: "Codo de radio largo (R/D = 1.5)"
        },
        "90_short": {
            name: "Codo 90° Radio Corto",
            category: "Codos",
            L_D: 50,
            K_typical: 1.3,
            description: "Codo de radio corto (R/D < 1)"
        },
        "45_std": {
            name: "Codo 45°",
            category: "Codos",
            L_D: 16,
            K_typical: 0.4,
            description: "Codo de 45 grados"
        },
        "90_miter": {
            name: "Codo 90° a 45° (Miter)",
            category: "Codos",
            L_D: 60,
            K_typical: 1.2,
            description: "Codo miter de 90 con un corte a 45°"
        },
        "return_180": {
            name: "Retorno 180°",
            category: "Codos",
            L_D: 50,
            K_typical: 1.5,
            description: "Codo de retorno de 180 grados"
        }
    },

    // TES (TEES)
    tees: {
        "tee_run": {
            name: "Tee Flujo Recto",
            category: "Tees",
            L_D: 20,
            K_typical: 0.4,
            description: "Flujo a través de la rama principal"
        },
        "tee_branch_90": {
            name: "Tee Flujo Lateral 90°",
            category: "Tees",
            L_D: 60,
            K_typical: 1.0,
            description: "Flujo desde la rama principal a la lateral (90°)"
        },
        "tee_branch_angle": {
            name: "Tee Flujo Lateral (Ángulo)",
            category: "Tees",
            L_D: 45,
            K_typical: 0.8,
            description: "Tee con ángulo diferente a 90°"
        },
        "tee_diverging": {
            name: "Tee Divergente",
            category: "Tees",
            L_D: 70,
            K_typical: 1.2,
            description: "Flujo que se divide en dos direcciones"
        }
    },

    // REDUCCIONES
    reductions: {
        "sudden_contraction": {
            name: "Contracción Súbita",
            category: "Reducciones",
            L_D: 0,
            K_variable: true,
            K_formula: "0.5 * (1 - (D2/D1)^2)",
            description: "Contracción súbita de diámetro"
        },
        "sudden_expansion": {
            name: "Expansión Súbita",
            category: "Reducciones",
            L_D: 0,
            K_variable: true,
            K_formula: "(1 - (D1/D2)^2)^2",
            description: "Expansión súbita de diámetro"
        },
        "concentric_gradual": {
            name: "Reducción Concéntrica Gradual",
            category: "Reducciones",
            L_D: 10,
            K_variable: true,
            K_typical: 0.3,
            description: "Reducción concéntrica con ángulo ≤ 30°"
        },
        "eccentric_gradual": {
            name: "Reducción Excéntrica Gradual",
            category: "Reducciones",
            L_D: 10,
            K_variable: true,
            K_typical: 0.35,
            description: "Reducción excéntrica con ángulo ≤ 30°"
        }
    },

    // VÁLVULAS
    valves: {
        "gate_full": {
            name: "Válvula de Compuerta 100% Abierta",
            category: "Válvulas",
            L_D: 8,
            K_typical: 0.15,
            description: "Válvula de compuerta completamente abierta"
        },
        "gate_75": {
            name: "Válvula de Compuerta 75% Abierta",
            category: "Válvulas",
            L_D: 35,
            K_typical: 0.26,
            description: "Válvula de compuerta 75% abierta"
        },
        "gate_50": {
            name: "Válvula de Compuerta 50% Abierta",
            category: "Válvulas",
            L_D: 160,
            K_typical: 2.1,
            description: "Válvula de compuerta 50% abierta"
        },
        "gate_25": {
            name: "Válvula de Compuerta 25% Abierta",
            category: "Válvulas",
            L_D: 900,
            K_typical: 17,
            description: "Válvula de compuerta 25% abierta"
        },
        "globe_full": {
            name: "Válvula de Globo 100% Abierta",
            category: "Válvulas",
            L_D: 340,
            K_typical: 4.0,
            description: "Válvula de globo completamente abierta"
        },
        "angle_full": {
            name: "Válvula de Ángulo 100% Abierta",
            category: "Válvulas",
            L_D: 150,
            K_typical: 2.0,
            description: "Válvula de ángulo completamente abierta"
        },
        "butterfly_2_8": {
            name: "Válvula Mariposa (2\" a 8\")",
            category: "Válvulas",
            L_D: 45,
            K_typical: 0.5,
            description: "Válvula mariposa 2 a 8 pulgadas"
        },
        "butterfly_10_14": {
            name: "Válvula Mariposa (10\" a 14\")",
            category: "Válvulas",
            L_D: 35,
            K_typical: 0.4,
            description: "Válvula mariposa 10 a 14 pulgadas"
        },
        "butterfly_16_24": {
            name: "Válvula Mariposa (16\" a 24\")",
            category: "Válvulas",
            L_D: 25,
            K_typical: 0.3,
            description: "Válvula mariposa 16 a 24 pulgadas"
        },
        "check_swing": {
            name: "Válvula Check (Swing)",
            category: "Válvulas",
            L_D: 100,
            K_typical: 1.5,
            description: "Válvula check tipo swing"
        },
        "check_ball": {
            name: "Válvula Check (Bola)",
            category: "Válvulas",
            L_D: 150,
            K_typical: 2.0,
            description: "Válvula check tipo bola"
        },
        "check_lift": {
            name: "Válvula Check (Levante)",
            category: "Válvulas",
            L_D: 600,
            K_typical: 8.0,
            description: "Válvula check tipo levante"
        },
        "plug_full": {
            name: "Válvula de Tapón 100% Abierta",
            category: "Válvulas",
            L_D: 18,
            K_typical: 0.4,
            description: "Válvula de tapón completamente abierta"
        },
        "ball_full": {
            name: "Válvula de Bola 100% Abierta",
            category: "Válvulas",
            L_D: 3,
            K_typical: 0.05,
            description: "Válvula de bola completamente abierta"
        },
        "diaphragm": {
            name: "Válvula de Diafragma",
            category: "Válvulas",
            L_D: 120,
            K_typical: 2.0,
            description: "Válvula de diafragma tipo Saunders"
        },
        "needle": {
            name: "Válvula de Aguja",
            category: "Válvulas",
            L_D: 400,
            K_typical: 6.0,
            description: "Válvula de aguja para control preciso"
        },
        "pinch": {
            name: "Válvula de Pinzamiento",
            category: "Válvulas",
            L_D: 50,
            K_typical: 0.8,
            description: "Válvula de pinzamiento (pinch valve)"
        },
        "foot_valve": {
            name: "Válvula de Pie",
            category: "Válvulas",
            L_D: 420,
            K_typical: 5.0,
            description: "Válvula de pie con filtro"
        },
        "foot_valve_hinged": {
            name: "Válvula de Pie (Bisagra)",
            category: "Válvulas",
            L_D: 75,
            K_typical: 1.2,
            description: "Válvula de pie tipo bisagra"
        },
        "sluice": {
            name: "Válvula de Compuerta (Sluice)",
            category: "Válvulas",
            L_D: 10,
            K_typical: 0.2,
            description: "Válvula tipo compuerta para servicios pesados"
        },
        "knife_gate": {
            name: "Válvula Guillotina",
            category: "Válvulas",
            L_D: 12,
            K_typical: 0.25,
            description: "Válvula guillotina para pulpa y lodos"
        }
    },

    // ENTRADAS Y SALIDAS
    entries_exits: {
        "tank_sharp": {
            name: "Entrada de Tanque (Borde Agudo)",
            category: "Entradas",
            L_D: 0,
            K_typical: 0.5,
            description: "Entrada desde tanque con borde agudo"
        },
        "tank_rounded": {
            name: "Entrada de Tanque (Borde Redondeado)",
            category: "Entradas",
            L_D: 0,
            K_typical: 0.04,
            description: "Entrada desde tanque con borde redondeado"
        },
        "tank_projecting": {
            name: "Entrada de Tanque (Tubo Proyectado)",
            category: "Entradas",
            L_D: 0,
            K_typical: 0.8,
            description: "Entrada desde tanque con tubo proyectado hacia dentro"
        },
        "tank_bellmouth": {
            name: "Entrada de Tanque (Bocina)",
            category: "Entradas",
            L_D: 0,
            K_typical: 0.05,
            description: "Entrada tipo bocina (bellmouth)"
        },
        "exit_sharp": {
            name: "Salida de Tanque",
            category: "Salidas",
            L_D: 0,
            K_typical: 1.0,
            description: "Salida hacia tanque (pérdida completa de velocidad)"
        },
        "exit_diffuser": {
            name: "Salida con Difusor",
            category: "Salidas",
            L_D: 0,
            K_typical: 0.5,
            description: "Salida con difusor gradual"
        }
    },

    // FILTROS Y COLADORES
    filters: {
        "strainer_basket": {
            name: "Colador de Canasta",
            category: "Filtros",
            L_D: 300,
            K_typical: 4.0,
            description: "Colador tipo canasta (basket strainer)"
        },
        "strainer_t": {
            name: "Colador Tipo T",
            category: "Filtros",
            L_D: 400,
            K_typical: 5.0,
            description: "Colador tipo T (T-strainer)"
        },
        "strainer_y": {
            name: "Colador Tipo Y",
            category: "Filtros",
            L_D: 350,
            K_typical: 4.5,
            description: "Colador tipo Y (Y-strainer)"
        },
        "duplex_strainer": {
            name: "Colador Dúplex",
            category: "Filtros",
            L_D: 500,
            K_typical: 6.0,
            description: "Colador dúplex para limpieza en línea"
        }
    },

    // ACCESORIOS ESPECIALES PARA PULPA
    pulp_special: {
        "blowoff_valve": {
            name: "Válvula de Purga",
            category: "Pulpa y Papel",
            L_D: 100,
            K_typical: 1.5,
            description: "Válvula de purga para líneas de pulpa"
        },
        "dilution_connection": {
            name: "Conexión de Dilución",
            category: "Pulpa y Papel",
            L_D: 50,
            K_typical: 0.8,
            description: "Conexión para inyección de diluyente"
        },
        "sample_cock": {
            name: "Llave de Muestreo",
            category: "Pulpa y Papel",
            L_D: 30,
            K_typical: 0.5,
            description: "Llave para toma de muestras de pulpa"
        },
        "stock_line_valve": {
            name: "Válvula de Línea de Pulpa",
            category: "Pulpa y Papel",
            L_D: 80,
            K_typical: 1.2,
            description: "Válvula especial para líneas de pulpa"
        },
        "refiner_discharge": {
            name: "Descarga de Refinador",
            category: "Pulpa y Papel",
            L_D: 120,
            K_typical: 2.0,
            description: "Conexión de descarga de refinador de pulpa"
        }
    }
};

// Función para obtener accesorio por ID
function getFitting(id) {
    // Buscar en todas las categorías
    for (const category in FITTINGS_DATABASE) {
        for (const fittingId in FITTINGS_DATABASE[category]) {
            if (fittingId === id) {
                return {
                    id: fittingId,
                    ...FITTINGS_DATABASE[category][fittingId]
                };
            }
        }
    }
    return null;
}

// Función para obtener accesorios por categoría
function getFittingsByCategory(categoryName) {
    const results = [];
    for (const category in FITTINGS_DATABASE) {
        for (const fittingId in FITTINGS_DATABASE[category]) {
            const fitting = FITTINGS_DATABASE[category][fittingId];
            if (fitting.category === categoryName) {
                results.push({
                    id: fittingId,
                    ...fitting
                });
            }
        }
    }
    return results;
}

// Función para obtener todas las categorías
function getAllCategories() {
    const categories = new Set();
    for (const category in FITTINGS_DATABASE) {
        for (const fittingId in FITTINGS_DATABASE[category]) {
            categories.add(FITTINGS_DATABASE[category][fittingId].category);
        }
    }
    return Array.from(categories).sort();
}

// Función para calcular K basado en L/D
function calculateKfromLD(L_D, f = 0.02) {
    // K = f * (L/D)
    // Si no se proporciona f, usar valor típico de 0.02
    return f * L_D;
}

// Función para calcular longitud equivalente
function calculateEquivalentLength(K, D_mm, f = 0.02) {
    // Le = K * D / f
    const D_m = D_mm / 1000;
    return (K * D_m) / f; // metros
}

// Función para obtener K de accesorio (considerando si es variable)
function getFittingK(fittingId, D1_mm = null, D2_mm = null) {
    const fitting = getFitting(fittingId);
    if (!fitting) return null;

    if (fitting.K_variable && fitting.K_formula) {
        // Para accesorios con K variable, calcular basado en fórmula
        if (D1_mm && D2_mm) {
            const d1 = D1_mm;
            const d2 = D2_mm;
            const ratio = d2 / d1;

            if (fittingId.includes("contraction")) {
                // Contracción súbita: 0.5 * (1 - (D2/D1)^2)
                return 0.5 * (1 - ratio * ratio);
            } else if (fittingId.includes("expansion")) {
                // Expansión súbita: (1 - (D1/D2)^2)
                // CORREGIDO: Se eliminó el exponente 2 exterior según Crane TP-410
                return 1 - Math.pow(d1 / d2, 2);
            }
        }
        return fitting.K_typical || 0.5;
    }

    return fitting.K_typical || fitting.L_D * 0.02;
}

// Función para formatear lista de accesorios para select
function getFittingsSelectOptions(category = null) {
    let fittings = [];

    if (category) {
        fittings = getFittingsByCategory(category);
    } else {
        // Obtener todos los accesorios
        for (const cat in FITTINGS_DATABASE) {
            for (const fittingId in FITTINGS_DATABASE[cat]) {
                fittings.push({
                    id: fittingId,
                    ...FITTINGS_DATABASE[cat][fittingId]
                });
            }
        }
    }

    // Agrupar por categoría para optgroup
    const grouped = {};
    fittings.forEach(f => {
        if (!grouped[f.category]) {
            grouped[f.category] = [];
        }
        grouped[f.category].push(f);
    });

    return grouped;
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.getFitting = getFitting;
    window.getFittingsByCategory = getFittingsByCategory;
    window.getAllCategories = getAllCategories;
    window.calculateKfromLD = calculateKfromLD;
    window.calculateEquivalentLength = calculateEquivalentLength;
    window.getFittingK = getFittingK;
    window.getFittingsSelectOptions = getFittingsSelectOptions;
    window.FITTINGS_DATABASE = FITTINGS_DATABASE;
}
