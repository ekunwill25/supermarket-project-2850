/*
  FRESHMART — warehouse.js
  JavaScript for the Warehouse Portal (src/pages/warehouse/index.html).

  This is a NEW file — completely separate from portal.js.
  portal.js only handles the ripple on the landing page.
  warehouse.js handles: navigation, scan lookup, pick checklist,
  dispatch confirmation, issue reporting, substitution logging,
  mobile sidebar, and toast notifications.
*/


/* ══════════════════════════════════════════════════════════════
   1. PAGE NAVIGATION
   Shows/hides .wh-page sections and updates the topbar title.
   Called by onclick on each sidebar nav button.
   ══════════════════════════════════════════════════════════════ */

// Map of page IDs → [Topbar Title, Breadcrumb subtitle]
const PAGE_INFO = {
    dashboard:      ['Dashboard',           'Warehouse · Overview'],
    scan:           ['Scan Item',           'Warehouse · Operations'],
    inventory:      ['Inventory',           'Warehouse · Stock'],
    pick:           ['Pick Orders',         'Warehouse · Operations'],
    dispatch:       ['Dispatch Orders',     'Warehouse · Operations'],
    'report-issue': ['Report Issue',        'Warehouse · Issues'],
    substitution:   ['Report Substitution', 'Warehouse · Issues'],
};

/**
 * showPage — navigate to a warehouse sub-page.
 * @param {string} id   — the page key (matches PAGE_INFO + element id "wh-page-{id}")
 * @param {HTMLElement} btn — the sidebar nav button that was clicked
 */
function showPage(id, btn) {
    // 1. Hide every page
    document.querySelectorAll('.wh-page').forEach(p => p.classList.remove('active'));

    // 2. Show the target
    const target = document.getElementById('wh-page-' + id);
    if (target) target.classList.add('active');

    // 3. Update topbar
    const info = PAGE_INFO[id] || [id, 'Warehouse'];
    document.getElementById('topbar-title').textContent    = info[0];
    document.getElementById('topbar-breadcrumb').textContent = info[1];

    // 4. Update sidebar active state
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // 5. Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');

    // 6. Scroll to top of main content
    document.getElementById('wh-content').scrollTop = 0;
    window.scrollTo(0, 0);
}


/* ══════════════════════════════════════════════════════════════
   2. MOBILE SIDEBAR TOGGLE
   ══════════════════════════════════════════════════════════════ */

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Close sidebar when clicking outside of it on mobile
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggleBtn &&
        !toggleBtn.contains(e.target)
    ) {
        sidebar.classList.remove('open');
    }
});


/* ══════════════════════════════════════════════════════════════
   3. RIPPLE EFFECT
   Same logic as portal.js but applied to order-cards and
   nav buttons in the warehouse portal.
   ══════════════════════════════════════════════════════════════ */

function applyRipple(e) {
    const el = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;
    const rect = el.getBoundingClientRect();

    circle.style.width  = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left   = `${e.clientX - rect.left - radius}px`;
    circle.style.top    = `${e.clientY - rect.top  - radius}px`;
    circle.classList.add('ripple');

    const existing = el.querySelector('.ripple');
    if (existing) existing.remove();
    el.appendChild(circle);
}

// Attach ripple to all order cards and nav buttons on load
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.order-card, .nav-btn').forEach(el => {
        el.addEventListener('click', applyRipple);
    });
});


/* ══════════════════════════════════════════════════════════════
   4. TOAST NOTIFICATIONS
   Lightweight pop-up that auto-dismisses after 3.5 seconds.
   ══════════════════════════════════════════════════════════════ */

let _toastTimer = null;

/**
 * showToast — display a notification toast.
 * @param {string} icon    — emoji icon
 * @param {string} title   — bold headline
 * @param {string} message — secondary detail line
 */
function showToast(icon, title, message) {
    document.getElementById('toast-icon').textContent  = icon;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent   = message;

    const toast = document.getElementById('wh-toast');
    toast.style.display = 'block';

    // Reset the auto-dismiss timer
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => {
        toast.style.display = 'none';
    }, 3500);
}


/* ══════════════════════════════════════════════════════════════
   5. SCAN ITEM PAGE
   ══════════════════════════════════════════════════════════════ */

/*
  Mock product database.
  In production this would be an API call.
*/
const PRODUCTS = {
    'SKU-00142': {
        name:      'Organic Whole Milk 2L',
        brand:     'Cravendale',
        category:  'Dairy',
        aisle:     '3B',
        shelf:     'Shelf 2',
        stock:     4,
        min:       50,
        price:     '£1.49',
        useBy:     '21 Apr 2025',
        useDays:   3,
        emoji:     '🥛',
        status:    'critical',
    },
    'SKU-00391': {
        name:      'Sourdough Bread 800g',
        brand:     'Bakehouse',
        category:  'Bakery',
        aisle:     '1A',
        shelf:     'Shelf 1',
        stock:     11,
        min:       40,
        price:     '£1.75',
        useBy:     '20 Apr 2025',
        useDays:   2,
        emoji:     '🍞',
        status:    'low',
    },
    'SKU-00057': {
        name:      'Free Range Eggs × 12',
        brand:     'Happy Hens',
        category:  'Eggs',
        aisle:     '2C',
        shelf:     'Shelf 3',
        stock:     18,
        min:       60,
        price:     '£2.25',
        useBy:     '28 Apr 2025',
        useDays:   10,
        emoji:     '🥚',
        status:    'low',
    },
    'SKU-00213': {
        name:      'Chicken Breast 500g',
        brand:     "Butcher's Best",
        category:  'Meat',
        aisle:     'Cold Store',
        shelf:     'Bay 2',
        stock:     31,
        min:       50,
        price:     '£3.99',
        useBy:     '22 Apr 2025',
        useDays:   4,
        emoji:     '🍗',
        status:    'ok',
    },
    'SKU-00088': {
        name:      'Cheddar Cheese 400g',
        brand:     'Wyke Farms',
        category:  'Dairy',
        aisle:     '3B',
        shelf:     'Shelf 4',
        stock:     43,
        min:       50,
        price:     '£2.85',
        useBy:     '10 May 2025',
        useDays:   22,
        emoji:     '🧀',
        status:    'ok',
    },
};

/**
 * simulateScan — called when the camera scan zone is tapped.
 * Pre-fills the SKU input with a demo value and runs lookup.
 */
function simulateScan() {
    document.getElementById('sku-input').value = 'SKU-00142';
    lookupSKU();
}

/**
 * lookupSKU — looks up the entered SKU in the mock database
 * and renders the result panel.
 */
function lookupSKU() {
    const raw = document.getElementById('sku-input').value.trim().toUpperCase();
    if (!raw) {
        showToast('⚠️', 'No SKU entered', 'Type a barcode or SKU number first');
        return;
    }

    const product = PRODUCTS[raw];

    // Show result panel, hide placeholder
    document.getElementById('scan-placeholder').style.display = 'none';
    document.getElementById('scan-result-panel').classList.add('visible');

    if (!product) {
        // Not found state
        document.getElementById('result-name').textContent    = 'Product Not Found';
        document.getElementById('result-meta').textContent    = raw + ' · No match in system';
        document.getElementById('result-stock-val').textContent = '—';
        document.getElementById('result-stock-val').style.color = 'rgba(255,255,255,0.4)';
        document.getElementById('result-aisle-val').textContent  = '—';
        document.getElementById('result-price-val').textContent  = '—';
        document.getElementById('result-useby-val').textContent  = '—';
        document.getElementById('result-useby-sub').textContent  = '';
        document.getElementById('result-emoji').textContent = '❓';
        document.getElementById('result-alert').style.display = 'none';
        showToast('❌', 'Not found', 'SKU ' + raw + ' is not in the system');
        return;
    }

    // Populate fields
    document.getElementById('result-name').textContent    = product.name;
    document.getElementById('result-meta').textContent    = raw + ' · ' + product.category + ' · Aisle ' + product.aisle;
    document.getElementById('result-emoji').textContent   = product.emoji;
    document.getElementById('result-price-val').textContent = product.price;
    document.getElementById('result-aisle-val').textContent  = product.aisle;

    // Stock — colour-coded
    const stockEl = document.getElementById('result-stock-val');
    stockEl.textContent = product.stock;
    if (product.status === 'critical') {
        stockEl.style.color = '#f87171';
    } else if (product.status === 'low') {
        stockEl.style.color = '#fbbf24';
    } else {
        stockEl.style.color = '#4ade80';
    }

    // Use-by
    document.getElementById('result-useby-val').textContent = product.useDays + 'd';
    document.getElementById('result-useby-sub').textContent = product.useBy;

    // Alert banner
    const alert = document.getElementById('result-alert');
    if (product.status === 'critical') {
        alert.style.display = 'flex';
        alert.className = 'wh-alert wh-alert-red mb-3';
        alert.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i><div>Stock critically low — reorder or escalate to manager immediately.</div>';
    } else if (product.status === 'low') {
        alert.style.display = 'flex';
        alert.className = 'wh-alert wh-alert-amber mb-3';
        alert.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i><div>Stock is below threshold — consider flagging for reorder.</div>';
    } else {
        alert.style.display = 'none';
    }

    // Add to recent scans table
    addToRecentScans(raw, product.name, product.status);

    showToast('✅', 'Product found', product.name + ' · ' + product.aisle);
}

/**
 * addToRecentScans — prepends a row to the recent scans table.
 */
function addToRecentScans(sku, name, status) {
    const tbody = document.getElementById('recent-scans-body');
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const badgeMap = {
        critical: '<span class="badge-wh badge-red">Critical</span>',
        low:      '<span class="badge-wh badge-amber">Low Stock</span>',
        ok:       '<span class="badge-wh badge-green">Found</span>',
    };
    const badge = badgeMap[status] || '<span class="badge-wh badge-grey">—</span>';

    const row = document.createElement('tr');
    row.innerHTML = `
    <td class="td-muted">${sku}</td>
    <td>${name}</td>
    <td class="td-muted">${now}</td>
    <td>${badge}</td>`;

    // Prepend (newest first) and cap at 5 rows
    tbody.insertBefore(row, tbody.firstChild);
    if (tbody.children.length > 5) tbody.removeChild(tbody.lastChild);
}

/**
 * clearScan — resets the scan page back to its empty state.
 */
function clearScan() {
    document.getElementById('sku-input').value = '';
    document.getElementById('scan-result-panel').classList.remove('visible');
    document.getElementById('scan-placeholder').style.display = 'flex';
}


/* ══════════════════════════════════════════════════════════════
   6. PICK ORDERS PAGE
   ══════════════════════════════════════════════════════════════ */

// Track how many items are checked in the active order
let _pickChecked = 5;   // 5 pre-ticked on load to show progress
const _pickTotal  = 14;

/**
 * togglePick — tick/untick a pick checklist item.
 * Updates the running count, progress bar, and parent row style.
 */
function togglePick(checkEl) {
    const wasChecked = checkEl.classList.contains('checked');
    checkEl.classList.toggle('checked');
    checkEl.textContent = checkEl.classList.contains('checked') ? '✓' : '';

    // Update parent pick-item visual
    const item = checkEl.closest('.pick-item');
    if (item) item.classList.toggle('done', checkEl.classList.contains('checked'));

    // Update counter
    _pickChecked = wasChecked
        ? Math.max(0, _pickChecked - 1)
        : Math.min(_pickTotal, _pickChecked + 1);

    // Update progress bar + label
    const pct = Math.round((_pickChecked / _pickTotal) * 100);
    document.getElementById('pick-progress-bar').style.width = pct + '%';
    document.getElementById('pick-progress-label').textContent = _pickChecked + ' of ' + _pickTotal + ' items picked';
    document.getElementById('pick-count-label').textContent    = _pickChecked + ' / ' + _pickTotal + ' items picked';
}

/**
 * completeOrder — marks the active pick order as done.
 */
function completeOrder() {
    if (_pickChecked < _pickTotal) {
        const remaining = _pickTotal - _pickChecked;
        showToast('⚠️', 'Incomplete pick', remaining + ' item' + (remaining > 1 ? 's' : '') + ' still need to be picked');
        return;
    }
    showToast('✅', 'Order complete!', 'ORD-2847 sent to dispatch queue');
    // Reset progress bar to full green
    const bar = document.getElementById('pick-progress-bar');
    bar.classList.remove('pb-blue');
    bar.classList.add('pb-green');
}

/**
 * selectOrder — switches the active order display.
 * In a real app this would load a different order's item list.
 */
function selectOrder(card, orderId, meta) {
    // Remove active highlight from all queue cards
    document.querySelectorAll('#pick-queue .order-card').forEach(c => c.classList.remove('active-order'));
    card.classList.add('active-order');

    document.getElementById('active-order-label').textContent = orderId;
    document.getElementById('active-order-meta-topbar').textContent = meta;
    showToast('📋', 'Order selected', orderId + ' — work through the pick list below');
}


/* ══════════════════════════════════════════════════════════════
   7. DISPATCH ORDERS PAGE
   ══════════════════════════════════════════════════════════════ */

/**
 * dispatchOrder — confirms an order has been handed to the driver.
 * @param {HTMLElement} btn     — the clicked button
 * @param {string}      orderId — e.g. "ORD-2845"
 */
function dispatchOrder(btn, orderId) {
    // Update button to confirmed state
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Dispatched!';
    btn.classList.remove('btn-wh-success');
    btn.classList.add('btn-wh-ghost');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.transform = 'none';
    btn.style.boxShadow = 'none';

    // Dim the parent card
    const card = btn.closest('.dispatch-card, .glass-card');
    if (card) card.style.opacity = '0.65';

    showToast('🚚', orderId + ' dispatched', 'Driver and delivery log updated');
}


/* ══════════════════════════════════════════════════════════════
   8. REPORT ISSUE PAGE
   ══════════════════════════════════════════════════════════════ */

/**
 * submitIssue — validates and "submits" the issue report form.
 */
function submitIssue() {
    const type     = document.getElementById('issue-type').value;
    const desc     = document.getElementById('issue-desc').value.trim();
    const priority = document.getElementById('issue-priority').value;

    if (!type) {
        showToast('⚠️', 'Select issue type', 'Choose a type before submitting');
        document.getElementById('issue-type').focus();
        return;
    }
    if (!desc) {
        showToast('⚠️', 'Description required', 'Describe the issue so management can act');
        document.getElementById('issue-desc').focus();
        return;
    }

    // Add to open issues panel
    addOpenIssue(type, desc, priority);

    showToast('🚩', 'Issue reported', 'Management has been notified immediately');
    clearIssueForm();
}

/**
 * addOpenIssue — adds a new issue card to the open issues panel.
 */
function addOpenIssue(type, desc, priority) {
    const panel = document.getElementById('open-issues-list');
    const now   = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const priorityBadge =
        priority.startsWith('Critical') ? '<span class="badge-wh badge-red">Critical</span>'  :
            priority.startsWith('High')     ? '<span class="badge-wh badge-red">High</span>'      :
                priority.startsWith('Medium')   ? '<span class="badge-wh badge-amber">Medium</span>'  :
                    '<span class="badge-wh badge-grey">Low</span>';

    const labelMap = {
        stock:     'Out of Stock',
        damaged:   'Damaged Product',
        expiry:    'Near / Past Expiry',
        misplace:  'Misplaced Item',
        label:     'Incorrect Label',
        equipment: 'Equipment Fault',
        safety:    'Safety Hazard',
        other:     'Other Issue',
    };
    const typeLabel = labelMap[type] || type;

    const card = document.createElement('div');
    card.className = 'issue-card issue-card-amber mb-2';
    card.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-1">
      <span style="font-weight:600;font-size:0.88rem;">${typeLabel}</span>
      ${priorityBadge}
    </div>
    <div style="font-size:0.8rem;color:rgba(255,255,255,0.6);">${desc.slice(0, 80)}${desc.length > 80 ? '…' : ''}</div>
    <div style="font-size:0.7rem;color:rgba(255,255,255,0.28);margin-top:5px;">
      <i class="bi bi-clock"></i> Reported ${now} · You
    </div>
    <div class="d-flex gap-2 mt-2">
      <button class="btn-icon" onclick="resolveIssue(this)" title="Mark resolved"><i class="bi bi-check-circle"></i></button>
      <button class="btn-icon" title="Escalate"><i class="bi bi-arrow-up-circle"></i></button>
    </div>`;

    // Insert before the "no other issues" placeholder text
    const placeholder = document.getElementById('no-issues-placeholder');
    panel.insertBefore(card, placeholder);
}

/**
 * resolveIssue — removes a resolved issue card from the panel.
 */
function resolveIssue(btn) {
    const card = btn.closest('.issue-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.3s ease';
        setTimeout(() => card.remove(), 320);
        showToast('✅', 'Issue resolved', 'Marked as resolved and removed from open list');
    }
}

/**
 * clearIssueForm — resets all issue form fields.
 */
function clearIssueForm() {
    document.getElementById('issue-type').value     = '';
    document.getElementById('issue-priority').value = 'Medium — needs attention today';
    document.getElementById('issue-sku').value      = '';
    document.getElementById('issue-location').value = '';
    document.getElementById('issue-desc').value     = '';
}


/* ══════════════════════════════════════════════════════════════
   9. REPORT SUBSTITUTION PAGE
   ══════════════════════════════════════════════════════════════ */

/**
 * submitSubstitution — validates and logs a product substitution.
 */
function submitSubstitution() {
    const order       = document.getElementById('sub-order').value.trim();
    const original    = document.getElementById('sub-original').value.trim();
    const replacement = document.getElementById('sub-replacement').value.trim();

    if (!order || !original || !replacement) {
        showToast('⚠️', 'Missing fields', 'Order number, original and replacement are all required');
        return;
    }

    addSubstitutionHistory(order, original, replacement);
    showToast('🔄', 'Substitution recorded', original + ' → ' + replacement + ' logged for ' + order);
    clearSubForm();
}

/**
 * addSubstitutionHistory — prepends an entry to the history panel.
 */
function addSubstitutionHistory(order, original, replacement) {
    const list = document.getElementById('sub-history-list');
    const now  = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const entry = document.createElement('div');
    entry.className = 'sub-history-item new-entry mb-2';
    entry.innerHTML = `
    <div style="font-size:0.7rem;color:rgba(255,255,255,0.28);margin-bottom:4px;">${order} · ${now}</div>
    <div style="font-size:0.83rem;font-weight:600;margin-bottom:3px;">${original}</div>
    <div style="display:flex;align-items:center;gap:6px;">
      <i class="bi bi-arrow-right" style="color:rgba(255,255,255,0.28);font-size:0.75rem;"></i>
      <span style="font-size:0.8rem;color:rgba(255,255,255,0.6);">${replacement}</span>
    </div>`;

    list.insertBefore(entry, list.firstChild);
}

/**
 * clearSubForm — resets all substitution form fields.
 */
function clearSubForm() {
    ['sub-order','sub-original','sub-orig-qty','sub-orig-price',
        'sub-replacement','sub-brand','sub-qty','sub-price','sub-notes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}


/* ══════════════════════════════════════════════════════════════
   10. INVENTORY SEARCH (client-side filter)
   ══════════════════════════════════════════════════════════════ */

/**
 * filterInventory — hides rows that don't match the search term.
 * Fires on keyup from the inventory search input.
 */
function filterInventory(inputEl) {
    const query = inputEl.value.toLowerCase();
    const rows  = document.querySelectorAll('#inventory-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}