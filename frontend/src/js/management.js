/* ============================================================
   MANAGEMENT PORTAL — management.js
   Save as: src/js/management.js

   Handles:
   - Page navigation (showPage)
   - Chart.js chart rendering (revenue, orders, donut, age, location, repeat)
   - Date range switching
   - Top products table + product performance bars
   - CSV export
   - Toast notifications
   - Sidebar toggle
   ============================================================ */

'use strict';


/* ── 1. DATA
   All placeholder data lives here so it is easy to swap for
   real API calls once the backend endpoints are ready.           */

const DATA = {

  /* Revenue & orders by day — last 30 days */
  '30d': {
    labels:  ['1 Apr','3 Apr','5 Apr','7 Apr','9 Apr','11 Apr','13 Apr','15 Apr','17 Apr','19 Apr','21 Apr','23 Apr','25 Apr','27 Apr','29 Apr'],
    revenue: [1420,1680,1530,1920,2100,1870,2240,2050,2380,2190,2560,2310,2700,2480,2890],
    target:  [1750,1750,1750,1750,1750,1750,1750,1750,1750,1750,1750,1750,1750,1750,1750],
    orders:  [38,45,41,52,57,50,61,56,64,59,69,62,73,67,78],
    kpi: { revenue:'£54,290', orders:'1,482', aov:'£36.63', customers:'1,104' },
  },

  '7d': {
    labels:  ['23 Apr','24 Apr','25 Apr','26 Apr','27 Apr','28 Apr','29 Apr'],
    revenue: [2310,2480,2700,2560,2890,2430,2760],
    target:  [2500,2500,2500,2500,2500,2500,2500],
    orders:  [62,67,73,69,78,65,74],
    kpi: { revenue:'£17,130', orders:'488', aov:'£35.12', customers:'312' },
  },

  '90d': {
    labels:  ['Jan','Feb','Mar','Apr'],
    revenue: [44200,48600,51900,54290],
    target:  [46000,48000,50000,52000],
    orders:  [1180,1290,1390,1482],
    kpi: { revenue:'£198,990', orders:'5,342', aov:'£37.25', customers:'2,840' },
  },

  'ytd': {
    labels:  ['Jan','Feb','Mar','Apr'],
    revenue: [44200,48600,51900,54290],
    target:  [46000,48000,50000,52000],
    orders:  [1180,1290,1390,1482],
    kpi: { revenue:'£198,990', orders:'5,342', aov:'£37.25', customers:'2,840' },
  },
};

const TOP_PRODUCTS = [
  { rank:1, name:'Organic Whole Milk 2L',     cat:'Dairy',      sold:842, revenue:'£2,105', trend:'up'   },
  { rank:2, name:'Sourdough Bread 800g',       cat:'Bakery',     sold:736, revenue:'£1,840', trend:'up'   },
  { rank:3, name:'Free Range Eggs (12)',       cat:'Produce',    sold:694, revenue:'£2,776', trend:'flat' },
  { rank:4, name:'Chicken Breast 500g',        cat:'Meat',       sold:621, revenue:'£3,105', trend:'up'   },
  { rank:5, name:'Greek Yoghurt 500g',         cat:'Dairy',      sold:580, revenue:'£1,160', trend:'down' },
  { rank:6, name:'Cheddar Cheese 400g',        cat:'Dairy',      sold:543, revenue:'£1,629', trend:'up'   },
  { rank:7, name:'Atlantic Salmon Fillet',     cat:'Fish',       sold:498, revenue:'£2,490', trend:'up'   },
  { rank:8, name:'Baby Spinach 200g',          cat:'Produce',    sold:461, revenue:'£922',   trend:'flat' },
  { rank:9, name:'Orange Juice 1L',            cat:'Beverages',  sold:435, revenue:'£870',   trend:'down' },
  { rank:10, name:'Dark Chocolate 85%',        cat:'Snacks',     sold:412, revenue:'£824',   trend:'up'   },
];

const CATEGORY_DATA = {
  labels:      ['Dairy','Bakery','Produce','Meat','Frozen','Beverages','Snacks'],
  values:      [28,18,16,14,10,8,6],
  colours:     ['#60a5fa','#fbbf24','#4ade80','#f87171','#c084fc','#34d399','#fb923c'],
};

const AGE_DATA = {
  labels: ['18–24','25–34','35–44','45–54','55–64','65+'],
  values: [12,28,24,18,11,7],
};

const LOCATION_DATA = {
  labels:  ['City Centre','Headingley','Chapel A.','Roundhay','Meanwood','Other'],
  values:  [34,18,14,12,10,12],
  colours: ['#c084fc','#60a5fa','#4ade80','#fbbf24','#f87171','rgba(255,255,255,0.25)'],
};

const REPEAT_DATA = {
  labels:  ['Week 1','Week 2','Week 3','Week 4'],
  repeat:  [64,68,71,74],
  newCust: [36,32,29,26],
};


/* ── 2. CHART REGISTRY
   Keeps references so we can destroy & rebuild on date change    */
const CHARTS = {};

/* Shared Chart.js defaults */
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.color = 'rgba(255,255,255,0.45)';

function chartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.6)',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } },
      },
    },
  };
}


/* ── 3. REVENUE CHART */
function buildRevenueChart(range) {
  const d = DATA[range];
  const ctx = document.getElementById('chart-revenue');
  if (!ctx) return;

  if (CHARTS.revenue) { CHARTS.revenue.destroy(); }

  CHARTS.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Revenue',
          data: d.revenue,
          borderColor: '#c084fc',
          backgroundColor: 'rgba(192,132,252,0.12)',
          fill: true,
          tension: 0.45,
          pointRadius: 3,
          pointBackgroundColor: '#c084fc',
          borderWidth: 2,
        },
        {
          label: 'Target',
          data: d.target,
          borderColor: 'rgba(255,255,255,0.2)',
          borderDash: [5, 5],
          fill: false,
          tension: 0,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      ...chartDefaults(),
      scales: {
        ...chartDefaults().scales,
        y: {
          ...chartDefaults().scales.y,
          ticks: {
            ...chartDefaults().scales.y.ticks,
            callback: v => '£' + (v >= 1000 ? (v/1000).toFixed(1)+'k' : v),
          },
        },
      },
    },
  });
}


/* ── 4. ORDERS CHART */
function buildOrdersChart(range) {
  const d = DATA[range];
  const ctx = document.getElementById('chart-orders');
  if (!ctx) return;

  if (CHARTS.orders) { CHARTS.orders.destroy(); }

  CHARTS.orders = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [{
        label: 'Orders',
        data: d.orders,
        backgroundColor: 'rgba(192,132,252,0.55)',
        borderColor: '#c084fc',
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: chartDefaults(),
  });
}


/* ── 5. CATEGORY DONUT CHART */
function buildCategoryDonut() {
  const ctx = document.getElementById('chart-category-donut');
  if (!ctx) return;
  if (CHARTS.categoryDonut) { CHARTS.categoryDonut.destroy(); }

  CHARTS.categoryDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: CATEGORY_DATA.labels,
      datasets: [{
        data: CATEGORY_DATA.values,
        backgroundColor: CATEGORY_DATA.colours,
        borderColor: '#0d1f13',
        borderWidth: 2,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` },
        },
      },
    },
  });
}


/* ── 6. AGE BREAKDOWN CHART */
function buildAgeChart() {
  const ctx = document.getElementById('chart-age');
  if (!ctx) return;
  if (CHARTS.age) { CHARTS.age.destroy(); }

  CHARTS.age = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: AGE_DATA.labels,
      datasets: [{
        label: '% of customers',
        data: AGE_DATA.values,
        backgroundColor: [
          'rgba(192,132,252,0.7)',
          'rgba(192,132,252,0.85)',
          'rgba(192,132,252,1)',
          'rgba(147,51,234,0.85)',
          'rgba(147,51,234,0.65)',
          'rgba(147,51,234,0.45)',
        ],
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      ...chartDefaults(),
      scales: {
        ...chartDefaults().scales,
        y: {
          ...chartDefaults().scales.y,
          ticks: {
            ...chartDefaults().scales.y.ticks,
            callback: v => v + '%',
          },
        },
      },
    },
  });
}


/* ── 7. LOCATION DONUT CHART */
function buildLocationChart() {
  const ctx = document.getElementById('chart-location');
  if (!ctx) return;
  if (CHARTS.location) { CHARTS.location.destroy(); }

  CHARTS.location = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: LOCATION_DATA.labels,
      datasets: [{
        data: LOCATION_DATA.values,
        backgroundColor: LOCATION_DATA.colours,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` },
        },
      },
    },
  });
}


/* ── 8. REPEAT VS NEW CHART */
function buildRepeatChart() {
  const ctx = document.getElementById('chart-repeat');
  if (!ctx) return;
  if (CHARTS.repeat) { CHARTS.repeat.destroy(); }

  CHARTS.repeat = new Chart(ctx, {
    type: 'line',
    data: {
      labels: REPEAT_DATA.labels,
      datasets: [
        {
          label: 'Repeat',
          data: REPEAT_DATA.repeat,
          borderColor: '#c084fc',
          backgroundColor: 'rgba(192,132,252,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#c084fc',
          borderWidth: 2,
        },
        {
          label: 'New',
          data: REPEAT_DATA.newCust,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96,165,250,0.06)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#60a5fa',
          borderWidth: 2,
        },
      ],
    },
    options: {
      ...chartDefaults(),
      scales: {
        ...chartDefaults().scales,
        y: {
          ...chartDefaults().scales.y,
          ticks: {
            ...chartDefaults().scales.y.ticks,
            callback: v => v + '%',
          },
          max: 100,
        },
      },
    },
  });
}


/* ── 9. TOP PRODUCTS TABLE */
function buildTopProductsTable() {
  /* there are two tbodies with id="top-products-tbody"
     (dashboard preview + products page full table) */
  const tbodies = document.querySelectorAll('#top-products-tbody');
  if (!tbodies.length) return;

  const rows = TOP_PRODUCTS.map(p => {
    const rankClass = p.rank <= 3 ? `rank-${p.rank}` : 'rank-n';
    const trendIcon = p.trend === 'up'
      ? '<i class="bi bi-arrow-up-short" style="color:#4ade80;font-size:1rem;"></i>'
      : p.trend === 'down'
      ? '<i class="bi bi-arrow-down-short" style="color:#f87171;font-size:1rem;"></i>'
      : '<i class="bi bi-dash" style="color:rgba(255,255,255,0.3);font-size:1rem;"></i>';

    return `<tr>
      <td><span class="rank-badge ${rankClass}">${p.rank}</span></td>
      <td style="font-weight:600;">${p.name}</td>
      <td><span class="td-muted">${p.cat}</span></td>
      <td>${p.sold.toLocaleString()}</td>
      <td>${p.revenue}</td>
      <td>${trendIcon}</td>
    </tr>`;
  }).join('');

  tbodies.forEach(tbody => { tbody.innerHTML = rows; });
}


/* ── 10. PRODUCT PERFORMANCE BARS */
function buildPerfBars() {
  const container = document.getElementById('product-perf-bars');
  if (!container) return;

  const maxSold = TOP_PRODUCTS[0].sold;
  const colours = ['#c084fc','#9333ea','#60a5fa','#4ade80','#fbbf24','#f87171','#34d399','#fb923c','#818cf8','#a78bfa'];

  container.innerHTML = TOP_PRODUCTS.map((p, i) => {
    const pct = Math.round((p.sold / maxSold) * 100);
    return `<div class="perf-bar-row">
      <div class="perf-bar-label" title="${p.name}">${p.name}</div>
      <div class="perf-bar-track">
        <div class="perf-bar-fill" style="width:${pct}%;background:${colours[i % colours.length]};"></div>
      </div>
      <div class="perf-bar-value">${p.sold}</div>
    </div>`;
  }).join('');
}


/* ── 11. KPI STRIP UPDATE */
function updateKPIStrip(range) {
  const kpi = DATA[range].kpi;
  /* Dashboard strip */
  setText('kpi-revenue',   kpi.revenue);
  setText('kpi-orders',    kpi.orders);
  setText('kpi-aov',       kpi.aov);
  setText('kpi-customers', kpi.customers);
  /* Sales page strip */
  setText('kpi-revenue-sales', kpi.revenue);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}


/* ── 12. DATE RANGE SWITCHING */
let currentRange = '30d';

function setDateRange(range, btn) {
  currentRange = range;

  /* Update all date tab active states */
  document.querySelectorAll('.date-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  /* Mark both the clicked button and any sibling with same range */
  document.querySelectorAll(`.date-tab`).forEach(t => {
    if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${range}'`)) {
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
    }
  });

  updateKPIStrip(range);
  buildRevenueChart(range);
  buildOrdersChart(range);
}


/* ── 13. PAGE NAVIGATION */
function showPage(pageId, btn) {
  /* Hide all pages */
  document.querySelectorAll('.mgmt-page').forEach(p => p.classList.remove('active'));

  /* Show target */
  const target = document.getElementById('mgmt-page-' + pageId);
  if (target) target.classList.add('active');

  /* Update sidebar active state */
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  /* Update topbar breadcrumb */
  const titles = {
    dashboard: { title: 'Dashboard',           crumb: 'Management · Overview'   },
    sales:     { title: 'Sales Analytics',     crumb: 'Management · Analytics'  },
    products:  { title: 'Product Performance', crumb: 'Management · Analytics'  },
    customers: { title: 'Customer Insights',   crumb: 'Management · Analytics'  },
  };
  const t = titles[pageId] || titles.dashboard;
  setText('topbar-title',      t.title);
  setText('topbar-breadcrumb', t.crumb);

  /* Build page-specific content if not already built */
  if (pageId === 'products') {
    buildCategoryDonut();
    buildPerfBars();
    buildTopProductsTable();
  }
  if (pageId === 'customers') {
    buildAgeChart();
    buildLocationChart();
    buildRepeatChart();
  }

  /* Close sidebar on mobile */
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768 && sidebar) {
    sidebar.classList.remove('open');
  }
}


/* ── 14. SIDEBAR TOGGLE (mobile) */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}


/* ── 15. TOAST */
function showToast(title, msg, icon) {
  setText('toast-title', title);
  setText('toast-msg',   msg || '');
  const iconEl = document.getElementById('toast-icon');
  if (iconEl) iconEl.textContent = icon || '✅';
  const toast = document.getElementById('wh-toast');
  if (!toast) return;
  toast.style.display = 'block';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.display = 'none'; }, 3000);
}


/* ── 16. CSV EXPORT */
function exportCSV(type) {
  let csv = '';
  let filename = '';

  if (type === 'sales') {
    filename = 'freshmart-sales-export.csv';
    csv = 'Period,Revenue,Orders,vs Target\n';
    csv += 'Week 1,£12400,338,-4.6%\n';
    csv += 'Week 2,£13800,378,+6.2%\n';
    csv += 'Week 3,£14200,390,+9.2%\n';
    csv += 'Week 4,£13890,376,+6.8%\n';
    showToast('Export Ready', 'Sales data exported as CSV', '📥');
  } else if (type === 'products') {
    filename = 'freshmart-products-export.csv';
    csv = 'Rank,Product,Category,Units Sold,Revenue,Trend\n';
    TOP_PRODUCTS.forEach(p => {
      csv += `${p.rank},"${p.name}",${p.cat},${p.sold},"${p.revenue}",${p.trend}\n`;
    });
    showToast('Export Ready', 'Product data exported as CSV', '📥');
  }

  if (!csv) return;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}





/* ── 18. INIT — runs when DOM is ready */
document.addEventListener('DOMContentLoaded', () => {

  /* Build dashboard charts */
  buildRevenueChart(currentRange);
  buildOrdersChart(currentRange);
  buildTopProductsTable();
  updateKPIStrip(currentRange);

  /* Sign out button */
  const signOutBtn = document.querySelector('.nav-btn-danger');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem('fm_user');
      sessionStorage.removeItem('fm_user');
      window.location.href = '../../index.html';
    });
  }

  /* mgmt-page visibility — warehouse.css uses .wh-page.active
     but management uses .mgmt-page.active — add the display rule */
  const pageStyle = document.createElement('style');
  pageStyle.textContent = `
    .mgmt-page { display: none; }
    .mgmt-page.active { display: block; animation: fadeUp 0.25s ease both; }
  `;
  document.head.appendChild(pageStyle);
});