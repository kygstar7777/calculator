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
    const motivationMessage = document.getElementById('motivationMessage');

    document.getElementById('loading').style.display = 'block'; // 로딩 표시

    while (currentAssets < goalDividend * 12) {
        currentAssets += monthlyInvestment * 12; // 연간 투자금 추가
        currentAssets *= (1 + stockGrowth); // 매년 자산 증가
        
        yearData.push(`Year ${years + 1}`);
        assetData.push(currentAssets / 10000); // 만 원 단위로 변환
        years++;
        monthlyInvestment *= (1 + investmentGrowth); // 매년 추가 투자금 증가
    }

    // 최종 결과 출력
    const finalDividend = (currentAssets * dividendYield) / 12;
    document.getElementById('result').innerHTML = `
        <strong>계산 결과:</strong><br>
        목표 월 배당금 달성까지 예상 소요 기간: ${years}년<br>
        총 투자 금액: ${formatNumber(currentAssets / 10000)} 만 원<br>
        최종 자산: ${formatNumber(currentAssets / 10000)} 만 원<br>
        목표 월 배당금: ${formatNumber(finalDividend / 10000)} 만 원
    `;
    document.getElementById('result').style.display = 'block'; // 결과 영역 표시

    // 목표 진행 상황 업데이트
    goalProgress.innerHTML = `<strong>목표 진행 상황:</strong> ${formatNumber(goalDividend / 10000)} 만 원 (현재 월 배당금)`;

    // 동기 부여 메시지 추가
    motivationMessage.innerHTML = `현재 목표를 향해 ${years}년 동안 꾸준히 투자하고 있습니다. 계속 힘내세요!`;

    // 차트 표시
    displayChart(yearData, assetData);
    
    document.getElementById('loading').style.display = 'none'; // 로딩 숨기기

    // 결과 공유 버튼 표시
    document.getElementById('shareResult').style.display = 'block';
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

// 배경 선택 기능
document.getElementById('backgroundSelect').addEventListener('change', function() {
    const backgroundUrl = this.value;
    document.body.style.backgroundImage = `url('${backgroundUrl}')`; // 선택한 배경 이미지 적용
});

// 다크 모드 전환
document.getElementById('toggle-theme').addEventListener('click', function() {
    const body = document.body;
    body.classList.toggle('dark-mode');
});

// 공유하기 기능
document.getElementById('shareResult').addEventListener('click', function() {
    const resultText = document.getElementById('result').innerText;
    navigator.clipboard.writeText(resultText).then(() => {
        alert('결과가 클립보드에 복사되었습니다!');
    });
});
