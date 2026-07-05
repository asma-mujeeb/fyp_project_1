
// =====================================================
// invoice.js — Invoice Generator
// =====================================================

// STEP 1: Set today's date automatically when page loads
document.getElementById('inv-date').value
  = new Date().toISOString().split('T')[0];
// new Date()         = today's date and time
// .toISOString()     = "2025-07-03T10:00:00.000Z"
// .split('T')[0]     = "2025-07-03" (date part only)


// STEP 2: Preview Invoice function
// Called when user clicks "Preview Invoice"
function previewInvoice() {

  // Read text input values
  // || 'default' is fallback if field is empty
  var from     = document.getElementById('inv-from').value    || 'Freelancer';
  var to       = document.getElementById('inv-to').value      || 'Client';
  var service  = document.getElementById('inv-service').value || 'Service';
  var date     = document.getElementById('inv-date').value    || '';
  var currency = document.getElementById('inv-currency').value;
  var amount   = parseFloat(document.getElementById('inv-amount').value) || 0;
  var taxRate  = parseFloat(document.getElementById('inv-tax').value)    || 0;

  // Calculate tax and total
  var taxAmt = amount * taxRate / 100;
  var total  = amount + taxAmt;

  // Format numbers
  function fmt(n) {
    return currency + ' ' + Math.round(n).toLocaleString();
  }

  // Fill in invoice preview fields
  document.getElementById('p-from').textContent
    = from;
  document.getElementById('p-to').textContent
    = to;
  document.getElementById('p-date').textContent
    = 'Date: ' + date;
  document.getElementById('p-service').textContent
    = service;
  document.getElementById('p-subtotal').textContent
    = fmt(amount);
  document.getElementById('p-total').textContent
    = 'Total: ' + fmt(total);

  // Show or hide tax row
  // If tax is 0 — hide the tax row completely
  var taxRow = document.getElementById('p-tax-row');
  if (taxRate > 0) {
    taxRow.style.display = ''; // show
    document.getElementById('p-tax-label').textContent
      = 'Tax (' + taxRate + '%)';
    document.getElementById('p-tax-val').textContent
      = fmt(taxAmt);
  } else {
    taxRow.style.display = 'none'; // hide
  }

  // Make invoice preview box visible
  document.getElementById('invoice-preview')
    .classList.remove('hidden');
}