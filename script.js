document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    calculate();
});

function calculate() {
    const assets = parseFloat(document.getElementById('assets').value) * 10000;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000;
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000;

    let currentAssets = assets;
    let years = 0;

    while (currentAssets * dividendYield < goalDividend) {
        currentAssets += monthlyInvestment * 12; // 연간 투입금 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장률 적용
        monthlyInvestment *= (1 + investmentGrowth); // 월 추가 투입금 증가율 적용
        years++;
    }

    const totalInvestment = assets + (monthlyInvestment * 12 * years);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        목표 달성 시기: ${years} 년 후<br>
        목표 달성 시 총 자산: ${(currentAssets / 10000).toFixed(2)} 만 원<br>
        목표 달성 시 총 투자 원금: ${(totalInvestment / 10000).toFixed(2)} 만 원<br>
        목표 달성 후 월 배당금: ${(currentAssets * dividendYield / 12 / 10000).toFixed(2)} 만 원
    `;
    resultDiv.style.display = 'block'; // 결과를 보이도록 설정
}
