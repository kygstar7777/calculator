function calculate() {
    const asset = parseFloat(document.getElementById('asset').value);
    const dividendRate = parseFloat(document.getElementById('dividend-rate').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividend-growth').value) / 100;
    const priceGrowth = parseFloat(document.getElementById('price-growth').value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    const investmentGrowth = parseFloat(document.getElementById('investment-growth').value) / 100;
    const targetDividend = parseFloat(document.getElementById('target-dividend').value);

    if (isNaN(asset) || isNaN(dividendRate) || isNaN(dividendGrowth) || isNaN(priceGrowth) || 
        isNaN(monthlyInvestment) || isNaN(investmentGrowth) || isNaN(targetDividend)) {
        alert('모든 값을 입력해주세요.');
        return;
    }

    let years = 0;
    let currentDividend = (asset * dividendRate) / 12;
    let totalAssets = asset;

    while (currentDividend < targetDividend) {
        years++;
        totalAssets += (monthlyInvestment * 12);
        currentDividend = (totalAssets * dividendRate) / 12;
        monthlyInvestment += (monthlyInvestment * investmentGrowth);
        totalAssets += (totalAssets * priceGrowth);
    }

    document.getElementById('target-years').textContent = years;
    document.getElementById('total-assets').textContent = totalAssets.toFixed(2);
    document.getElementById('final-dividend').textContent = currentDividend.toFixed(2);
}
