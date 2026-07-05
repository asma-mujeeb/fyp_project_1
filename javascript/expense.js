
    // Copied directly here to test
    function calculateExpenses() {
      var allInputs = document.querySelectorAll('.exp-input');
      var total = 0;
      allInputs.forEach(function(input) {
        total += parseFloat(input.value) || 0;
      });
      document.getElementById('exp-total').textContent
        = 'PKR ' + Math.round(total).toLocaleString();
      document.getElementById('exp-result')
        .classList.remove('hidden');
    }
  