function calculate() {
    const assets = parseFloat(document.getElementById('assets').value) * 10000; // 만 원을 원으로 변환
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100; 
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 만 원을 원으로 변환
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000; // 만 원을 원으로 변환

    let currentAssets = assets;
    let years = 0;

    while (currentAssets * dividendYield < goalDividend) {
        currentAssets += monthlyInvestment * 12; // 연간 투입금 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장률 적용
        monthlyInvestment *= (1 + investmentGrowth); // 월 추가 투입금 증가율 적용
        years++;
    }

    // 결과 출력
    document.getElementById('result').innerHTML = `
        목표 달성 시기: ${years} 년 후<br>
        목표 달성 시 총 자산: ${(currentAssets / 10000).toFixed(2)} 만 원<br>
        목표 달성 시 총 투자 원금: ${(assets + (monthlyInvestment * 12 * years) / 10000).toFixed(2)} 만 원<br>
        목표 달성 후 월 배당금: ${(currentAssets * dividendYield / 12 / 10000).toFixed(2)} 만 원
    `;
}

// 버튼 클릭 이벤트
document.querySelector('.calculate-btn').addEventListener('click', calculate);
