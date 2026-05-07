/*
  FRESHMART — warehouse.js
*/


/* 1. PAGE NAVIGATION
   Shows/hides .wh-page sections and updates the topbar title.
   Called by onclick on each sidebar nav button.  */

const PAGE_INFO = {
    dashboard:      ['Dashboard',           'Warehouse · Overview'],
    scan:           ['Scan Item',           'Warehouse · Operations'],
    inventory:      ['Inventory',           'Warehouse · Stock'],
    pick:           ['Pick Orders',         'Warehouse · Operations'],
    dispatch:       ['Dispatch Orders',     'Warehouse · Operations'],
    'report-issue': ['Report Issue',        'Warehouse · Issues'],
    substitution:   ['Report Substitution', 'Warehouse · Issues'],
};

function showPage(id, btn) {
    document.querySelectorAll('.wh-page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('wh-page-' + id);
    if (target) target.classList.add('active');
    const info = PAGE_INFO[id] || [id, 'Warehouse'];
    document.getElementById('topbar-title').textContent      = info[0];
    document.getElementById('topbar-breadcrumb').textContent = info[1];
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('wh-content').scrollTop = 0;
    window.scrollTo(0, 0);
}


/* 2. MOBILE SIDEBAR TOGGLE */

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

document.addEventListener('click', function (e) {
    const sidebar   = document.getElementById('sidebar');
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


/* 3. RIPPLE EFFECT */

function applyRipple(e) {
    const el   = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const radius = size / 2;

    const circle = document.createElement('span');
    circle.style.cssText = `
        position: fixed;
        border-radius: 50%;
        background: rgba(255,255,255,0.18);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-anim 0.55s linear forwards;
        width:  ${size}px;
        height: ${size}px;
        left:   ${e.clientX - radius}px;
        top:    ${e.clientY - radius}px;
        z-index: 9999;
    `;
    document.body.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.order-card, .nav-btn').forEach(el => {
        el.addEventListener('click', applyRipple);
    });
});


/* 4. TOAST NOTIFICATIONS */

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


/* 5. SCAN ITEM PAGE */

const PRODUCTS = {
    'SKU-00142': { name:'Organic Whole Milk 2L', brand:'Cravendale', category:'Dairy', aisle:'3B', shelf:'Shelf 2', stock:4, min:50, price:'£1.49', useBy:'21 Apr 2025', useDays:3, emoji:'🥛', status:'critical' },
    'SKU-00391': { name:'Sourdough Bread 800g', brand:'Bakehouse', category:'Bakery', aisle:'1A', shelf:'Shelf 1', stock:11, min:40, price:'£1.75', useBy:'20 Apr 2025', useDays:2, emoji:'🍞', status:'low' },
    'SKU-00057': { name:'Free Range Eggs × 12', brand:'Happy Hens', category:'Eggs', aisle:'2C', shelf:'Shelf 3', stock:18, min:60, price:'£2.25', useBy:'28 Apr 2025', useDays:10, emoji:'🥚', status:'low' },
    'SKU-00213': { name:'Chicken Breast 500g', brand:"Butcher's Best", category:'Meat', aisle:'Cold Store', shelf:'Bay 2', stock:31, min:50, price:'£3.99', useBy:'22 Apr 2025', useDays:4, emoji:'🍗', status:'ok' },
    'SKU-00088': { name:'Cheddar Cheese 400g', brand:'Wyke Farms', category:'Dairy', aisle:'3B', shelf:'Shelf 4', stock:43, min:50, price:'£2.85', useBy:'10 May 2025', useDays:22, emoji:'🧀', status:'ok' },
};

function simulateScan() {
    document.getElementById('sku-input').value = 'SKU-00142';
    lookupSKU();
}

function lookupSKU() {
    const raw     = document.getElementById('sku-input').value.trim().toUpperCase();
    if (!raw) { showToast('⚠️', 'No SKU entered', 'Type a barcode or SKU number first'); return; }
    const product = PRODUCTS[raw];
    document.getElementById('scan-placeholder').style.display = 'none';
    document.getElementById('scan-result-panel').classList.add('visible');
    if (!product) {
        document.getElementById('result-name').textContent      = 'Product Not Found';
        document.getElementById('result-meta').textContent      = raw + ' · No match in system';
        document.getElementById('result-stock-val').textContent  = '—';
        document.getElementById('result-stock-val').style.color = 'rgba(255,255,255,0.4)';
        document.getElementById('result-aisle-val').textContent  = '—';
        document.getElementById('result-price-val').textContent  = '—';
        document.getElementById('result-useby-val').textContent  = '—';
        document.getElementById('result-useby-sub').textContent  = '';
        document.getElementById('result-emoji').textContent      = '❓';
        document.getElementById('result-alert').style.display   = 'none';
        showToast('❌', 'Not found', 'SKU ' + raw + ' is not in the system');
        return;
    }
    document.getElementById('result-name').textContent      = product.name;
    document.getElementById('result-meta').textContent      = raw + ' · ' + product.category + ' · Aisle ' + product.aisle;
    document.getElementById('result-emoji').textContent     = product.emoji;
    document.getElementById('result-price-val').textContent = product.price;
    document.getElementById('result-aisle-val').textContent = product.aisle;
    const stockEl = document.getElementById('result-stock-val');
    stockEl.textContent = product.stock;
    stockEl.style.color = product.status === 'critical' ? '#f87171' : product.status === 'low' ? '#fbbf24' : '#4ade80';
    document.getElementById('result-useby-val').textContent = product.useDays + 'd';
    document.getElementById('result-useby-sub').textContent = product.useBy;
    const alert = document.getElementById('result-alert');
    if (product.status === 'critical') {
        alert.style.display = 'flex'; alert.className = 'wh-alert wh-alert-red mb-3';
        alert.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i><div>Stock critically low — reorder or escalate to manager immediately.</div>';
    } else if (product.status === 'low') {
        alert.style.display = 'flex'; alert.className = 'wh-alert wh-alert-amber mb-3';
        alert.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i><div>Stock is below threshold — consider flagging for reorder.</div>';
    } else { alert.style.display = 'none'; }
    addToRecentScans(raw, product.name, product.status);
    showToast('✅', 'Product found', product.name + ' · ' + product.aisle);
}

function addToRecentScans(sku, name, status) {
    const tbody = document.getElementById('recent-scans-body');
    const now   = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const badgeMap = { critical: '<span class="badge-wh badge-red">Critical</span>', low: '<span class="badge-wh badge-amber">Low Stock</span>', ok: '<span class="badge-wh badge-green">Found</span>', 'not-found': '<span class="badge-wh badge-red">Not Found</span>' };
    const row = document.createElement('tr');
    row.innerHTML = `<td class="td-muted">${sku}</td><td>${name}</td><td class="td-muted">${now}</td><td>${badgeMap[status] || '<span class="badge-wh badge-grey">—</span>'}</td>`;
    tbody.insertBefore(row, tbody.firstChild);
    if (tbody.children.length > 5) tbody.removeChild(tbody.lastChild);
}

function clearScan() {
    document.getElementById('sku-input').value = '';
    document.getElementById('scan-result-panel').classList.remove('visible');
    document.getElementById('scan-placeholder').style.display = 'flex';
}


/* ══════════════════════════════════════════════════════════════
   6. PICK ORDERS PAGE
   ══════════════════════════════════════════════════════════════ */

// Dynamically read item count from real orders in localStorage
// Falls back to 14 (demo) if no real orders exist
const _realOrders  = JSON.parse(localStorage.getItem('fm_orders') || '[]');
const _activeOrder = _realOrders.length > 0 ? _realOrders[_realOrders.length - 1] : null;
let _pickTotal     = _activeOrder
    ? (_activeOrder.itemCount || (_activeOrder.items ? _activeOrder.items.length : 0) || 14)
    : 14;
let _pickChecked   = 0;

/* Call this whenever switching orders — resets counters and DOM labels */
function resetPickState(itemCount) {
    _pickTotal   = itemCount;
    _pickChecked = 0;
    const bar = document.getElementById('pick-progress-bar');
    const pbl = document.getElementById('pick-progress-label');
    const lbl = document.getElementById('pick-count-label');
    if (bar) bar.style.width  = '0%';
    if (pbl) pbl.textContent  = '0 of ' + itemCount + ' items picked';
    if (lbl) lbl.textContent  = '0 / '  + itemCount + ' items picked';
}

function togglePick(checkEl) {
    const wasChecked = checkEl.classList.contains('checked');
    checkEl.classList.toggle('checked');
    checkEl.textContent = checkEl.classList.contains('checked') ? '✓' : '';
    const item = checkEl.closest('.pick-item');
    if (item) item.classList.toggle('done', checkEl.classList.contains('checked'));

    // Re-read _pickTotal from DOM in case it was updated by pick.html
    // Count total pick-items in the list
    const allItems = document.querySelectorAll('#pick-items .pick-item');
    if (allItems.length > 0 && _pickTotal === 0) _pickTotal = allItems.length;

    _pickChecked = wasChecked
        ? Math.max(0, _pickChecked - 1)
        : Math.min(_pickTotal, _pickChecked + 1);

    const pct = _pickTotal > 0 ? Math.round((_pickChecked / _pickTotal) * 100) : 0;
    const bar = document.getElementById('pick-progress-bar');
    const pbl = document.getElementById('pick-progress-label');
    const lbl = document.getElementById('pick-count-label');
    if (bar) bar.style.width   = pct + '%';
    if (pbl) pbl.textContent   = _pickChecked + ' of ' + _pickTotal + ' items picked';
    if (lbl) lbl.textContent   = _pickChecked + ' / '  + _pickTotal + ' items picked';
}

function completeOrder() {
    if (_pickChecked < _pickTotal) {
        const remaining = _pickTotal - _pickChecked;
        showToast('⚠️', 'Incomplete pick', remaining + ' item' + (remaining > 1 ? 's' : '') + ' still need to be picked');
        return;
    }

    // Save completed order to dispatch queue in localStorage
    const realOrders    = JSON.parse(localStorage.getItem('fm_orders') || '[]');
    const dispatchQueue = JSON.parse(localStorage.getItem('fm_dispatch_queue') || '[]');

    // Find the currently active order (index 0 when reversed = last in array)
    const reversedOrders = realOrders.slice().reverse();
    const activeOrderIdx = typeof _activeOrderIndex !== 'undefined' ? _activeOrderIndex : 0;
    const activeOrder    = reversedOrders[activeOrderIdx] || (realOrders.length > 0 ? realOrders[realOrders.length - 1] : null);

    const rawAddr = activeOrder ? (activeOrder.address || '') : '';
    const dispatchEntry = {
        id:          activeOrder ? activeOrder.id : ('ORD-' + Math.floor(2800 + Math.random() * 200)),
        itemCount:   _pickTotal,
        status:      'ready',
        completedAt: new Date().toISOString(),
        address:     rawAddr,   // may be string or object — dispatch.html handles both
        delivery:    activeOrder ? activeOrder.delivery : 'Standard',
    };

    // Avoid duplicates
    if (!dispatchQueue.find(o => o.id === dispatchEntry.id)) {
        dispatchQueue.push(dispatchEntry);
        localStorage.setItem('fm_dispatch_queue', JSON.stringify(dispatchQueue));
    }

    // Mark order as picked in fm_orders
    if (activeOrder) {
        const idx = realOrders.findIndex(o => o.id === activeOrder.id);
        if (idx !== -1) {
            realOrders[idx].warehouseStatus = 'picked';
            realOrders[idx].pickedAt = new Date().toISOString();
            localStorage.setItem('fm_orders', JSON.stringify(realOrders));
        }
    }

    showToast('✅', 'Order complete!', dispatchEntry.id + ' sent to dispatch queue — redirecting to dispatch');

    // Update dispatch badge in sidebar nav
    const updatedQueue = JSON.parse(localStorage.getItem('fm_dispatch_queue') || '[]');
    const dispatchBadge = document.querySelector('a[href="dispatch.html"] .nav-badge');
    if (dispatchBadge) dispatchBadge.textContent = updatedQueue.length;

    // Redirect to dispatch page after 2s so user sees the toast
    setTimeout(function() {
        window.location.href = 'dispatch.html';
    }, 2000);

    // Turn completed card green
    const bar = document.getElementById('pick-progress-bar');
    if (bar) { bar.classList.remove('pb-blue'); bar.classList.add('pb-green'); }

    // Remove completed order from queue and promote next after short delay
    setTimeout(function() {
        const queue = document.getElementById('pick-queue');
        if (!queue) return;
        const currentIndex = typeof _activeOrderIndex !== 'undefined' ? _activeOrderIndex : 0;
        const cards = queue.querySelectorAll('.order-card');

        // Remove the completed card with a fade
        if (cards[currentIndex]) {
            cards[currentIndex].style.transition = 'opacity 0.4s ease, max-height 0.4s ease';
            cards[currentIndex].style.opacity    = '0';
            cards[currentIndex].style.maxHeight  = cards[currentIndex].offsetHeight + 'px';
            setTimeout(function() {
                cards[currentIndex].style.maxHeight  = '0';
                cards[currentIndex].style.overflow   = 'hidden';
                cards[currentIndex].style.marginBottom = '0';
                cards[currentIndex].style.padding    = '0';
                setTimeout(function() {
                    if (cards[currentIndex].parentElement) {
                        cards[currentIndex].parentElement.removeChild(cards[currentIndex]);
                    }
                    // Update the pending count
                    var remaining = document.querySelectorAll('#pick-queue .order-card').length;
                    var countEl   = document.getElementById('queue-count');
                    var subEl     = document.getElementById('pick-subheading');
                    if (countEl) countEl.textContent = remaining + ' pending';
                    if (subEl)   subEl.textContent   = remaining + ' order' + (remaining !== 1 ? 's' : '') + ' to fulfil this shift';
                    // After removal, promote the new first card
                    if (typeof selectPickOrder === 'function') {
                        selectPickOrder(0);
                    }
                }, 400);
            }, 400);
        }

        // Also update _activeOrderIndex back to 0
        if (typeof _activeOrderIndex !== 'undefined') _activeOrderIndex = 0;
    }, 800);
}

function selectOrder(card, orderId, meta) {
    document.querySelectorAll('#pick-queue .order-card').forEach(c => c.classList.remove('active-order'));
    card.classList.add('active-order');
    const lbl  = document.getElementById('active-order-label');
    const mtop = document.getElementById('active-order-meta-topbar');
    if (lbl)  lbl.textContent  = orderId;
    if (mtop) mtop.textContent = meta;

    // Reset pick counters for the newly selected order
    // Parse item count from meta string e.g. "7 items · Due 11:00am"
    const metaMatch = String(meta).match(/^(\d+)\s+item/);
    const newTotal  = metaMatch ? parseInt(metaMatch[1]) : _pickTotal;
    _pickTotal   = newTotal;
    _pickChecked = 0;

    const bar = document.getElementById('pick-progress-bar');
    const pbl = document.getElementById('pick-progress-label');
    const lbl2 = document.getElementById('pick-count-label');
    if (bar)  bar.style.width  = '0%';
    if (pbl)  pbl.textContent  = '0 of ' + newTotal + ' items picked';
    if (lbl2) lbl2.textContent = '0 / '  + newTotal + ' items picked';

    showToast('📋', 'Order selected', orderId + ' — work through the pick list below');
}


/* ══════════════════════════════════════════════════════════════
   7. DISPATCH ORDERS PAGE
   ══════════════════════════════════════════════════════════════ */

function dispatchOrder(btn, orderId) {
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Dispatched!';
    btn.classList.remove('btn-wh-success');
    btn.classList.add('btn-wh-ghost');
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.transform = 'none';
    btn.style.boxShadow = 'none';
    const card = btn.closest('.dispatch-card, .glass-card');
    if (card) card.style.opacity = '0.65';

    // Update order status in fm_orders so customer orders.html shows "Shipped"
    const cleanId = String(orderId).replace(/^#/, '');
    const orders  = JSON.parse(localStorage.getItem('fm_orders') || '[]');
    const idx     = orders.findIndex(o =>
        String(o.id) === cleanId ||
        '#' + String(o.id) === cleanId ||
        String(o.id) === '#' + cleanId
    );
    if (idx !== -1) {
        orders[idx].status       = 'shipped';
        orders[idx].dispatchedAt = new Date().toISOString();
        localStorage.setItem('fm_orders', JSON.stringify(orders));
    }

    // Also update fm_dispatch_queue entry
    const queue = JSON.parse(localStorage.getItem('fm_dispatch_queue') || '[]');
    const qi    = queue.findIndex(o =>
        String(o.id) === cleanId ||
        '#' + String(o.id) === cleanId
    );
    if (qi !== -1) {
        queue[qi].status       = 'dispatched';
        queue[qi].dispatchedAt = new Date().toISOString();
        localStorage.setItem('fm_dispatch_queue', JSON.stringify(queue));
    }

    showToast('🚚', orderId + ' dispatched', 'Customer notified · Order marked as shipped');
}


/* ══════════════════════════════════════════════════════════════
   8. REPORT ISSUE PAGE
   ══════════════════════════════════════════════════════════════ */

function submitIssue() {
    const type     = document.getElementById('issue-type').value;
    const desc     = document.getElementById('issue-desc').value.trim();
    const priority = document.getElementById('issue-priority').value;
    if (!type) { showToast('⚠️', 'Select issue type', 'Choose a type before submitting'); document.getElementById('issue-type').focus(); return; }
    if (!desc) { showToast('⚠️', 'Description required', 'Describe the issue so management can act'); document.getElementById('issue-desc').focus(); return; }
    addOpenIssue(type, desc, priority);
    showToast('🚩', 'Issue reported', 'Management has been notified immediately');
    clearIssueForm();
}

function addOpenIssue(type, desc, priority) {
    const panel = document.getElementById('open-issues-list');
    const now   = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const priorityBadge = priority.startsWith('Critical') ? '<span class="badge-wh badge-red">Critical</span>'
        : priority.startsWith('High') ? '<span class="badge-wh badge-red">High</span>'
        : priority.startsWith('Medium') ? '<span class="badge-wh badge-amber">Medium</span>'
        : '<span class="badge-wh badge-grey">Low</span>';
    const labelMap = { stock:'Out of Stock', damaged:'Damaged Product', expiry:'Near / Past Expiry', misplace:'Misplaced Item', label:'Incorrect Label', equipment:'Equipment Fault', safety:'Safety Hazard', other:'Other Issue' };
    const card = document.createElement('div');
    card.className = 'issue-card issue-card-amber mb-2';
    card.innerHTML = `<div class="d-flex align-items-center justify-content-between mb-1"><span style="font-weight:600;font-size:0.88rem;">${labelMap[type]||type}</span>${priorityBadge}</div><div style="font-size:0.8rem;color:rgba(255,255,255,0.6);">${desc.slice(0,80)}${desc.length>80?'…':''}</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.28);margin-top:5px;"><i class="bi bi-clock"></i> Reported ${now} · You</div><div class="d-flex gap-2 mt-2"><button class="btn-icon" onclick="resolveIssue(this)" title="Mark resolved"><i class="bi bi-check-circle"></i></button><button class="btn-icon" title="Escalate"><i class="bi bi-arrow-up-circle"></i></button></div>`;
    const placeholder = document.getElementById('no-issues-placeholder');
    panel.insertBefore(card, placeholder);
}

function resolveIssue(btn) {
    const card = btn.closest('.issue-card');
    if (card) {
        card.style.opacity = '0'; card.style.transition = 'opacity 0.3s ease';
        setTimeout(() => card.remove(), 320);
        showToast('✅', 'Issue resolved', 'Marked as resolved and removed from open list');
    }
}

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

function submitSubstitution() {
    const order       = document.getElementById('sub-order').value.trim();
    const original    = document.getElementById('sub-original').value.trim();
    const replacement = document.getElementById('sub-replacement').value.trim();
    if (!order || !original || !replacement) { showToast('⚠️', 'Missing fields', 'Order number, original and replacement are all required'); return; }
    addSubstitutionHistory(order, original, replacement);
    showToast('🔄', 'Substitution recorded', original + ' → ' + replacement + ' logged for ' + order);
    clearSubForm();
}

function addSubstitutionHistory(order, original, replacement) {
    const list = document.getElementById('sub-history-list');
    const now  = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const entry = document.createElement('div');
    entry.className = 'sub-history-item new-entry mb-2';
    entry.innerHTML = `<div style="font-size:0.7rem;color:rgba(255,255,255,0.28);margin-bottom:4px;">${order} · ${now}</div><div style="font-size:0.83rem;font-weight:600;margin-bottom:3px;">${original}</div><div style="display:flex;align-items:center;gap:6px;"><i class="bi bi-arrow-right" style="color:rgba(255,255,255,0.28);font-size:0.75rem;"></i><span style="font-size:0.8rem;color:rgba(255,255,255,0.6);">${replacement}</span></div>`;
    list.insertBefore(entry, list.firstChild);
}

function clearSubForm() {
    ['sub-order','sub-original','sub-orig-qty','sub-orig-price','sub-replacement','sub-brand','sub-qty','sub-price','sub-notes'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
}


/* ══════════════════════════════════════════════════════════════
   10. INVENTORY SEARCH (client-side filter)
   ══════════════════════════════════════════════════════════════ */

function filterInventory(inputEl) {
    const query = inputEl.value.toLowerCase();
    document.querySelectorAll('#inventory-table tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
}