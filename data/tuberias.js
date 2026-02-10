/**
 * BASE DE DATOS DE TUBERÍAS - P2603 SW-K60
 * Normas: ANSI B36.10, ANSI B36.19, DIN, BPE, 3A
 * Materiales: Acero al carbón, Acero inoxidable, PVC
 */

const PIPE_DATABASE = {
    // Normas ANSI B36.10 (Acero al carbón)
    ANSI_B36_10: {
        name: "ANSI B36.10",
        description: "Acero al carbón",
        material: "Carbon Steel",
        schedules: [10, 20, 30, 40, 60, 80, 100, 120, 140, 160, "STD", "XS", "XXS"],
        pipes: [
            { nominal: "1/4", OD_mm: 13.72, schedule40: { wall_mm: 2.24, ID_mm: 9.24, weight_kg_m: 0.63 }, schedule80: { wall_mm: 3.02, ID_mm: 7.68, weight_kg_m: 0.80 } },
            { nominal: "3/8", OD_mm: 17.15, schedule40: { wall_mm: 2.31, ID_mm: 12.52, weight_kg_m: 0.84 }, schedule80: { wall_mm: 3.20, ID_mm: 10.74, weight_kg_m: 1.10 } },
            { nominal: "1/2", OD_mm: 21.34, schedule40: { wall_mm: 2.77, ID_mm: 15.80, weight_kg_m: 1.27 }, schedule80: { wall_mm: 3.73, ID_mm: 13.88, weight_kg_m: 1.62 } },
            { nominal: "3/4", OD_mm: 26.67, schedule40: { wall_mm: 2.87, ID_mm: 20.93, weight_kg_m: 1.69 }, schedule80: { wall_mm: 3.91, ID_mm: 18.85, weight_kg_m: 2.20 } },
            { nominal: "1", OD_mm: 33.40, schedule40: { wall_mm: 3.38, ID_mm: 26.64, weight_kg_m: 2.50 }, schedule80: { wall_mm: 4.55, ID_mm: 24.30, weight_kg_m: 3.24 } },
            { nominal: "1.25", OD_mm: 42.16, schedule40: { wall_mm: 3.56, ID_mm: 35.04, weight_kg_m: 3.39 }, schedule80: { wall_mm: 4.85, ID_mm: 32.46, weight_kg_m: 4.47 } },
            { nominal: "1.5", OD_mm: 48.26, schedule40: { wall_mm: 3.68, ID_mm: 40.90, weight_kg_m: 4.05 }, schedule80: { wall_mm: 5.08, ID_mm: 38.10, weight_kg_m: 5.41 } },
            { nominal: "2", OD_mm: 60.33, schedule40: { wall_mm: 3.91, ID_mm: 52.50, weight_kg_m: 5.44 }, schedule80: { wall_mm: 5.54, ID_mm: 49.25, weight_kg_m: 7.48 } },
            { nominal: "2.5", OD_mm: 73.03, schedule40: { wall_mm: 5.16, ID_mm: 62.71, weight_kg_m: 8.63 }, schedule80: { wall_mm: 7.01, ID_mm: 59.01, weight_kg_m: 11.41 } },
            { nominal: "3", OD_mm: 88.90, schedule40: { wall_mm: 5.49, ID_mm: 77.92, weight_kg_m: 11.29 }, schedule80: { wall_mm: 7.62, ID_mm: 73.66, weight_kg_m: 15.27 } },
            { nominal: "4", OD_mm: 114.30, schedule40: { wall_mm: 6.02, ID_mm: 102.26, weight_kg_m: 16.07 }, schedule80: { wall_mm: 8.56, ID_mm: 97.18, weight_kg_m: 22.32 } },
            { nominal: "6", OD_mm: 168.28, schedule40: { wall_mm: 7.11, ID_mm: 154.06, weight_kg_m: 28.26 }, schedule80: { wall_mm: 10.97, ID_mm: 146.34, weight_kg_m: 42.55 } },
            { nominal: "8", OD_mm: 219.08, schedule40: { wall_mm: 8.18, ID_mm: 202.72, weight_kg_m: 42.35 }, schedule80: { wall_mm: 12.70, ID_mm: 193.68, weight_kg_m: 64.63 } },
            { nominal: "10", OD_mm: 273.05, schedule40: { wall_mm: 9.27, ID_mm: 254.51, weight_kg_m: 60.31 }, schedule80: { wall_mm: 15.09, ID_mm: 242.87, weight_kg_m: 95.98 } },
            { nominal: "12", OD_mm: 323.85, schedule40: { wall_mm: 9.53, ID_mm: 304.79, weight_kg_m: 73.78 }, schedule80: { wall_mm: 17.48, ID_mm: 288.89, weight_kg_m: 133.38 } },
            { nominal: "14", OD_mm: 355.60, schedule40: { wall_mm: 9.53, ID_mm: 336.54, weight_kg_m: 81.37 }, schedule80: { wall_mm: 19.05, ID_mm: 317.50, weight_kg_m: 158.08 } },
            { nominal: "16", OD_mm: 406.40, schedule40: { wall_mm: 9.53, ID_mm: 387.34, weight_kg_m: 93.45 }, schedule80: { wall_mm: 19.05, ID_mm: 368.30, weight_kg_m: 182.68 } },
            { nominal: "18", OD_mm: 457.20, schedule40: { wall_mm: 9.53, ID_mm: 438.14, weight_kg_m: 105.39 }, schedule80: { wall_mm: 19.05, ID_mm: 419.10, weight_kg_m: 207.24 } },
            { nominal: "20", OD_mm: 508.00, schedule40: { wall_mm: 9.53, ID_mm: 488.94, weight_kg_m: 117.46 }, schedule80: { wall_mm: 19.05, ID_mm: 469.90, weight_kg_m: 231.79 } },
            { nominal: "24", OD_mm: 609.60, schedule40: { wall_mm: 9.53, ID_mm: 590.54, weight_kg_m: 141.73 }, schedule80: { wall_mm: 19.05, ID_mm: 571.50, weight_kg_m: 280.11 } }
        ]
    },

    // Normas ANSI B36.19 (Acero inoxidable)
    ANSI_B36_19: {
        name: "ANSI B36.19",
        description: "Acero inoxidable",
        material: "Stainless Steel",
        schedules: ["5S", "10S", "40S", "80S"],
        pipes: [
            { nominal: "1/4", OD_mm: 13.72, schedule10S: { wall_mm: 1.65, ID_mm: 10.42, weight_kg_m: 0.50 }, schedule40S: { wall_mm: 2.24, ID_mm: 9.24, weight_kg_m: 0.63 }, schedule80S: { wall_mm: 3.02, ID_mm: 7.68, weight_kg_m: 0.80 } },
            { nominal: "3/8", OD_mm: 17.15, schedule10S: { wall_mm: 1.65, ID_mm: 13.85, weight_kg_m: 0.64 }, schedule40S: { wall_mm: 2.31, ID_mm: 12.53, weight_kg_m: 0.84 }, schedule80S: { wall_mm: 3.20, ID_mm: 10.75, weight_kg_m: 1.10 } },
            { nominal: "1/2", OD_mm: 21.34, schedule10S: { wall_mm: 2.11, ID_mm: 17.12, weight_kg_m: 1.00 }, schedule40S: { wall_mm: 2.77, ID_mm: 15.80, weight_kg_m: 1.27 }, schedule80S: { wall_mm: 3.73, ID_mm: 13.88, weight_kg_m: 1.62 } },
            { nominal: "3/4", OD_mm: 26.67, schedule10S: { wall_mm: 2.11, ID_mm: 22.45, weight_kg_m: 1.28 }, schedule40S: { wall_mm: 2.87, ID_mm: 20.93, weight_kg_m: 1.69 }, schedule80S: { wall_mm: 3.91, ID_mm: 18.85, weight_kg_m: 2.20 } },
            { nominal: "1", OD_mm: 33.40, schedule10S: { wall_mm: 2.77, ID_mm: 27.86, weight_kg_m: 2.09 }, schedule40S: { wall_mm: 3.38, ID_mm: 26.64, weight_kg_m: 2.50 }, schedule80S: { wall_mm: 4.55, ID_mm: 24.30, weight_kg_m: 3.24 } },
            { nominal: "1.25", OD_mm: 42.16, schedule10S: { wall_mm: 2.77, ID_mm: 36.62, weight_kg_m: 2.70 }, schedule40S: { wall_mm: 3.56, ID_mm: 35.04, weight_kg_m: 3.39 }, schedule80S: { wall_mm: 4.85, ID_mm: 32.46, weight_kg_m: 4.47 } },
            { nominal: "1.5", OD_mm: 48.26, schedule10S: { wall_mm: 2.77, ID_mm: 42.72, weight_kg_m: 3.11 }, schedule40S: { wall_mm: 3.68, ID_mm: 40.90, weight_kg_m: 4.05 }, schedule80S: { wall_mm: 5.08, ID_mm: 38.10, weight_kg_m: 5.41 } },
            { nominal: "2", OD_mm: 60.33, schedule10S: { wall_mm: 2.77, ID_mm: 54.79, weight_kg_m: 3.93 }, schedule40S: { wall_mm: 3.91, ID_mm: 52.51, weight_kg_m: 5.44 }, schedule80S: { wall_mm: 5.54, ID_mm: 49.25, weight_kg_m: 7.48 } },
            { nominal: "2.5", OD_mm: 73.03, schedule10S: { wall_mm: 3.05, ID_mm: 66.93, weight_kg_m: 5.26 }, schedule40S: { wall_mm: 5.16, ID_mm: 62.71, weight_kg_m: 8.63 }, schedule80S: { wall_mm: 7.01, ID_mm: 59.01, weight_kg_m: 11.41 } },
            { nominal: "3", OD_mm: 88.90, schedule10S: { wall_mm: 3.05, ID_mm: 82.80, weight_kg_m: 6.46 }, schedule40S: { wall_mm: 5.49, ID_mm: 77.92, weight_kg_m: 11.29 }, schedule80S: { wall_mm: 7.62, ID_mm: 73.66, weight_kg_m: 15.27 } },
            { nominal: "4", OD_mm: 114.30, schedule10S: { wall_mm: 3.05, ID_mm: 108.20, weight_kg_m: 8.38 }, schedule40S: { wall_mm: 6.02, ID_mm: 102.26, weight_kg_m: 16.07 }, schedule80S: { wall_mm: 8.56, ID_mm: 97.18, weight_kg_m: 22.32 } },
            { nominal: "6", OD_mm: 168.28, schedule10S: { wall_mm: 3.40, ID_mm: 161.48, weight_kg_m: 13.72 }, schedule40S: { wall_mm: 7.11, ID_mm: 154.06, weight_kg_m: 28.26 }, schedule80S: { wall_mm: 10.97, ID_mm: 146.34, weight_kg_m: 42.55 } },
            { nominal: "8", OD_mm: 219.08, schedule10S: { wall_mm: 3.76, ID_mm: 211.56, weight_kg_m: 19.75 }, schedule40S: { wall_mm: 8.18, ID_mm: 202.72, weight_kg_m: 42.35 }, schedule80S: { wall_mm: 12.70, ID_mm: 193.68, weight_kg_m: 64.63 } },
            { nominal: "10", OD_mm: 273.05, schedule10S: { wall_mm: 4.20, ID_mm: 264.65, weight_kg_m: 27.70 }, schedule40S: { wall_mm: 9.27, ID_mm: 254.51, weight_kg_m: 60.31 }, schedule80S: { wall_mm: 15.09, ID_mm: 242.87, weight_kg_m: 95.98 } },
            { nominal: "12", OD_mm: 323.85, schedule10S: { wall_mm: 4.57, ID_mm: 314.71, weight_kg_m: 35.70 }, schedule40S: { wall_mm: 9.53, ID_mm: 304.79, weight_kg_m: 73.78 }, schedule80S: { wall_mm: 17.48, ID_mm: 288.89, weight_kg_m: 133.38 } },
            { nominal: "14", OD_mm: 355.60, schedule10S: { wall_mm: 4.85, ID_mm: 345.90, weight_kg_m: 41.60 }, schedule40S: { wall_mm: 9.53, ID_mm: 336.54, weight_kg_m: 81.37 }, schedule80S: { wall_mm: 19.05, ID_mm: 317.50, weight_kg_m: 158.08 } },
            { nominal: "16", OD_mm: 406.40, schedule10S: { wall_mm: 4.85, ID_mm: 396.70, weight_kg_m: 47.70 }, schedule40S: { wall_mm: 9.53, ID_mm: 387.34, weight_kg_m: 93.45 }, schedule80S: { wall_mm: 19.05, ID_mm: 368.30, weight_kg_m: 182.68 } },
            { nominal: "18", OD_mm: 457.20, schedule10S: { wall_mm: 5.40, ID_mm: 446.40, weight_kg_m: 59.40 }, schedule40S: { wall_mm: 9.53, ID_mm: 438.14, weight_kg_m: 105.39 }, schedule80S: { wall_mm: 19.05, ID_mm: 419.10, weight_kg_m: 207.24 } },
            { nominal: "20", OD_mm: 508.00, schedule10S: { wall_mm: 5.40, ID_mm: 497.20, weight_kg_m: 66.20 }, schedule40S: { wall_mm: 9.53, ID_mm: 488.94, weight_kg_m: 117.46 }, schedule80S: { wall_mm: 19.05, ID_mm: 469.90, weight_kg_m: 231.79 } },
            { nominal: "24", OD_mm: 609.60, schedule10S: { wall_mm: 5.40, ID_mm: 598.80, weight_kg_m: 79.60 }, schedule40S: { wall_mm: 9.53, ID_mm: 590.54, weight_kg_m: 141.73 }, schedule80S: { wall_mm: 19.05, ID_mm: 571.50, weight_kg_m: 280.11 } }
        ]
    },

    // PVC (Schedule 40)
    PVC_40: {
        name: "PVC Schedule 40",
        description: "PVC Schedule 40",
        material: "PVC",
        schedules: [40],
        pipes: [
            { nominal: "1/2", OD_mm: 21.34, schedule40: { wall_mm: 2.41, ID_mm: 16.52, weight_kg_m: 0.38 } },
            { nominal: "3/4", OD_mm: 26.67, schedule40: { wall_mm: 2.87, ID_mm: 20.93, weight_kg_m: 0.54 } },
            { nominal: "1", OD_mm: 33.40, schedule40: { wall_mm: 3.38, ID_mm: 26.64, weight_kg_m: 0.86 } },
            { nominal: "1.25", OD_mm: 42.16, schedule40: { wall_mm: 3.56, ID_mm: 35.04, weight_kg_m: 1.14 } },
            { nominal: "1.5", OD_mm: 48.26, schedule40: { wall_mm: 3.68, ID_mm: 40.90, weight_kg_m: 1.35 } },
            { nominal: "2", OD_mm: 60.33, schedule40: { wall_mm: 3.91, ID_mm: 52.51, weight_kg_m: 1.79 } },
            { nominal: "2.5", OD_mm: 73.03, schedule40: { wall_mm: 5.16, ID_mm: 62.71, weight_kg_m: 2.93 } },
            { nominal: "3", OD_mm: 88.90, schedule40: { wall_mm: 5.49, ID_mm: 77.92, weight_kg_m: 3.77 } },
            { nominal: "4", OD_mm: 114.30, schedule40: { wall_mm: 6.02, ID_mm: 102.26, weight_kg_m: 5.30 } },
            { nominal: "6", OD_mm: 168.28, schedule40: { wall_mm: 7.11, ID_mm: 154.06, weight_kg_m: 10.25 } },
            { nominal: "8", OD_mm: 219.08, schedule40: { wall_mm: 8.18, ID_mm: 202.72, weight_kg_m: 16.12 } },
            { nominal: "10", OD_mm: 273.05, schedule40: { wall_mm: 9.27, ID_mm: 254.51, weight_kg_m: 24.51 } },
            { nominal: "12", OD_mm: 323.85, schedule40: { wall_mm: 9.53, ID_mm: 304.79, weight_kg_m: 29.84 } }
        ]
    },

    // PVC (Schedule 80)
    PVC_80: {
        name: "PVC Schedule 80",
        description: "PVC Schedule 80",
        material: "PVC",
        schedules: [80],
        pipes: [
            { nominal: "1/2", OD_mm: 21.34, schedule80: { wall_mm: 3.12, ID_mm: 15.10, weight_kg_m: 0.49 } },
            { nominal: "3/4", OD_mm: 26.67, schedule80: { wall_mm: 3.91, ID_mm: 18.85, weight_kg_m: 0.78 } },
            { nominal: "1", OD_mm: 33.40, schedule80: { wall_mm: 4.55, ID_mm: 24.30, weight_kg_m: 1.25 } },
            { nominal: "1.25", OD_mm: 42.16, schedule80: { wall_mm: 4.85, ID_mm: 32.46, weight_kg_m: 1.69 } },
            { nominal: "1.5", OD_mm: 48.26, schedule80: { wall_mm: 5.08, ID_mm: 38.10, weight_kg_m: 2.06 } },
            { nominal: "2", OD_mm: 60.33, schedule80: { wall_mm: 5.54, ID_mm: 49.25, weight_kg_m: 2.77 } },
            { nominal: "2.5", OD_mm: 73.03, schedule80: { wall_mm: 7.01, ID_mm: 59.01, weight_kg_m: 4.43 } },
            { nominal: "3", OD_mm: 88.90, schedule80: { wall_mm: 7.62, ID_mm: 73.66, weight_kg_m: 5.88 } },
            { nominal: "4", OD_mm: 114.30, schedule80: { wall_mm: 8.56, ID_mm: 97.18, weight_kg_m: 8.95 } },
            { nominal: "6", OD_mm: 168.28, schedule80: { wall_mm: 10.97, ID_mm: 146.34, weight_kg_m: 18.65 } },
            { nominal: "8", OD_mm: 219.08, schedule80: { wall_mm: 12.70, ID_mm: 193.68, weight_kg_m: 29.87 } },
            { nominal: "10", OD_mm: 273.05, schedule80: { wall_mm: 15.09, ID_mm: 242.87, weight_kg_m: 46.84 } },
            { nominal: "12", OD_mm: 323.85, schedule80: { wall_mm: 17.48, ID_mm: 288.89, weight_kg_m: 66.12 } }
        ]
    }
};

// Rugosidad de tuberías (mm)
const PIPE_ROUGHNESS = {
    "Carbon Steel": 0.045,
    "Stainless Steel": 0.015,
    "PVC": 0.0015,
    "HDPE": 0.0015,
    "Copper": 0.0015,
    "Cast Iron": 0.26,
    "Concrete": 1.0
};

// Funciones definidas como const para evitar hoisting
const getPipeData = function (norm, nominal, schedule) {
    const normData = PIPE_DATABASE[norm];
    if (!normData) return null;

    const pipe = normData.pipes.find(p => p.nominal === nominal);
    if (!pipe) return null;

    const scheduleKey = `schedule${schedule}`;
    const scheduleData = pipe[scheduleKey];

    if (!scheduleData) return null;

    // Incluir OD_mm del objeto pipe padre en el resultado
    return {
        ...scheduleData,
        OD_mm: pipe.OD_mm,
        nominal: pipe.nominal
    };
};


const getAvailableSizes = function (norm) {
    const normData = PIPE_DATABASE[norm];
    return normData ? normData.pipes.map(p => p.nominal) : [];
};

const getAvailableSchedules = function (norm) {
    const normData = PIPE_DATABASE[norm];
    return normData ? normData.schedules : [];
};

const calculateInternalArea = function (ID_mm) {
    const ID_m = ID_mm / 1000;
    return Math.PI * Math.pow(ID_m / 2, 2); // m²
};

const nominalToInches = function (nominal) {
    const map = {
        "1/4": 0.25, "3/8": 0.375, "1/2": 0.5, "3/4": 0.75,
        "1": 1, "1.25": 1.25, "1.5": 1.5, "2": 2, "2.5": 2.5, "3": 3,
        "4": 4, "6": 6, "8": 8, "10": 10, "12": 12, "14": 14,
        "16": 16, "18": 18, "20": 20, "24": 24
    };
    return map[nominal] || parseFloat(nominal);
};

const formatNominal = function (nominal) {
    const fractionMap = {
        "0.25": "1/4", "0.375": "3/8", "0.5": "1/2", "0.75": "3/4"
    };
    if (fractionMap[nominal]) return fractionMap[nominal];
    return nominal.toString();
};

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.getPipeData = getPipeData;
    window.getAvailableSizes = getAvailableSizes;
    window.getAvailableSchedules = getAvailableSchedules;
    window.calculateInternalArea = calculateInternalArea;
    window.nominalToInches = nominalToInches;
    window.formatNominal = formatNominal;
    window.PIPE_DATABASE = PIPE_DATABASE;
    window.PIPE_ROUGHNESS = PIPE_ROUGHNESS;
}
