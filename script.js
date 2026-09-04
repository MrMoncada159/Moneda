/* =========================================================
   GlobalCurrency - Lógica y Funcionalidades Interactivas
   Proyecto Institucional: Colegio Bilingüe Los Ángeles
   ========================================================= */

// =========================================================
// 1. ESTRUCTURA DE DATOS: 17 MONEDAS INTERNACIONALES
// =========================================================
const currenciesData = [
    { country: 'Estados Unidos', currency: 'Dólar estadounidense', code: 'USD', symbol: '$', flag: '🇺🇸', region: 'america', baseValue: 1.00, currentValue: 1.00, decimals: 2 },
    { country: 'Unión Europea', currency: 'Euro', code: 'EUR', symbol: '€', flag: '🇪🇺', region: 'europe', baseValue: 0.8601, currentValue: 0.8601, decimals: 4 },
    { country: 'Reino Unido', currency: 'Libra esterlina', code: 'GBP', symbol: '£', flag: '🇬🇧', region: 'europe', baseValue: 0.7392, currentValue: 0.7392, decimals: 4 },
    { country: 'Japón', currency: 'Yen japonés', code: 'JPY', symbol: '¥', flag: '🇯🇵', region: 'asia-oceania', baseValue: 155.87, currentValue: 155.87, decimals: 2 },
    { country: 'China', currency: 'Yuan chino', code: 'CNY', symbol: '¥', flag: '🇨🇳', region: 'asia-oceania', baseValue: 7.1000, currentValue: 7.1000, decimals: 4 },
    { country: 'Canadá', currency: 'Dólar canadiense', code: 'CAD', symbol: 'C$', flag: '🇨🇦', region: 'america', baseValue: 1.3796, currentValue: 1.3796, decimals: 4 },
    { country: 'Australia', currency: 'Dólar australiano', code: 'AUD', symbol: 'A$', flag: '🇦🇺', region: 'asia-oceania', baseValue: 1.5150, currentValue: 1.5150, decimals: 4 },
    { country: 'Suiza', currency: 'Franco suizo', code: 'CHF', symbol: 'CHF', flag: '🇨🇭', region: 'europe', baseValue: 0.9330, currentValue: 0.9330, decimals: 4 },
    { country: 'India', currency: 'Rupia india', code: 'INR', symbol: '₹', flag: '🇮🇳', region: 'asia-oceania', baseValue: 83.50, currentValue: 83.50, decimals: 2 },
    { country: 'Brasil', currency: 'Real brasileño', code: 'BRL', symbol: 'R$', flag: '🇧🇷', region: 'america', baseValue: 5.45, currentValue: 5.45, decimals: 4 },
    { country: 'México', currency: 'Peso mexicano', code: 'MXN', symbol: 'MX$', flag: '🇲🇽', region: 'america', baseValue: 17.15, currentValue: 17.15, decimals: 2 },
    { country: 'Colombia', currency: 'Peso colombiano', code: 'COP', symbol: 'COL$', flag: '🇨🇴', region: 'america', baseValue: 3141.36, currentValue: 3141.36, decimals: 2 },
    { country: 'Corea del Sur', currency: 'Won surcoreano', code: 'KRW', symbol: '₩', flag: '🇰🇷', region: 'asia-oceania', baseValue: 1365.00, currentValue: 1365.00, decimals: 0 },
    { country: 'Nueva Zelanda', currency: 'Dólar neozelandés', code: 'NZD', symbol: 'NZ$', flag: '🇳🇿', region: 'asia-oceania', baseValue: 1.6350, currentValue: 1.6350, decimals: 4 },
    { country: 'Nigeria', currency: 'Naira nigeriana', code: 'NGN', symbol: '₦', flag: '🇳🇬', region: 'africa', baseValue: 1580.00, currentValue: 1580.00, decimals: 2 },
    { country: 'Argelia', currency: 'Dinar argelino', code: 'DZD', symbol: 'DA', flag: '🇩🇿', region: 'africa', baseValue: 133.2551, currentValue: 133.2551, decimals: 2 },
    { country: 'Bitcoin', currency: 'Bitcoin', code: 'BTC', symbol: '₿', flag: '🪙', region: 'crypto', baseValue: 0.00001236, currentValue: 0.00001236, decimals: 8 }
];

// =========================================================
// 2. VARIABLES GLOBALES Y CONTROL DE ESTADO
// =========================================================
// Historial de cotizaciones para las mini gráficas (Sparklines)
const historyMap = new Map(); // Llave: código de divisa, Valor: array de números
const MAX_HISTORY_POINTS = 22; // Cantidad de puntos mostrados en cada sparkline

// Estado de filtrado de monedas
let currentRegionFilter = 'all';
let revealObserver = null;

// Estado del gráfico principal de tendencias
let currentChartPeriod = '1D';
let mainChartData = [];
const MAIN_CHART_POINTS = 35;

// Referencias a elementos del DOM
const currencyGrid = document.getElementById('currency-grid');
const tickerTrack = document.getElementById('ticker-track');
const heroQuickRates = document.getElementById('hero-quick-rates');
const mainChartSvg = document.getElementById('main-chart');
const gainersList = document.getElementById('gainers-list');
const losersList = document.getElementById('losers-list');
const lastUpdateText = document.getElementById('last-update-text');

// Referencias de la Calculadora de Conversión
const calcAmountInput = document.getElementById('calc-amount');
const calcAmountPrefix = document.getElementById('calc-amount-prefix');
const calcFromSelect = document.getElementById('calc-from-currency');
const calcToSelect = document.getElementById('calc-to-currency');
const calcFromFlag = document.getElementById('calc-from-flag');
const calcToFlag = document.getElementById('calc-to-flag');
const btnSwap = document.getElementById('btn-swap-currencies');
const btnConvertAction = document.getElementById('btn-convert-action');
const calcFormulaText = document.getElementById('calc-formula-text');
const calcResultDisplay = document.getElementById('calc-result-display');
const calcDestFullName = document.getElementById('calc-dest-full-name');
const calcDirectRate = document.getElementById('calc-direct-rate');
const calcInverseRate = document.getElementById('calc-inverse-rate');
const calcSyncStatus = document.getElementById('calc-sync-status');
const quickAmtButtons = document.querySelectorAll('.quick-amt-btn');

// Referencias del Modal de Consejos
const modalOverlay = document.getElementById('modal-overlay');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const modalBtnClose = document.getElementById('modal-btn-close');

// Navegación
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// =========================================================
// 3. INICIALIZACIÓN DE LA APLICACIÓN
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar estatísticas hero y filtros
    const statCount = document.getElementById('stat-currencies-count');
    if (statCount) statCount.textContent = '17';
    
    const allPill = document.querySelector('.filter-pill[data-filter="all"]');
    if (allPill) allPill.textContent = `Todas las monedas (${currenciesData.length})`;

    // Inicializar historiales de datos con sutiles variaciones iniciales
    initializeCurrenciesHistory();

    // Renderizar componentes principales
    renderCurrencyCards();
    renderCurrencyTable();
    renderTrendCategories();
    initCalculatorSelectors();
    calculateConversion(); // Ejecutar primer cálculo
    initMarketTicker();
    renderHeroQuickRates();
    initMainChart(currentChartPeriod);
    renderRankings();

    // Iniciar bucles de simulación financiera en tiempo real
    startLivePriceSimulation();
    startMainChartSimulation();

    // Registrar escuchadores de eventos
    setupEventListeners();
    setupScrollReveal();
});

/**
 * Genera el historial base para cada moneda para que los gráficos sparkline
 * muestren curvas estéticas desde el primer instante.
 */
function initializeCurrenciesHistory() {
    currenciesData.forEach(curr => {
        const history = [];
        for (let i = 0; i < MAX_HISTORY_POINTS; i++) {
            // Variación sutil inicial dentro de ±0.3%
            const initialVariation = curr.baseValue * (1 + (Math.sin(i / 2) * 0.003) + (Math.random() - 0.5) * 0.002);
            history.push(initialVariation);
        }
        historyMap.set(curr.code, history);
        curr.currentValue = history[history.length - 1];
    });
}

// =========================================================
// 4. RENDERIZADO DE MONEDAS Y GRÁFICAS SPARKLINE
// =========================================================

/**
 * Renderiza las tarjetas de divisas en la grilla según el filtro seleccionado.
 */
function renderCurrencyCards() {
    if (!currencyGrid) return;
    currencyGrid.innerHTML = '';

    const filtered = currentRegionFilter === 'all'
        ? currenciesData
        : currenciesData.filter(c => c.region === currentRegionFilter);

    filtered.forEach(currency => {
        const history = historyMap.get(currency.code);
        const current = history[history.length - 1];
        const percentChange = ((current - currency.baseValue) / currency.baseValue) * 100;
        const isUp = percentChange >= 0;

        const card = document.createElement('div');
        card.className = 'card currency-card reveal';
        card.id = `currency-card-${currency.code}`;
        card.dataset.code = currency.code;
        card.dataset.region = currency.region;

        card.innerHTML = `
            <div class="currency-card-top">
                <span class="flag-badge" title="${currency.country}">${currency.flag}</span>
                <div class="currency-badge-box">
                    <span class="currency-code-pill">${currency.code}</span>
                </div>
            </div>
            
            <div class="currency-country-name">${currency.country}</div>
            <div class="currency-official-name">${currency.currency}</div>
            
            <div class="currency-price-wrap">
                <div class="currency-price-label">Valor en USD (Base)</div>
                <div class="currency-price-value" id="val-${currency.code}">
                    ${currency.symbol} ${formatNumber(current, currency.decimals)}
                </div>
            </div>

            <div class="currency-delta-row">
                <div class="delta-pill ${isUp ? 'up' : 'down'}" id="delta-${currency.code}">
                    <span class="delta-icon">${isUp ? '▲' : '▼'}</span>
                    <span class="delta-val">${isUp ? '+' : ''}${percentChange.toFixed(2)}%</span>
                </div>
                <span class="currency-symbol-tag">Símbolo: <strong>${currency.symbol}</strong></span>
            </div>

            <div class="currency-sparkline" id="sparkline-${currency.code}">
                <!-- SVG Sparkline inyectado por drawSparkline -->
            </div>
        `;

        currencyGrid.appendChild(card);
        drawSparkline(currency.code, history, isUp);
    });
}

/**
 * Dibuja un gráfico sparkline SVG dinámico y estilizado para cada tarjeta.
 * @param {string} code - Código ISO de la divisa (ej. USD, EUR).
 * @param {number[]} data - Serie temporal de cotizaciones.
 * @param {boolean} isUp - Indica si la tendencia actual es positiva.
 */
function drawSparkline(code, data, isUp) {
    const container = document.getElementById(`sparkline-${code}`);
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 48;
    const padding = 4;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = (max - min) || (min * 0.005) || 1;

    // Calcular puntos de la polilínea
    const points = data.map((val, idx) => {
        const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isUp ? '#10b981' : '#f43f5e';
    const fillColor = isUp ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

    // Construir área bajo la curva
    const areaPoints = `${points} ${width - padding},${height} ${padding},${height}`;

    const svg = `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <polygon points="${areaPoints}" fill="${fillColor}" />
            <polyline points="${points}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    `;

    container.innerHTML = svg;
}

// =========================================================
// TABLA Y TENDENCIAS
// =========================================================

function renderCurrencyTable() {
    const tableBody = document.getElementById('currencies-table-body');
    if (!tableBody) return;
    let html = '';
    currenciesData.forEach(c => {
        const history = historyMap.get(c.code);
        const current = history ? history[history.length - 1] : c.currentValue;
        const percent = ((current - c.baseValue) / c.baseValue) * 100;
        const isUp = percent >= 0;
        let arrow = '➖';
        if (percent >= 0.05) arrow = '▲';
        else if (percent <= -0.05) arrow = '▼';

        html += `
            <tr>
                <td>${c.flag} ${c.code}</td>
                <td>${c.currency}</td>
                <td>${c.symbol}</td>
                <td>${formatNumber(current, c.decimals)}</td>
                <td class="${isUp ? 'text-green' : 'text-red'}">${isUp ? '+' : ''}${percent.toFixed(2)}%</td>
                <td>${arrow}</td>
            </tr>
        `;
    });
    tableBody.innerHTML = html;
}

function renderTrendCategories() {
    const upList = document.getElementById('trend-up-list');
    const downList = document.getElementById('trend-down-list');
    const stableList = document.getElementById('trend-stable-list');
    if (!upList || !downList || !stableList) return;

    let upHtml = '', downHtml = '', stableHtml = '';

    currenciesData.forEach(c => {
        const history = historyMap.get(c.code);
        const current = history ? history[history.length - 1] : c.currentValue;
        const percent = ((current - c.baseValue) / c.baseValue) * 100;
        
        const itemHtml = `<li>${c.flag} ${c.code}: ${percent > 0 ? '+' : ''}${percent.toFixed(2)}%</li>`;
        
        if (Math.abs(percent) < 0.05) {
            stableHtml += itemHtml;
        } else if (percent >= 0) {
            upHtml += itemHtml;
        } else {
            downHtml += itemHtml;
        }
    });

    upList.innerHTML = upHtml || '<li>Sin datos</li>';
    downList.innerHTML = downHtml || '<li>Sin datos</li>';
    stableList.innerHTML = stableHtml || '<li>Sin datos</li>';
}

// =========================================================
// 5. SIMULACIÓN DE PRECIOS EN TIEMPO REAL
// =========================================================

/**
 * Inicia la simulación periódica de variaciones financieras cada 3 segundos.
 * Las variaciones son suaves, graduales y naturales como en una plataforma de trading real.
 */
function startLivePriceSimulation() {
    setInterval(() => {
        currenciesData.forEach(currency => {
            const history = historyMap.get(currency.code);
            const lastVal = history[history.length - 1];

            // Generar una fluctuación realista
            let maxSwing = 0.0012;
            let maxDeviation = 0.018;
            
            if (currency.code === 'BTC') {
                maxSwing = 0.003;
                maxDeviation = 0.04;
            }
            
            const deltaPercent = (Math.random() - 0.5) * 2 * maxSwing;
            let newVal = lastVal * (1 + deltaPercent);

            const minLimit = currency.baseValue * (1 - maxDeviation);
            const maxLimit = currency.baseValue * (1 + maxDeviation);
            newVal = Math.min(Math.max(newVal, minLimit), maxLimit);

            // Actualizar datos
            history.push(newVal);
            if (history.length > MAX_HISTORY_POINTS) {
                history.shift();
            }
            currency.currentValue = newVal;

            // Actualizar tarjeta visual si está en el DOM
            updateCurrencyCardDOM(currency, lastVal, newVal);
        });

        // Actualizar componentes dependientes de los precios en tiempo real
        calculateConversion(); // Recalcula la calculadora en tiempo real
        updateMarketTickerDOM();
        updateHeroQuickRatesDOM();
        renderRankings();
        renderCurrencyTable();
        renderTrendCategories();
        updateTimestamp();

    }, 3000); // Frecuencia: cada 3 segundos
}

/**
 * Actualiza la tarjeta de una moneda en el DOM con animación de pulso (verde/rojo).
 */
function updateCurrencyCardDOM(currency, oldVal, newVal) {
    const valElement = document.getElementById(`val-${currency.code}`);
    const deltaElement = document.getElementById(`delta-${currency.code}`);
    if (!valElement || !deltaElement) return;

    const isIncrease = newVal >= oldVal;
    const totalPercentChange = ((newVal - currency.baseValue) / currency.baseValue) * 100;
    const isOverallUp = totalPercentChange >= 0;

    // Actualizar valor con formato
    valElement.textContent = `${currency.symbol} ${formatNumber(newVal, currency.decimals)}`;

    // Efecto de pulso y color momentáneo
    valElement.classList.remove('flash-up', 'flash-down');
    void valElement.offsetWidth; // Forzar reflujo para reiniciar la animación CSS
    valElement.classList.add(isIncrease ? 'flash-up' : 'flash-down');

    // Quitar clase después de la animación
    setTimeout(() => {
        valElement.classList.remove('flash-up', 'flash-down');
    }, 800);

    // Actualizar delta badge
    deltaElement.className = `delta-pill ${isOverallUp ? 'up' : 'down'}`;
    deltaElement.innerHTML = `
        <span class="delta-icon">${isOverallUp ? '▲' : '▼'}</span>
        <span class="delta-val">${isOverallUp ? '+' : ''}${totalPercentChange.toFixed(2)}%</span>
    `;

    // Redibujar sparkline con la nueva serie
    const history = historyMap.get(currency.code);
    drawSparkline(currency.code, history, isOverallUp);
}

/**
 * Actualiza el texto de última sincronización.
 */
function updateTimestamp() {
    if (!lastUpdateText) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    lastUpdateText.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Última fluctuación: ${timeStr} (En vivo)</span>
    `;
}

// =========================================================
// 6. CALCULADORA DE CONVERSIÓN DE DIVISAS (EN TIEMPO REAL)
// =========================================================

/**
 * Inicializa las opciones de las 17 divisas en los selectores de origen y destino.
 */
function initCalculatorSelectors() {
    if (!calcFromSelect || !calcToSelect) return;

    calcFromSelect.innerHTML = '';
    calcToSelect.innerHTML = '';

    currenciesData.forEach(curr => {
        const optionFrom = document.createElement('option');
        optionFrom.value = curr.code;
        optionFrom.textContent = `${curr.flag} ${curr.code} - ${curr.currency}`;
        calcFromSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = curr.code;
        optionTo.textContent = `${curr.flag} ${curr.code} - ${curr.currency}`;
        calcToSelect.appendChild(optionTo);
    });

    // Valores iniciales por defecto: De USD a COP (Peso colombiano)
    calcFromSelect.value = 'USD';
    calcToSelect.value = 'COP';

    updateCalculatorFlags();
}

/**
 * Actualiza las banderas e iconos según la divisa seleccionada.
 */
function updateCalculatorFlags() {
    if (!calcFromSelect || !calcToSelect) return;
    const fromCurr = currenciesData.find(c => c.code === calcFromSelect.value);
    const toCurr = currenciesData.find(c => c.code === calcToSelect.value);

    if (fromCurr && calcFromFlag) {
        calcFromFlag.textContent = fromCurr.flag;
        if (calcAmountPrefix) calcAmountPrefix.textContent = fromCurr.symbol;
    }
    if (toCurr && calcToFlag) {
        calcToFlag.textContent = toCurr.flag;
    }
}

/**
 * Realiza el cálculo matemático de conversión de divisas en tiempo real.
 */
function calculateConversion() {
    if (!calcAmountInput || !calcFromSelect || !calcToSelect) return;

    const rawAmount = calcAmountInput.value.trim();
    const amount = Number(rawAmount);
    const fromCode = calcFromSelect.value;
    const toCode = calcToSelect.value;

    const fromCurrency = currenciesData.find(c => c.code === fromCode);
    const toCurrency = currenciesData.find(c => c.code === toCode);

    if (!fromCurrency || !toCurrency) {
        setCalculatorError('La moneda seleccionada no está disponible.');
        return;
    }

    if (!rawAmount || !Number.isFinite(amount) || amount < 0) {
        setCalculatorError(amount < 0 ? 'Ingrese un monto igual o mayor que cero.' : 'Ingrese un monto válido.');
        return;
    }

    // Cálculo con tasas fluctuantes en tiempo real
    const fromRate = fromCurrency.currentValue;
    const toRate = toCurrency.currentValue;

    if (!Number.isFinite(fromRate) || !Number.isFinite(toRate) || fromRate <= 0 || toRate <= 0) {
        setCalculatorError('La tasa para una de las monedas no está disponible.');
        return;
    }

    // Conversión cruzada
    const rateDirect = toRate / fromRate;
    const rateInverse = fromRate / toRate;
    const convertedTotal = amount * rateDirect;

    if (!Number.isFinite(rateDirect) || !Number.isFinite(rateInverse) || !Number.isFinite(convertedTotal)) {
        setCalculatorError('No fue posible calcular la conversión con ese monto.');
        return;
    }

    // Determinar decimales idóneos para la visualización
    let displayDecimals = toCurrency.decimals;
    if (toCurrency.code === 'BTC' || fromCurrency.code === 'BTC') {
        displayDecimals = 8;
    } else if (toCurrency.decimals === 0) {
        displayDecimals = 0;
    }

    const rateDecimals = rateDirect < 0.001 ? 8 : (rateDirect < 0.01 ? 6 : (rateDirect < 1 ? 4 : 2));
    const inverseDecimals = rateInverse < 0.001 ? 8 : (rateInverse < 0.01 ? 6 : (rateInverse < 1 ? 4 : 2));

    // Actualizar elementos en el DOM
    if (calcFormulaText) {
        calcFormulaText.textContent = `${formatNumber(amount, fromCurrency.decimals)} ${fromCurrency.code} equivalen exactamente a:`;
    }

    if (calcResultDisplay) {
        calcResultDisplay.textContent = `${toCurrency.symbol} ${formatNumber(convertedTotal, displayDecimals)} ${toCurrency.code}`;
    }

    if (calcDestFullName) {
        calcDestFullName.textContent = `${toCurrency.flag} ${toCurrency.currency} (${toCurrency.country})`;
    }

    if (calcDirectRate) {
        calcDirectRate.textContent = `1 ${fromCurrency.code} = ${formatNumber(rateDirect, rateDecimals)} ${toCurrency.code}`;
    }

    if (calcInverseRate) {
        calcInverseRate.textContent = `1 ${toCurrency.code} = ${formatNumber(rateInverse, inverseDecimals)} ${fromCurrency.code}`;
    }

    if (calcSyncStatus) {
        calcSyncStatus.textContent = `Sincronizado • ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
}

function setCalculatorError(message) {
    if (calcResultDisplay) calcResultDisplay.textContent = '---';
    if (calcFormulaText) calcFormulaText.textContent = message;
    if (calcDestFullName) calcDestFullName.textContent = '';
    if (calcDirectRate) calcDirectRate.textContent = 'Tasa no disponible';
    if (calcInverseRate) calcInverseRate.textContent = 'Tasa no disponible';
    if (calcSyncStatus) calcSyncStatus.textContent = 'Revisa el monto y vuelve a intentarlo';
}

// =========================================================
// 7. CINTA RODANTE DE MERCADO (TICKER) & PREVIEW HERO
// =========================================================

/**
 * Inicializa la cinta rodante superior de cotizaciones financieras.
 */
function initMarketTicker() {
    if (!tickerTrack) return;
    updateMarketTickerDOM();
}

/**
 * Actualiza el contenido HTML de la cinta rodante duplicando los ítems
 * para lograr un efecto infinito sin cortes visuales.
 */
function updateMarketTickerDOM() {
    if (!tickerTrack) return;

    let itemsHTML = '';
    currenciesData.forEach(c => {
        const history = historyMap.get(c.code);
        const current = history[history.length - 1];
        const percent = ((current - c.baseValue) / c.baseValue) * 100;
        const isUp = percent >= 0;

        itemsHTML += `
            <div class="ticker-item">
                <span class="ticker-flag">${c.flag}</span>
                <span class="ticker-code">${c.code}/USD</span>
                <span class="ticker-val">${c.symbol}${formatNumber(current, c.decimals)}</span>
                <span class="ticker-change ${isUp ? 'up' : 'down'}">
                    ${isUp ? '▲' : '▼'} ${Math.abs(percent).toFixed(2)}%
                </span>
            </div>
        `;
    });

    // Duplicar para efecto infinito continuo
    tickerTrack.innerHTML = itemsHTML + itemsHTML;
}

/**
 * Renderiza el mini widget de cotizaciones destacadas en la sección Hero.
 */
function renderHeroQuickRates() {
    updateHeroQuickRatesDOM();
}

function updateHeroQuickRatesDOM() {
    if (!heroQuickRates) return;

    // Divisas destacadas para el Hero
    const spotlightCodes = ['EUR', 'GBP', 'COP', 'JPY', 'BTC'];
    const spotlightCurrencies = currenciesData.filter(c => spotlightCodes.includes(c.code));

    let html = '';
    spotlightCurrencies.forEach(curr => {
        const history = historyMap.get(curr.code);
        const current = history[history.length - 1];
        const percent = ((current - curr.baseValue) / curr.baseValue) * 100;
        const isUp = percent >= 0;

        html += `
            <div class="preview-row">
                <div class="preview-currency">
                    <span class="preview-flag">${curr.flag}</span>
                    <div>
                        <div class="preview-code">${curr.code}</div>
                        <div class="preview-country">${curr.country}</div>
                    </div>
                </div>
                <div class="preview-price-box">
                    <div class="preview-value">${curr.symbol} ${formatNumber(current, curr.decimals)}</div>
                    <div class="preview-change ${isUp ? 'text-green' : 'text-red'}">
                        ${isUp ? '▲ +' : '▼ '}${percent.toFixed(2)}%
                    </div>
                </div>
            </div>
        `;
    });

    heroQuickRates.innerHTML = html;
}

// =========================================================
// 8. DASHBOARD DE TENDENCIAS Y GRÁFICO PRINCIPAL SVG
// =========================================================

/**
 * Inicializa los datos y dibuja el gráfico compuesto principal según el período.
 * @param {string} period - '1D', '1S', '1M', '1A'
 */
function initMainChart(period) {
    mainChartData = [];
    let base = 100;
    let volatility = 0.8;

    if (period === '1D') { base = 102.1; volatility = 0.5; }
    else if (period === '1S') { base = 98.4; volatility = 1.2; }
    else if (period === '1M') { base = 94.6; volatility = 2.0; }
    else if (period === '1A') { base = 88.0; volatility = 3.5; }

    let currentVal = base;
    for (let i = 0; i < MAIN_CHART_POINTS; i++) {
        const trend = (i / MAIN_CHART_POINTS) * 4; // Ligera tendencia alcista
        const noise = (Math.sin(i / 2.5) * 1.5) + (Math.random() - 0.48) * volatility * 2;
        currentVal = base + trend + noise;
        mainChartData.push(currentVal);
    }

    drawMainChart();
    updateChartMetrics(period);
}

/**
 * Actualiza la simulación continua del gráfico principal.
 */
function startMainChartSimulation() {
    setInterval(() => {
        const last = mainChartData[mainChartData.length - 1];
        const step = (Math.random() - 0.48) * 0.6;
        const next = Math.max(70, Math.min(140, last + step));

        mainChartData.push(next);
        if (mainChartData.length > MAIN_CHART_POINTS) {
            mainChartData.shift();
        }

        drawMainChart();
    }, 4000);
}

/**
 * Dibuja el gráfico SVG interactivo con rejilla, curva suave y área con gradiente.
 */
function drawMainChart() {
    if (!mainChartSvg) return;

    const width = 700;
    const height = 260;
    const padX = 20;
    const padY = 25;

    const min = Math.min(...mainChartData);
    const max = Math.max(...mainChartData);
    const range = (max - min) || 1;

    // Generar líneas de rejilla horizontales
    let gridLinesSvg = '';
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
        const y = padY + (i / gridCount) * (height - padY * 2);
        gridLinesSvg += `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="4 4" />`;
    }

    // Calcular puntos de la curva
    const pointsArray = mainChartData.map((val, i) => {
        const x = padX + (i / (mainChartData.length - 1)) * (width - padX * 2);
        const y = height - padY - ((val - min) / range) * (height - padY * 2);
        return { x, y };
    });

    const polylinePoints = pointsArray.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPoints = `${polylinePoints} ${width - padX},${height - padY} ${padX},${height - padY}`;

    // Construir SVG con gradiente y efecto glow
    const svgHTML = `
        <defs>
            <linearGradient id="mainChartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="mainChartLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
        </defs>
        ${gridLinesSvg}
        <polygon points="${areaPoints}" fill="url(#mainChartAreaGrad)" />
        <polyline points="${polylinePoints}" fill="none" stroke="url(#mainChartLineGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="${pointsArray[pointsArray.length - 1].x}" cy="${pointsArray[pointsArray.length - 1].y}" r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="2" />
    `;

    mainChartSvg.innerHTML = svgHTML;
}

/**
 * Actualiza las etiquetas métricas del gráfico según el período.
 */
function updateChartMetrics(period) {
    const currentIndexVal = document.getElementById('current-index-val');
    const currentIndexChange = document.getElementById('current-index-change');
    if (!currentIndexVal || !currentIndexChange) return;

    const latest = mainChartData[mainChartData.length - 1];
    const initial = mainChartData[0];
    const change = ((latest - initial) / initial) * 100;
    const isUp = change >= 0;

    currentIndexVal.textContent = `${latest.toFixed(2)} pts`;
    currentIndexChange.textContent = `${isUp ? '+' : ''}${change.toFixed(2)}%`;
    currentIndexChange.className = `metric-val ${isUp ? 'text-green' : 'text-red'}`;
}

/**
 * Renderiza el ranking en vivo de las monedas que más suben y bajan.
 */
function renderRankings() {
    if (!gainersList || !losersList) return;

    // Calcular el porcentaje de cambio actual de todas las monedas
    const rankedList = currenciesData.map(c => {
        const history = historyMap.get(c.code);
        const current = history[history.length - 1];
        const percent = ((current - c.baseValue) / c.baseValue) * 100;
        return {
            flag: c.flag,
            code: c.code,
            country: c.country,
            percent: percent
        };
    });

    // Ordenar de mayor a menor
    rankedList.sort((a, b) => b.percent - a.percent);

    const topGainers = rankedList.slice(0, 4);
    // Filtrar los que tienen cambios negativos para la lista de perdedores
    const topLosers = [...rankedList].filter(item => item.percent < 0).reverse().slice(0, 4);

    gainersList.innerHTML = topGainers.map(item => `
        <li>
            <span class="rank-currency-label">
                <span>${item.flag}</span>
                <span>${item.code}</span>
            </span>
            <span class="rank-change up">+${Math.abs(item.percent).toFixed(2)}%</span>
        </li>
    `).join('');

    losersList.innerHTML = topLosers.map(item => `
        <li>
            <span class="rank-currency-label">
                <span>${item.flag}</span>
                <span>${item.code}</span>
            </span>
            <span class="rank-change down">-${Math.abs(item.percent).toFixed(2)}%</span>
        </li>
    `).join('');
}

// =========================================================
// 9. MODALES DE CONSEJOS EMPRESARIALES
// =========================================================

/**
 * Base de datos enriquecida con los consejos detallados por tamaño de empresa.
 */
const businessTipsData = {
    pequena: {
        icon: '🏪',
        title: 'Consejos de Manejo de Divisas para Pequeñas Empresas',
        subtitle: 'Protegiendo márgenes en importaciones',
        content: `
            <p>Las pequeñas empresas deben ser cautelosas con las fluctuaciones monetarias, especialmente al importar productos.</p>
            
            <h4>Recomendaciones Estratégicas y Cambiarias:</h4>
            <ul>
                <li><strong>Monitoreo de tasas de cambio:</strong> Revisa el tipo de cambio antes de concretar compras internacionales o importar bienes.</li>
                <li><strong>Costo promedio (Dollar-Cost Averaging):</strong> Realiza compras de divisas de forma periódica para promediar el precio de compra.</li>
                <li><strong>Protección de márgenes:</strong> Asegúrate de que tus precios de venta puedan absorber variaciones de hasta un 5% en la moneda extranjera.</li>
                <li><strong>Actualización de listas de precios:</strong> Mantén tus listas de precios actualizadas reflejando los cambios reales en los costos de reposición.</li>
                <li><strong>Contratos Forward:</strong> Para pedidos grandes, utiliza contratos forward simples para fijar costos predecibles.</li>
            </ul>

            <h4>Indicadores Clave a Medir (KPIs):</h4>
            <div class="modal-kpi-grid">
                <div class="modal-kpi-card">
                    <div class="modal-kpi-title">Margen Bruto</div>
                    <div class="modal-kpi-desc">Meta sugerida: > 35%</div>
                </div>
                <div class="modal-kpi-card">
                    <div class="modal-kpi-title">Días de Caja Disponible</div>
                    <div class="modal-kpi-desc">Meta sugerida: Mínimo 60-90 días</div>
                </div>
            </div>
            
            <p><em>Consejo del Colegio Bilingüe Los Ángeles:</em> La reinversión del 40% de las primeras utilidades en automatización y capacitación reduce el riesgo de cierre en un 65%.</p>
        `
    },
    mediana: {
        icon: '🏢',
        title: 'Estrategias Cambiarias para Medianas Empresas',
        subtitle: 'Diversificación y planificación internacional',
        content: `
            <p>Las medianas empresas operan con volúmenes que exigen una gestión del riesgo cambiario mucho más estructurada.</p>
            
            <h4>Recomendaciones Estratégicas y Cambiarias:</h4>
            <ul>
                <li><strong>Diversificar la exposición a divisas:</strong> No dependas únicamente del dólar estadounidense si operas con diferentes regiones.</li>
                <li><strong>Cobertura de operaciones de importación/exportación:</strong> Implementa herramientas de cobertura financiera (hedging) para asegurar la rentabilidad de las ventas al exterior.</li>
                <li><strong>Planificación estratégica de pagos:</strong> Programa tus pagos internacionales en momentos de fortaleza de la moneda local.</li>
                <li><strong>Cuentas multimoneda:</strong> Utiliza cuentas bancarias en diversas divisas para evitar dobles conversiones innecesarias.</li>
                <li><strong>Monitoreo de bancos centrales:</strong> Sigue de cerca las políticas de los bancos centrales que influyen en las tasas de interés y tipos de cambio.</li>
            </ul>

            <h4>Indicadores Clave a Medir (KPIs):</h4>
            <div class="modal-kpi-grid">
                <div class="modal-kpi-card">
                    <div class="modal-kpi-title">EBITDA</div>
                    <div class="modal-kpi-desc">Rendimiento operativo real</div>
                </div>
                <div class="modal-kpi-card">
                    <div class="modal-kpi-title">Ciclo de Conversión de Efectivo</div>
                    <div class="modal-kpi-desc">Menor a 45 días</div>
                </div>
            </div>

            <p><em>Consejo del Colegio Bilingüe Los Ángeles:</em> Auditar anualmente los procesos operativos permite detectar hasta un 18% de ahorros en costos de logística y suministros.</p>
        `
    },
    grande: {
        icon: '🏦',
        title: 'Gestión del Riesgo Cambiario para Grandes Corporaciones',
        subtitle: 'Cobertura sofisticada y tesorería global',
        content: `
            <p>Las grandes corporaciones gestionan tesorería en múltiples monedas, requiriendo instrumentos financieros complejos y gobierno corporativo.</p>
            
            <h4>Recomendaciones Estratégicas y Cambiarias:</h4>
            <ul>
                <li><strong>Cobertura sofisticada:</strong> Utiliza una combinación de futuros, opciones y contratos forwards para estructurar blindajes cambiarios a medida.</li>
                <li><strong>Cobertura natural (Natural Hedging):</strong> Equilibra ingresos y gastos en la misma moneda mediante la diversificación operativa y cadenas de suministro globales.</li>
                <li><strong>Gestión de tesorería centralizada:</strong> Maneja la liquidez a través de centros de tesorería regionales o globales optimizando los saldos en múltiples divisas.</li>
                <li><strong>Comités de riesgo cambiario (FX Risk Committees):</strong> Establece órganos de decisión colegiada para fijar políticas de riesgo, umbrales y métricas de desempeño.</li>
                <li><strong>Cumplimiento normativo global:</strong> Asegura el cumplimiento regulatorio en el manejo de divisas e inversiones a través de múltiples jurisdicciones internacionales.</li>
            </ul>

            <h4>Indicadores Clave a Medir (KPIs):</h4>
            <div class="modal-kpi-grid">
                <div class="modal-kpi-card">
                    <div class="modal-kpi-title">ROIC (Retorno sobre Capital)</div>
                    <div class="modal-kpi-desc">Debe superar el WACC corporativo</div>
                </div>
                <div class="modal-kpi-card">
                    <div class="modal-kpi-title">Calificación Crediticia (Rating)</div>
                    <div class="modal-kpi-desc">Grado de inversión institucional</div>
                </div>
            </div>

            <p><em>Consejo del Colegio Bilingüe Los Ángeles:</em> Las empresas con una política estructurada de cobertura cambiaria presentan un 40% menor volatilidad en sus estados financieros trimestrales.</p>
        `
    }
};

/**
 * Abre el modal con la información temática de la empresa seleccionada.
 */
function openTipModal(type) {
    const tipData = businessTipsData[type];
    if (!tipData || !modalOverlay) return;

    if (modalIcon) modalIcon.textContent = tipData.icon;
    if (modalTitle) modalTitle.textContent = tipData.title;
    if (modalBody) modalBody.innerHTML = tipData.content;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
}

/**
 * Cierra la ventana modal activa.
 */
function closeTipModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// =========================================================
// 10. CONFIGURACIÓN DE EVENT LISTENERS & INTERACCIONES
// =========================================================
function setupEventListeners() {
    // --- Menú Móvil Hamburguesa ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Navbar al hacer Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Filtros de Monedas por Región ---
    const filterButtons = document.querySelectorAll('.filter-pill');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentRegionFilter = btn.dataset.filter;
            renderCurrencyCards();
            setupScrollReveal();
        });
    });

    // --- Calculadora de Conversión: Eventos Reactivos ---
    if (calcAmountInput) {
        calcAmountInput.addEventListener('input', calculateConversion);
        calcAmountInput.addEventListener('change', calculateConversion);
    }

    if (calcFromSelect) {
        calcFromSelect.addEventListener('change', () => {
            updateCalculatorFlags();
            calculateConversion();
        });
    }

    if (calcToSelect) {
        calcToSelect.addEventListener('change', () => {
            updateCalculatorFlags();
            calculateConversion();
        });
    }

    // Botón Swap (Intercambio de divisas origen <-> destino)
    if (btnSwap) {
        btnSwap.addEventListener('click', () => {
            const tempVal = calcFromSelect.value;
            calcFromSelect.value = calcToSelect.value;
            calcToSelect.value = tempVal;

            updateCalculatorFlags();
            calculateConversion();
        });
    }

    // Botón Convertir
    if (btnConvertAction) {
        btnConvertAction.addEventListener('click', calculateConversion);
    }

    // Botones de montos rápidos ($100, $1,000, $5,000, $10,000)
    quickAmtButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            quickAmtButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const amt = btn.dataset.amt;
            if (calcAmountInput) {
                calcAmountInput.value = amt;
                calculateConversion();
            }
        });
    });

    // --- Pestañas de Período del Gráfico de Tendencias ---
    const periodButtons = document.querySelectorAll('.period-tab');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            periodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentChartPeriod = btn.dataset.period;
            initMainChart(currentChartPeriod);
        });
    });

    // --- Botones "Ver más" de Consejos Empresariales ---
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tipTarget;
            openTipModal(target);
        });
    });

    // Cierre de modal
    if (modalClose) modalClose.addEventListener('click', closeTipModal);
    if (modalBtnClose) modalBtnClose.addEventListener('click', closeTipModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeTipModal();
        });
    }

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeTipModal();
        }
    });
}

// =========================================================
// 11. ANIMACIÓN DE APARICIÓN AL HACER SCROLL (INTERSECTION OBSERVER)
// =========================================================
function setupScrollReveal() {
    if (revealObserver) revealObserver.disconnect();
    const revealElements = document.querySelectorAll('.reveal');
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// =========================================================
// 12. UTILIDADES Y FORMATEO INTERNACIONAL
// =========================================================

/**
 * Formatea un número con separadores de miles internacionales y precisión decimal fija.
 * @param {number} value - Número a formatear.
 * @param {number} decimals - Cantidad de decimales deseados.
 * @returns {string} Cadena de texto formateada.
 */
function formatNumber(value, decimals) {
    if (!Number.isFinite(Number(value))) return '—';
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
