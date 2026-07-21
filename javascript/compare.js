// ==========================================================================
// FILENAME: javascript/compare.js
// ==========================================================================

const exchangeRates = { USD: 1.0, PKR: 278.0, GBP: 0.78, EUR: 0.92, AED: 3.67 };
const currencySigns = { USD: '$', PKR: '₨', GBP: '£', EUR: '€', AED: 'د.إ' };

let currentCurrency = localStorage.getItem('fiq_currency') || 'USD';

function calculateComparison() {
  currentCurrency = localStorage.getItem('fiq_currency') || "USD";

  // STEP 1: Read input values directly from layout node structures
  const amount = parseFloat(document.getElementById('cmp-amount').value) || 0;

  // STEP 2: Calculate explicit platform deductions and net returns matrix parameters
  const fiverrNet  = amount * 0.80; 
  const fiverrLost = amount * 0.20;

  const upworkFee  = amount <= 500 ? amount * 0.20 : (500 * 0.20) + ((amount - 500) * 0.10);
  const upworkNet  = amount - upworkFee;

  const directNet  = amount * 1.00; 

  // STEP 3: Setup monospace currency formatting helper block
  const fractionDigits = (currentCurrency === 'PKR') ? 0 : 2;
  const sign = currencySigns[currentCurrency] || '$';
  
  function fmt(n) {
    return sign + ' ' + Math.round(n).toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    });
  }

  // STEP 4: Inject processed elements directly into dashboard cards nodes
  document.getElementById('cmp-f-net').textContent = 'Net: ' + fmt(fiverrNet);
  document.getElementById('cmp-f-lost').textContent = 'Fee: ' + fmt(fiverrLost);

  document.getElementById('cmp-u-net').textContent = 'Net: ' + fmt(upworkNet);
  document.getElementById('cmp-u-lost').textContent = 'Fee: ' + fmt(upworkFee);

  document.getElementById('cmp-d-net').textContent = 'Net: ' + fmt(directNet);
  document.getElementById('cmp-d-lost').textContent = 'No deductions ✓';

  // STEP 5: Find the maximum profitable yield avenue outcome 
  const best = Math.max(fiverrNet, upworkNet, directNet);

  // STEP 6: Flush old template indicator badges and styles to maintain DOM state integrity
  ['cmp-fiverr', 'cmp-upwork', 'cmp-direct'].forEach(function(id) {
    const cardEl = document.getElementById(id);
    if (cardEl) {
      cardEl.classList.remove('best');
      const oldBadge = cardEl.querySelector('.best-badge');
      if (oldBadge) oldBadge.remove();
    }
  });

  // STEP 7: Check winning coordinate map indices
  let bestId;
  if (best === directNet) {
    bestId = 'cmp-direct';
  } else if (best === upworkNet) {
    bestId = 'cmp-upwork';
  } else {
    bestId = 'cmp-fiverr';
  }

  // STEP 8: Append active focus highlights on winning card item
  const bestCard = document.getElementById(bestId);
  if (bestCard) {
    bestCard.classList.add('best');

    // STEP 9: Programmatically generate the premium indicator badge node
    const badge = document.createElement('div');
    badge.className = 'best-badge';
    badge.textContent = '✓ Best earnings';
    bestCard.insertBefore(badge, bestCard.firstChild);
  }

  // STEP 10: Inject dynamic contextual analysis text advisory statements
  const advice = document.getElementById('cmp-advice');
  if (advice) {
    if (bestId === 'cmp-direct') {
      advice.textContent = `💡 Direct clients give you 100% of earnings! Saving you ${fmt(fiverrLost)} vs Fiverr.`;
    } else if (bestId === 'cmp-upwork') {
      advice.textContent = '💡 Upwork sliding structures give you a better return margin matrix than Fiverr here.';
    } else {
      advice.textContent = '💡 Consider direct clients or sliding platform contracts to maximize absolute take-home yields.';
    }
  }

  // STEP 11: Remove rendering constraint classes to present calculation results view canvas
  document.getElementById('compare-result').classList.remove('hidden');
}

// Global hook listener matching Navbar dropdown transitions
window.addEventListener('storage', (e) => {
    if (e.key === 'fiq_currency') {
        const oldCurrency = currentCurrency;
        currentCurrency = e.newValue || 'USD';

        const conversionFactor = exchangeRates[currentCurrency] / exchangeRates[oldCurrency];
        
        const cmpAmountInput = document.getElementById('cmp-amount');
        if (cmpAmountInput && cmpAmountInput.value) {
            cmpAmountInput.value = Math.round(parseFloat(cmpAmountInput.value) * conversionFactor);
        }

        if (!document.getElementById('compare-result').classList.contains('hidden')) {
            calculateComparison();
        }
    }
});