document.querySelector('.calculate-btn').addEventListener('click', calculate);

function calculate() {
    let asset = parseFloat(document.getElementById('asset').value);
    let dividendRate = parseFloat(document.getElementById('dividend-rate').value) / 100;
    let dividendGrowth = parseFloat(document.getElementById('dividend-growth').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    let investmentGrowth = parseFloat(document.getElementById('investment-growth').value) / 100;
    let targetDividend = parseFloat(document.getElementById('target-dividend').value);

    let years = 0;
    let totalAsset = asset;
    let totalInvestment = asset;
    let monthlyDividend = totalAsset * dividendRate / 12;

    while (monthlyDividend < targetDividend) {
        years++;
        
        // 매년 배당금 성장
        monthlyDividend *= (1 + dividendGrowth);
        
        // 매년 투자 금액 증가
        totalAsset += (monthlyInvestment * 12) * Math.pow(1 + investmentGrowth, years);
        totalInvestment += monthlyInvestment * 12; // 총 투자 금액 업데이트
    }

    // 결과 표시
    document.getElementById('result').innerHTML = `
        목표 달성 시기: ${years} 년 후<br>
        목표 달성 시 총 자산: ${totalAsset.toFixed(2)} 만 원<br>
        목표 달성 시 총 투자 원금: ${totalInvestment.toFixed(2)} 만 원<br>
        목표 달성 후 월 배당금: ${monthlyDividend.toFixed(2)} 만 원
    `;
}
