/**
 * PUNTO DE ENTRADA - P2603 SW-K60
 * Inicialización de la aplicación
 */

// ===== INICIALIZACIÓN =====

// Función para verificar que todas las dependencias estén disponibles
function checkDependencies() {
    const required = [
        'State', 'StepManager',
        'getPulpData', 'getAllPulpTypes',
        'getPipeData', 'getAvailableSizes',
        'getFitting', 'getAllCategories',
        'getWaterProperties', 'getWaterVaporPressure',
        'calculateVelocity', 'calculatePulpDensity',
        'determineFlowRegion', 'calculateKmod',
        'validatePipeVelocity',
        'calculatePumpingSystem',
        'formatNumber', 'formatDate',
        'exportToJSON', 'importFromJSON',
        'flowUnit_to_L_s', 'L_s_to_flowUnit',
        'Chart'
    ];

    const missing = required.filter(name => typeof window[name] === 'undefined');

    if (missing.length > 0) {
        console.error('Dependencias faltantes:', missing);
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('P2603 SW-K60 - Inicializando...');

    // Esperar un momento más para asegurar que todos los scripts se cargaron
    setTimeout(() => {
        // Verificar dependencias
        if (!checkDependencies()) {
            console.error('Error: Faltan dependencias críticas. La aplicación puede no funcionar correctamente.');
            // Mostrar mensaje al usuario
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; gap: 20px; padding: 20px;">
                    <h1 style="color: #ff5252;">Error de Carga</h1>
                    <p style="color: #b0b0b0;">No se pudieron cargar todas las dependencias de la aplicación.</p>
                    <p style="color: #757575;">Por favor, recargue la página o contacte al administrador.</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #00BFA5; color: #121212; border: none; border-radius: 4px; cursor: pointer;">Recargar</button>
                </div>
            `;
            return;
        }

        // Cargar estado guardado SOLO si hay parámetro ?restore=true en URL
        const urlParams = new URLSearchParams(window.location.search);
        const shouldRestore = urlParams.get('restore') === 'true';
        if (shouldRestore) {
            const loaded = State.loadFromLocalStorage();
            if (loaded) {
                console.log('✓ Estado previo restaurado desde localStorage');
            }
        } else {
            // Limpiar cualquier estado previo para comenzar fresco
            State.clearLocalStorage();
            console.log('✓ Iniciando con estado limpio');
        }

        // Inicializar StepManager
        StepManager.init();


        // Suscribir a cambios de estado
        State.subscribe((path, value, fullState) => {
            console.log(`State changed: ${path} =`, value);
        });

        // Mostrar información de la aplicación
        showAboutInfo();

        // Inicializar nuevo cálculo
        initNewCalculation();

        // Inicializar ayuda
        initHelp();

        // Inicializar botones del modal de resultados
        initResultsModalButtons();

        console.log('P2603 SW-K60 - Inicialización completa');
    }, 100);
});

// ===== FUNCIONES GLOBALES =====

/**
 * Mostrar información "Acerca de"
 */
function showAboutInfo() {
    const aboutBtn = document.getElementById('btnAbout');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content modal-medium">
                    <div class="modal-header">
                        <h2>Acerca de P2603 SW-K60</h2>
                        <button class="btn-icon close-modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <img src="assets/images/DML.png" alt="DML" style="height: 60px; margin: 0 1rem;">
                            <img src="assets/images/SW.png" alt="Smurfit Westrock" style="height: 50px; margin: 0 1rem;">
                        </div>
                        <h3 style="text-align: center; color: var(--accent-primary); margin-bottom: 1rem;">
                            Cálculo Hidráulico de Bombas de Pulpa
                        </h3>
                        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 1.5rem;">
                            Aplicación web para evaluación y especificación de bombas<br>
                            en sistemas de bombeo de pulpa de papel
                        </p>
                        <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                            <p><strong>Desarrollado por:</strong></p>
                            <p>DML INGENIEROS para Smurfit Westrock Colombia</p>
                            <p><strong>Autores:</strong></p>
                            <p>Ing. Jonathan Arboleda Genes</p>
                            <p>Ing. Herminsul Rosero</p>
                        </div>
                        <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px;">
                            <p><strong>Versión:</strong> 1.0</p>
                            <p><strong>Fecha:</strong> 2025</p>
                            <p><strong>Basado en:</strong></p>
                            <ul style="margin: 0.5rem 0 0 1rem; padding-left: 1.5rem;">
                                <li>TAPPI TIP 0410-14</li>
                                <li>Correlaciones de Duffy y Möller</li>
                                <li>Hydraulic Institute Standards</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Cerrar modal
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    }
}

/**
 * Iniciar nuevo cálculo
 */
function initNewCalculation() {
    const newCalcBtn = document.getElementById('btnNewCalculation');
    if (newCalcBtn) {
        newCalcBtn.addEventListener('click', () => {
            if (confirm('¿Está seguro que desea iniciar un nuevo cálculo? Todos los datos actuales se perderán.')) {
                // Resetear estado completamente
                State.reset();

                // Cerrar modal de resultados si está abierto
                const resultsModal = document.getElementById('resultsModal');
                if (resultsModal) {
                    resultsModal.classList.remove('active');
                }

                // Forzar ir al paso 1 y re-renderizar
                StepManager.currentStep = 1;
                StepManager.renderStepper();
                StepManager.renderCurrentStep();

                // Notificar al usuario
                console.log('✓ Nuevo cálculo iniciado - todos los datos han sido reiniciados');
            }
        });
    }
}

/**
 * Mostrar ayuda
 */
function initHelp() {
    const helpBtn = document.getElementById('btnHelp');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content modal-medium">
                    <div class="modal-header">
                        <h2>Ayuda</h2>
                        <button class="btn-icon close-modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h3>Guía de Uso</h3>

                        <div class="help-section">
                            <h4>Paso 1: Datos del Proceso</h4>
                            <p>Seleccione el tipo de pulpa e ingrese la consistencia y temperatura de operación.</p>
                        </div>

                        <div class="help-section">
                            <h4>Paso 2-3: Tuberías</h4>
                            <p>Especifique las características de las tuberías de succión y descarga, incluyendo diámetro, longitud, y accesorios.</p>
                        </div>

                        <div class="help-section">
                            <h4>Paso 4: Datos de Bomba</h4>
                            <p>Ingrese los datos de la bomba (fabricante, modelo, impulsor, RPM, flujo de diseño).</p>
                        </div>

                        <div class="help-section">
                            <h4>Paso 5: Curva Característica</h4>
                            <p>Ingrese al menos 3 puntos de la curva H-Q de la bomba (flujo, TDH, NPSHr, eficiencia).</p>
                        </div>

                        <div class="help-section">
                            <h4>Paso 6: Condiciones de Operación</h4>
                            <p>Especifique presiones y elevaciones de los tanques de succión y descarga.</p>
                        </div>

                        <div class="help-section">
                            <h4>Paso 7: Resultados</h4>
                            <p>Revise los resultados del cálculo, gráficos y recomendaciones.</p>
                        </div>

                        <div class="alert alert-info">
                            <strong>Tip:</strong> Los datos se guardan automáticamente. Puede exportarlos para usarlos después.
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Cerrar modal
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    }
}

/**
 * Inicializar botones del modal de resultados
 */
function initResultsModalButtons() {
    const resultsModal = document.getElementById('resultsModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnPrintReport = document.getElementById('btnPrintReport');
    const btnExportPDF = document.getElementById('btnExportPDF');

    if (btnCloseModal && resultsModal) {
        btnCloseModal.addEventListener('click', () => {
            resultsModal.classList.remove('active');
        });
    }

    if (btnPrintReport) {
        btnPrintReport.addEventListener('click', () => {
            window.print();
        });
    }

    if (btnExportPDF) {
        btnExportPDF.addEventListener('click', () => {
            // Exportar a PDF usando la funcionalidad de impresión del navegador
            // El usuario puede seleccionar "Guardar como PDF" en el diálogo de impresión
            window.print();
        });
    }
}

// ===== UTILIDADES DE IMPRESIÓN =====

/**
 * Preparar documento para impresión
 */
function preparePrintDocument() {
    // Agregar header de impresión
    const printHeader = document.createElement('div');
    printHeader.className = 'print-only print-cover';
    printHeader.innerHTML = `
        <div class="print-cover-header">
            <img src="assets/images/DML.png" class="print-logo-dml" alt="DML">
        </div>
        <div class="print-cover-title">
            <h1>VALIDACIÓN DE BOMBA DE PULPA</h1>
            <h2>Proyecto: P2603 SW-K60</h2>
        </div>
        <div class="print-cover-footer">
            <div class="print-cover-info">
                <p><strong>Fecha:</strong> ${formatDate()}</p>
                <p><strong>Elaborado por:</strong> Ing. Jonathan Arboleda Genes</p>
                <p><strong>Revisado por:</strong> Ing. Herminsul Rosero</p>
            </div>
            <div class="print-cover-logos">
                <img src="assets/images/SW.png" class="print-logo-sw" alt="Smurfit Westrock">
            </div>
        </div>
    `;
    document.body.prepend(printHeader);

    // Agregar botón de volver
    const backButton = document.createElement('button');
    backButton.className = 'print-only';
    backButton.textContent = '← Volver a la aplicación';
    backButton.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; padding: 10px 20px;';
    backButton.onclick = () => {
        printHeader.remove();
        backButton.remove();
        window.location.reload();
    };
    document.body.appendChild(backButton);
}

// Interceptar impresión
window.addEventListener('beforeprint', preparePrintDocument);

window.addEventListener('afterprint', () => {
    // Limpiar elementos de impresión
    document.querySelectorAll('.print-only').forEach(el => el.remove());
});

// ===== MANEJO DE ERRORES =====

window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
});

// ===== SERVICIO WORKER (opcional para PWA) =====

if ('serviceWorker' in navigator) {
    // Registrar service worker si está disponible
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registrado'))
    //     .catch(err => console.log('Service Worker no registrado:', err));
}

// ===== CONSOLA =====

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                 P2603 SW-K60                                     ║
║         Cálculo Hidráulico de Bombas de Pulpa                 ║
║                                                                ║
║  Desarrollado por: DML INGENIEROS                              ║
║  Para: Smurfit Westrock Colombia                               ║
║  Autores: Ing. Jonathan Arboleda Genes, Ing. Herminsul Rosero  ║
║                                                                ║
║  Versión: 1.0 | Fecha: 2025                                   ║
╚══════════════════════════════════════════════════════════════════╝
`);
