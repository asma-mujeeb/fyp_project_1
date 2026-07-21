// ==========================================================================
// FILENAME: javascript/invoice.js
// ==========================================================================

const exchangeRates = { USD: 1.0, PKR: 278.0, GBP: 0.78, EUR: 0.92, AED: 3.67 };
const currencySigns = { USD: '$', PKR: '₨', GBP: '£', EUR: '€', AED: 'د.إ' };

let currentCurrency = localStorage.getItem('fiq_currency') || 'USD';

document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('inv-date');
    if(dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    initInvoiceItemsEngine();
    previewInvoice();
});

function initInvoiceItemsEngine() {
    const container = document.getElementById('invoice-items-container');
    const addItemBtn = document.getElementById('add-item-btn');
    const limitMessage = document.getElementById('limit-message');
    const maxItems = 8; 

    function updateUIState() {
        const rows = container.querySelectorAll('.invoice-item-row');
        if (rows.length >= maxItems) {
            addItemBtn.disabled = true;
            addItemBtn.style.opacity = '0.5';
            addItemBtn.style.cursor = 'not-allowed';
            limitMessage.classList.remove('hidden');
        } else {
            addItemBtn.disabled = false;
            addItemBtn.style.opacity = '1';
            addItemBtn.style.cursor = 'pointer';
            limitMessage.classList.add('hidden');
        }
    }

    function createItemRow(itemName = '', desc = '', qty = 1, price = 0) {
        const rowsCount = container.querySelectorAll('.invoice-item-row').length;
        if (rowsCount >= maxItems) return;

        const rowId = 'item-row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const rowHTML = `
            <div class="invoice-item-row" id="${rowId}">
              <div class="grid-2" style="gap: 10px; margin-bottom: 8px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <label>Item / Service Name</label>
                  <input type="text" class="item-name" value="${itemName}" placeholder="e.g. Logo Design">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label>Description (Optional)</label>
                  <input type="text" class="item-desc" value="${desc}" placeholder="Optional details">
                </div>
              </div>
              <div style="display: flex; gap: 10px; align-items: flex-end;">
                <div class="form-group" style="margin-bottom: 0; flex: 1;">
                  <label>Quantity</label>
                  <input type="number" class="item-qty" value="${qty}" min="1">
                </div>
                <div class="form-group" style="margin-bottom: 0; flex: 2;">
                  <label>Unit Price</label>
                  <input type="number" class="item-price" value="${price}" min="0">
                </div>
                <div style="flex: 1; text-align: right; padding-bottom: 10px; font-weight: 600; color: #4b5563; font-size: 13px;">
                  Row Total: <span class="item-row-total">0.00</span>
                </div>
              </div>
              <button type="button" class="remove-item-btn"><i class="fa fa-trash"></i> Remove</button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', rowHTML);
        const newRow = document.getElementById(rowId);

        newRow.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                calculateRowTotal(newRow);
                previewInvoice();
            });
        });

        newRow.querySelector('.remove-item-btn').addEventListener('click', () => {
            newRow.remove();
            updateUIState();
            previewInvoice();
        });

        calculateRowTotal(newRow);
        updateUIState();
    }

    function calculateRowTotal(row) {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = qty * price;
        
        currentCurrency = localStorage.getItem('fiq_currency') || "USD";
        const fractionDigits = (currentCurrency === 'PKR') ? 0 : 2;
        
        row.querySelector('.item-row-total').textContent = total.toLocaleString(undefined, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
        row.dataset.calculatedTotal = total; 
    }

    addItemBtn.addEventListener('click', () => {
        createItemRow('', '', 1, 0);
        previewInvoice();
    });

    window.gatherInvoiceLineItems = function() {
        const data = [];
        if (!container) return data;
        container.querySelectorAll('.invoice-item-row').forEach(row => {
            data.push({
                name: row.querySelector('.item-name').value || 'Service Item',
                desc: row.querySelector('.item-desc').value || '',
                qty: parseFloat(row.querySelector('.item-qty').value) || 0,
                price: parseFloat(row.querySelector('.item-price').value) || 0,
                total: parseFloat(row.dataset.calculatedTotal) || 0
            });
        });
        return data;
    };

    if (container && container.querySelectorAll('.invoice-item-row').length === 0) {
        createItemRow('Logo Design', 'Primary branding package', 1, 0);
    }
}

function previewInvoice() {
    currentCurrency = localStorage.getItem('fiq_currency') || "USD";

    const from = document.getElementById('inv-from').value || 'Freelancer';
    const to = document.getElementById('inv-to').value || 'Client';
    const date = document.getElementById('inv-date').value || '';
    const taxRate = parseFloat(document.getElementById('inv-tax').value) || 0;

    let items = [];
    if (typeof window.gatherInvoiceLineItems === 'function') {
        items = window.gatherInvoiceLineItems();
    }

    const amount = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmt = amount * (taxRate / 100);
    const total = amount + taxAmt;

    const fractionDigits = (currentCurrency === 'PKR') ? 0 : 2;
    const sign = currencySigns[currentCurrency] || '$';

    function fmt(n) {
        return sign + ' ' + n.toLocaleString(undefined, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
    }

    document.getElementById('p-from').textContent = from;
    document.getElementById('p-to').textContent = to;
    document.getElementById('p-date').textContent = 'Date: ' + date;
    document.getElementById('p-subtotal').textContent = fmt(amount);
    document.getElementById('p-total').textContent = 'Total: ' + fmt(total);

    const tbody = document.getElementById('p-invoice-items-body');
    if (tbody) {
        tbody.innerHTML = '';

        if (items.length === 0) {
            tbody.innerHTML = `
                <tr style="border-bottom: 1px solid #eef2f6;">
                  <td colspan="4" style="padding: 12px 0; color: #999; text-align: center;">No items added</td>
                </tr>
            `;
        } else {
            items.forEach(item => {
                const descriptionLine = item.desc ? `<div style="font-size: 11px; color: #777; margin-top: 2px;">${item.desc}</div>` : '';
                const rowHTML = `
                    <tr style="border-bottom: 1px solid #eef2f6; vertical-align: top;">
                      <td style="padding: 12px 0;">
                        <div style="font-weight: 600; color: #222;">${item.name}</div>
                        ${descriptionLine}
                      </td>
                      <td style="padding: 12px 0; text-align: center;">${item.qty}</td>
                      <td style="padding: 12px 0; text-align: right;">${fmt(item.price)}</td>
                      <td style="padding: 12px 0; text-align: right; font-weight: 600;">${fmt(item.total)}</td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', rowHTML);
            });
        }
    }

    const taxRow = document.getElementById('p-tax-row');
    if (taxRow) {
        if (taxRate > 0) {
            taxRow.style.display = '';
            document.getElementById('p-tax-label').textContent = 'Tax (' + taxRate + '%):';
            document.getElementById('p-tax-val').textContent = fmt(taxAmt);
        } else {
            taxRow.style.display = 'none';
        }
    }

    document.getElementById('invoice-preview').classList.remove('hidden');
}

function downloadInvoicePDF() {
    window.print();
}

// Global hook listener matching Navbar dropdown transitions
window.addEventListener('storage', (e) => {
    if (e.key === 'fiq_currency') {
        const oldCurrency = currentCurrency;
        currentCurrency = e.newValue || 'USD';

        const conversionFactor = exchangeRates[currentCurrency] / exchangeRates[oldCurrency];
        const container = document.getElementById('invoice-items-container');
        
        if (container) {
            container.querySelectorAll('.invoice-item-row').forEach(row => {
                const priceInput = row.querySelector('.item-price');
                if (priceInput && priceInput.value) {
                    priceInput.value = Math.round(parseFloat(priceInput.value) * conversionFactor);
                }
                
                // Recalculate inner row properties live
                const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                const total = qty * price;
                const fractionDigits = (currentCurrency === 'PKR') ? 0 : 2;
                
                row.querySelector('.item-row-total').textContent = total.toLocaleString(undefined, {
                    minimumFractionDigits: fractionDigits,
                    maximumFractionDigits: fractionDigits
                });
                row.dataset.calculatedTotal = total;
            });
        }
        
        previewInvoice();
    }
});