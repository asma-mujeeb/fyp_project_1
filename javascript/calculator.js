
// =====================================================
// calculator.js — Profession Calculator
// =====================================================

// STEP 1: Object storing extra-cost label
// for each of the 11 professions
var professionLabels = {
  'Digital Marketing': 'Ad Spend / Other Cost',
  'TikTok Shop':       'VAT + Affiliate Fees',
  'Video Editing':     'Equipment / Subscription',
  'Audio Editing':     'Studio / Plugin Cost',
  'Graphic Design':    'Adobe / Canva Fees',
  'Content Writing':   'Research Tools Cost',
  'Social Media':      'Scheduling Tool Cost',
  'Web Development':   'Hosting / Domain Cost',
  'Photography':       'Equipment / Editing SW',
  'E-Commerce':        'Product / Return Cost',
  'SEO':               'SEO Tool Subscription'
};


// STEP 2: Called when user clicks a profession button
// Updates calculator title and extra-cost label
function selectProfession(name, clickedBtn) {

  // Remove green highlight from ALL buttons
  document.querySelectorAll('.prof-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });

  // Highlight only the clicked button
  clickedBtn.classList.add('active');

  // Update calculator heading e.g. "SEO Calculator"
  document.getElementById('calc-title').textContent
    = name + ' Calculator';

  // Update the extra cost label for this profession
  document.getElementById('extra-label').textContent
    = professionLabels[name];
}


// STEP 3: Main calculation function
// Called when user clicks "Calculate Net Profit"
function calculateProfit() {

  // Read all input values
  // parseFloat() converts text to number
  // || 0 handles empty fields
  var currency = document.getElementById('calc-currency').value;
  var income   = parseFloat(document.getElementById('c-income').value)   || 0;
  var pfeeRate = parseFloat(document.getElementById('c-platform').value) || 0;
  var software = parseFloat(document.getElementById('c-software').value) || 0;
  var extra    = parseFloat(document.getElementById('c-extra').value)    || 0;
  var taxRate  = parseFloat(document.getElementById('c-taxrate').value)  || 0;

  // Calculate each deduction
  var platformFee = income * pfeeRate / 100;
  // e.g. 50000 x 20 / 100 = 10000

  var taxAmount = income * taxRate / 100;
  // e.g. 50000 x 10 / 100 = 5000

  var netProfit = income - platformFee - software
                         - extra - taxAmount;
  // e.g. 50000-10000-2000-3000-5000 = 30000

  // Format numbers: PKR 30,000
  function fmt(n) {
    return currency + ' ' + Math.round(n).toLocaleString();
  }

  // Display results in HTML
  document.getElementById('r-gross').textContent
    = fmt(income);
  document.getElementById('r-platform').textContent
    = '- ' + fmt(platformFee);
  document.getElementById('r-software').textContent
    = '- ' + fmt(software);
  document.getElementById('r-extra').textContent
    = '- ' + fmt(extra);
  document.getElementById('r-tax').textContent
    = '- ' + fmt(taxAmount);
  document.getElementById('r-net').textContent
    = fmt(netProfit);

  // Color: green if positive, red if negative
  var netEl = document.getElementById('r-net');
  if (netProfit >= 0) {
    netEl.style.color = '#1D9E75'; // green
  } else {
    netEl.style.color = '#D85A30'; // red
  }
}