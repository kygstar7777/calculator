document.querySelector('.calculate-btn').addEventListener('click', calculate);

function calculate() {
    // 변수 선언 및 값 가져오기
    let asset = parseFloat(document.getElementById('asset').value); // 보유 자산
    let dividendRate = parseFloat(document.getElementById('dividend-rate').value) / 100; // 시가 배당률
    let dividendGrowth = parseFloat(document.getElementById('dividend-growth').value) / 100; // 배당 성장률
    let monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value); // 월 추가 투입금
    let investmentGrowth = parseFloat(document.getElementById('investment-growth').value) / 100; // 투입금 증가율
    let targetDividend = parseFloat(document.getElementById('target-dividend').value); // 목표 월 배당금

    let years = 0;
    let totalAsset = asset;
    let totalInvestment = asset;
    let monthlyDividend = (totalAsset * dividendRate) / 12; // 초기 월 배당금

    while (monthlyDividend < targetDividend) {
        years++;
        monthlyDividend *= (1 + dividendGrowth); // 매년 배당금 성장 적용
        totalAsset += (monthlyInvestment * 12) * Math.pow(1 + investmentGrowth, years); // 총 자산 증가
        totalInvestment += monthlyInvestment * 12; // 총 투자 원금 증가
    }

    // 결과 표시
    document.getElementById('result').innerHTML = `
        목표 달성 시기: ${years} 년 후<br>
        목표 달성 시 총 자산: ${totalAsset.toFixed(2)} 만 원<br>
        목표 달성 시 총 투자 원금: ${totalInvestment.toFixed(2)} 만 원<br>
        목표 달성 후 월 배당금: ${monthlyDividend.toFixed(2)} 만 원
    `;
}
