// ==========================================================================
// FILENAME: javascript/dashboard.js
// ==========================================================================

const exchangeRates = { USD: 1.0, PKR: 278.0, GBP: 0.78, EUR: 0.92, AED: 3.67 };
const currencySigns = { USD: '$', PKR: '₨', GBP: '£', EUR: '€', AED: 'د.إ' };

let currentCurrency = localStorage.getItem('fiq_currency') || 'USD';

function calculateDashboard() {
    currentCurrency = localStorage.getItem('fiq_currency') || "USD";

    const income = parseFloat(document.getElementById('d-income').value) || 0;
    const bizExp = parseFloat(document.getElementById('d-bizexp').value) || 0;
    const taxRate = parseFloat(document.getElementById('d-taxrate').value) || 0;
    const house = parseFloat(document.getElementById('d-house').value) || 0;

    const taxAmt = income * (taxRate / 100);
    const realNet = income - bizExp - taxAmt - house;

    const fractionDigits = (currentCurrency === 'PKR') ? 0 : 2;
    const sign = currencySigns[currentCurrency] || '$';

    function fmt(n) {
        return sign + ' ' + n.toLocaleString(undefined, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
    }

    document.getElementById('d-r-gross').textContent = fmt(income);
    document.getElementById('d-r-biz').textContent = '- ' + fmt(bizExp);
    document.getElementById('d-r-tax').textContent = '- ' + fmt(taxAmt);
    document.getElementById('d-r-house').textContent = '- ' + fmt(house);

    const netEl = document.getElementById('d-r-net');
    netEl.textContent = fmt(realNet);

    const msg = document.getElementById('d-r-msg');
    if (realNet >= 0) {
        netEl.style.color = '#1D9E75';
        msg.textContent = '✓ Positive! You earn more than you spend.';
        msg.style.color = '#1D9E75';
    } else {
        netEl.style.color = '#D85A30';
        msg.textContent = '⚠ Warning: Expenses exceed income! Review spending.';
        msg.style.color = '#D85A30';
    }

    document.getElementById('dash-result').classList.remove('hidden');
}

// Global hook listener matching Navbar dropdown transitions
window.addEventListener('storage', (e) => {
    if (e.key === 'fiq_currency') {
        const oldCurrency = currentCurrency;
        currentCurrency = e.newValue || 'USD';

        const conversionFactor = exchangeRates[currentCurrency] / exchangeRates[oldCurrency];

        // Currency values inside inputs that require multi-currency shifting
        const inputIds = ['d-income', 'd-bizexp', 'd-house'];
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) {
                el.value = Math.round(parseFloat(el.value) * conversionFactor);
            }
        });

        if (!document.getElementById('dash-result').classList.contains('hidden')) {
            calculateDashboard();
        }
    }
});