document.querySelector('.calculate-btn').addEventListener('click', calculate);

function calculate() {
    const assets = parseFloat(document.getElementById('assets').value) * 10000; // 만 원 단위
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100; // 퍼센트 단위
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100; // 퍼센트 단위
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100; // 퍼센트 단위
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 만 원 단위
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100; // 퍼센트 단위
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000; // 만 원 단위

    let currentAssets = assets;
    let years = 0;

    while (currentAssets * dividendYield < goalDividend) {
        currentAssets += monthlyInvestment * 12; // 연간 투입금 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장률 적용
        monthlyInvestment *= (1 + investmentGrowth); // 월 추가 투입금 증가율 적용
        years++;
    }

    // 결과 출력
    document.getElementById('years').textContent = years;
    document.getElementById('totalAssets').textContent = (currentAssets / 10000).toFixed(2);
    document.getElementById('totalInvestment').textContent = (assets + (monthlyInvestment * 12 * years) / 10000).toFixed(2);
    document.getElementById('monthlyDividend').textContent = ((currentAssets * dividendYield) / 12 / 10000).toFixed(2);

    // 결과 표시
    document.querySelector('.result').style.display = 'block';
}
