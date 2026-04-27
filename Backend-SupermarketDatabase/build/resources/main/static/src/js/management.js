/*
  FRESHMART — management.js
  Save as: src/js/management.js

  Handles all Management Portal interactivity:
    - Page navigation (showPage)
    - Date range tab switching (setDateRange)
    - All Chart.js chart initialisation & re-rendering
    - Export CSV helper
    - Toast notifications (reuses same pattern as warehouse.js)
    - Mobile sidebar toggle
    - Ripple effect (same logic as portal.js / warehouse.js)

  Dependencies (loaded before this script in index.html):
    - Bootstrap 5 bundle (bootstrap.bundle.min.js)
    - Chart.js (chart.umd.min.js from CDN)
*/


/* ══════════════════════════════════════════════════════════════
   1. CHART.JS GLOBAL DEFAULTS
   Set once so every chart inherits these without repetition.
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

    Chart.defaults.color             = 'rgba(255,255,255,0.45)';
    Chart.defaults.borderColor       = 'rgba(255,255,255,0.06)';
    Chart.defaults.font.family       = "'DM Sans', sans-serif";
    Chart.defaults.font.size         = 12;
    Chart.defaults.plugins.legend.display = false; // we use custom HTML legends
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(13,31,19,0.95)';
    Chart.defaults.plugins.tooltip.borderColor      = 'rgba(255,255,255,0.12)';
    Chart.defaults.plugins.tooltip.borderWidth      = 1;
    Chart.defaults.plugins.tooltip.padding          = 10;
    Chart.defaults.plugins.tooltip.titleColor       = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor        = 'rgba(255,255,255,0.65)';
    Chart.defaults.plugins.tooltip.cornerRadius     = 8;
    Chart.defaults.plugins.tooltip.titleFont        = { family: "'Fraunces', serif", weight: '600', size: 13 };

    // Init everything
    initCharts();
    attachRipple();
});


/* ══════════════════════════════════════════════════════════════
   2. PAGE NAVIGATION
   ══════════════════════════════════════════════════════════════ */

const MGMT_PAGES = {
    dashboard:    ['Dashboard',           'Management · Overview'],
    sales:        ['Sales Analytics',     'Management · Analytics'],
    products:     ['Product Performance', 'Management · Analytics'],
    customers:    ['Customer Insights',   'Management · Analytics'],
};

/**
 * showPage — navigate to a management sub-page.
 * @param {string}      id  — page key
 * @param {HTMLElement} btn — the clicked sidebar nav button
 */
function showPage(id, btn) {
    document.querySelectorAll('.mgmt-page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById('mgmt-page-' + id);
    if (target) target.classList.add('active');

    const info = MGMT_PAGES[id] || [id, 'Management'];
    document.getElementById('topbar-title').textContent      = info[0];
    document.getElementById('topbar-breadcrumb').textContent = info[1];

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.getElementById('sidebar').classList.remove('open');

    // Resize charts after show (Chart.js needs visible canvas)
    setTimeout(() => {
        Object.values(_charts).forEach(c => { if (c) c.resize(); });
    }, 50);

    window.scrollTo(0, 0);
}


/* ══════════════════════════════════════════════════════════════
   3. MOBILE SIDEBAR
   ══════════════════════════════════════════════════════════════ */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

document.addEventListener('click', function (e) {
    const sidebar   = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    if (
        sidebar &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        toggleBtn &&
        !toggleBtn.contains(e.target)
    ) {
        sidebar.classList.remove('open');
    }
});


/* ══════════════════════════════════════════════════════════════
   4. DATE RANGE TABS
   Switches the active tab and re-renders charts with new data.
   ══════════════════════════════════════════════════════════════ */
let _currentRange = '30d';

function setDateRange(range, tabEl) {
    _currentRange = range;
    document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
    if (tabEl) tabEl.classList.add('active');
    updateChartsForRange(range);
    showToast('📅', 'Date range updated', 'Showing data for: ' + tabEl.textContent.trim());
}

/**
 * updateChartsForRange — swaps in different mock datasets
 * depending on the selected time window.
 */
function updateChartsForRange(range) {
    const datasets = DATE_DATASETS[range] || DATE_DATASETS['30d'];

    // Revenue line chart
    if (_charts.revenue) {
        _charts.revenue.data.labels          = datasets.labels;
        _charts.revenue.data.datasets[0].data = datasets.revenue;
        _charts.revenue.data.datasets[1].data = datasets.target;
        _charts.revenue.update('active');
    }

    // Orders bar chart
    if (_charts.orders) {
        _charts.orders.data.labels          = datasets.labels;
        _charts.orders.data.datasets[0].data = datasets.orders;
        _charts.orders.update('active');
    }

    // Update the summary strip numbers
    const summary = SUMMARY_DATA[range] || SUMMARY_DATA['30d'];
    document.getElementById('kpi-revenue').textContent  = summary.revenue;
    document.getElementById('kpi-orders').textContent   = summary.orders;
    document.getElementById('kpi-aov').textContent      = summary.aov;
    document.getElementById('kpi-customers').textContent = summary.customers;
}


/* ══════════════════════════════════════════════════════════════
   5. MOCK DATA
   ══════════════════════════════════════════════════════════════ */

// Summary KPI numbers per range
const SUMMARY_DATA = {
    '7d':  { revenue: '£12,840', orders: '342',   aov: '£37.54', customers: '291'  },
    '30d': { revenue: '£54,290', orders: '1,482', aov: '£36.63', customers: '1,104' },
    '90d': { revenue: '£158,470',orders: '4,330', aov: '£36.60', customers: '3,201' },
    'ytd': { revenue: '£421,990',orders: '11,820',aov: '£35.70', customers: '7,840' },
};

// Chart datasets per range
const DATE_DATASETS = {
    '7d': {
        labels:  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        revenue: [1820, 1550, 1900, 2100, 2400, 1750, 1320],
        target:  [1800, 1800, 1800, 1800, 1800, 1800, 1800],
        orders:  [48,   42,   51,   58,   65,   47,   31],
    },
    '30d': {
        labels:  ['W1','W2','W3','W4'],
        revenue: [12400, 13800, 14200, 13890],
        target:  [13000, 13000, 13000, 13000],
        orders:  [338, 378, 390, 376],
    },
    '90d': {
        labels:  ['Jan','Feb','Mar'],
        revenue: [48200, 54290, 55980],
        target:  [50000, 50000, 50000],
        orders:  [1340, 1482, 1508],
    },
    'ytd': {
        labels:  ['Jan','Feb','Mar','Apr'],
        revenue: [48200, 54290, 55980, 63520],
        target:  [50000, 50000, 50000, 50000],
        orders:  [1340, 1482, 1508, 1740],
    },
};

// Category sales data (ProductPerformance page)
const CATEGORY_DATA = {
    labels: ['Dairy', 'Bakery', 'Produce', 'Meat', 'Frozen', 'Beverages', 'Snacks'],
    sales:  [28400,   18200,    16500,     22100,  12300,    14800,       9200],
    units:  [9420,    7830,     12400,     4120,   5610,     6230,        7890],
    colours: [
        '#60a5fa', '#fbbf24', '#4ade80', '#f87171',
        '#c084fc', '#34d399', '#fb923c',
    ],
};

// Customer age breakdown (CustomerInsights page)
const AGE_DATA = {
    labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
    values: [12, 28, 24, 18, 11, 7],
};

// Customer location data
const LOCATION_DATA = {
    labels: ['Leeds City', 'Headingley', 'Chapel Allerton', 'Roundhay', 'Meanwood', 'Other'],
    values: [34, 18, 14, 12, 10, 12],
};

// Top products
const TOP_PRODUCTS = [
    { name: 'Organic Whole Milk 2L',   sku: 'SKU-00142', category: 'Dairy',    sold: 412, revenue: '£613.88', trend: '+18%', up: true  },
    { name: 'Free Range Eggs × 12',    sku: 'SKU-00057', category: 'Eggs',     sold: 387, revenue: '£870.75', trend: '+12%', up: true  },
    { name: 'Chicken Breast 500g',     sku: 'SKU-00213', category: 'Meat',     sold: 341, revenue: '£1360.59',trend: '+9%',  up: true  },
    { name: 'Cheddar Cheese 400g',     sku: 'SKU-00088', category: 'Dairy',    sold: 298, revenue: '£849.30', trend: '-3%',  up: false },
    { name: 'Sourdough Bread 800g',    sku: 'SKU-00391', category: 'Bakery',   sold: 276, revenue: '£483.00', trend: '-7%',  up: false },
    { name: 'Orange Juice 1L',         sku: 'SKU-00201', category: 'Beverages',sold: 261, revenue: '£521.39', trend: '+5%',  up: true  },
    { name: 'Greek Yoghurt 500g',      sku: 'SKU-00108', category: 'Dairy',    sold: 244, revenue: '£390.40', trend: '+22%', up: true  },
];


/* ══════════════════════════════════════════════════════════════
   6. CHART INITIALISATION
   ══════════════════════════════════════════════════════════════ */

// Registry so we can .update() and .resize() them later
const _charts = {};

function initCharts() {
    initRevenueChart();
    initOrdersChart();
    initCategoryDonut();
    initProductBarsChart();
    initAgeChart();
    initLocationChart();
    initRepeatChart();
    populateTopProductsTable();
}

/* ── 6a. Revenue line chart (Sales Analytics) ── */
function initRevenueChart() {
    const ctx = document.getElementById('chart-revenue');
    if (!ctx) return;

    const d = DATE_DATASETS['30d'];
    _charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: d.labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: d.revenue,
                    borderColor: '#c084fc',
                    backgroundColor: 'rgba(192,132,252,0.12)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.42,
                    pointRadius: 4,
                    pointBackgroundColor: '#c084fc',
                    pointHoverRadius: 6,
                },
                {
                    label: 'Target',
                    data: d.target,
                    borderColor: 'rgba(255,255,255,0.18)',
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    fill: false,
                    tension: 0,
                    pointRadius: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(255,255,255,0.4)' },
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: 'rgba(255,255,255,0.4)',
                        callback: v => '£' + v.toLocaleString(),
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => ' ' + ctx.dataset.label + ': £' + ctx.parsed.y.toLocaleString(),
                    },
                },
            },
        },
    });
}

/* ── 6b. Orders bar chart (Sales Analytics) ── */
function initOrdersChart() {
    const ctx = document.getElementById('chart-orders');
    if (!ctx) return;

    const d = DATE_DATASETS['30d'];
    _charts.orders = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.labels,
            datasets: [
                {
                    label: 'Orders',
                    data: d.orders,
                    backgroundColor: 'rgba(192,132,252,0.3)',
                    hoverBackgroundColor: 'rgba(192,132,252,0.55)',
                    borderRadius: 6,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)' } },
            },
        },
    });
}

/* ── 6c. Category donut (Product Performance) ── */
function initCategoryDonut() {
    const ctx = document.getElementById('chart-category-donut');
    if (!ctx) return;

    _charts.categoryDonut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: CATEGORY_DATA.labels,
            datasets: [{
                data: CATEGORY_DATA.sales,
                backgroundColor: CATEGORY_DATA.colours.map(c => c + 'cc'),
                hoverBackgroundColor: CATEGORY_DATA.colours,
                borderColor: '#0d1f13',
                borderWidth: 3,
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => ' ' + ctx.label + ': £' + ctx.parsed.toLocaleString(),
                    },
                },
            },
        },
    });
}

/* ── 6d. Product units sold horizontal bars (Product Performance) ── */
function initProductBarsChart() {
    const container = document.getElementById('product-perf-bars');
    if (!container) return;

    const maxVal = Math.max(...TOP_PRODUCTS.map(p => p.sold));
    container.innerHTML = TOP_PRODUCTS.map((p, i) => {
        const pct   = Math.round((p.sold / maxVal) * 100);
        const colour = CATEGORY_DATA.colours[i % CATEGORY_DATA.colours.length];
        return `
      <div class="perf-bar-row">
        <div class="perf-bar-label" title="${p.name}">${p.name}</div>
        <div class="perf-bar-track">
          <div class="perf-bar-fill" style="width:${pct}%;background:${colour};"></div>
        </div>
        <div class="perf-bar-value">${p.sold}</div>
      </div>`;
    }).join('');
}

/* ── 6e. Customer age breakdown bar chart ── */
function initAgeChart() {
    const ctx = document.getElementById('chart-age');
    if (!ctx) return;

    _charts.age = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: AGE_DATA.labels,
            datasets: [{
                label: 'Customers %',
                data: AGE_DATA.values,
                backgroundColor: [
                    'rgba(192,132,252,0.5)',
                    'rgba(192,132,252,0.7)',
                    'rgba(192,132,252,0.85)',
                    'rgba(192,132,252,0.65)',
                    'rgba(192,132,252,0.45)',
                    'rgba(192,132,252,0.3)',
                ],
                hoverBackgroundColor: '#c084fc',
                borderRadius: 6,
                borderSkipped: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)' } },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(255,255,255,0.4)', callback: v => v + '%' },
                    max: 35,
                },
            },
            plugins: {
                tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.y + '% of customers' } },
            },
        },
    });
}

/* ── 6f. Customer location donut ── */
function initLocationChart() {
    const ctx = document.getElementById('chart-location');
    if (!ctx) return;

    _charts.location = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: LOCATION_DATA.labels,
            datasets: [{
                data: LOCATION_DATA.values,
                backgroundColor: [
                    'rgba(192,132,252,0.8)',
                    'rgba(96,165,250,0.8)',
                    'rgba(74,222,128,0.8)',
                    'rgba(251,191,36,0.8)',
                    'rgba(248,113,113,0.8)',
                    'rgba(255,255,255,0.2)',
                ],
                borderColor: '#0d1f13',
                borderWidth: 3,
                hoverOffset: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%' } },
            },
        },
    });
}

/* ── 6g. Repeat vs new customers line chart ── */
function initRepeatChart() {
    const ctx = document.getElementById('chart-repeat');
    if (!ctx) return;

    _charts.repeat = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Repeat Customers',
                    data: [64, 68, 71, 74],
                    borderColor: '#c084fc',
                    backgroundColor: 'rgba(192,132,252,0.1)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#c084fc',
                },
                {
                    label: 'New Customers',
                    data: [36, 32, 29, 26],
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96,165,250,0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#60a5fa',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)' } },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(255,255,255,0.4)', callback: v => v + '%' },
                    max: 100,
                },
            },
        },
    });
}

/* ── 6h. Populate top products table ── */
function populateTopProductsTable() {
    const tbody = document.getElementById('top-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = TOP_PRODUCTS.map((p, i) => {
        const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n';
        const trendClass = p.up ? 'delta-up' : 'delta-down';
        const trendIcon  = p.up ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
        return `
      <tr class="${i === 0 ? 'top-row' : ''}">
        <td><span class="rank-badge ${rankClass}">${i + 1}</span></td>
        <td>
          <div>${p.name}</div>
          <div class="td-muted">${p.sku}</div>
        </td>
        <td><span class="badge-wh badge-${categoryBadgeColour(p.category)}">${p.category}</span></td>
        <td style="font-weight:600;">${p.sold}</td>
        <td style="font-weight:600;">${p.revenue}</td>
        <td>
          <span class="stat-delta ${trendClass}" style="margin:0;">
            <i class="bi ${trendIcon}"></i>${p.trend}
          </span>
        </td>
      </tr>`;
    }).join('');
}

function categoryBadgeColour(cat) {
    const map = { Dairy: 'blue', Bakery: 'amber', Produce: 'green', Meat: 'red', Beverages: 'green', Eggs: 'green', Frozen: 'purple' };
    return map[cat] || 'grey';
}


/* ══════════════════════════════════════════════════════════════
   7. EXPORT CSV
   Builds a downloadable CSV from the top products data.
   ══════════════════════════════════════════════════════════════ */
function exportCSV(type) {
    let csv, filename;

    if (type === 'products') {
        const headers = ['Rank', 'Product', 'SKU', 'Category', 'Units Sold', 'Revenue', 'Trend'];
        const rows    = TOP_PRODUCTS.map((p, i) => [
            i + 1, `"${p.name}"`, p.sku, p.category, p.sold, p.revenue.replace('£',''), p.trend,
        ]);
        csv      = [headers, ...rows].map(r => r.join(',')).join('\n');
        filename = 'freshmart-top-products.csv';

    } else if (type === 'sales') {
        const d = DATE_DATASETS[_currentRange];
        const headers = ['Period', 'Revenue (£)', 'Target (£)', 'Orders'];
        const rows    = d.labels.map((l, i) => [l, d.revenue[i], d.target[i], d.orders[i]]);
        csv      = [headers, ...rows].map(r => r.join(',')).join('\n');
        filename = 'freshmart-sales-' + _currentRange + '.csv';

    } else {
        showToast('⚠️', 'Unknown export type', '');
        return;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    showToast('📥', 'Export downloaded', filename);
}


/* ══════════════════════════════════════════════════════════════
   8. TOAST (same pattern as warehouse.js)
   ══════════════════════════════════════════════════════════════ */
let _toastTimer = null;

function showToast(icon, title, message) {
    document.getElementById('toast-icon').textContent  = icon;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent   = message;

    const toast = document.getElementById('wh-toast');
    toast.style.display = 'block';
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { toast.style.display = 'none'; }, 3500);
}


/* ══════════════════════════════════════════════════════════════
   9. RIPPLE EFFECT (same logic as portal.js / warehouse.js)
   ══════════════════════════════════════════════════════════════ */
function attachRipple() {
    document.querySelectorAll('.portal-card, .segment-card, .nav-btn').forEach(el => {
        el.addEventListener('click', function (e) {
            const circle   = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius   = diameter / 2;
            const rect     = this.getBoundingClientRect();
            circle.style.width  = `${diameter}px`;
            circle.style.height = `${diameter}px`;
            circle.style.left   = `${e.clientX - rect.left - radius}px`;
            circle.style.top    = `${e.clientY - rect.top  - radius}px`;
            circle.classList.add('ripple');
            const existing = this.querySelector('.ripple');
            if (existing) existing.remove();
            this.appendChild(circle);
        });
    });
}