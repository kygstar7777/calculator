// 버튼 클릭 이벤트 추가
document.querySelector('.calculate-btn').addEventListener('click', calculate);

function calculate() {
    let asset = parseFloat(document.getElementById('asset').value);
    let dividendRate = parseFloat(document.getElementById('dividend-rate').value) / 100;
    let dividendGrowth = parseFloat(document.getElementById('dividend-growth').value) / 100;
    let priceGrowth = parseFloat(document.getElementById('price-growth').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    let investmentGrowth = parseFloat(document.getElementById('investment-growth').value) / 100;
    let targetDividend = parseFloat(document.getElementById('target-dividend').value);

    let years = 0;
    let totalAsset = asset;
    let monthlyDividend = totalAsset * dividendRate / 12;
    let targetAchieved = false;

    while (!targetAchieved) {
        years++;
        monthlyDividend *= (1 + dividendGrowth);
        totalAsset += monthlyInvestment * Math.pow(1 + investmentGrowth, years);
        
        if (monthlyDividend >= targetDividend) {
            targetAchieved = true;
        }
    }

    document.getElementById('result').innerHTML = `목표 달성 시기: ${years} 년 후`;
}
