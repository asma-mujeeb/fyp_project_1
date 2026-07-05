
// =====================================================
// dashboard.js — Combined Financial Dashboard
// =====================================================
// FORMULA:
//   Tax      = Income x (TaxRate / 100)
//   Real Net = Income - BusinessCosts - Tax
//                     - HouseExpenses
// =====================================================

// Called when user clicks "Calculate Real Net Income"
function calculateDashboard() {

  // STEP 1: Read input values
  var income  = parseFloat(document.getElementById('d-income').value)  || 0;
  var bizExp  = parseFloat(document.getElementById('d-bizexp').value)  || 0;
  var taxRate = parseFloat(document.getElementById('d-taxrate').value) || 0;
  var house   = parseFloat(document.getElementById('d-house').value)   || 0;

  // STEP 2: Calculate
  var taxAmt  = income * taxRate / 100;
  var realNet = income - bizExp - taxAmt - house;

  // STEP 3: Format numbers
  function fmt(n) {
    return 'PKR ' + Math.round(n).toLocaleString();
  }

  // STEP 4: Display the 4 metric cards
  document.getElementById('d-r-gross').textContent
    = fmt(income);
  document.getElementById('d-r-biz').textContent
    = '- ' + fmt(bizExp);
  document.getElementById('d-r-tax').textContent
    = '- ' + fmt(taxAmt);
  document.getElementById('d-r-house').textContent
    = '- ' + fmt(house);

  // STEP 5: Display final net income
  var netEl = document.getElementById('d-r-net');
  netEl.textContent = fmt(realNet);

  // Green if positive, red if negative
  if (realNet >= 0) {
    netEl.style.color = '#1D9E75';
  } else {
    netEl.style.color = '#D85A30';
  }

  // STEP 6: Show advice message
  var msg = document.getElementById('d-r-msg');
  if (realNet >= 0) {
    msg.textContent
      = '✓ Positive! You earn more than you spend.';
    msg.style.color = '#1D9E75';
  } else {
    msg.textContent
      = '⚠ Warning: Expenses exceed income! Review spending.';
    msg.style.color = '#D85A30';
  }

  // STEP 7: Make result section visible
  document.getElementById('dash-result')
    .classList.remove('hidden');
}