/**
 * GESTIÓN DE ESTADO - P2603 SW-K60
 * Estado centralizado de la aplicación
 */

// ===== ESTADO INICIAL =====

const INITIAL_STATE = {
    // Paso actual (1-7)
    currentStep: 1,

    // Datos del proceso (Paso 1)
    process: {
        pulpType: '',           // Sin tipo seleccionado por defecto
        consistency: 0,         // Iniciar en 0
        temperature: 0,         // Iniciar en 0
        flow: 0,                // NUEVO: Flujo de operación (L/s) - del balance de planta
        pH: 7.0,
        SR_degrees: 0,
        air_content: 0
    },


    // Tubería de succión (Paso 2)
    suction: {
        norm: 'ANSI_B36_10',
        nominal: '6',
        schedule: '40',
        length: 10,
        roughness: 0.045,
        fittings: []
    },

    // Tubería de descarga (Paso 3)
    discharge: {
        norm: 'ANSI_B36_10',
        nominal: '4',
        schedule: '40',
        length: 50,
        roughness: 0.045,
        fittings: []
    },

    // Datos de bomba (Paso 4)
    pump: {
        manufacturer: '',
        model: '',
        type: 'Centrífuga',
        serial_number: '',
        impeller_diameter: 300,
        rpm: 1750,
        flow: 150,
        curve_points: [
            { flow: 0, TDH: 45, NPSHr: 2.5, efficiency: 0 },
            { flow: 75, TDH: 42, NPSHr: 2.8, efficiency: 65 },
            { flow: 150, TDH: 38, NPSHr: 3.2, efficiency: 78 },
            { flow: 225, TDH: 32, NPSHr: 4.0, efficiency: 75 },
            { flow: 300, TDH: 22, NPSHr: 5.5, efficiency: 60 }
        ]
    },

    // Condiciones de operación (Paso 6)
    operatingConditions: {
        tank_pressure_suction: 0,        // bar manométrico
        elevation_suction: -2,           // m (positivo = por encima de bomba)
        tank_pressure_discharge: 2,      // bar manométrico
        elevation_discharge: 15,         // m
        system_type: 'open'              // open, closed, pressurized
    },

    // Resultados del cálculo
    results: null,

    // Historial de cambios
    history: [],

    // Estado de validación
    validation: {
        step1: { valid: false, errors: {}, warnings: {} },
        step2: { valid: false, errors: {}, warnings: {} },
        step3: { valid: false, errors: {}, warnings: {} },
        step4: { valid: false, errors: {}, warnings: {} },
        step5: { valid: false, errors: {}, warnings: {} },
        step6: { valid: false, errors: {}, warnings: {} }
    },

    // Configuración
    config: {
        autoSave: true,
        useAirCorrection: true,
        language: 'es',
        units: {
            pressure: 'kPa',
            flow: 'm3_h',  // Opciones: 'm3_h', 'gpm', 'L_s'
            head: 'm',
            power: 'kW'
        }
    }
};

// ===== CLASE DE GESTIÓN DE ESTADO =====

class StateManager {
    constructor(initialState = INITIAL_STATE) {
        this.state = this.deepCopy(initialState);
        this.listeners = [];
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
    }

    /**
     * Copia profunda de objeto
     */
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Obtener estado completo
     */
    getState() {
        return this.deepCopy(this.state);
    }

    /**
     * Obtener valor anidado
     */
    get(path) {
        const keys = path.split('.');
        let value = this.state;

        for (const key of keys) {
            if (value && value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return typeof value === 'object' ? this.deepCopy(value) : value;
    }

    /**
     * Actualizar valor anidado
     */
    set(path, value) {
        // Guardar estado actual en historial antes de cambiar
        this.saveToHistory();

        const keys = path.split('.');
        let obj = this.state;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) {
                obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = value;

        // Notificar cambios
        this.notifyListeners(path, value);

        // Auto-guardado
        if (this.state.config.autoSave) {
            this.saveToLocalStorage();
        }
    }

    /**
     * Actualizar múltiples valores
     */
    setMultiple(updates) {
        this.saveToHistory();

        for (const [path, value] of Object.entries(updates)) {
            const keys = path.split('.');
            let obj = this.state;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) {
                    obj[keys[i]] = {};
                }
                obj = obj[keys[i]];
            }

            obj[keys[keys.length - 1]] = value;
        }

        // Notificar cambios
        this.notifyListeners('batch', updates);

        // Auto-guardado
        if (this.state.config.autoSave) {
            this.saveToLocalStorage();
        }
    }

    /**
     * Actualizar estado de paso completo
     */
    setStep(step, data) {
        this.saveToHistory();
        this.state.currentStep = step;
        this.state[`step${step}`] = { ...this.state[`step${step}`], ...data };
        this.notifyListeners('step', { step, data });

        if (this.state.config.autoSave) {
            this.saveToLocalStorage();
        }
    }

    /**
     * Avanzar al siguiente paso
     */
    nextStep() {
        if (this.state.currentStep < 7) {
            this.set('currentStep', this.state.currentStep + 1);
            this.notifyListeners('stepChanged', this.state.currentStep);
        }
    }

    /**
     * Retroceder al paso anterior
     */
    previousStep() {
        if (this.state.currentStep > 1) {
            this.set('currentStep', this.state.currentStep - 1);
            this.notifyListeners('stepChanged', this.state.currentStep);
        }
    }

    /**
     * Ir a paso específico
     */
    goToStep(step) {
        if (step >= 1 && step <= 7) {
            this.set('currentStep', step);
            this.notifyListeners('stepChanged', this.state.currentStep);
        }
    }

    /**
     * Agregar accesorio
     */
    addFitting(section, fitting) {
        const fittings = this.get(`${section}.fittings`) || [];
        fitting.id = Date.now().toString();
        fittings.push(fitting);
        this.set(`${section}.fittings`, fittings);
    }

    /**
     * Eliminar accesorio
     */
    removeFitting(section, fittingId) {
        const fittings = this.get(`${section}.fittings`) || [];
        const updated = fittings.filter(f => f.id !== fittingId);
        this.set(`${section}.fittings`, updated);
    }

    /**
     * Agregar punto de curva
     */
    addCurvePoint(point) {
        const curve = this.get('pump.curve_points') || [];
        point.id = Date.now().toString();
        curve.push(point);
        // Ordenar por flujo
        curve.sort((a, b) => a.flow - b.flow);
        this.set('pump.curve_points', curve);
    }

    /**
     * Eliminar punto de curva
     */
    removeCurvePoint(pointId) {
        const curve = this.get('pump.curve_points') || [];
        const updated = curve.filter(p => p.id !== pointId);
        this.set('pump.curve_points', updated);
    }

    /**
     * Eliminar todos los puntos de la curva
     */
    clearAllCurvePoints() {
        this.set('pump.curve_points', []);
    }

    /**
     * Guardar resultado de cálculo
     */
    setResults(results) {
        this.set('results', results);
    }

    /**
     * Actualizar estado de validación
     */
    setValidation(step, validation) {
        this.set(`validation.step${step}`, validation);
    }

    /**
     * Suscribir a cambios
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notificar a todos los listeners
     */
    notifyListeners(path, value) {
        this.listeners.forEach(listener => {
            try {
                listener(path, value, this.getState());
            } catch (error) {
                console.error('Error en listener:', error);
            }
        });
    }

    /**
     * Guardar en historial
     */
    saveToHistory() {
        // Eliminar historial futuro si estamos en medio
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        // Agregar estado actual
        this.history.push(this.deepCopy(this.state));

        // Limitar tamaño del historial
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    /**
     * Deshacer último cambio
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.state = this.deepCopy(this.history[this.historyIndex]);
            this.notifyListeners('undo', this.getState());
            return true;
        }
        return false;
    }

    /**
     * Rehacer último cambio deshecho
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.state = this.deepCopy(this.history[this.historyIndex]);
            this.notifyListeners('redo', this.getState());
            return true;
        }
        return false;
    }

    /**
     * Reiniciar estado
     */
    reset() {
        this.state = this.deepCopy(INITIAL_STATE);
        this.history = [];
        this.historyIndex = -1;
        this.notifyListeners('reset', this.getState());
        this.clearLocalStorage();
    }

    /**
     * Guardar en localStorage
     */
    saveToLocalStorage() {
        try {
            const dataToSave = {
                state: this.state,
                timestamp: Date.now()
            };
            localStorage.setItem('sw-k60-state', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error guardando en localStorage:', error);
        }
    }

    /**
     * Cargar desde localStorage
     */
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('sw-k60-state');
            if (saved) {
                const data = JSON.parse(saved);
                // Verificar que no sea muy antiguo (más de 7 días)
                const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (data.timestamp > weekAgo) {
                    this.state = { ...INITIAL_STATE, ...data.state };
                    this.notifyListeners('loaded', this.getState());
                    return true;
                }
            }
        } catch (error) {
            console.error('Error cargando desde localStorage:', error);
        }
        return false;
    }

    /**
     * Limpiar localStorage
     */
    clearLocalStorage() {
        try {
            localStorage.removeItem('sw-k60-state');
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
        }
    }

    /**
     * Exportar estado
     */
    export() {
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            state: this.getState()
        };
    }

    /**
     * Importar estado
     */
    import(data) {
        if (data && data.state) {
            this.state = { ...INITIAL_STATE, ...data.state };
            this.notifyListeners('imported', this.getState());
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    /**
     * Obtener progreso
     */
    getProgress() {
        const completedSteps = this.state.currentStep - 1;
        const totalSteps = 7;
        return {
            step: this.state.currentStep,
            completed: completedSteps,
            total: totalSteps,
            percentage: Math.round((completedSteps / totalSteps) * 100)
        };
    }

    /**
     * Verificar si paso está completo
     */
    isStepComplete(step) {
        return this.state.validation[`step${step}`]?.valid || false;
    }

    /**
     * Obtener datos para resumen
     */
    getSummary() {
        return {
            currentStep: this.state.currentStep,
            pulpType: this.state.process.pulpType,
            pulpName: getPulpData(this.state.process.pulpType)?.name || 'N/A',
            consistency: this.state.process.consistency,
            flow: this.state.process.flow,
            suctionDiameter: this.state.suction.nominal,
            dischargeDiameter: this.state.discharge.nominal
        };
    }

    /**
     * Obtener etiqueta de unidad de flujo para mostrar
     */
    getFlowUnitLabel() {
        const unit = this.state.config.units.flow;
        const labels = {
            'L_s': 'L/s',
            'm3_h': 'm³/h',
            'gpm': 'GPM'
        };
        return labels[unit] || 'm³/h';
    }

    /**
     * Obtener unidad de flujo actual
     */
    getFlowUnit() {
        return this.state.config.units.flow || 'm3_h';
    }

    /**
     * Establecer unidad de flujo
     */
    setFlowUnit(unit) {
        if (['L_s', 'm3_h', 'gpm'].includes(unit)) {
            this.set('config.units.flow', unit);
            return true;
        }
        return false;
    }

    /**
     * Convertir flujo desde unidad actual a L/s (para cálculos)
     */
    flowTo_L_s(value) {
        const unit = this.getFlowUnit();
        return flowUnit_to_L_s(value, unit);
    }

    /**
     * Convertir flujo desde L/s a unidad actual (para mostrar)
     */
    L_sToFlow(value_L_s) {
        const unit = this.getFlowUnit();
        return L_s_to_flowUnit(value_L_s, unit);
    }
}

// ===== INSTANCIA GLOBAL =====

// Crear instancia global del gestor de estado
const stateManager = new StateManager();

// Alias para acceso más corto
const State = stateManager;
const appState = stateManager;

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.State = stateManager;
    window.appState = stateManager;
}
