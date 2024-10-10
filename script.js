const previousCalculations = [];

document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    calculate();
});

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
});

document.getElementById('save-calculation').addEventListener('click', function() {
    saveCalculation();
});

document.getElementById('view-history').addEventListener('click', function() {
    viewHistory();
});

function calculate() {
    const assets = parseFloat(document.getElementById('assets').value) * 10000;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000;
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000;

    let currentAssets = assets;
    let years = 0;
    const detailedCalculations = [];
    const yearData = [];
    const assetData = [];
    const goalProgress = document.getElementById('goalProgress');

    // 목표 달성 기간 계산
    while (currentAssets * dividendYield < goalDividend) {
        detailedCalculations.push(`Year ${years + 1}: 총 자산 ${(currentAssets / 10000).toFixed(2)} 만 원, 목표 월 배당금 ${(currentAssets * dividendYield / 12 / 10000).toFixed(2)} 만 원`);
        
        currentAssets += monthlyInvestment * 12; // 연간 투입금 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장률 적용
        monthlyInvestment *= (1 + investmentGrowth); // 월 추가 투입금 증가율 적용
        years++;
        
        // 연도별 데이터 저장
        yearData.push(years);
        assetData.push(currentAssets / 10000); // 만 원 단위로 저장
    }

    const totalInvestment = assets + (monthlyInvestment * 12 * years);
    const goalDividendPerMonth = (currentAssets * dividendYield) / 12 / 10000; // 목표 월 배당금

    // 결과 표시
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; // 결과 영역 표시
    resultDiv.innerHTML = `
        <strong>계산 결과:</strong><br>
        <span>목표 월 배당금 달성까지 예상 소요 기간: <strong>${years}년</strong></span><br>
        <span>총 투자 금액: <strong>${(totalInvestment / 10000).toFixed(2)} 만 원</strong></span><br>
        <span>최종 자산: <strong>${(currentAssets / 10000).toFixed(2)} 만 원</strong></span><br>
        <span>목표 월 배당금: <strong>${goalDividendPerMonth.toFixed(2)} 만 원</strong></span><br><br>
        <strong>상세 계산 과정:</strong><br>
        <ul>${detailedCalculations.map(item => `<li>${item}</li>`).join('')}</ul>
    `;

    // 목표 진행 상태 표시
    goalProgress.innerHTML = `현재 자산의 ${((currentAssets * dividendYield) / goalDividend * 100).toFixed(2)}% 목표 달성!`;

    createChart(yearData, assetData); // 차트 생성
}

function createChart(years, assets) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    const growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: '최종 자산 (만 원)',
                data: assets,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
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
                    }
                }
            }
        }
    });
    document.getElementById('growthChart').style.display = 'block'; // 차트 영역 표시
}

function saveCalculation() {
    const resultDiv = document.getElementById('result').innerHTML;
    previousCalculations.push(resultDiv);
    alert("계산 결과가 저장되었습니다!");
}

function viewHistory() {
    if (previousCalculations.length === 0) {
        alert("저장된 계산 결과가 없습니다.");
    } else {
        alert(previousCalculations.join('\n\n'));
    }
}
