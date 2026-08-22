/* =========================================================
   GlobalCurrency - Lógica principal
   ========================================================= */

// ---------- Datos simulados de monedas ----------
// Cada objeto contiene la información base de una moneda.
// En una versión real, estos datos se obtendrían de una API.
const currenciesData = [
    { country: 'Estados Unidos', currency: 'Dólar estadounidense', code: 'USD', symbol: '$', flag: '🇺🇸', baseValue: 1.0, decimals: 2 },
    { country: 'Unión Europea', currency: 'Euro', code: 'EUR', symbol: '€', flag: '🇪🇺', baseValue: 0.92, decimals: 2 },
    { country: 'Reino Unido', currency: 'Libra esterlina', code: 'GBP', symbol: '£', flag: '🇬🇧', baseValue: 0.79, decimals: 2 },
    { country: 'Japón', currency: 'Yen japonés', code: 'JPY', symbol: '¥', flag: '🇯🇵', baseValue: 149.5, decimals: 1 },
    { country: 'China', currency: 'Yuan chino', code: 'CNY', symbol: '¥', flag: '🇨🇳', baseValue: 7.24, decimals: 2 },
    { country: 'Canadá', currency: 'Dólar canadiense', code: 'CAD', symbol: 'C$', flag: '🇨🇦', baseValue: 1.36, decimals: 2 },
    { country: 'Australia', currency: 'Dólar australiano', code: 'AUD', symbol: 'A$', flag: '🇦🇺', baseValue: 0.65, decimals: 2 },
    { country: 'Suiza', currency: 'Franco suizo', code: 'CHF', symbol: 'CHF', flag: '🇨🇭', baseValue: 0.88, decimals: 2 },
    { country: 'India', currency: 'Rupia india', code: 'INR', symbol: '₹', flag: '🇮🇳', baseValue: 83.2, decimals: 2 },
    { country: 'Brasil', currency: 'Real brasileño', code: 'BRL', symbol: 'R$', flag: '🇧🇷', baseValue: 4.95, decimals: 2 },
    { country: 'México', currency: 'Peso mexicano', code: 'MXN', symbol: 'MX$', flag: '🇲🇽', baseValue: 16.8, decimals: 2 },
    { country: 'Colombia', currency: 'Peso colombiano', code: 'COP', symbol: 'COL$', flag: '🇨🇴', baseValue: 3920.0, decimals: 2 },
    { country: 'Corea del Sur', currency: 'Won surcoreano', code: 'KRW', symbol: '₩', flag: '🇰🇷', baseValue: 1320.0, decimals: 0 },
    { country: 'Nigeria', currency: 'Naira nigeriana', code: 'NGN', symbol: '₦', flag: '🇳🇬', baseValue: 780.0, decimals: 2 }
];

// ---------- Variables globales ----------
// Historial de valores por moneda para las mini gráficas
const historyMap = new Map(); // key: code, value: array de números
const MAX_HISTORY = 20; // cuántos puntos mostrar en la mini gráfica

// Referencias al DOM
const currencyGrid = document.getElementById('currency-grid');
const mainChart = document.getElementById('main-chart');
const gainersList = document.getElementById('gainers-list');
const losersList = document.getElementById('losers-list');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');

// ---------- Inicialización ----------
document.addEventListener('DOMContentLoaded', () => {
    renderCurrencyCards();
    startPriceSimulation();
    startMainChartSimulation();
    renderGainersLosers();
    setupEventListeners();
    setupScrollReveal();
});

// ---------- Funciones de renderizado ----------

/**
 * Crea las tarjetas de monedas y las inserta en el grid.
 * Además inicializa el historial con el valor base.
 */
function renderCurrencyCards() {
    currencyGrid.innerHTML = '';
    currenciesData.forEach((currency, index) => {
        // Inicializar historial con valores cercanos al base para que la gráfica no comience plana
        const history = [];
        for (let i = 0; i < MAX_HISTORY; i++) {
            history.push(currency.baseValue * (1 + (Math.random() - 0.5) * 0.001));
        }
        historyMap.set(currency.code, history);

        // Crear la tarjeta
        const card = document.createElement('div');
        card.className = 'card currency-card reveal';
        card.dataset.currency = currency.code;
        card.innerHTML = `
            <div class="currency-header">
                <span class="flag">${currency.flag}</span>
                <span class="currency-code">${currency.code}</span>
            </div>
            <div class="currency-country">${currency.country}</div>
            <div class="currency-name">${currency.currency}</div>
            <div class="currency-value" id="value-${currency.code}">${formatNumber(currency.baseValue, currency.decimals)}</div>
            <div class="currency-change" id="change-${currency.code}">
                <span class="change-icon">▲</span>
                <span class="change-percent">0.00%</span>
            </div>
            <div class="currency-chart" id="chart-${currency.code}"></div>
        `;
        currencyGrid.appendChild(card);
    });
}

/**
 * Actualiza el valor, el porcentaje y la mini gráfica de una moneda específica.
 * @param {Object} currency - Objeto con la información de la moneda.
 */
function updateCurrencyCard(currency) {
    const code = currency.code;
    const history = historyMap.get(code);
    const current = history[history.length - 1];

    // Calcular el porcentaje de cambio respecto al valor base
    const percent = ((current - currency.baseValue) / currency.baseValue) * 100;
    const isUp = percent >= 0;

    // Actualizar el valor mostrado
    const valueEl = document.getElementById(`value-${code}`);
    valueEl.textContent = formatNumber(current, currency.decimals);
    valueEl.className = `currency-value ${isUp ? 'up' : 'down'}`;

    // Actualizar el indicador de cambio
    const changeEl = document.getElementById(`change-${code}`);
    const icon = changeEl.querySelector('.change-icon');
    const percentSpan = changeEl.querySelector('.change-percent');
    icon.textContent = isUp ? '▲' : '▼';
    icon.style.color = isUp ? '#10b981' : '#ef4444';
    percentSpan.textContent = `${isUp ? '+' : ''}${percent.toFixed(2)}%`;
    percentSpan.className = `change-percent ${isUp ? 'change-up' : 'change-down'}`;

    // Redibujar la mini gráfica
    drawSparkline(code, history);
}

/**
 * Dibuja una mini gráfica de línea dentro de la tarjeta.
 * @param {string} code - Código de la moneda.
 * @param {number[]} data - Historial de valores.
 */
function drawSparkline(code, data) {
    const container = document.getElementById(`chart-${code}`);
    if (!container) return;

    // Crear SVG
    const width = container.clientWidth || 200;
    const height = container.clientHeight || 50;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    // Crear polilínea
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#3b82f6');
    polyline.setAttribute('stroke-width', '2');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(polyline);
    container.innerHTML = '';
    container.appendChild(svg);
}

/**
 * Formatea un número según el número de decimales y agrega separadores de miles.
 * @param {number} value - Valor a formatear.
 * @param {number} decimals - Número de decimales.
 * @returns {string} Número formateado.
 */
function formatNumber(value, decimals) {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// ---------- Simulación de precios en tiempo real ----------

/**
 * Inicia la simulación de fluctuación de precios.
 * Cada 3 segundos, para cada moneda, se agrega un pequeño cambio aleatorio
 * al último valor y se actualiza la tarjeta.
 */
function startPriceSimulation() {
    setInterval(() => {
        currenciesData.forEach(currency => {
            const history = historyMap.get(currency.code);
            const lastValue = history[history.length - 1];

            // Generar un cambio aleatorio pequeño (entre -0.15% y +0.15%)
            const maxChange = 0.0015; // 0.15%
            const delta = (Math.random() - 0.5) * 2 * maxChange;
            const newValue = lastValue * (1 + delta);

            // Asegurar que el valor no se aleje demasiado del base (máx ±1%)
            const maxDeviation = 0.01; // 1%
            const minAllowed = currency.baseValue * (1 - maxDeviation);
            const maxAllowed = currency.baseValue * (1 + maxDeviation);
            const clampedValue = Math.min(Math.max(newValue, minAllowed), maxAllowed);

            // Actualizar historial
            history.push(clampedValue);
            if (history.length > MAX_HISTORY) {
                history.shift();
            }

            // Actualizar la tarjeta
            updateCurrencyCard(currency);
        });
    }, 3000); // cada 3 segundos
}

// ---------- Gráfico principal de tendencias (simulado) ----------

let mainChartData = [];
const MAIN_CHART_MAX = 50;
let mainChartInitialized = false;

/**
 * Inicializa el gráfico principal con datos simulados.
 */
function startMainChartSimulation() {
    // Generar 20 puntos iniciales
    for (let i = 0; i < 20; i++) {
        mainChartData.push(100 + Math.random() * 10);
    }
    drawMainChart();

    // Actualizar cada 5 segundos
    setInterval(() => {
        const last = mainChartData[mainChartData.length - 1];
        const delta = (Math.random() - 0.5) * 2 * 1.5; // ±1.5
        const newVal = Math.max(80, Math.min(130, last + delta));
        mainChartData.push(newVal);
        if (mainChartData.length > MAIN_CHART_MAX) {
            mainChartData.shift();
        }
        drawMainChart();
    }, 5000);
}

/**
 * Dibuja el gráfico de líneas principal.
 */
function drawMainChart() {
    const svg = document.getElementById('main-chart');
    if (!svg) return;

    const width = 600;
    const height = 250;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Limpiar SVG
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Línea de fondo (rejilla)
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
        const y = (i / gridLines) * height;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', y);
        line.setAttribute('x2', width);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(255,255,255,0.05)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
    }

    // Línea principal
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    const points = mainChartData.map((value, i) => {
        const x = (i / (mainChartData.length - 1)) * width;
        const min = Math.min(...mainChartData);
        const max = Math.max(...mainChartData);
        const range = max - min || 1;
        const y = height - ((value - min) / range) * (height * 0.8) - height * 0.1;
        return `${x},${y}`;
    }).join(' ');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#3b82f6');
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(polyline);

    // Área bajo la línea (gradiente)
    const areaPoints = points + ` ${width},${height} 0,${height}`;
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    area.setAttribute('points', areaPoints);
    area.setAttribute('fill', 'rgba(59,130,246,0.15)');
    svg.insertBefore(area, polyline);
}

// ---------- Listas de ganadores y perdedores (simuladas) ----------

/**
 * Genera y muestra las listas de mayores alzas y bajas.
 * Se simulan datos aleatorios de algunas monedas.
 */
function renderGainersLosers() {
    // Crear copias con cambios aleatorios
    const gainers = [];
    const losers = [];
    currenciesData.forEach(currency => {
        const randomChange = (Math.random() - 0.5) * 4; // entre -2% y +2%
        const entry = {
            label: `${currency.flag} ${currency.code}`,
            change: randomChange
        };
        if (randomChange > 0) gainers.push(entry);
        else losers.push(entry);
    });

    // Ordenar por cambio absoluto
    gainers.sort((a, b) => b.change - a.change);
    losers.sort((a, b) => a.change - b.change);

    // Tomar top 5 de cada uno
    const topGainers = gainers.slice(0, 5);
    const topLosers = losers.slice(0, 5);

    // Renderizar listas
    gainersList.innerHTML = topGainers.map(item => `
        <li>
            <span class="currency-label">${item.label}</span>
            <span class="change change-up">+${item.change.toFixed(2)}%</span>
        </li>
    `).join('');

    losersList.innerHTML = topLosers.map(item => `
        <li>
            <span class="currency-label">${item.label}</span>
            <span class="change change-down">${item.change.toFixed(2)}%</span>
        </li>
    `).join('');
}

// ---------- Eventos y funcionalidades interactivas ----------

/**
 * Configura todos los event listeners de la página.
 */
function setupEventListeners() {
    // --- Menú hamburguesa ---
    hamburger.addEventListener('click', toggleMobileMenu);

    // Cerrar menú al hacer clic en un enlace (solo móvil)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // --- Navbar con fondo al hacer scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Modales de consejos ---
    document.querySelectorAll('.btn-ver-mas').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tipTarget;
            openTipModal(target);
        });
    });

    modalClose.addEventListener('click', closeTipModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeTipModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeTipModal();
        }
    });
}

/**
 * Alterna la visibilidad del menú móvil.
 */
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

/**
 * Abre el modal con la información adicional según el tipo de empresa.
 * @param {string} type - 'pequena', 'mediana' o 'grande'.
 */
function openTipModal(type) {
    let title, content;
    switch (type) {
        case 'pequena':
            title = 'Pequeña empresa';
            content = `
                <p><strong>Recomendaciones detalladas:</strong></p>
                <ul>
                    <li>Mantén un registro estricto de todos los gastos operativos y administrativos.</li>
                    <li>Elabora un presupuesto mensual y compáralo con los ingresos reales.</li>
                    <li>Reinvierte una parte de las utilidades en áreas clave como marketing y capacitación.</li>
                    <li>Establece metas de crecimiento realistas y medibles a corto plazo.</li>
                    <li>Investiga constantemente a tu competencia y a tus clientes para adaptarte rápidamente.</li>
                </ul>
                <p><em>Consejo adicional:</em> Considera usar herramientas digitales gratuitas o de bajo costo para gestionar tu contabilidad.</p>
            `;
            break;
        case 'mediana':
            title = 'Mediana empresa';
            content = `
                <p><strong>Recomendaciones detalladas:</strong></p>
                <ul>
                    <li>Antes de expandirte, asegura que tu operación actual sea rentable y estable.</li>
                    <li>Automatiza procesos repetitivos mediante software especializado (ERP, CRM).</li>
                    <li>Explora canales de venta digitales para llegar a nuevos mercados.</li>
                    <li>Diversifica tu cartera de productos o servicios para reducir riesgos.</li>
                    <li>Invierte en la formación y retención de talento clave para tu crecimiento.</li>
                </ul>
                <p><em>Consejo adicional:</em> Realiza auditorías internas periódicas para identificar ineficiencias.</p>
            `;
            break;
        case 'grande':
            title = 'Gran empresa';
            content = `
                <p><strong>Recomendaciones detalladas:</strong></p>
                <ul>
                    <li>Desarrolla alianzas estratégicas con socios internacionales para acceder a nuevos mercados.</li>
                    <li>Implementa un sistema integral de gestión de riesgos financieros y operativos.</li>
                    <li>Fomenta una cultura de innovación mediante laboratorios de ideas y proyectos piloto.</li>
                    <li>Utiliza análisis de datos avanzados para la toma de decisiones.</li>
                    <li>Planifica inversiones a largo plazo alineadas con la visión corporativa.</li>
                </ul>
                <p><em>Consejo adicional:</em> Mantén un comité de ética y cumplimiento normativo actualizado.</p>
            `;
            break;
        default:
            title = 'Información';
            content = '<p>No hay información disponible.</p>';
    }

    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // evitar scroll de fondo
}

/**
 * Cierra el modal activo.
 */
function closeTipModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ---------- Animación de aparición al hacer scroll (Intersection Observer) ----------

/**
 * Configura la observación de elementos con clase .reveal
 * para agregarles la clase .active cuando entran al viewport.
 */
function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Una vez visible, dejar de observar para mejorar rendimiento
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}