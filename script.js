// 로컬 스토리지에 저장하는 함수
function saveToLocalStorage() {
    const assets = document.getElementById('assets').value;
    const dividendYield = document.getElementById('dividendYield').value;
    const dividendGrowth = document.getElementById('dividendGrowth').value;
    const stockGrowth = document.getElementById('stockGrowth').value;
    const monthlyInvestment = document.getElementById('monthlyInvestment').value;
    const investmentGrowth = document.getElementById('investmentGrowth').value;
    const goalDividend = document.getElementById('goalDividend').value;
    const dividendReinvestmentRate = document.getElementById('dividendReinvestmentRate').value;

    localStorage.setItem('assets', assets);
    localStorage.setItem('dividendYield', dividendYield);
    localStorage.setItem('dividendGrowth', dividendGrowth);
    localStorage.setItem('stockGrowth', stockGrowth);
    localStorage.setItem('monthlyInvestment', monthlyInvestment);
    localStorage.setItem('investmentGrowth', investmentGrowth);
    localStorage.setItem('goalDividend', goalDividend);
    localStorage.setItem('dividendReinvestmentRate', dividendReinvestmentRate);
}

// 페이지 로드 시 로컬 스토리지에서 불러오기
function loadFromLocalStorage() {
    document.getElementById('assets').value = localStorage.getItem('assets') || 1000;
    document.getElementById('dividendYield').value = localStorage.getItem('dividendYield') || 4.0;
    document.getElementById('dividendGrowth').value = localStorage.getItem('dividendGrowth') || 5.0;
    document.getElementById('stockGrowth').value = localStorage.getItem('stockGrowth') || 5.0;
    document.getElementById('monthlyInvestment').value = localStorage.getItem('monthlyInvestment') || 50;
    document.getElementById('investmentGrowth').value = localStorage.getItem('investmentGrowth') || 3.0;
    document.getElementById('goalDividend').value = localStorage.getItem('goalDividend') || 200;
    document.getElementById('dividendReinvestmentRate').value = localStorage.getItem('dividendReinvestmentRate') || 100;
}

// 계산 버튼 클릭 시 실행되는 함수
document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('loading').style.display = 'block'; // 로딩 표시

    const currentAssets = Number(document.getElementById('assets').value) * 10000; // 만 원 단위
    const dividendYield = Number(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = Number(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = Number(document.getElementById('stockGrowth').value) / 100;
    const monthlyInvestment = Number(document.getElementById('monthlyInvestment').value) * 10000; // 만 원 단위
    const investmentGrowth = Number(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = Number(document.getElementById('goalDividend').value) * 10000; // 만 원 단위
    const dividendReinvestmentRate = Number(document.getElementById('dividendReinvestmentRate').value) / 100;

    // 미래 자산과 목표 달성 시기 계산
    let futureAssets = currentAssets;
    let years = 0;
    const futureAssetValues = []; // 자산 변화를 기록할 배열

    while (futureAssets < goalDividend) {
        const annualDividend = futureAssets * dividendYield; // 연간 배당금
        futureAssets = futureAssets * (1 + dividendYield * dividendReinvestmentRate + dividendGrowth) + monthlyInvestment * 12 * (1 + investmentGrowth);
        futureAssetValues.push(futureAssets);
        years++;
    }

    const result = `목표 배당금: ${goalDividend / 10000} 만 원에 도달하기까지 약 ${years}년이 걸립니다.`;
    document.getElementById('result').innerText = result;

    // 목표 진행 상황 그래프
    drawGoalProgressChart(futureAssetValues, years);
    
    // 로컬 스토리지에 데이터 저장
    saveToLocalStorage();

    document.getElementById('loading').style.display = 'none'; // 로딩 숨기기
    document.getElementById('shareResult').style.display = 'block'; // 결과 공유 버튼 표시

    // 차트 그리기
    drawCharts(currentAssets, dividendYield, dividendGrowth, stockGrowth, monthlyInvestment, investmentGrowth, years);
});

// 목표 진행 상황 차트 그리기
function drawGoalProgressChart(futureAssetValues, years) {
    const ctxGoal = document.getElementById('goalProgress').getContext('2d');
    const labels = Array.from({ length: years }, (_, i) => `Year ${i}`);
    
    const goalProgressChart = new Chart(ctxGoal, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '자산 성장',
                data: futureAssetValues,
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

// 차트 그리기 함수
function drawCharts(currentAssets, dividendYield, dividendGrowth, stockGrowth, monthlyInvestment, investmentGrowth, years) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    const futureAssets = [];
    const labels = [];

    for (let i = 0; i <= years; i++) {
        futureAssets.push(currentAssets * Math.pow(1 + dividendYield + dividendGrowth, i) + monthlyInvestment * 12 * (Math.pow(1 + investmentGrowth, i) - 1) / investmentGrowth);
        labels.push(`Year ${i}`);
    }

    const growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '자산 성장',
                data: futureAssets,
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

    // 미래 성장 차트
    const ctxFuture = document.getElementById('futureGrowthChart').getContext('2d');
    const futureGrowth = [];
    const futureLabels = [];

    for (let i = 0; i <= years; i++) {
        futureGrowth.push((futureAssets[i] * dividendYield));
        futureLabels.push(`Year ${i}`);
    }

    const futureGrowthChart = new Chart(ctxFuture, {
        type: 'bar',
        data: {
            labels: futureLabels,
            datasets: [{
                label: '미래 배당금',
                data: futureGrowth,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '배당금 (만원)'
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

    document.getElementById('growthChart').style.display = 'block';
    document.getElementById('futureGrowthChart').style.display = 'block';
}

// 다크 모드 토글 함수
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// 배경 선택 기능
document.getElementById('backgroundSelect').addEventListener('change', (event) => {
    const selectedBackground = event.target.value;
    if (selectedBackground) {
        document.body.style.backgroundImage = `url(${selectedBackground})`;
        document.body.style.backgroundSize = 'cover';
    } else {
        document.body.style.backgroundImage = '';
    }
});

// 페이지 로드 시 데이터 불러오기
window.onload = () => {
    loadFromLocalStorage();
};
