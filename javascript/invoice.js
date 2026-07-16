// =====================================================
// invoice.js — Invoice Generator
// =====================================================

// STEP 1: Set today's date automatically when page loads
document.getElementById('inv-date').value = new Date().toISOString().split('T')[0];

// STEP 2: Preview Invoice function
function previewInvoice() {
  var from     = document.getElementById('inv-from').value    || 'Freelancer';
  var to       = document.getElementById('inv-to').value      || 'Client';
  var service  = document.getElementById('inv-service').value || 'Service';
  var date     = document.getElementById('inv-date').value    || '';
  var currency = document.getElementById('inv-currency').value;
  var amount   = parseFloat(document.getElementById('inv-amount').value) || 0;
  var taxRate  = parseFloat(document.getElementById('inv-tax').value)    || 0;

  var taxAmt = amount * taxRate / 100;
  var total  = amount + taxAmt;

  function fmt(n) {
    return currency + ' ' + Math.round(n).toLocaleString();
  }

  document.getElementById('p-from').textContent = from;
  document.getElementById('p-to').textContent = to;
  document.getElementById('p-date').textContent = 'Date: ' + date;
  document.getElementById('p-service').textContent = service;
  document.getElementById('p-subtotal').textContent = fmt(amount);
  document.getElementById('p-total').textContent = 'Total: ' + fmt(total);

  var taxRow = document.getElementById('p-tax-row');
  if (taxRate > 0) {
    taxRow.style.display = '';
    document.getElementById('p-tax-label').textContent = 'Tax (' + taxRate + '%)';
    document.getElementById('p-tax-val').textContent = fmt(taxAmt);
  } else {
    taxRow.style.display = 'none';
  }

  // Make invoice preview box visible
  document.getElementById('invoice-preview').classList.remove('hidden');
}

// STEP 3: Native Print PDF Generator
function downloadInvoicePDF() {
  // Triggers the system print layout directly
  window.print();
}