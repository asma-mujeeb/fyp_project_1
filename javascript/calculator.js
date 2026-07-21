// ==========================================================================
// FILENAME: javascript/calculator.js
// ==========================================================================

// 1. Fixed market exchange rates benchmark mapped relative to a 1 USD base
const exchangeRates = {
    USD: 1.0,
    PKR: 278.0, 
    GBP: 0.78,
    EUR: 0.92,
    AED: 3.67
};

// Currency signs mapping lookup dictionary
const currencySigns = {
    USD: '$',
    PKR: '₨',
    GBP: '£',
    EUR: '€',
    AED: 'د.إ'
};

/**
 * Modular configuration registry for all profession calculators.
 * Digital Marketing keeps its original precise financial terms, labels, and targets.
 */
const professionSchema = {
    "Digital Marketing": {
        fields: [
            { id: "grossIncomeInput", label: "Gross Income", placeholder: "e.g., 50000", defaultValue: 50000, type: "currency" },
            { id: "platformFeeInput", label: "Platform Fee % (Fiverr=20, Upwork=10)", placeholder: "e.g., 20", defaultValue: 20, type: "percentage" },
            { id: "softwareCostInput", label: "Software / Tools Cost", placeholder: "e.g., 2000", defaultValue: 2000, type: "currency" },
            { id: "extraCostInput", label: "Ad Spend / Other Cost", placeholder: "e.g., 300", defaultValue: 300, type: "currency" },
            { id: "taxRateInput", label: "Tax Rate %", placeholder: "e.g., 10", defaultValue: 10, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.grossIncomeInput * (vals.platformFeeInput / 100);
            const tax = vals.grossIncomeInput * (vals.taxRateInput / 100);
            return { 
                gross: vals.grossIncomeInput, 
                platformFee: pFee,
                softwareCost: vals.softwareCostInput,
                extraCost: vals.extraCostInput,
                tax: tax, 
                net: vals.grossIncomeInput - pFee - vals.softwareCostInput - vals.extraCostInput - tax 
            };
        }
    },
    "TikTok Shop": {
        fields: [
            { id: "sellingPrice", label: "Selling Price (Total Revenue)", placeholder: "e.g., 75000", defaultValue: 75000, type: "currency" },
            { id: "productCost", label: "Product Cost", placeholder: "e.g., 8000", defaultValue: 8000, type: "currency" },
            { id: "shipping", label: "Shipping Cost", placeholder: "e.g., 4000", defaultValue: 4000, type: "currency" },
            { id: "platformCommission", label: "Platform Commission (%)", placeholder: "e.g., 5", defaultValue: 5, type: "percentage" },
            { id: "ads", label: "Ads Spend", placeholder: "e.g., 2000", defaultValue: 2000, type: "currency" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 15", defaultValue: 15, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.sellingPrice * (vals.platformCommission / 100);
            const tax = vals.sellingPrice * (vals.taxRate / 100);
            const totalCosts = vals.productCost + vals.shipping + pFee + vals.ads;
            return { gross: vals.sellingPrice, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.sellingPrice - totalCosts - tax };
        }
    },
    "Video Editing": {
        fields: [
            { id: "projectIncome", label: "Project Income", placeholder: "e.g., 60000", defaultValue: 60000, type: "currency" },
            { id: "softwareSubscription", label: "Software Subscription", placeholder: "e.g., 1500", defaultValue: 1500, type: "currency" },
            { id: "assetsCost", label: "Assets Cost", placeholder: "e.g., 500", defaultValue: 0, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 20", defaultValue: 20, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 5", defaultValue: 5, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.projectIncome * (vals.platformFee / 100);
            const tax = vals.projectIncome * (vals.taxRate / 100);
            const totalCosts = vals.softwareSubscription + vals.assetsCost + pFee;
            return { gross: vals.projectIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.projectIncome - totalCosts - tax };
        }
    },
    "Audio Editing": {
        fields: [
            { id: "projectIncome", label: "Project Income", placeholder: "e.g., 45000", defaultValue: 45000, type: "currency" },
            { id: "pluginCost", label: "Plugin Cost", placeholder: "e.g., 800", defaultValue: 800, type: "currency" },
            { id: "softwareCost", label: "Software Cost", placeholder: "e.g., 400", defaultValue: 0, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 20", defaultValue: 20, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 5", defaultValue: 5, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.projectIncome * (vals.platformFee / 100);
            const tax = vals.projectIncome * (vals.taxRate / 100);
            const totalCosts = vals.pluginCost + vals.softwareCost + pFee;
            return { gross: vals.projectIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.projectIncome - totalCosts - tax };
        }
    },
    "Graphic Design": {
        fields: [
            { id: "projectIncome", label: "Project Income", placeholder: "e.g., 40000", defaultValue: 40000, type: "currency" },
            { id: "fontsAssetsCost", label: "Fonts & Assets Cost", placeholder: "e.g., 100", defaultValue: 100, type: "currency" },
            { id: "softwareSubscription", label: "Software Subscription", placeholder: "e.g., 1200", defaultValue: 1200, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 20", defaultValue: 20, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 8", defaultValue: 8, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.projectIncome * (vals.platformFee / 100);
            const tax = vals.projectIncome * (vals.taxRate / 100);
            const totalCosts = vals.fontsAssetsCost + vals.softwareSubscription + pFee;
            return { gross: vals.projectIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.projectIncome - totalCosts - tax };
        }
    },
    "Content Writing": {
        fields: [
            { id: "projectIncome", label: "Project Income", placeholder: "e.g., 35000", defaultValue: 35000, type: "currency" },
            { id: "researchCost", label: "Research Cost", placeholder: "e.g., 500", defaultValue: 0, type: "currency" },
            { id: "aiToolCost", label: "AI Tool Cost", placeholder: "e.g., 500", defaultValue: 500, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 15", defaultValue: 15, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 5", defaultValue: 5, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.projectIncome * (vals.platformFee / 100);
            const tax = vals.projectIncome * (vals.taxRate / 100);
            const totalCosts = vals.researchCost + vals.aiToolCost + pFee;
            return { gross: vals.projectIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.projectIncome - totalCosts - tax };
        }
    },
    "Social Media": {
        fields: [
            { id: "monthlyIncome", label: "Monthly Income", placeholder: "e.g., 55000", defaultValue: 55000, type: "currency" },
            { id: "adBudget", label: "Ad Budget", placeholder: "e.g., 1500", defaultValue: 1500, type: "currency" },
            { id: "schedulingToolCost", label: "Scheduling Tool Cost", placeholder: "e.g., 1100", defaultValue: 1100, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 10", defaultValue: 10, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 10", defaultValue: 10, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.monthlyIncome * (vals.platformFee / 100);
            const tax = vals.monthlyIncome * (vals.taxRate / 100);
            const totalCosts = vals.adBudget + vals.schedulingToolCost + pFee;
            return { gross: vals.monthlyIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.monthlyIncome - totalCosts - tax };
        }
    },
    "Web Development": {
        fields: [
            { id: "projectIncome", label: "Project Income", placeholder: "e.g., 90000", defaultValue: 90000, type: "currency" },
            { id: "hostingDomain", label: "Hosting & Domain", placeholder: "e.g., 2500", defaultValue: 2500, type: "currency" },
            { id: "apiCost", label: "API Cost", placeholder: "e.g., 500", defaultValue: 500, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 10", defaultValue: 10, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 12", defaultValue: 12, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.projectIncome * (vals.platformFee / 100);
            const tax = vals.projectIncome * (vals.taxRate / 100);
            const totalCosts = vals.hostingDomain + vals.apiCost + pFee;
            return { gross: vals.projectIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.projectIncome - totalCosts - tax };
        }
    },
    "Photography": {
        fields: [
            { id: "sessionIncome", label: "Session Income", placeholder: "e.g., 70000", defaultValue: 70000, type: "currency" },
            { id: "equipmentCost", label: "Equipment Cost", placeholder: "e.g., 2000", defaultValue: 2000, type: "currency" },
            { id: "travelCost", label: "Travel Cost", placeholder: "e.g., 2000", defaultValue: 2000, type: "currency" },
            { id: "editingSoftware", label: "Editing Software", placeholder: "e.g., 3000", defaultValue: 3000, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 5", defaultValue: 5, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 10", defaultValue: 10, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.sessionIncome * (vals.platformFee / 100);
            const tax = vals.sessionIncome * (vals.taxRate / 100);
            const totalCosts = vals.equipmentCost + vals.travelCost + vals.editingSoftware + pFee;
            return { gross: vals.sessionIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.sessionIncome - totalCosts - tax };
        }
    },
    "E-Commerce": {
        fields: [
            { id: "revenue", label: "Total Revenue", placeholder: "e.g., 120000", defaultValue: 120000, type: "currency" },
            { id: "productCost", label: "Product Cost", placeholder: "e.g., 15000", defaultValue: 15000, type: "currency" },
            { id: "shipping", label: "Shipping", placeholder: "e.g., 4000", defaultValue: 4000, type: "currency" },
            { id: "marketingCost", label: "Marketing Cost", placeholder: "e.g., 4000", defaultValue: 4000, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 8", defaultValue: 8, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 15", defaultValue: 15, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.revenue * (vals.platformFee / 100);
            const tax = vals.revenue * (vals.taxRate / 100);
            const totalCosts = vals.productCost + vals.shipping + vals.marketingCost + pFee;
            return { gross: vals.revenue, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.revenue - totalCosts - tax };
        }
    },
    "SEO": {
        fields: [
            { id: "clientIncome", label: "Client Income", placeholder: "e.g., 65000", defaultValue: 65000, type: "currency" },
            { id: "seoTools", label: "SEO Tools Cost", placeholder: "e.g., 1800", defaultValue: 1800, type: "currency" },
            { id: "contentCost", label: "Content Cost", placeholder: "e.g., 400", defaultValue: 400, type: "currency" },
            { id: "platformFee", label: "Platform Fee (%)", placeholder: "e.g., 15", defaultValue: 15, type: "percentage" },
            { id: "taxRate", label: "Tax Rate (%)", placeholder: "e.g., 10", defaultValue: 10, type: "percentage" }
        ],
        calculate: (vals) => {
            const pFee = vals.clientIncome * (vals.platformFee / 100);
            const tax = vals.clientIncome * (vals.taxRate / 100);
            const totalCosts = vals.seoTools + vals.contentCost + pFee;
            return { gross: vals.clientIncome, platformFee: totalCosts, softwareCost: 0, extraCost: 0, tax: tax, net: vals.clientIncome - totalCosts - tax };
        }
    }
};

let currentCurrency = localStorage.getItem('fiq_currency') || 'USD';
let currentProfession = 'Digital Marketing';

// Fetch UI Document Form Containers and Targets
const calculatorHeader = document.getElementById('calculatorHeader');

// Dynamically targeted output node parameters
const grossIncomeDisplay = document.getElementById('grossIncomeDisplay');
const platformFeeDisplay = document.getElementById('platformFeeDisplay'); 
const softwareCostDisplay = document.getElementById('softwareCostDisplay');
const extraCostDisplay = document.getElementById('extraCostDisplay');
const taxDisplay = document.getElementById('taxDisplay');
const netProfitDisplay = document.getElementById('netProfitDisplay');

const formContainer = document.getElementById('dynamicFormContainer'); 

/**
 * Builds and mounts HTML input elements dynamically dependent on the selected schema logic
 */
function renderDynamicForm(profession, checkOldValues = false) {
    if (!formContainer) return;

    const schema = professionSchema[profession];
    if (!schema) return;

    const preservedValues = {};
    if (checkOldValues) {
        schema.fields.forEach(field => {
            const inputNode = document.getElementById(field.id);
            if (inputNode) preservedValues[field.id] = parseFloat(inputNode.value) || 0;
        });
    }

    const conversionFactor = exchangeRates[currentCurrency] / exchangeRates['PKR'];
    formContainer.innerHTML = ''; 

    schema.fields.forEach(field => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group'; 

        const label = document.createElement('label');
        label.innerText = field.label;
        label.setAttribute('for', field.id);

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control';
        input.id = field.id;
        input.placeholder = field.placeholder;

        if (checkOldValues && preservedValues[field.id] !== undefined) {
            input.value = preservedValues[field.id];
        } else {
            if (field.type === 'currency') {
                input.value = Math.round(field.defaultValue * conversionFactor);
            } else {
                input.value = field.defaultValue;
            }
        }

        input.addEventListener('input', calculateNetProfit);

        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        formContainer.appendChild(inputGroup);
    });
}

/**
 * Core Computational Calculation Processing Engine Core Routine
 */
function calculateNetProfit() {
    const schema = professionSchema[currentProfession];
    if (!schema) return;

    const inputValues = {};
    schema.fields.forEach(field => {
        const inputNode = document.getElementById(field.id);
        inputValues[field.id] = inputNode ? (parseFloat(inputNode.value) || 0) : 0;
    });

    const results = schema.calculate(inputValues);

    grossIncomeDisplay.innerText = formatCurrency(results.gross, currentCurrency);
    taxDisplay.innerText = `- ${formatCurrency(results.tax, currentCurrency)}`;
    netProfitDisplay.innerText = formatCurrency(results.net, currentCurrency);

    if (currentProfession === "Digital Marketing") {
        if (platformFeeDisplay) platformFeeDisplay.innerText = `- ${formatCurrency(results.platformFee, currentCurrency)}`;
        if (softwareCostDisplay) {
            softwareCostDisplay.parentElement.style.display = 'flex';
            softwareCostDisplay.innerText = `- ${formatCurrency(results.softwareCost, currentCurrency)}`;
        }
        if (extraCostDisplay) {
            extraCostDisplay.parentElement.style.display = 'flex';
            extraCostDisplay.innerText = `- ${formatCurrency(results.extraCost, currentCurrency)}`;
        }
    } else {
        if (platformFeeDisplay) platformFeeDisplay.innerText = `- ${formatCurrency(results.platformFee, currentCurrency)}`;
        if (softwareCostDisplay) softwareCostDisplay.parentElement.style.display = 'none';
        if (extraCostDisplay) extraCostDisplay.parentElement.style.display = 'none';
    }
}

function formatCurrency(value, currency) {
    const fractionDigits = (currency === 'PKR') ? 0 : 2;
    const sign = currencySigns[currency] || '$';
    const formatted = Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
    return value < 0 ? `-${sign} ${formatted}` : `${sign} ${formatted}`;
}

/**
 * Global Callback hook linked explicitly into the Navbar currency tracking engine
 */
function calculateProfessionMargins() {
    const oldCurrency = currentCurrency;
    currentCurrency = localStorage.getItem('fiq_currency') || 'USD';

    const conversionFactor = exchangeRates[currentCurrency] / exchangeRates[oldCurrency];
    const schema = professionSchema[currentProfession];

    if (schema) {
        schema.fields.forEach(field => {
            const inputNode = document.getElementById(field.id);
            if (inputNode && field.type === 'currency' && inputNode.value) {
                inputNode.value = Math.round(parseFloat(inputNode.value) * conversionFactor);
            }
        });
    }

    calculateNetProfit();
}

// Tab Switching Event Mapping Architecture
const tabButtons = document.querySelectorAll('.category-btn');
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('.category-btn.active')?.classList.remove('active');
        this.classList.add('active');

        let rawProfession = this.getAttribute('data-profession');
        
        if (rawProfession === "Digital Marketing") currentProfession = "Digital Marketing";
        else if (rawProfession === "TikTok Shop") currentProfession = "TikTok Shop";
        else if (rawProfession === "Video Editing") currentProfession = "Video Editing";
        else if (rawProfession === "Audio Editing") currentProfession = "Audio Editing";
        else if (rawProfession === "Graphic Design") currentProfession = "Graphic Design";
        else if (rawProfession === "Content Writing") currentProfession = "Content Writing";
        else if (rawProfession === "Social Media") currentProfession = "Social Media";
        else if (rawProfession === "Web Development") currentProfession = "Web Development";
        else if (rawProfession === "Photography") currentProfession = "Photography";
        else if (rawProfession === "E-Commerce" || rawProfession === "E-commerce") currentProfession = "E-Commerce";
        else if (rawProfession === "SEO") currentProfession = "SEO";
        else currentProfession = rawProfession;

        if (calculatorHeader) calculatorHeader.innerText = `${currentProfession} Calculator`;

        renderDynamicForm(currentProfession, false);
        calculateNetProfit();
    });
});

// Trigger initial baseline initialization runtime stack loops
document.addEventListener('DOMContentLoaded', () => {
    renderDynamicForm(currentProfession, false);
    calculateNetProfit();
});

// Sync from Navbar dropdown alterations
window.addEventListener('storage', (e) => {
    if (e.key === 'fiq_currency') {
        calculateProfessionMargins();
    }
});