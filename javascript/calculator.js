// 1. Exchange rates relative to 1 USD base
const exchangeRates = {
    USD: 1.0,
    PKR: 278.0, 
    GBP: 0.78,
    EUR: 0.92,
    AED: 3.67
};

// Standard default values for each profession (These are in PKR base)
const professionDefaults = {
    "Digital Marketing": { grossIncome: 50000, platformFee: 20, softwareCost: 2000, extraCost: 300, taxRate: 10 },
    "TikTok Shop":       { grossIncome: 75000, platformFee: 5,  softwareCost: 4000, extraCost: 8000, taxRate: 15 },
    "Video Editing":     { grossIncome: 60000, platformFee: 20, softwareCost: 1500, extraCost: 0,    taxRate: 5 },
    "Audio Editing":     { grossIncome: 45000, platformFee: 20, softwareCost: 800,  extraCost: 0,    taxRate: 5 },
    "Graphic Design":    { grossIncome: 40000, platformFee: 20, softwareCost: 1200, extraCost: 100,  taxRate: 8 },
    "Content Writing":   { grossIncome: 35000, platformFee: 15, softwareCost: 500,  extraCost: 0,    taxRate: 5 },
    "Social Media":      { grossIncome: 55000, platformFee: 10, softwareCost: 1100, extraCost: 1500, taxRate: 10 },
    "Web Development":   { grossIncome: 90000, platformFee: 10, softwareCost: 2500, extraCost: 500,  taxRate: 12 },
    "Photography":       { grossIncome: 70000, platformFee: 5,  softwareCost: 3000, extraCost: 2000, taxRate: 10 },
    "E-Commerce":        { grossIncome: 120000,platformFee: 8,  softwareCost: 4000, extraCost: 15000,taxRate: 15 },
    "SEO":               { grossIncome: 65000, platformFee: 15, softwareCost: 1800, extraCost: 400,  taxRate: 10 }
};

let currentCurrency = 'PKR';
let previousCurrency = 'PKR';
let currentProfession = 'Digital Marketing';

// 2. Fetch DOM References
const calculatorHeader = document.getElementById('calculatorHeader');
const currencySelect = document.getElementById('currencySelect');

const grossIncomeInput = document.getElementById('grossIncomeInput');
const platformFeeInput = document.getElementById('platformFeeInput');
const softwareCostInput = document.getElementById('softwareCostInput');
const extraCostInput = document.getElementById('extraCostInput');
const taxRateInput = document.getElementById('taxRateInput');

const grossIncomeDisplay = document.getElementById('grossIncomeDisplay');
const platformFeeDisplay = document.getElementById('platformFeeDisplay');
const softwareCostDisplay = document.getElementById('softwareCostDisplay');
const extraCostDisplay = document.getElementById('extraCostDisplay');
const taxDisplay = document.getElementById('taxDisplay');
const netProfitDisplay = document.getElementById('netProfitDisplay');

// 3. Main Calculation Function
function calculateNetProfit() {
    // Read input values directly as they exist currently in the inputs
    const grossIncome = parseFloat(grossIncomeInput.value) || 0;
    const platformFeePercent = parseFloat(platformFeeInput.value) || 0;
    const softwareCost = parseFloat(softwareCostInput.value) || 0;
    const extraCost = parseFloat(extraCostInput.value) || 0;
    const taxRatePercent = parseFloat(taxRateInput.value) || 0;

    // Calculations based on current on-screen numbers
    const platformFee = grossIncome * (platformFeePercent / 100);
    const taxAmount = grossIncome * (taxRatePercent / 100);
    const netProfit = grossIncome - platformFee - softwareCost - extraCost - taxAmount;

    // Update Right Side Visual Panels (using current selected currency)
    grossIncomeDisplay.innerText = formatCurrency(grossIncome, currentCurrency);
    platformFeeDisplay.innerText = `- ${formatCurrency(platformFee, currentCurrency)}`;
    softwareCostDisplay.innerText = `- ${formatCurrency(softwareCost, currentCurrency)}`;
    extraCostDisplay.innerText = `- ${formatCurrency(extraCost, currentCurrency)}`;
    taxDisplay.innerText = `- ${formatCurrency(taxAmount, currentCurrency)}`;
    netProfitDisplay.innerText = formatCurrency(netProfit, currentCurrency);
}

// 4. Elegant Formatting Helper
function formatCurrency(value, currency) {
    const fractionDigits = (currency === 'PKR') ? 0 : 2;
    const formatted = value.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
    return `${currency} ${formatted}`;
}

// 5. Active Tab Switching Handler
const tabButtons = document.querySelectorAll('.category-btn');
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from previous tab, assign to clicked tab
        document.querySelector('.category-btn.active')?.classList.remove('active');
        this.classList.add('active');

        // Update title text
        currentProfession = this.getAttribute('data-profession');
        calculatorHeader.innerText = `${currentProfession} Calculator`;

        // Load defaults for the clicked profession (which are baseline PKR)
        const defaults = professionDefaults[currentProfession];
        if (defaults) {
            // Convert PKR base defaults to currently selected on-screen currency
            const conversionFactor = exchangeRates[currentCurrency] / exchangeRates['PKR'];

            grossIncomeInput.value = Math.round(defaults.grossIncome * conversionFactor);
            platformFeeInput.value = defaults.platformFee; // Stays as %
            softwareCostInput.value = Math.round(defaults.softwareCost * conversionFactor);
            extraCostInput.value = Math.round(defaults.extraCost * conversionFactor);
            taxRateInput.value = defaults.taxRate; // Stays as %
        }

        calculateNetProfit();
    });
});

// 6. Currency Selection Event Listener (With Live Conversion)
currencySelect.addEventListener('change', (event) => {
    currentCurrency = event.target.value;

    // Math to scale values inside input boxes automatically
    const conversionFactor = exchangeRates[currentCurrency] / exchangeRates[previousCurrency];

    if (grossIncomeInput.value) {
        grossIncomeInput.value = Math.round(parseFloat(grossIncomeInput.value) * conversionFactor);
    }
    if (softwareCostInput.value) {
        softwareCostInput.value = Math.round(parseFloat(softwareCostInput.value) * conversionFactor);
    }
    if (extraCostInput.value) {
        extraCostInput.value = Math.round(parseFloat(extraCostInput.value) * conversionFactor);
    }

    previousCurrency = currentCurrency;
    calculateNetProfit();
});

// Live calculation when values are edited
const inputs = [grossIncomeInput, platformFeeInput, softwareCostInput, extraCostInput, taxRateInput];
inputs.forEach(input => {
    if (input) {
        input.addEventListener('input', calculateNetProfit);
    }
});

// Initialize display values once elements are ready
document.addEventListener('DOMContentLoaded', calculateNetProfit);