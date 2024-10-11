document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const assets = parseFloat(document.getElementById('assets').value) * 10000; // 만원 단위
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 만원 단위
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalMonthlyDividend = parseFloat(document.getElementById('goalMonthlyDividend').value) * 10000; // 목표 월 배당금을 만원 단위로 변환
    const annualGoalDividend = goalMonthlyDividend * 12; // 목표 월 배당금을 연간으로 변환
    const dividendReinvestmentRate = parseFloat(document.getElementById('dividendReinvestmentRate').value) / 100;

    let futureAssets = assets;
    let totalDividend = 0;
    let years = 0;
    const futureAssetValues = [];
    const detailedResults = [];

    // 목표 월 배당금에 도달할 때까지 연간 배당금을 누적
    while (totalDividend < annualGoalDividend) {
        const annualDividend = futureAssets * dividendYield; // 연간 배당금 계산
        totalDividend += annualDividend; // 연간 배당금 누적
        futureAssets = futureAssets * (1 + dividendReinvestmentRate * dividendYield + dividendGrowth) + monthlyInvestment * 12 * (1 + investmentGrowth);

        detailedResults.push({
            year: years,
            annualDividend: (annualDividend / 10000).toFixed(2), // 연간 배당금
            totalAssets: (futureAssets / 10000).toFixed(2), // 총 자산
        });

        futureAssetValues.push(futureAssets);
        years++;

        if (years > 100) break; // 무한 루프 방지용
    }

    const result = `목표 월 배당금: ${(goalMonthlyDividend / 10000).toFixed(2)} 만 원에 도달하기까지 약 ${years}년이 걸립니다.`;
    document.getElementById('result').innerText = result;

    displayDetailedResults(detailedResults);
    drawGoalProgressChart(futureAssetValues, years);
});

function displayDetailedResults(results) {
    const detailedResultsDiv = document.getElementById('detailedResults');
    detailedResultsDiv.innerHTML = '';

    results.forEach(result => {
        detailedResultsDiv.innerHTML += `
            <div>
                <strong>연차:</strong> ${result.year}년<br>
                <strong>연간 배당금:</strong> ${result.annualDividend} 만 원<br>
                <strong>연말 자산:</strong> ${result.totalAssets} 만 원<br>
                <hr>
            </div>
        `;
    });
}

function drawGoalProgressChart(futureAssetValues, years) {
    const ctx = document.getElementById('goalProgress').getContext('2d');
    const labels = Array.from({ length: years }, (_, i) => `Year ${i}`);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '자산 성장',
                data: futureAssetValues.map(v => (v / 10000).toFixed(2)), // 만원 단위
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '금액 (만원)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '년도'
                    }
                }
            }
        }
    });
}

// 다크 모드 토글
document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});
