document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    calculate();
});

function formatNumber(num) {
    return num.toLocaleString('ko-KR'); // 한국식 숫자 포맷
}

function calculate() {
    const assets = parseFloat(document.getElementById('assets').value) * 10000; // 만 원 단위
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 만 원 단위
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000; // 만 원 단위

    let currentAssets = assets;
    let years = 0;
    const detailedCalculations = [];
    const yearData = [];
    const assetData = [];
    const goalProgress = document.getElementById('goalProgress');

    document.getElementById('loading').style.display = 'block'; // 로딩 표시

    // 목표 달성 기간 계산
    while (currentAssets * dividendYield < goalDividend) {
        detailedCalculations.push(`Year ${years + 1}: 총 자산 ${formatNumber(currentAssets / 10000)} 만 원, 월 배당금 ${formatNumber((currentAssets * dividendYield) / 12 / 10000)} 만 원`);
        
        currentAssets += monthlyInvestment * 12; // 연간 투입금 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장률 적용
        monthlyInvestment *= (1 + investmentGrowth); // 월 추가 투입금 증가율 적용
        years++;
        
        // 연도별 데이터 저장
        yearData.push(years);
        assetData.push(currentAssets / 10000); // 만 원 단위로 저장
    }

    // 목표 월 배당금 계산
    const goalDividendPerMonth = Math.floor((currentAssets * dividendYield) / 12 / 10000); // 목표 월 배당금 (정수)

    // 결과 표시
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; // 결과 영역 표시
    resultDiv.innerHTML = `
        <strong>계산 결과:</strong><br>
        <span>목표 월 배당금 달성까지 예상 소요 기간: <strong>${years}년</strong></span><br>
        <span>총 투자 금액: ${formatNumber(currentAssets / 10000)} 만 원</span><br>
        <span>목표 월 배당금: ${goalDividendPerMonth} 만 원</span><br>
    `;

    // 목표 진행 상황 업데이트
    goalProgress.innerHTML = `<strong>목표 진행 상황:</strong> ${formatNumber(goalDividendPerMonth)} 만 원 (현재 월 배당금)`;

    // 차트 표시
    displayChart(yearData, assetData);
    
    document.getElementById('loading').style.display = 'none'; // 로딩 숨기기
}

function displayChart(labels, data) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    document.getElementById('growthChart').style.display = 'block'; // 차트 영역 표시

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '자산 성장',
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '연도'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '자산 (만 원)'
                    },
                    beginAtZero: true
                }
            }
        });
}
