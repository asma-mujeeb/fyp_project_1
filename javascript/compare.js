

// =====================================================
// compare.js — Platform Comparison Tool
// =====================================================
// Fiverr  = keep 80%  (loses 20%)
// Upwork  = keep 90%  (loses 10%)
// Direct  = keep 100% (loses  0%)
// =====================================================

// Called when user clicks "Compare Platforms"
function calculateComparison() {

  // STEP 1: Read inputs
  var amount   = parseFloat(document.getElementById('cmp-amount').value) || 0;
  var currency = document.getElementById('cmp-currency').value;

  // STEP 2: Calculate earnings on each platform
  var fiverrNet  = amount * 0.80;
  var upworkNet  = amount * 0.90;
  var directNet  = amount * 1.00;
  var fiverrLost = amount * 0.20;
  var upworkLost = amount * 0.10;

  // STEP 3: Format numbers
  function fmt(n) {
    return currency + ' ' + Math.round(n).toLocaleString();
  }

  // STEP 4: Fill in the three cards
  document.getElementById('cmp-f-net').textContent
    = fmt(fiverrNet);
  document.getElementById('cmp-f-lost').textContent
    = '- ' + fmt(fiverrLost) + ' deducted';

  document.getElementById('cmp-u-net').textContent
    = fmt(upworkNet);
  document.getElementById('cmp-u-lost').textContent
    = '- ' + fmt(upworkLost) + ' deducted';

  document.getElementById('cmp-d-net').textContent
    = fmt(directNet);
  document.getElementById('cmp-d-lost').textContent
    = 'No deductions ✓';

  // STEP 5: Find the best platform
  // Math.max() returns the largest number
  var best = Math.max(fiverrNet, upworkNet, directNet);

  // STEP 6: Remove old highlights
  ['cmp-fiverr', 'cmp-upwork', 'cmp-direct'].forEach(
    function(id) {
      document.getElementById(id).classList.remove('best');
      var oldBadge = document.getElementById(id)
        .querySelector('.best-badge');
      if (oldBadge) oldBadge.remove();
    }
  );

  // STEP 7: Find which card won
  var bestId;
  if (best === directNet) {
    bestId = 'cmp-direct';
  } else if (best === upworkNet) {
    bestId = 'cmp-upwork';
  } else {
    bestId = 'cmp-fiverr';
  }

  // STEP 8: Highlight winning card
  var bestCard = document.getElementById(bestId);
  bestCard.classList.add('best');

  // STEP 9: Add "Best earnings" badge
  var badge = document.createElement('div');
  badge.className   = 'best-badge';
  badge.textContent = '✓ Best earnings';
  bestCard.insertBefore(badge, bestCard.firstChild);

  // STEP 10: Show advice message
  var advice = document.getElementById('cmp-advice');
  if (bestId === 'cmp-direct') {
    advice.textContent
      = '💡 Direct clients give you 100% of earnings!';
  } else if (bestId === 'cmp-upwork') {
    advice.textContent
      = '💡 Upwork takes only 10% — better than Fiverr.';
  } else {
    advice.textContent
      = '💡 Consider Upwork or direct clients to earn more.';
  }

  // STEP 11: Make results visible
  document.getElementById('compare-result')
    .classList.remove('hidden');
}