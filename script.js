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
        최종 월 배당금: ${formatNumber(finalDividend)} 만 원
    `;
    document.getElementById('result').style.display = 'block'; // 결과 표시
    document.getElementById('loading').style.display = 'none'; // 로딩 숨기기
    drawChart(yearData, assetData);

    // 목표 진행 상황
    if (finalDividend >= goalDividend) {
        goalProgress.innerHTML = "축하합니다! 목표를 달성하셨습니다!";
        motivationMessage.innerHTML = "꾸준한 노력이 성과로 이어집니다!";
    } else {
        goalProgress.innerHTML = "아직 목표에 도달하지 않았습니다.";
        motivationMessage.innerHTML = "포기하지 마세요! 조금씩 나아가면 결국 도달할 수 있습니다!";
    }

    // 공유 버튼 표시
    document.getElementById('shareResult').style.display = 'block';
}

function drawChart(yearData, assetData) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearData,
            datasets: [{
                label: '자산 성장',
                data: assetData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '자산 (만 원)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '연도'
                    }
                }
            }
        }
    });
    document.getElementById('growthChart').style.display = 'block'; // 차트 표시
}

document.getElementById('shareResult').addEventListener('click', function() {
    const resultText = document.getElementById('result').innerText;
    navigator.clipboard.writeText(resultText)
        .then(() => {
            alert('결과가 클립보드에 복사되었습니다!');
        })
        .catch(err => {
            console.error('결과 복사에 실패했습니다!', err);
        });
});

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode'); // 다크 모드 전환
    if (document.body.classList.contains('dark-mode')) {
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#fff';
    } else {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
    }
});

document.getElementById('backgroundSelect').addEventListener('change', function() {
    const selectedImage = this.value;
    document.body.style.backgroundImage = `url('${selectedImage}')`;
});
