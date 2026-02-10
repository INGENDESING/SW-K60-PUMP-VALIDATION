/**
 * CONTROLADORES DE INTERFAZ DE USUARIO - P2603 SW-K60
 * Gestión de UI y navegación
 */

// ===== GESTIÓN DE PASOS =====

const StepManager = {
    currentStep: 1,
    totalSteps: 7,

    init() {
        this.renderStepper();
        this.renderCurrentStep();
        this.updateProgress();
        this.bindEvents();
    },

    renderStepper() {
        const stepperItems = document.querySelectorAll('.stepper-item');
        stepperItems.forEach((item, index) => {
            const step = index + 1;
            if (step < State.get('currentStep')) {
                item.classList.add('completed');
                item.classList.remove('active');
            } else if (step === State.get('currentStep')) {
                item.classList.add('active');
                item.classList.remove('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
    },

    renderCurrentStep() {
        const step = State.get('currentStep');
        const stepForm = document.getElementById('stepForm');

        if (!stepForm) return;

        // Renderizar contenido del paso actual
        const content = this.getStepContent(step);
        stepForm.innerHTML = content;

        // Inicializar componentes del paso
        this.initStepComponents(step);

        // Cargar datos existentes
        this.loadStepData(step);
    },

    getStepContent(step) {
        const templates = {
            1: this.getStep1Template(),
            2: this.getStep2Template('suction'),
            3: this.getStep2Template('discharge'),
            4: this.getStep4Template(),
            5: this.getStep5Template(),
            6: this.getStep6Template(),
            7: this.getStep7Template()
        };

        return templates[step] || '<p>Paso no encontrado</p>';
    },

    /**
     * Genera opciones HTML para el selector de cédula según la norma
     * @param {string} norm - Código de la norma (ej: 'ANSI_B36_10')
     * @param {string} currentSchedule - Cédula actualmente seleccionada
     * @returns {string} HTML con las opciones del select
     */
    getScheduleOptionsForNorm(norm, currentSchedule) {
        // Mapeo de cédulas disponibles por norma
        const schedulesByNorm = {
            'ANSI_B36_10': ['40', '80'],
            'ANSI_B36_19': ['10S', '40S', '80S'],
            'PVC_40': ['40'],
            'PVC_80': ['80']
        };

        const schedules = schedulesByNorm[norm] || ['40', '80'];

        return schedules.map(sch =>
            `<option value="${sch}" ${sch === currentSchedule ? 'selected' : ''}>${sch}</option>`
        ).join('');
    },

    // ===== TEMPLATES DE PASOS =====

    getStep1Template() {
        const pulpTypes = getAllPulpTypes();
        const selectedPulp = State.get('process.pulpType');

        return `
            <div class="step-process fade-in">
                <h2>Datos del Proceso</h2>
                <p class="text-secondary">Ingrese las características de la pulpa y condiciones de operación</p>

                <div class="process-grid">
                    <div class="process-card">
                        <div class="process-card-icon">🌲</div>
                        <h4>Tipo de Pulpa</h4>
                        <div class="form-group">
                            <label class="form-label required">Seleccione el tipo de pulpa</label>
                            <select class="input select" id="pulpType" required>
                                ${pulpTypes.map(p => `
                                    <option value="${p.key}" ${p.key === selectedPulp ? 'selected' : ''}>${p.name}</option>
                                `).join('')}
                            </select>
                            <small class="form-hint">Origen: ${getPulpData(selectedPulp)?.origin || 'N/A'}</small>
                        </div>
                    </div>

                    <div class="process-card">
                        <div class="process-card-icon">💧</div>
                        <h4>Consistencia</h4>
                        <div class="form-group">
                            <label class="form-label required">Consistencia de pulpa</label>
                            <input type="number" class="input" id="consistency"
                                   value="${State.get('process.consistency')}"
                                   min="0.5" max="8.0" step="0.1" required>
                            <small class="form-hint">Rango típico: 1-5%</small>
                        </div>
                    </div>

                    <div class="process-card">
                        <div class="process-card-icon">🌡️</div>
                        <h4>Temperatura</h4>
                        <div class="form-group">
                            <label class="form-label required">Temperatura del fluido</label>
                            <input type="number" class="input" id="temperature"
                                   value="${State.get('process.temperature') || ''}"
                                   min="10" max="90" step="1" required
                                   placeholder="0">
                            <small class="form-hint">Rango: 10-90°C</small>
                        </div>
                    </div>

                    <div class="process-card">
                        <div class="process-card-icon">📊</div>
                        <h4>Flujo de Operación</h4>
                        <div class="form-group">
                            <label class="form-label required">Flujo requerido</label>
                            <div class="input-with-unit">
                                <input type="number" class="input" id="processFlow"
                                       value="${State.get('process.flow') || ''}"
                                       min="0" max="10000" step="0.1" required
                                       placeholder="0">
                                <span class="input-unit">${State.getFlowUnitLabel()}</span>
                            </div>
                            <small class="form-hint">Del balance de materia/energía de la planta</small>
                        </div>
                    </div>
                </div>


                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">pH</label>
                        <input type="number" class="input" id="pH"
                               value="${State.get('process.pH')}"
                               min="4" max="10" step="0.1">
                        <small class="form-hint">Opcional</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Grado de Refinación (°SR)</label>
                        <input type="number" class="input" id="SR_degrees"
                               value="${State.get('process.SR_degrees')}"
                               min="0" max="100" step="1">
                        <small class="form-hint">Opcional</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Contenido de Aire (%)</label>
                        <input type="number" class="input" id="air_content"
                               value="${State.get('process.air_content')}"
                               min="0" max="5" step="0.1">
                        <small class="form-hint">Opcional</small>
                    </div>
                </div>

                <!-- Configuración de Unidades -->
                <div class="card" style="margin-top: var(--space-lg);">
                    <div class="card-header" style="margin-bottom: 0; padding-bottom: var(--space-sm); border-bottom: none;">
                        <h3 style="font-size: var(--text-base); margin: 0; display: flex; align-items: center; gap: var(--space-sm);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 1v6m0 6v6"></path>
                                <path d="m9 9 3-3 3 3"></path>
                            </svg>
                            Unidades de Medida
                        </h3>
                    </div>
                    <div class="form-row" style="margin-bottom: 0;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Unidad de Flujo</label>
                            <select class="input select" id="flowUnit">
                                <option value="m3_h" ${State.get('config.units.flow') === 'm3_h' ? 'selected' : ''}>m³/h (metros cúbicos por hora)</option>
                                <option value="gpm" ${State.get('config.units.flow') === 'gpm' ? 'selected' : ''}>GPM (galones por minuto)</option>
                                <option value="L_s" ${State.get('config.units.flow') === 'L_s' ? 'selected' : ''}>L/s (litros por segundo)</option>
                            </select>
                            <small class="form-hint">Seleccione la unidad para flujo en toda la aplicación</small>
                        </div>
                    </div>
                </div>

                <div id="step1Validation" class="validation-container"></div>
            </div>
        `;
    },

    getStep2Template(section) {
        const isSuction = section === 'suction';
        const title = isSuction ? 'Tubería de Succión' : 'Tubería de Descarga';
        const data = State.get(section);
        const sizes = getAvailableSizes(data.norm);
        const schedules = this.getScheduleOptionsForNorm(data.norm, data.schedule);

        return `
            <div class="pipe-section fade-in">
                <h2>${title}</h2>
                <p class="text-secondary">Especifique las características de la tubería y accesorios</p>

                <div class="pipe-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    Especificaciones de Tubería
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">Norma</label>
                        <select class="input select" id="${section}_norm" required>
                            <option value="ANSI_B36_10" ${data.norm === 'ANSI_B36_10' ? 'selected' : ''}>ANSI B36.10 (Acero al carbón)</option>
                            <option value="ANSI_B36_19" ${data.norm === 'ANSI_B36_19' ? 'selected' : ''}>ANSI B36.19 (Inoxidable)</option>
                            <option value="PVC_40" ${data.norm === 'PVC_40' ? 'selected' : ''}>PVC Schedule 40</option>
                            <option value="PVC_80" ${data.norm === 'PVC_80' ? 'selected' : ''}>PVC Schedule 80</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Diámetro Nominal</label>
                        <select class="input select" id="${section}_nominal" required>
                            ${sizes.map(size => `
                                <option value="${size}" ${size === data.nominal ? 'selected' : ''}>${size}"</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Cédula</label>
                        <select class="input select" id="${section}_schedule" required>
                            ${schedules}
                        </select>
                    </div>
                </div>

                <div class="pipe-dimensions">
                    <div class="dimension-display">
                        <div class="dimension-label">Diámetro Exterior</div>
                        <div class="dimension-value" id="${section}_OD">-</div>
                        <div class="dimension-unit">mm</div>
                    </div>
                    <div class="dimension-display">
                        <div class="dimension-label">Espesor de Pared</div>
                        <div class="dimension-value" id="${section}_wall">-</div>
                        <div class="dimension-unit">mm</div>
                    </div>
                    <div class="dimension-display">
                        <div class="dimension-label">Diámetro Interior</div>
                        <div class="dimension-value" id="${section}_ID">-</div>
                        <div class="dimension-unit">mm</div>
                    </div>
                    <div class="dimension-display">
                        <div class="dimension-label">Área de Flujo</div>
                        <div class="dimension-value" id="${section}_area">-</div>
                        <div class="dimension-unit">cm²</div>
                    </div>
                </div>

                <!-- Sección de Velocidad con Validación -->
                <div class="velocity-section">
                    <div class="velocity-section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2L3 14h9l-1-8"/>
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                        Velocidad de Flujo
                    </div>
                    <div class="velocity-display">
                        <div class="velocity-main">
                            <div class="velocity-label">Velocidad</div>
                            <div class="velocity-value" id="${section}_velocity">-</div>
                            <div class="velocity-unit">m/s</div>
                        </div>
                        <div class="velocity-status" id="${section}_velocityStatus">
                            <span>-</span>
                        </div>
                    </div>
                    <div class="velocity-messages" id="${section}_velocityMessages"></div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label required">Longitud de Tubería</label>
                        <input type="number" class="input" id="${section}_length"
                               value="${data.length}"
                               min="0.5" max="500" step="0.1" required>
                        <small class="form-hint">metros</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Rugosidad Absoluta</label>
                        <input type="number" class="input" id="${section}_roughness"
                               value="${data.roughness}"
                               min="0.001" max="1.0" step="0.001">
                        <small class="form-hint">mm (default según material)</small>
                    </div>
                </div>

                <div class="accessories-section">
                    <div class="accessories-header">
                        <h3>Accesorios</h3>
                        <button class="btn btn-secondary btn-sm" id="${section}_addFitting">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Agregar Accesorio
                        </button>
                    </div>

                    <div class="accessories-table-container">
                        <table class="dynamic-table" id="${section}_fittingsTable">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>L/D</th>
                                    <th>K</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody id="${section}_fittingsList">
                                ${data.fittings && data.fittings.length > 0 ?
                data.fittings.map((f, i) => this.renderFittingRow(section, f, i)).join('') :
                '<tr><td colspan="5" class="text-muted text-center">No hay accesorios agregados</td></tr>'
            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="${section}Validation" class="validation-container"></div>
            </div>
        `;
    },

    renderFittingRow(section, fitting, index) {
        const fittingData = getFitting(fitting.type);
        const name = fittingData ? fittingData.name : fitting.type;
        const L_D = fittingData ? fittingData.L_D : 0;
        const K = fittingData ? fittingData.K_typical : 0;

        return `
            <tr data-fitting-id="${fitting.id || index}">
                <td>${name}</td>
                <td>
                    <input type="number" class="input quantity-input"
                           value="${fitting.quantity || 1}"
                           min="1" max="100" data-fitting-id="${fitting.id || index}">
                </td>
                <td>${L_D}</td>
                <td>${K.toFixed(2)}</td>
                <td>
                    <button class="btn-icon remove-fitting-btn"
                            data-section="${section}"
                            data-fitting-id="${fitting.id || index}"
                            title="Eliminar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    },

    getStep4Template() {
        const pump = State.get('pump');
        // Obtener flujo del proceso (Paso 1)
        const processFlow = State.get('process.flow') || 0;

        // Priorizar flujo del proceso si existe, sino usar el guardado en bomba
        // Nota: Esto asegura que el valor por defecto sea el del proceso
        let flowToUse = processFlow > 0 ? processFlow : (pump.flow || 0);

        // Si ya se ha guardado un flujo específico en la bomba que es diferente al del proceso
        // y diferente al default (150), podríamos querer respetarlo, pero por inconsistencia reportada
        // vamos a forzar la sincronización con el proceso si este está definido.

        // Convertir flujo desde L/s a la unidad seleccionada para mostrar
        const flowDisplay = State.L_sToFlow(flowToUse);

        // Actualizar el estado de la bomba para que coincida (silenciosamente)
        if (processFlow > 0 && pump.flow !== processFlow) {
            // No llamamos a State.set aquí para evitar ciclos de renderizado infinitos si causara reactividad
            // pero el input mostrará el valor correcto
        }

        return `
            <div class="pump-section fade-in">
                <h2>Datos de la Bomba</h2>
                <p class="text-secondary">Especifique las características de la bomba centrífuga</p>

                <div class="pump-info">
                    <div class="pump-specifications">
                        <h3>Especificaciones Generales</h3>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Fabricante</label>
                                <input type="text" class="input" id="pump_manufacturer"
                                       value="${pump.manufacturer}" placeholder="Ej: Goulds, KSB, Sulzer">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Modelo</label>
                                <input type="text" class="input" id="pump_model"
                                       value="${pump.model}" placeholder="Ej: 3196">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Tipo</label>
                                <select class="input select" id="pump_type">
                                    <option value="Centrífuga" ${pump.type === 'Centrífuga' ? 'selected' : ''}>Centrífuga</option>
                                    <option value="Vórtice" ${pump.type === 'Vórtice' ? 'selected' : ''}>Vórtice</option>
                                    <option value="Trizadora" ${pump.type === 'Trizadora' ? 'selected' : ''}>Trizadora</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Número de Serie</label>
                                <input type="text" class="input" id="pump_serial"
                                       value="${pump.serial_number}" placeholder="Opcional">
                            </div>
                        </div>

                        <h3>Parámetros de Operación</h3>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label required">Diámetro del Impulsor</label>
                                <input type="number" class="input" id="pump_impeller"
                                       value="${pump.impeller_diameter}"
                                       min="50" max="1000" step="1" required>
                                <small class="form-hint">mm</small>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Velocidad de Rotación</label>
                                <input type="number" class="input" id="pump_rpm"
                                       value="${pump.rpm}"
                                       min="100" max="6000" step="10" required>
                                <small class="form-hint">RPM</small>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Flujo de Diseño</label>
                                <input type="number" class="input" id="pump_flow"
                                       value="${flowDisplay}"
                                       min="0.1" max="20000" step="0.1" required>
                                <small class="form-hint">${State.getFlowUnitLabel()}</small>
                            </div>
                        </div>
                    </div>

                        <div class="pump-placeholder" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: visible;">
                            <!-- Diagrama Técnico de Bomba Centrífuga (Estilo Goulds 3196) -->
                            <svg width="450" height="280" viewBox="0 0 450 280" fill="none" stroke="currentColor" stroke-width="1.5" style="max-width: 100%; height: auto;">
                                <defs>
                                    <linearGradient id="gouldsTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#00897B;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#004D40;stop-opacity:1" />
                                    </linearGradient>
                                    <linearGradient id="metalGrey" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style="stop-color:#B0BEC5;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#78909C;stop-opacity:1" />
                                    </linearGradient>
                                    <linearGradient id="shaftSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style="stop-color:#CFD8DC;stop-opacity:1" />
                                        <stop offset="50%" style="stop-color:#ECEFF1;stop-opacity:1" />
                                        <stop offset="100%" style="stop-color:#B0BEC5;stop-opacity:1" />
                                    </linearGradient>
                                    <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-primary)" />
                                    </marker>
                                </defs>

                                <!-- BASE / PEDESTAL (Amarillo/Gris seguridad) -->
                                <path d="M40 240 L360 240 L360 260 L40 260 Z" fill="#FDD835" stroke="#F9A825" stroke-width="1"/>
                                <rect x="80" y="260" width="240" height="10" fill="#F9A825" opacity="0.6"/>

                                <!-- CAJA DE RODAMIENTOS (Bearing Frame) -->
                                <path d="M180 140 L320 140 L320 200 L180 200 Z" fill="url(#metalGrey)" stroke="#546E7A"/>
                                <!-- Aletas de enfriamiento -->
                                <line x1="200" y1="140" x2="200" y2="200" stroke="#546E7A" stroke-width="1" opacity="0.5"/>
                                <line x1="220" y1="140" x2="220" y2="200" stroke="#546E7A" stroke-width="1" opacity="0.5"/>
                                <line x1="240" y1="140" x2="240" y2="200" stroke="#546E7A" stroke-width="1" opacity="0.5"/>
                                <line x1="260" y1="140" x2="260" y2="200" stroke="#546E7A" stroke-width="1" opacity="0.5"/>
                                <line x1="280" y1="140" x2="280" y2="200" stroke="#546E7A" stroke-width="1" opacity="0.5"/>
                                <line x1="300" y1="140" x2="300" y2="200" stroke="#546E7A" stroke-width="1" opacity="0.5"/>
                                <!-- Pata de soporte trasera -->
                                <path d="M280 200 L280 240 L300 240 L300 200 Z" fill="url(#metalGrey)" stroke="#546E7A"/>

                                <!-- ADAPTADOR DE MARCO (Frame Adapter) -->
                                <path d="M140 120 L180 140 L180 200 L140 220 Z" fill="url(#metalGrey)" stroke="#546E7A"/>

                                <!-- VOLUTA / CUERPO (Casing) - Azul Goulds -->
                                <path d="M80 100 C 50 100, 40 140, 40 170 C 40 210, 80 230, 110 230 C 140 230, 150 200, 150 170 L 150 120 L 130 120 L 130 60 L 90 60 L 90 100 Z" fill="url(#gouldsTeal)" stroke="#004D40" stroke-width="2"/>
                                <!-- Brida descarga (detalle) -->
                                <rect x="80" y="50" width="60" height="10" fill="#004D40"/>
                                <!-- Brida succión (entrada axial) -->
                                <rect x="30" y="145" width="10" height="50" fill="#004D40"/>
                                <!-- Pata de soporte delantera -->
                                <path d="M90 230 L90 240 L130 240 L130 230 Z" fill="#004D40"/>

                                <!-- EJE y ACOPLE -->
                                <rect x="320" y="160" width="40" height="15" fill="url(#shaftSteel)" stroke="#90A4AE"/>
                                <rect x="350" y="150" width="10" height="35" rx="2" fill="#FF7043" stroke="#D84315"/> <!-- Acople -->
                                <text x="355" y="140" font-size="10" fill="var(--text-secondary)" text-anchor="middle">Acople</text>

                                <!-- FLECHAS DE FLUJO -->
                                <!-- Entrada -->
                                <path d="M10 170 L35 170" stroke="var(--accent-primary)" stroke-width="3" marker-end="url(#arrowHead)"/>
                                <!-- Salida -->
                                <path d="M110 50 L110 20" stroke="var(--accent-primary)" stroke-width="3" marker-end="url(#arrowHead)"/>

                                <!-- ETIQUETAS DE DATOS DINÁMICOS -->
                                
                                <!-- Flujo (Descarga) -->
                                <g transform="translate(130, 30)">
                                    <rect x="0" y="0" width="100" height="35" rx="4" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" stroke-opacity="0.5"/>
                                    <text x="10" y="15" font-size="10" fill="var(--text-secondary)">Flujo (Q):</text>
                                    <text x="10" y="28" font-size="12" font-weight="bold" fill="var(--accent-primary)">${flowDisplay.toFixed(1)} ${State.getFlowUnitLabel()}</text>
                                </g>

                                <!-- Presión Succión -->
                                <g transform="translate(0, 100)">
                                    <rect x="0" y="0" width="80" height="35" rx="4" fill="var(--bg-tertiary)" stroke="var(--text-muted)" stroke-opacity="0.5"/>
                                    <text x="5" y="15" font-size="10" fill="var(--text-secondary)">P. Succión:</text>
                                    <text x="5" y="28" font-size="11" font-weight="bold" fill="var(--text-primary)">
                                        ${State.get('operatingConditions.tank_pressure_suction') ? State.get('operatingConditions.tank_pressure_suction') + ' bar' : '--'}
                                    </text>
                                </g>

                                <!-- Impulsor / RPM -->
                                <g transform="translate(160, 245)">
                                    <rect x="0" y="0" width="120" height="30" rx="4" fill="var(--bg-tertiary)" stroke="var(--border-color)"/>
                                    <text x="60" y="12" font-size="10" fill="var(--text-secondary)" text-anchor="middle">Impulsor: <tspan fill="var(--text-primary)" font-weight="bold">${pump.impeller_diameter || '--'} mm</tspan></text>
                                    <text x="60" y="24" font-size="10" fill="var(--text-secondary)" text-anchor="middle">Velocidad: <tspan fill="var(--text-primary)" font-weight="bold">${pump.rpm || '--'} RPM</tspan></text>
                                </g>
                                
                                <!-- Etiqueta Principal -->
                                <text x="225" y="275" font-size="12" fill="var(--text-muted)" text-anchor="middle" font-style="italic">Bomba Centrifuga de Proceso ANSI (Tipo Goulds 3196)</text>
                            </svg>
                        </div>
                </div>

                <div id="step4Validation" class="validation-container"></div>
            </div>
        `;
    },

    getStep5Template() {
        const curvePoints = State.get('pump.curve_points') || [];
        const flowUnitLabel = State.getFlowUnitLabel();
        const pump = State.get('pump') || {};

        return `
            <div class="curve-section fade-in">
                <h2>Curva Característica de la Bomba</h2>
                <p class="text-secondary">Ingrese los puntos de la curva característica H-Q de la bomba</p>

                <!-- Tarjeta de Información del Impulsor -->
                <div class="impeller-info-card" style="background: rgba(30, 30, 40, 0.5); border: 1px solid rgba(0, 191, 165, 0.3); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: var(--accent-primary);">Impulsor Actual</h3>
                    <div class="impeller-specs" style="display: flex; gap: 2rem; flex-wrap: wrap;">
                        <div class="spec-item" style="display: flex; flex-direction: column; gap: 0.25rem;">
                            <span class="spec-label" style="font-size: 0.875rem; color: var(--text-secondary);">Diámetro:</span>
                            <span class="spec-value" style="font-size: 1.25rem; font-weight: bold; color: var(--accent-primary);">${pump.impeller_diameter || '--'} mm</span>
                        </div>
                        <div class="spec-item" style="display: flex; flex-direction: column; gap: 0.25rem;">
                            <span class="spec-label" style="font-size: 0.875rem; color: var(--text-secondary);">Velocidad:</span>
                            <span class="spec-value" style="font-size: 1.25rem; font-weight: bold; color: var(--accent-primary);">${pump.rpm || '--'} RPM</span>
                        </div>
                        <div class="spec-item" style="display: flex; flex-direction: column; gap: 0.25rem;">
                            <span class="spec-label" style="font-size: 0.875rem; color: var(--text-secondary);">Tipo:</span>
                            <span class="spec-value" style="font-size: 1.25rem; font-weight: bold; color: var(--text-primary);">${pump.type || 'Centrífuga'}</span>
                        </div>
                    </div>
                </div>

                <div class="curve-inputs">
                    <div class="form-group">
                        <label class="form-label">Flujo (Q)</label>
                        <input type="number" class="input" id="curve_flow"
                               min="0" max="20000" step="0.1" placeholder="0">
                        <small class="form-hint">${flowUnitLabel}</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Altura (TDH)</label>
                        <input type="number" class="input" id="curve_tdh"
                               min="0" max="500" step="0.1" placeholder="0">
                        <small class="form-hint">m</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">NPSH Requerido</label>
                        <input type="number" class="input" id="curve_npshr"
                               min="0" max="20" step="0.1" placeholder="0">
                        <small class="form-hint">m</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Eficiencia</label>
                        <input type="number" class="input" id="curve_efficiency"
                               min="0" max="100" step="1" placeholder="0">
                        <small class="form-hint">%</small>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Potencia (BHP)</label>
                        <input type="number" class="input" id="curve_power"
                               min="0" max="1000" step="0.1" placeholder="0">
                        <small class="form-hint">kW (opcional)</small>
                    </div>

                    <div class="form-group" style="display: flex; align-items: flex-end;">
                        <button class="btn btn-primary" id="addCurvePoint">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Agregar Punto
                        </button>
                    </div>
                </div>

                <!-- Sección de Reglas de Afinidad -->
                <div class="impeller-modifier-card" style="background: rgba(30, 30, 40, 0.5); border: 1px solid rgba(0, 191, 165, 0.3); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--accent-primary); display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                        </svg>
                        Reglas de Afinidad - Modificar Impulsor
                    </h3>
                    <p class="text-secondary" style="margin: 0 0 1rem 0; font-size: 0.9rem;">Cambie el diámetro del impulsor para recalcular la curva (RPM constantes)</p>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Diámetro Original (mm)</label>
                            <input type="number" class="input" id="original_impeller"
                                   value="${pump.impeller_diameter || 300}" disabled
                                   style="background: rgba(255, 255, 255, 0.05); cursor: not-allowed;">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nuevo Diámetro (mm)</label>
                            <input type="number" class="input" id="new_impeller"
                                   value="${pump.impeller_diameter || 300}"
                                   min="${(pump.impeller_diameter || 300) * 0.7}"
                                   max="${(pump.impeller_diameter || 300) * 1.2}"
                                   step="1">
                            <small class="form-hint">Rango típico: 70% - 120% del original</small>
                        </div>

                        <div class="form-group" style="display: flex; align-items: flex-end;">
                            <button class="btn btn-primary" id="applyAffinityLaws" style="width: 100%;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 0.5rem;">
                                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                                </svg>
                                Aplicar Reglas de Afinidad
                            </button>
                        </div>
                    </div>

                    <div class="affinity-results" id="affinityResults" style="display: none; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                        <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: var(--accent-primary);">Resultado de Recálculo</h4>
                        <div class="results-summary" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1rem 0;">
                            <div class="result-item" style="background: rgba(0, 191, 165, 0.1); padding: 0.75rem; border-radius: 4px; text-align: center;">
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Cambio en Diámetro</div>
                                <div class="result-value" id="diameterChange" style="font-weight: bold; color: var(--accent-primary);">-</div>
                            </div>
                            <div class="result-item" style="background: rgba(0, 191, 165, 0.1); padding: 0.75rem; border-radius: 4px; text-align: center;">
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Cambio en TDH (est.)</div>
                                <div class="result-value" id="tdhChange" style="font-weight: bold; color: var(--accent-primary);">-</div>
                            </div>
                            <div class="result-item" style="background: rgba(0, 191, 165, 0.1); padding: 0.75rem; border-radius: 4px; text-align: center;">
                                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Cambio en Potencia (est.)</div>
                                <div class="result-value" id="powerChange" style="font-weight: bold; color: var(--accent-primary);">-</div>
                            </div>
                        </div>
                        <div class="confirmation-actions" style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                            <button class="btn btn-success" id="confirmAffinity" style="flex: 1; max-width: 200px;">
                                ✓ Confirmar y Reemplazar Curva
                            </button>
                            <button class="btn btn-secondary" id="cancelAffinity" style="flex: 1; max-width: 200px;">
                                ✗ Cancelar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="curve-points-list">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="margin: 0;">Puntos de la Curva (${curvePoints.length})</h3>
                        <button class="btn btn-danger btn-sm" id="clearAllCurvePoints" title="Eliminar todos los puntos de la curva">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Eliminar Todos los Puntos
                        </button>
                    </div>

                    <div class="curve-points-header">
                        <div style="flex: 1"><strong>Flujo (${flowUnitLabel})</strong></div>
                        <div style="flex: 1"><strong>TDH (m)</strong></div>
                        <div style="flex: 1"><strong>NPSHr (m)</strong></div>
                        <div style="flex: 1"><strong>Eficiencia (%)</strong></div>
                        <div style="flex: 1"><strong>Potencia (kW)</strong></div>
                        <div style="width: 50px;"></div>
                    </div>

                    <div id="curvePointsList">
                        ${curvePoints.map((point, index) => {
            // Convertir flujo desde L/s a la unidad seleccionada
            const flowDisplay = State.L_sToFlow(point.flow || 0);
            return `
                            <div class="curve-point-item" data-point-id="${point.id || index}">
                                <div>${flowDisplay.toFixed(1)}</div>
                                <div>${point.TDH.toFixed(1)}</div>
                                <div>${point.NPSHr.toFixed(2)}</div>
                                <div>${point.efficiency.toFixed(0)}</div>
                                <div>${point.power ? point.power.toFixed(2) : '-'}</div>
                                <button class="btn-icon remove-point-btn" data-point-id="${point.id || index}">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        `;
        }).join('')}
                    </div>

                <div class="curve-chart-preview" style="margin-top: 2rem; background: rgba(30, 30, 40, 0.5); padding: 1rem; border-radius: 8px;">
                    <canvas id="pumpCurvePreviewChart"></canvas>
                </div>

                <div id="step5Validation" class="validation-container"></div>
            </div>
        `;
    },

    getStep6Template() {
        const conditions = State.get('operatingConditions');

        return `
            <div class="conditions-section fade-in">
                <h2>Condiciones de Operación</h2>
                <p class="text-secondary">Especifique las condiciones de operación del sistema</p>

                <div class="conditions-grid">
                    <div class="condition-card">
                        <h4>Succión</h4>

                        <div class="form-group">
                            <label class="form-label required">Presión en Tanque de Succión</label>
                            <input type="number" class="input" id="tank_pressure_suction"
                                   value="${conditions.tank_pressure_suction}"
                                   min="-1" max="50" step="0.1" required>
                            <small class="form-hint">bar manométrico (positivo = presurizado)</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Elevación de Succión</label>
                            <input type="number" class="input" id="elevation_suction"
                                   value="${conditions.elevation_suction}"
                                   min="-50" max="200" step="0.1" required>
                            <small class="form-hint">m (positivo = por encima de bomba)</small>
                        </div>
                    </div>

                    <div class="condition-card">
                        <h4>Descarga</h4>

                        <div class="form-group">
                            <label class="form-label required">Presión en Descarga</label>
                            <input type="number" class="input" id="tank_pressure_discharge"
                                   value="${conditions.tank_pressure_discharge}"
                                   min="-1" max="50" step="0.1" required>
                            <small class="form-hint">bar manométrico</small>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Elevación de Descarga</label>
                            <input type="number" class="input" id="elevation_discharge"
                                   value="${conditions.elevation_discharge}"
                                   min="-50" max="200" step="0.1" required>
                            <small class="form-hint">m</small>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo de Sistema</label>
                    <select class="input select" id="system_type">
                        <option value="open" ${conditions.system_type === 'open' ? 'selected' : ''}>Abierto (atmósferico)</option>
                        <option value="closed" ${conditions.system_type === 'closed' ? 'selected' : ''}>Cerrado (presurizado)</option>
                        <option value="pressurized" ${conditions.system_type === 'pressurized' ? 'selected' : ''}>Presurizado</option>
                    </select>
                </div>

                <div id="step6Validation" class="validation-container"></div>
            </div>
        `;
    },

    getStep7Template() {
        return `
            <div class="results-section fade-in">
                <div id="resultsContent">
                    <div class="text-center" style="padding: 3rem;">
                        <svg class="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.25"></path>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-dasharray="32" stroke-dashoffset="32"></path>
                        </svg>
                        <p class="text-muted" style="margin-top: 1rem;">Calculando...</p>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== INICIALIZAR COMPONENTES DEL PASO =====

    initStepComponents(step) {
        // Event listeners específicos por paso
        if (step === 1) {
            this.initStep1Events();
        } else if (step === 2) {
            this.initPipeEvents('suction');
        } else if (step === 3) {
            this.initPipeEvents('discharge');
        } else if (step === 4) {
            this.initStep4Events();
        } else if (step === 5) {
            this.initStep5Events();
        } else if (step === 6) {
            this.initStep6Events();
        } else if (step === 7) {
            this.executeCalculation();
        }
    },

    initStep1Events() {
        const inputs = ['pulpType', 'consistency', 'temperature', 'pH', 'SR_degrees', 'air_content'];

        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    // Mapeo especial para claves
                    let stateKey = '';
                    if (id === 'pulpType') stateKey = 'process.pulpType';
                    else if (id === 'consistency') stateKey = 'process.consistency';
                    else if (id === 'temperature') stateKey = 'process.temperature';
                    else if (id === 'pH') stateKey = 'process.pH';
                    else if (id === 'SR_degrees') stateKey = 'process.SR_degrees';
                    else if (id === 'air_content') stateKey = 'process.air_content';

                    if (stateKey) {
                        const val = id === 'pulpType' ? e.target.value : (parseFloat(e.target.value) || 0);
                        State.set(stateKey, val);
                        this.updateSummary();

                        // Si cambia consistencia, actualizar validación de velocidades
                        if (id === 'consistency') {
                            this.updatePipeVelocities();
                        }

                        // Actualizar hint con origen para pulpType
                        if (id === 'pulpType') {
                            const pulp = getPulpData(e.target.value);
                            const hint = e.target.parentElement.querySelector('.form-hint');
                            if (hint && pulp) {
                                hint.textContent = `Origen: ${pulp.origin}`;
                            }
                        }
                    }
                });
            }
        });

        // Evento para flujo de operación (convertir a L/s si es necesario)
        const processFlowInput = document.getElementById('processFlow');
        if (processFlowInput) {
            processFlowInput.addEventListener('change', (e) => {
                const val = parseFloat(e.target.value) || 0;
                // Convertir y guardar en L/s
                const flow_L_s = State.flowTo_L_s(val);
                State.set('process.flow', flow_L_s);

                // Actualizar validación de velocidades si estamos en pasos posteriores
                this.updatePipeVelocities();

                // Actualizar resumen
                this.updateSummary();
            });
        }

        // Selector de unidad de flujo
        const flowUnitSelect = document.getElementById('flowUnit');
        if (flowUnitSelect) {
            flowUnitSelect.addEventListener('change', (e) => {
                const oldUnit = State.getFlowUnit();
                const newUnit = e.target.value;

                if (oldUnit !== newUnit) {
                    State.setFlowUnit(newUnit);

                    // Actualizar label del input
                    const flowInput = document.getElementById('processFlow');
                    if (flowInput) {
                        const unitLabel = flowInput.parentElement.querySelector('.input-unit');
                        if (unitLabel) {
                            unitLabel.textContent = State.getFlowUnitLabel();
                        }
                    }

                    // Notificar al usuario
                    const unitLabel = newUnit === 'm3_h' ? 'm³/h' : newUnit === 'gpm' ? 'GPM' : 'L/s';
                    alert(`Unidad de flujo cambiada a ${unitLabel}. Los valores se mostrarán en la nueva unidad.`);

                    // Actualizar resumen
                    this.updateSummary();
                    // Actualizar alarmas de velocidad en tuberías
                    setTimeout(() => this.updatePipeVelocities(), 100);
                }
            });
        }
    },

    initPipeEvents(section) {
        // Event listeners para selección de tubería
        const normSelect = document.getElementById(`${section}_norm`);
        const nominalSelect = document.getElementById(`${section}_nominal`);
        const scheduleSelect = document.getElementById(`${section}_schedule`);
        const flowInput = document.getElementById('pump_flow');

        const updateDimensions = () => {
            const norm = normSelect ? normSelect.value : null;
            const nominal = nominalSelect ? nominalSelect.value : null;
            const schedule = scheduleSelect ? scheduleSelect.value : null;

            console.log(`[updateDimensions] Section: ${section}, Norm: ${norm}, Nominal: ${nominal}, Schedule: ${schedule}`);

            if (!norm || !nominal || !schedule) {
                console.log('[updateDimensions] Valores faltantes, saliendo');
                return;
            }

            const pipeData = getPipeData(norm, nominal, schedule);
            console.log('[updateDimensions] pipeData:', pipeData);


            const odEl = document.getElementById(`${section}_OD`);
            const wallEl = document.getElementById(`${section}_wall`);
            const idEl = document.getElementById(`${section}_ID`);
            const areaEl = document.getElementById(`${section}_area`);
            const velocityEl = document.getElementById(`${section}_velocity`);
            const velocityStatusEl = document.getElementById(`${section}_velocityStatus`);

            if (pipeData && pipeData.OD_mm && pipeData.wall_mm && pipeData.ID_mm) {
                if (odEl) odEl.textContent = pipeData.OD_mm.toFixed(1);
                if (wallEl) wallEl.textContent = pipeData.wall_mm.toFixed(2);
                if (idEl) idEl.textContent = pipeData.ID_mm.toFixed(1);

                if (areaEl) {
                    const area = calculateInternalArea(pipeData.ID_mm) * 10000; // cm²
                    areaEl.textContent = area.toFixed(1);
                }

                // Calcular y mostrar velocidad con validación
                // Obtener flujo en L/s desde State (ya está guardado internamente en L/s)
                const flow_L_s = State.get('process.flow') || 0;

                if (velocityEl && pipeData.ID_mm && flow_L_s > 0) {
                    const velocity = calculateVelocity(flow_L_s, pipeData.ID_mm);
                    velocityEl.textContent = velocity.toFixed(2);

                    // Validar y mostrar estado de velocidad
                    if (velocityStatusEl) {
                        const consistency = State.get('process.consistency') || 3.0;
                        const sectionType = section.includes('suc') ? 'suction' : 'discharge';
                        const validation = validatePipeVelocity(sectionType, velocity, consistency, parseFloat(nominal));

                        // Actualizar clases y contenido según estado
                        velocityStatusEl.className = 'velocity-status';
                        let statusIcon = '';
                        let statusText = '';

                        if (validation.level === 'success') {
                            velocityStatusEl.classList.add('velocity-ok');
                            statusIcon = '✓';
                            statusText = 'Óptima';
                        } else if (validation.level === 'warning') {
                            velocityStatusEl.classList.add('velocity-warning');
                            statusIcon = '⚡';
                            statusText = 'Advertencia';
                        } else if (validation.level === 'error') {
                            velocityStatusEl.classList.add('velocity-error');
                            statusIcon = '⚠️';
                            statusText = 'Error';
                        }

                        velocityStatusEl.innerHTML = `<span class="status-icon">${statusIcon}</span> ${statusText}`;

                        // Mostrar mensajes, consecuencias y recomendaciones
                        const messagesContainer = document.getElementById(`${section}_velocityMessages`);
                        if (messagesContainer) {
                            messagesContainer.innerHTML = '';
                            messagesContainer.className = 'velocity-messages';

                            if (validation.messages.length > 0) {
                                // Mensaje principal
                                validation.messages.forEach(msg => {
                                    const msgDiv = document.createElement('div');
                                    msgDiv.className = `velocity-message ${validation.level}`;
                                    msgDiv.textContent = msg;
                                    messagesContainer.appendChild(msgDiv);
                                });

                                // Mostrar consecuencias si existen
                                if (validation.consequences && validation.consequences.length > 0) {
                                    const consequencesDiv = document.createElement('div');
                                    consequencesDiv.className = `velocity-details ${validation.level}`;
                                    consequencesDiv.innerHTML = `
                                        <div class="details-title">CONSECUENCIAS:</div>
                                        <ul class="details-list">
                                            ${validation.consequences.map(c => `<li>${c}</li>`).join('')}
                                        </ul>
                                    `;
                                    messagesContainer.appendChild(consequencesDiv);
                                }

                                // Mostrar recomendaciones si existen
                                if (validation.recommendations && validation.recommendations.length > 0) {
                                    const recsDiv = document.createElement('div');
                                    recsDiv.className = `velocity-details recommendations ${validation.level}`;
                                    recsDiv.innerHTML = `
                                        <div class="details-title">ACCIONES RECOMENDADAS:</div>
                                        <ul class="details-list">
                                            ${validation.recommendations.map(r => `<li>${r}</li>`).join('')}
                                        </ul>
                                    `;
                                    messagesContainer.appendChild(recsDiv);
                                }
                            }
                        }
                    }
                } else {
                    // Flujo no disponible
                    if (velocityEl) velocityEl.textContent = '-';
                    if (velocityStatusEl) {
                        velocityStatusEl.innerHTML = '<span>-</span>';
                        velocityStatusEl.className = 'velocity-status';
                    }
                }
            } else {
                // Valores por defecto si no se encuentra la tubería
                if (odEl) odEl.textContent = '-';
                if (wallEl) wallEl.textContent = '-';
                if (idEl) idEl.textContent = '-';
                if (areaEl) areaEl.textContent = '-';
                if (velocityEl) velocityEl.textContent = '-';
                if (velocityStatusEl) {
                    velocityStatusEl.innerHTML = '<span>-</span>';
                    velocityStatusEl.className = 'velocity-status';
                }
                // Limpiar mensajes de velocidad
                const messagesContainer = document.getElementById(`${section}_velocityMessages`);
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                }
            }
        };

        // Función para actualizar las opciones de cédula cuando cambia la norma
        const updateScheduleOptions = () => {
            if (!normSelect || !scheduleSelect) return;
            const norm = normSelect.value;
            const currentSchedule = scheduleSelect.value;
            const newOptions = StepManager.getScheduleOptionsForNorm(norm, currentSchedule);
            scheduleSelect.innerHTML = newOptions;
            // Actualizar dimensiones después de cambiar las opciones
            updateDimensions();
        };

        if (normSelect) normSelect.addEventListener('change', () => {
            // Guardar en State ANTES de actualizar UI
            State.set(`${section}.norm`, normSelect.value);
            updateScheduleOptions();
            this.updateSummary(); // Actualizar resumen cuando cambie norma
        });
        if (nominalSelect) nominalSelect.addEventListener('change', () => {
            // Guardar en State ANTES de actualizar UI
            State.set(`${section}.nominal`, nominalSelect.value);
            updateDimensions();
            this.updateSummary(); // Actualizar resumen cuando cambie diámetro
        });
        if (scheduleSelect) scheduleSelect.addEventListener('change', () => {
            // Guardar en State ANTES de actualizar UI
            State.set(`${section}.schedule`, scheduleSelect.value);
            updateDimensions();
            this.updateSummary(); // Actualizar resumen cuando cambie cédula
        });

        // También actualizar cuando cambie el flujo (usamos el evento personalizado)
        if (flowInput) {
            flowInput.addEventListener('change', () => {
                // Pequeño delay para que el valor se guarde en State antes de actualizar
                setTimeout(updateDimensions, 50);
            });
        }

        // Inicializar dimensiones
        updateDimensions();

        // Botón agregar accesorio
        const addBtn = document.getElementById(`${section}_addFitting`);
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showFittingDialog(section));
        }

        // Event delegation para eliminar accesorios
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-fitting-btn')) {
                const btn = e.target.closest('.remove-fitting-btn');
                const fittingId = btn.dataset.fittingId;
                State.removeFitting(section, fittingId);
                this.renderCurrentStep();
                this.updateSummary(); // Actualizar resumen en sidebar
            }
        });
    },

    showFittingDialog(section) {
        // Mostrar modal para seleccionar accesorio
        const categories = getAllCategories();

        let optionsHTML = '<select class="input select" id="fittingSelect">';
        optionsHTML += '<option value="">Seleccione un accesorio...</option>';

        categories.forEach(category => {
            const fittings = getFittingsByCategory(category);
            if (fittings.length > 0) {
                optionsHTML += `<optgroup label="${category}">`;
                fittings.forEach(fitting => {
                    optionsHTML += `<option value="${fitting.id}">${fitting.name} (L/D: ${fitting.L_D})</option>`;
                });
                optionsHTML += '</optgroup>';
            }
        });

        optionsHTML += '</select>';

        const modal = document.getElementById('fittingModal');
        if (modal) {
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <h3>Seleccionar Accesorio</h3>
                <div class="form-group">
                    <label class="form-label">Tipo de Accesorio</label>
                    ${optionsHTML}
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" class="input" id="fittingQuantity" value="1" min="1" max="100">
                </div>
            `;
            modal.classList.add('active');

            // Configurar botón de confirmación
            const confirmBtn = document.getElementById('confirmFitting');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    const fittingId = document.getElementById('fittingSelect').value;
                    const quantity = parseInt(document.getElementById('fittingQuantity').value) || 1;

                    if (fittingId) {
                        const fittingData = getFitting(fittingId);
                        State.addFitting(section, {
                            type: fittingId,
                            quantity: quantity,
                            L_D: fittingData.L_D,
                            K: fittingData.K_typical
                        });
                        this.renderCurrentStep();
                        this.updateSummary(); // Actualizar resumen en sidebar
                    }

                    modal.classList.remove('active');
                };
            }

            // Configurar botón cancelar
            const cancelBtn = document.getElementById('cancelFitting');
            if (cancelBtn) {
                cancelBtn.onclick = () => {
                    modal.classList.remove('active');
                };
            }

            // Configurar botón de cerrar (X)
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.classList.remove('active');
                };
            }

            // Cerrar al hacer clic fuera del modal
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            };
        }
    },

    initStep4Events() {
        // Event listeners para datos de bomba
        ['pump_manufacturer', 'pump_model', 'pump_serial', 'pump_type'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('pump_', '');
                    State.set(`pump.${field}`, e.target.value);
                });
            }
        });

        // Para impeller y rpm, guardar directamente
        ['pump_impeller', 'pump_rpm'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('pump_', '');
                    const mapping = {
                        impeller: 'impeller_diameter',
                        rpm: 'rpm'
                    };
                    State.set(`pump.${mapping[field] || field}`, parseFloat(e.target.value));
                });
            }
        });

        // Para el flujo, convertir a L/s antes de guardar (se guarda en L/s internamente)
        const flowInput = document.getElementById('pump_flow');
        if (flowInput) {
            flowInput.addEventListener('change', (e) => {
                const value = parseFloat(e.target.value) || 0;
                // Convertir desde la unidad seleccionada a L/s para guardar
                const flowIn_L_s = State.flowTo_L_s(value);
                State.set('pump.flow', flowIn_L_s);

                // Actualizar alarmas de velocidad en succión y descarga
                setTimeout(() => this.updatePipeVelocities(), 100);
            });
        }
    },

    /**
     * Actualizar alarmas de velocidad en secciones de tubería
     */
    updatePipeVelocities() {
        ['suction', 'discharge'].forEach(section => {
            const velocityEl = document.getElementById(`${section}_velocity`);
            const velocityStatusEl = document.getElementById(`${section}_velocityStatus`);
            const messagesContainer = document.getElementById(`${section}_velocityMessages`);

            if (!velocityEl || !velocityStatusEl) return;

            // Obtener datos de tubería
            const norm = State.get(`${section}.norm`);
            const nominal = State.get(`${section}.nominal`);
            const schedule = State.get(`${section}.schedule`);

            if (!norm || !nominal || !schedule) return;

            const pipeData = getPipeData(norm, nominal, schedule);
            if (!pipeData || !pipeData.ID_mm) return;

            // Obtener flujo en L/s y consistencia
            const flow_L_s = State.get('process.flow') || 0;
            const consistency = State.get('process.consistency') || 3.0;
            const sectionType = section;

            if (flow_L_s > 0) {
                const velocity = calculateVelocity(flow_L_s, pipeData.ID_mm);
                velocityEl.textContent = velocity.toFixed(2);

                const validation = validatePipeVelocity(sectionType, velocity, consistency, parseFloat(nominal));

                // Actualizar estado visual
                velocityStatusEl.className = 'velocity-status';
                let statusIcon = '';
                let statusText = '';

                if (validation.level === 'success') {
                    velocityStatusEl.classList.add('velocity-ok');
                    statusIcon = '✓';
                    statusText = 'Óptima';
                } else if (validation.level === 'warning') {
                    velocityStatusEl.classList.add('velocity-warning');
                    statusIcon = '⚡';
                    statusText = 'Advertencia';
                } else if (validation.level === 'error') {
                    velocityStatusEl.classList.add('velocity-error');
                    statusIcon = '⚠️';
                    statusText = 'Error';
                }

                velocityStatusEl.innerHTML = `<span class="status-icon">${statusIcon}</span> ${statusText}`;

                // Actualizar mensajes
                if (messagesContainer) {
                    messagesContainer.innerHTML = '';
                    messagesContainer.className = 'velocity-messages';

                    validation.messages.forEach(msg => {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = `velocity-message ${validation.level}`;
                        msgDiv.textContent = msg;
                        messagesContainer.appendChild(msgDiv);
                    });
                }
            } else {
                velocityEl.textContent = '-';
                velocityStatusEl.innerHTML = '<span>-</span>';
                velocityStatusEl.className = 'velocity-status';
                if (messagesContainer) messagesContainer.innerHTML = '';
            }
        });
    },

    initStep5Events() {
        // Inicializar gráfico si hay datos
        this.renderPumpCurvePreviewChart();

        // Botón agregar punto
        const addBtn = document.getElementById('addCurvePoint');
        if (addBtn) {
            addBtn.onclick = () => {
                const flow = parseFloat(document.getElementById('curve_flow').value);
                const tdh = parseFloat(document.getElementById('curve_tdh').value);
                const npshr = parseFloat(document.getElementById('curve_npshr').value);
                const efficiency = parseFloat(document.getElementById('curve_efficiency').value);
                const power = parseFloat(document.getElementById('curve_power').value);

                // Convertir flujo a L/s para guardar internamente
                // El input está en la unidad seleccionada (m3/h, gpm, etc)
                const flow_L_s = State.flowTo_L_s(flow);

                if (!isNaN(flow) && !isNaN(tdh)) {
                    State.addCurvePoint({
                        flow: flow_L_s,
                        TDH: tdh,
                        NPSHr: isNaN(npshr) ? 0 : npshr,
                        efficiency: isNaN(efficiency) ? 0 : efficiency,
                        power: isNaN(power) ? 0 : power
                    });
                    this.renderCurrentStep();
                    // El gráfico se renderiza de nuevo al llamar a renderCurrentStep que llama initStep5Events
                } else {
                    alert('Debe ingresar al menos Flujo y Altura (TDH)');
                }
            };
        }

        // Botón eliminar todos los puntos
        const clearBtn = document.getElementById('clearAllCurvePoints');
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm('¿Está seguro de eliminar todos los puntos de la curva?')) {
                    State.clearAllCurvePoints();
                    this.renderCurrentStep();
                }
            };
        }

        // Botones eliminar punto individual
        document.querySelectorAll('.remove-point-btn').forEach(btn => {
            btn.onclick = (e) => {
                const pointId = e.currentTarget.dataset.pointId; // Usar currentTarget para capturar el botón, no el icono
                // Si pointId es un índice numérico (versiones anteriores), convertir a número
                // Si es string (ID único), usar como tal
                // La función removeCurvePoint de State maneja IDs
                // Pero si state.js usa filter por ID, necesitamos asegurar que coincida el tipo

                // Revisar cómo State guarda los puntos. Si usa Date.now().toString(), es string.
                State.removeCurvePoint(pointId);
                this.renderCurrentStep();
            };
        });

        // ===== REGLAS DE AFINIDAD =====
        const applyAffinityBtn = document.getElementById('applyAffinityLaws');
        const confirmAffinityBtn = document.getElementById('confirmAffinity');
        const cancelAffinityBtn = document.getElementById('cancelAffinity');
        const newImpellerInput = document.getElementById('new_impeller');

        // Variable temporal para almacenar la curva recalculada
        let recalculatedCurve = null;

        if (applyAffinityBtn) {
            applyAffinityBtn.onclick = () => {
                const originalDiameter = parseFloat(document.getElementById('original_impeller').value);
                const newDiameter = parseFloat(newImpellerInput.value);

                if (!newDiameter || newDiameter <= 0) {
                    alert('Por favor ingrese un diámetro válido');
                    return;
                }

                if (newDiameter === originalDiameter) {
                    alert('El nuevo diámetro debe ser diferente al original');
                    return;
                }

                // Obtener curva actual
                const currentCurve = State.get('pump.curve_points') || [];

                if (currentCurve.length === 0) {
                    alert('No hay puntos de curva para recalcular. Agregue puntos primero.');
                    return;
                }

                // Aplicar reglas de afinidad
                recalculatedCurve = applyAffinityLaws(currentCurve, originalDiameter, newDiameter);

                // Mostrar resultados
                const diameterRatio = newDiameter / originalDiameter;
                const tdhRatio = Math.pow(diameterRatio, 2);
                const powerRatio = Math.pow(diameterRatio, 3);

                document.getElementById('diameterChange').textContent =
                    `${((diameterRatio - 1) * 100).toFixed(1)}% (${originalDiameter} → ${newDiameter} mm)`;

                document.getElementById('tdhChange').textContent =
                    `${((tdhRatio - 1) * 100).toFixed(1)}%`;

                document.getElementById('powerChange').textContent =
                    `${((powerRatio - 1) * 100).toFixed(1)}%`;

                document.getElementById('affinityResults').style.display = 'block';

                // Previsualizar curva recalculada en el gráfico
                this.previewAffinityCurve(recalculatedCurve);
            };
        }

        if (confirmAffinityBtn) {
            confirmAffinityBtn.onclick = () => {
                if (recalculatedCurve) {
                    // Guardar la nueva curva en el State
                    State.set('pump.curve_points', recalculatedCurve);

                    // Actualizar el diámetro del impulsor
                    const newDiameter = parseFloat(newImpellerInput.value);
                    State.set('pump.impeller_diameter', newDiameter);

                    // Recargar el paso
                    this.renderCurrentStep();

                    // Mostrar mensaje de éxito (usando alert temporalmente, podría mejorarse)
                    alert('Curva actualizada correctamente con reglas de afinidad');

                    // Limpiar
                    recalculatedCurve = null;
                }
            };
        }

        if (cancelAffinityBtn) {
            cancelAffinityBtn.onclick = () => {
                recalculatedCurve = null;
                document.getElementById('affinityResults').style.display = 'none';
                newImpellerInput.value = State.get('pump.impeller_diameter');
                // Recargar gráfico para eliminar previsualización
                this.renderPumpCurvePreviewChart();
            };
        }
    },

    // Función para renderizar el gráfico de previsualización en el Paso 5
    renderPumpCurvePreviewChart() {
        const ctx = document.getElementById('pumpCurvePreviewChart');
        if (!ctx) return;

        // Destruir instancia previa si existe para evitar superposiciones o memory leaks
        // Guardamos la instancia en una propiedad del DOM element o en una variable de clase si fuera necesario
        // Chart.js 3+ maneja esto mejor si recuperamos la instancia asociada al canvas
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        const curvePoints = State.get('pump.curve_points') || [];
        if (curvePoints.length === 0) {
            // Si no hay puntos, mostrar un gráfico vacío con ejes configurados
            // o simplemente retornar (el canvas estará vacío)
        }

        // Preparar datos
        // Ordenar por flujo para que la línea se dibuje correctamente
        const sortedPoints = [...curvePoints].sort((a, b) => a.flow - b.flow);

        const flowUnitLabel = State.getFlowUnitLabel();

        const flows = sortedPoints.map(p => State.L_sToFlow(p.flow));
        const tdhs = sortedPoints.map(p => p.TDH);

        // Agregar punto (0, max_head) si no existe, estimación simple o dejar que el usuario lo ponga
        // Mejor solo graficar lo que el usuario ingresa

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: flows, // Chart.js usará esto para el eje X si es categoría, o pares x/y si es scatter/line lineal
                datasets: [{
                    label: 'Curva H-Q (Altura vs Flujo)',
                    data: sortedPoints.map(p => ({
                        x: State.L_sToFlow(p.flow),
                        y: p.TDH
                    })),
                    borderColor: '#00BFA5', // Color principal (teal)
                    backgroundColor: 'rgba(0, 191, 165, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#00BFA5',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4 // Suavizado de curva
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permitir ajustar altura
                scales: {
                    x: {
                        type: 'linear', // Eje lineal para que los puntos se distribuyan proporcionalmente al flujo
                        title: {
                            display: true,
                            text: `Flujo (${flowUnitLabel})`,
                            color: '#ccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ccc'
                        },
                        min: 0
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Altura Dinámica Total - TDH (m)',
                            color: '#ccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ccc'
                        },
                        min: 0
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                return `TDH: ${context.parsed.y.toFixed(1)} m @ ${context.parsed.x.toFixed(1)} ${flowUnitLabel}`;
                            }
                        }
                    }
                }
            }
        });

        // Ajustar altura del contenedor si es necesario por CSS
        ctx.style.height = '300px';
    },

    /**
     * Previsualiza la curva recalculada sobre el gráfico existente
     * @param {Array} newCurve - Nueva curva calculada
     */
    previewAffinityCurve(newCurve) {
        const ctx = document.getElementById('pumpCurvePreviewChart');
        if (!ctx) return;

        const chart = Chart.getChart(ctx);
        if (!chart) return;

        // Obtener la curva actual
        const currentCurve = State.get('pump.curve_points') || [];
        const flowUnitLabel = State.getFlowUnitLabel();

        // Ordenar la nueva curva por flujo
        const sortedNewCurve = [...newCurve].sort((a, b) => a.flow - b.flow);

        // Agregar la curva de previsualización como un segundo dataset
        chart.data.datasets.push({
            label: 'Nueva Curva (Previsualización)',
            data: sortedNewCurve.map(p => ({
                x: State.L_sToFlow(p.flow),
                y: p.TDH
            })),
            borderColor: '#FF5252', // Color rojo para diferenciar
            backgroundColor: 'rgba(255, 82, 82, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5], // Línea punteada
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#FF5252',
            pointBorderColor: '#fff',
            fill: false
        });

        chart.update();
    },

    initStep6Events() {
        // Event listeners para condiciones de operación
        ['tank_pressure_suction', 'elevation_suction', 'tank_pressure_discharge',
            'elevation_discharge', 'system_type'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('change', (e) => {
                        State.set(`operatingConditions.${id}`,
                            id === 'system_type' ? e.target.value : parseFloat(e.target.value));
                    });
                }
            });
    },

    // ===== CARGAR DATOS EN PASO =====

    loadStepData(step) {
        // Los datos ya se cargan desde State en los templates
    },

    // ===== ACTUALIZAR PROGRESO =====

    updateProgress() {
        const progress = State.getProgress();
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (progressFill) {
            progressFill.style.width = `${progress.percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `Paso ${progress.step} de ${progress.total}`;
        }

        // Actualizar resumen en sidebar
        this.updateSummary();
    },

    updateSummary() {
        const summary = State.getSummary();
        const summaryContainer = document.getElementById('dataSummary');

        if (!summaryContainer) return;

        // Convertir flujo a la unidad seleccionada
        const flowDisplay = State.L_sToFlow(summary.flow || 0);
        const flowUnitLabel = State.getFlowUnitLabel();

        // Construir HTML del resumen - mostrar datos disponibles
        let summaryHTML = '';

        // Mostrar pulpa si existe
        if (summary.pulpName && summary.pulpName !== 'N/A') {
            summaryHTML += `
                <div class="data-summary-item">
                    <span class="data-summary-label">Pulpa:</span>
                    <span class="data-summary-value">${summary.pulpName}</span>
                </div>`;
        }

        // Mostrar consistencia si existe
        if (summary.consistency > 0) {
            summaryHTML += `
                <div class="data-summary-item">
                    <span class="data-summary-label">Consistencia:</span>
                    <span class="data-summary-value">${summary.consistency}%</span>
                </div>`;
        }

        // Mostrar flujo si existe
        if (summary.flow > 0) {
            summaryHTML += `
                <div class="data-summary-item">
                    <span class="data-summary-label">Flujo:</span>
                    <span class="data-summary-value">${flowDisplay.toFixed(1)} ${flowUnitLabel}</span>
                </div>`;
        }

        // Siempre mostrar diámetros (pueden estar seleccionados aún sin pulpa)
        summaryHTML += `
            <div class="data-summary-item">
                <span class="data-summary-label">Succión:</span>
                <span class="data-summary-value">${summary.suctionDiameter}"</span>
            </div>
            <div class="data-summary-item">
                <span class="data-summary-label">Descarga:</span>
                <span class="data-summary-value">${summary.dischargeDiameter}"</span>
            </div>`;

        summaryContainer.innerHTML = summaryHTML;
    },

    // ===== EVENTOS GLOBALES =====

    bindEvents() {
        // Botones de navegación
        const btnPrevious = document.getElementById('btnPrevious');
        const btnNext = document.getElementById('btnNext');

        if (btnPrevious) {
            btnPrevious.addEventListener('click', () => {
                State.previousStep();
                this.renderStepper();
                this.renderCurrentStep();
                this.updateProgress();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                State.nextStep();
                this.renderStepper();
                this.renderCurrentStep();
                this.updateProgress();
            });
        }

        // Botones de acción
        const btnExport = document.getElementById('btnExport');
        const btnImport = document.getElementById('btnImport');
        const btnSave = document.getElementById('btnSave');

        if (btnExport) {
            btnExport.addEventListener('click', () => this.exportData());
        }

        if (btnImport) {
            btnImport.addEventListener('click', () => this.importData());
        }

        if (btnSave) {
            btnSave.addEventListener('click', () => State.saveToLocalStorage());
        }

        // Stepper items clickeables
        document.querySelectorAll('.stepper-item').forEach(item => {
            item.addEventListener('click', () => {
                const step = parseInt(item.dataset.step);
                if (step <= State.get('currentStep')) {
                    State.goToStep(step);
                    this.renderStepper();
                    this.renderCurrentStep();
                    this.updateProgress();
                }
            });
        });
    },

    // ===== EXPORTAR/IMPORTAR DATOS =====

    exportData() {
        const data = State.export();
        const filename = `SW-K60_Calculo_${formatDate()}.json`;
        exportToJSON(data, filename);
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const data = await importFromJSON(file);
                    if (State.import(data)) {
                        this.renderCurrentStep();
                        this.updateProgress();
                        alert('Datos importados correctamente');
                    } else {
                        alert('Error al importar datos');
                    }
                } catch (error) {
                    alert('Error al leer archivo: ' + error.message);
                }
            }
        };

        input.click();
    },

    // ===== EJECUTAR CÁLCULO =====

    executeCalculation() {
        // Preparar datos del sistema
        const systemData = {
            pulpType: State.get('process.pulpType'),
            consistency_percent: State.get('process.consistency'),
            temperature_c: State.get('process.temperature'),
            pH: State.get('process.pH'),
            SR_degrees: State.get('process.SR_degrees'),
            air_content_percent: State.get('process.air_content'),

            suction: {
                norm: State.get('suction.norm'),
                D_mm: parseFloat(getPipeData(State.get('suction.norm'), State.get('suction.nominal'), State.get('suction.schedule'))?.ID_mm || 150),
                length_m: State.get('suction.length'),
                roughness_mm: State.get('suction.roughness'),
                fittings: State.get('suction.fittings') || []
            },

            discharge: {
                norm: State.get('discharge.norm'),
                D_mm: parseFloat(getPipeData(State.get('discharge.norm'), State.get('discharge.nominal'), State.get('discharge.schedule'))?.ID_mm || 100),
                length_m: State.get('discharge.length'),
                roughness_mm: State.get('discharge.roughness'),
                fittings: State.get('discharge.fittings') || []
            },

            operatingConditions: {
                tank_pressure_suction_kPa: State.get('operatingConditions.tank_pressure_suction'),
                elevation_suction_m: State.get('operatingConditions.elevation_suction'),
                tank_pressure_discharge_kPa: State.get('operatingConditions.tank_pressure_discharge'),
                elevation_discharge_m: State.get('operatingConditions.elevation_discharge'),
                system_type: State.get('operatingConditions.system_type')
            },

            pump: {
                flow_L_s: State.get('process.flow'),
                impeller_diameter_mm: State.get('pump.impeller_diameter'),
                rpm: State.get('pump.rpm'),
                curve_points: State.get('pump.curve_points') || []
            },

            useAirCorrection: State.get('config.useAirCorrection')
        };

        // Ejecutar cálculo
        try {
            const results = calculatePumpingSystem(systemData);
            State.setResults(results);
            this.displayResults(results);
        } catch (error) {
            console.error('Error en cálculo:', error);
            document.getElementById('resultsContent').innerHTML = `
                <div class="alert alert-error">
                    <span class="alert-icon">⚠</span>
                    <div class="alert-content">
                        <div class="alert-title">Error en el cálculo</div>
                        <div class="alert-message">${error.message}</div>
                    </div>
                </div>
            `;
        }
    },

    displayResults(results) {
        const container = document.getElementById('resultsContent');

        container.innerHTML = `
            ${this.getResultsOverview(results)}
            ${this.getResultsTables(results)}
            ${this.getResultsCharts(results)}
            ${this.getResultsRecommendations(results)}
        `;

        // Renderizar gráficos
        setTimeout(() => this.renderCharts(results), 100);
    },

    getResultsOverview(results) {
        const status = results.overallStatus;
        const statusClass = status.color;
        const statusIcon = status.color === 'green' ? '✓' : status.color === 'yellow' ? '⚠' : '⚠';

        return `
            <div class="results-overview">
                <div class="result-card ${statusClass}">
                    <div class="result-card-value">
                        <span class="traffic-light">
                            <span class="traffic-light-bulb ${statusClass}"></span>
                        </span>
                        ${statusIcon}
                    </div>
                    <div class="result-card-label">Estado General</div>
                </div>

                <div class="result-card">
                    <div class="result-card-value">${formatNumber(results.NPSH.available, 2)}</div>
                    <div class="result-card-label">NPSH Disp. (m)</div>
                </div>

                <div class="result-card">
                    <div class="result-card-value">${formatNumber(results.TDH.system, 2)}</div>
                    <div class="result-card-label">TDH Sistema (m)</div>
                </div>

                <div class="result-card">
                    <div class="result-card-value">${formatNumber(results.TDH.pump, 2)}</div>
                    <div class="result-card-label">TDH Bomba (m)</div>
                </div>

                <div class="result-card">
                    <div class="result-card-value">${formatNumber(results.power.motor_kW, 2)}</div>
                    <div class="result-card-label">Potencia (kW)</div>
                </div>

                <div class="result-card">
                    <div class="result-card-value">${formatNumber(results.efficiency, 1)}</div>
                    <div class="result-card-label">Eficiencia (%)</div>
                </div>
            </div>

            <div class="alert alert-${status.status === 'critical' ? 'error' : status.status === 'warning' ? 'warning' : 'success'}">
                <span class="alert-icon">${statusIcon}</span>
                <div class="alert-content">
                    <div class="alert-title">${status.message}</div>
                </div>
            </div>
        `;
    },

    getResultsTables(results) {
        return `
            <h3>Detalle de Cálculos</h3>

            <div class="results-section">
                <h4>Succión</h4>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Parámetro</th>
                            <th>Valor</th>
                            <th>Unidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Velocidad</td><td>${formatNumber(results.suction.velocity, 2)}</td><td>m/s</td></tr>
                        <tr><td>Número de Reynolds</td><td>${formatNumber(results.suction.Re, 0)}</td><td>-</td></tr>
                        <tr><td>Región de Flujo</td><td>${results.suction.flowRegion.name}</td><td>-</td></tr>
                        <tr><td>Factor de Fricción (Agua)</td><td>${formatNumber(results.suction.f_water, 4)}</td><td>-</td></tr>
                        <tr><td>Kmod</td><td>${formatNumber(results.suction.Kmod, 2)}</td><td>-</td></tr>
                        <tr><td>Pérdidas por Fricción</td><td>${formatNumber(results.suction.h_friction, 2)}</td><td>m</td></tr>
                        <tr><td>Pérdidas Menores</td><td>${formatNumber(results.suction.h_minor, 2)}</td><td>m</td></tr>
                        <tr><td>Pérdidas Totales</td><td>${formatNumber(results.suction.h_total, 2)}</td><td>m</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="results-section">
                <h4>Descarga</h4>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Parámetro</th>
                            <th>Valor</th>
                            <th>Unidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Velocidad</td><td>${formatNumber(results.discharge.velocity, 2)}</td><td>m/s</td></tr>
                        <tr><td>Número de Reynolds</td><td>${formatNumber(results.discharge.Re, 0)}</td><td>-</td></tr>
                        <tr><td>Región de Flujo</td><td>${results.discharge.flowRegion.name}</td><td>-</td></tr>
                        <tr><td>Pérdidas Totales</td><td>${formatNumber(results.discharge.h_total, 2)}</td><td>m</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="results-section">
                <h4>Evaluación de Bomba</h4>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Parámetro</th>
                            <th>Valor</th>
                            <th>Unidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>TDH Requerida</td><td>${formatNumber(results.TDH.system, 2)}</td><td>m</td></tr>
                        <tr><td>TDH Disponible</td><td>${formatNumber(results.TDH.pump, 2)}</td><td>m</td></tr>
                        <tr><td>Margen TDH</td><td class="${results.TDH.margin >= 0 ? 'text-success' : 'text-error'}">${formatNumber(results.TDH.margin, 2)}</td><td>m</td></tr>
                        <tr><td>NPSH Requerido</td><td>${formatNumber(results.NPSH.required, 2)}</td><td>m</td></tr>
                        <tr><td>NPSH Disponible</td><td>${formatNumber(results.NPSH.available, 2)}</td><td>m</td></tr>
                        <tr><td>Margen NPSH</td><td class="${results.NPSH.margin >= 0 ? 'text-success' : 'text-error'}">${formatNumber(results.NPSH.margin, 2)}</td><td>m</td></tr>
                        <tr><td>Potencia Hidráulica</td><td>${formatNumber(results.power.hydraulic / 1000, 2)}</td><td>kW</td></tr>
                        <tr><td>Potencia del Eje</td><td>${formatNumber(results.power.shaft / 1000, 2)}</td><td>kW</td></tr>
                        <tr><td>Potencia del Motor</td><td>${formatNumber(results.power.motor_kW, 2)}</td><td>kW</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    getResultsCharts(results) {
        return `
            <h3>Gráficos</h3>
            <div class="charts-container">
                <div class="chart-wrapper">
                    <canvas id="tdhChart"></canvas>
                </div>
                <div class="chart-wrapper">
                    <canvas id="npshChart"></canvas>
                </div>
            </div>
        `;
    },

    renderCharts(results) {
        const ctxTDH = document.getElementById('tdhChart'); // Changed from chartTDH to tdhChart to match HTML
        const ctxNPSH = document.getElementById('npshChart'); // Changed from chartSystemCurve to npshChart to match HTML

        if (!ctxTDH || !ctxNPSH) return;

        // Obtener etiqueta de unidad de flujo para los gráficos
        const flowUnitLabel = State.getFlowUnitLabel();

        // Destruir gráficos anteriores si existen
        if (this.chartTDH) this.chartTDH.destroy();
        if (this.chartNPSH) this.chartNPSH.destroy(); // Changed from chartSystem to chartNPSH

        // Configuración común para fuentes y estilos
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false, // Permitir altura personalizada por CSS
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Inter', sans-serif"
                        },
                        padding: 20,
                        color: '#B0B0B0' // Added color for legend labels
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    padding: 10
                },
                title: {
                    display: true,
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: "'Inter', sans-serif"
                    },
                    padding: { top: 10, bottom: 20 },
                    color: '#FFFFFF' // Added color for title
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: `Flujo (${State.getFlowUnitLabel()})`,
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#B0B0B0' // Added color for x-axis title
                    },
                    ticks: {
                        font: { size: 12 },
                        color: '#B0B0B0' // Added color for x-axis ticks
                    },
                    grid: {
                        color: '#333' // Changed from rgba(0, 0, 0, 0.1) to match original theme
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Altura (m)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: { size: 12 },
                        color: '#B0B0B0' // Added color for y-axis ticks
                    },
                    grid: {
                        color: '#333' // Changed from rgba(0, 0, 0, 0.1) to match original theme
                    }
                }
            },
            elements: {
                line: {
                    borderWidth: 2, // Changed from 3 to 2 to match original
                    tension: 0.4
                },
                point: {
                    radius: 3, // Changed from 4 to 3 to match original
                    hoverRadius: 5 // Changed from 6 to 5 to match original
                }
            }
        };

        // Obtener puntos de curva de la bomba
        const curvePoints = State.get('pump.curve_points') || [];

        // Si no hay puntos de curva, generar algunos basados en el punto de diseño
        let flows_L_s = [];
        if (curvePoints.length > 0) {
            flows_L_s = curvePoints.map(p => p.flow);
        } else {
            // Generar 5 puntos alrededor del flujo de diseño (0, 50%, 100%, 120%)
            const designFlow = results.pump.flow;
            if (designFlow > 0) {
                flows_L_s = [0, designFlow * 0.5, designFlow, designFlow * 1.2];
            } else {
                flows_L_s = [0, 10, 20, 30]; // Fallback
            }
        }

        const flows = flows_L_s.map(f => State.L_sToFlow(f));

        // Calcular TDHs de la curva de la bomba
        const TDHs = flows_L_s.map(flow_L_s => {
            if (curvePoints.length > 0) {
                // Interpolar desde puntos de curva existentes
                const point = curvePoints.find(p => Math.abs(p.flow - flow_L_s) < 0.1);
                if (point) return point.TDH;
                // Interpolación lineal simple
                for (let i = 0; i < curvePoints.length - 1; i++) {
                    if (flow_L_s >= curvePoints[i].flow && flow_L_s <= curvePoints[i + 1].flow) {
                        const t = (flow_L_s - curvePoints[i].flow) / (curvePoints[i + 1].flow - curvePoints[i].flow);
                        return curvePoints[i].TDH + t * (curvePoints[i + 1].TDH - curvePoints[i].TDH);
                    }
                }
            }
            // Fallback: aproximación parabólica desde punto de diseño
            const designTDH = results.TDH.pump || results.TDH.system || 40;
            const designFlow = results.pump.flow || State.get('process.flow');
            return designTDH * (1 - 0.3 * Math.pow(flow_L_s / designFlow - 1, 2));
        });

        // Calcular NPSHrs de la curva de la bomba
        const NPSHrs = flows_L_s.map(flow_L_s => {
            if (curvePoints.length > 0) {
                // Interpolar desde puntos de curva existentes
                const point = curvePoints.find(p => Math.abs(p.flow - flow_L_s) < 0.1);
                if (point) return point.NPSHr;
                // Interpolación lineal simple
                for (let i = 0; i < curvePoints.length - 1; i++) {
                    if (flow_L_s >= curvePoints[i].flow && flow_L_s <= curvePoints[i + 1].flow) {
                        const t = (flow_L_s - curvePoints[i].flow) / (curvePoints[i + 1].flow - curvePoints[i].flow);
                        return curvePoints[i].NPSHr + t * (curvePoints[i + 1].NPSHr - curvePoints[i].NPSHr);
                    }
                }
            }
            // Fallback: NPSHr aumenta con el flujo
            const designNPSHr = results.NPSH.required || 3;
            const designFlow = results.pump.flow || State.get('process.flow');
            return designNPSHr * Math.pow(flow_L_s / designFlow, 2);
        });

        // Curva del sistema
        const systemCurve = flows_L_s.map(flow_L_s => {
            // Aproximación: TDH ∝ Q²
            return results.TDH.system * Math.pow(flow_L_s / State.get('process.flow'), 2);
        });

        // Gráfico TDH
        const tdhCtx = document.getElementById('tdhChart');
        if (tdhCtx) {
            new Chart(tdhCtx, {
                type: 'line',
                data: {
                    labels: flows,
                    datasets: [
                        {
                            label: 'Curva de Bomba (TDH)',
                            data: TDHs,
                            borderColor: '#00BFA5',
                            backgroundColor: 'rgba(0, 191, 165, 0.1)',
                            borderWidth: 2,
                            tension: 0.4
                        },
                        {
                            label: 'Curva del Sistema',
                            data: systemCurve,
                            borderColor: '#7C4DFF',
                            backgroundColor: 'rgba(124, 77, 255, 0.1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'TDH vs Flujo',
                            color: '#FFFFFF'
                        },
                        legend: {
                            labels: { color: '#B0B0B0' }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: `Flujo (${flowUnitLabel})`,
                                color: '#B0B0B0'
                            },
                            ticks: { color: '#B0B0B0' },
                            grid: { color: '#333' }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'TDH (m)',
                                color: '#B0B0B0'
                            },
                            ticks: { color: '#B0B0B0' },
                            grid: { color: '#333' }
                        }
                    }
                }
            });
        }

        // Gráfico NPSH
        const npshCtx = document.getElementById('npshChart');
        if (npshCtx) {
            new Chart(npshCtx, {
                type: 'line',
                data: {
                    labels: flows,
                    datasets: [
                        {
                            label: 'NPSH Requerido',
                            data: NPSHrs,
                            borderColor: '#FF5252',
                            backgroundColor: 'rgba(255, 82, 82, 0.1)',
                            borderWidth: 2,
                            tension: 0.4
                        },
                        {
                            label: 'NPSH Disponible',
                            data: flows.map(() => results.NPSH.available),
                            borderColor: '#69F0AE',
                            backgroundColor: 'rgba(105, 240, 174, 0.1)',
                            borderWidth: 2,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'NPSH vs Flujo',
                            color: '#FFFFFF'
                        },
                        legend: {
                            labels: { color: '#B0B0B0' }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: `Flujo (${flowUnitLabel})`,
                                color: '#B0B0B0'
                            },
                            ticks: { color: '#B0B0B0' },
                            grid: { color: '#333' }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'NPSH (m)',
                                color: '#B0B0B0'
                            },
                            ticks: { color: '#B0B0B0' },
                            grid: { color: '#333' }
                        }
                    }
                }
            });
        }
    },

    getResultsRecommendations(results) {
        const recommendations = results.overallStatus.recommendations || [];

        return `
            <div class="suggestions-list">
                <h3>Recomendaciones</h3>
                ${recommendations.map(rec => `
                    <div class="suggestion-item">
                        <div class="suggestion-icon">💡</div>
                        <div class="suggestion-text">${rec}</div>
                    </div>
                `).join('')}
            </div>

            <div class="form-actions">
                <button class="btn btn-secondary" onclick="window.print()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 6 2 18 2"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Imprimir Reporte
                </button>
                <button class="btn btn-primary" onclick="location.reload()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Nuevo cálculo
                </button>
            </div>
        `;
    }
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.StepManager = StepManager;
}