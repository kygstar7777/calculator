// 로컬 스토리지에 저장하는 함수
function saveToLocalStorage() {
    const assets = document.getElementById('assets').value;
    const dividendYield = document.getElementById('dividendYield').value;
    const dividendGrowth = document.getElementById('dividendGrowth').value;
    const stockGrowth = document.getElementById('stockGrowth').value;
    const monthlyInvestment = document.getElementById('monthlyInvestment').value;
    const investmentGrowth = document.getElementById('investmentGrowth').value;
    const goalDividend = document.getElementById('goalDividend').value;
    const investmentStrategy = document.getElementById('investmentStrategy').value;

    localStorage.setItem('assets', assets);
    localStorage.setItem('dividendYield', dividendYield);
    localStorage.setItem('dividendGrowth', dividendGrowth);
    localStorage.setItem('stockGrowth', stockGrowth);
    localStorage.setItem('monthlyInvestment', monthlyInvestment);
    localStorage.setItem('investmentGrowth', investmentGrowth);
    localStorage.setItem('goalDividend', goalDividend);
    localStorage.setItem('investmentStrategy', investmentStrategy);
}

// 페이지 로드 시 로컬 스토리지에서 불러오기
function loadFromLocalStorage() {
    document.getElementById('assets').value = localStorage.getItem('assets') || 1000;
    document.getElementById('dividendYield').value = localStorage.getItem('dividendYield') || 4.0;
    document.getElementById('dividendGrowth').value = localStorage.getItem('dividendGrowth') || 5.0;
    document.getElementById('stockGrowth').value = localStorage.getItem('stockGrowth') || 5.0;
    document.getElementById('monthlyInvestment').value = localStorage.getItem('monthlyInvestment') || 100;
    document.getElementById('investmentGrowth').value = localStorage.getItem('investmentGrowth') || 10.0;
    document.getElementById('goalDividend').value = localStorage.getItem('goalDividend') || 200;
    document.getElementById('investmentStrategy').value = localStorage.getItem('investmentStrategy') || 'highDividend';
}

// 계산 함수
function calculate(event) {
    event.preventDefault(); // 기본 폼 제출 방지
    const loading = document.getElementById('loading');
    loading.style.display = 'block'; // 로딩 표시

    const currentAssets = Number(document.getElementById('assets').value) * 10000; // 만 원 단위
    const dividendYield = Number(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = Number(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = Number(document.getElementById('stockGrowth').value) / 100;
    const monthlyInvestment = Number(document.getElementById('monthlyInvestment').value) * 10000; // 만 원 단위
    const investmentGrowth = Number(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = Number(document.getElementById('goalDividend').value) * 10000; // 만 원 단위

    const years = [1, 2, 3, 4, 5, 10, 20];
    const yearData = years.map(year => year + "년");
    const assetData = [];
    const futureAssetData = [];
    let totalDividend = 0;

    // 자산 계산
    for (let year = 1; year <= 20; year++) {
        currentAssets += monthlyInvestment * 12; // 연간 투자액 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장
        totalDividend += currentAssets * dividendYield; // 연간 배당금 추가
        dividendYield *= (1 + dividendGrowth); // 배당금 성장

        if (years.includes(year)) {
            assetData.push(currentAssets / 10000); // 만 원 단위로 저장
        }

        if (year <= 20) {
            futureAssetData.push(currentAssets / 10000); // 만 원 단위로 저장
        }
    }

    // 최종 배당금 계산
    const finalDividend = totalDividend / 20; // 연평균 배당금
    const finalAssets = currentAssets;

    // 결과 표시
    document.getElementById('result').innerHTML = `
        <strong>최종 자산:</strong> ${formatNumber(finalAssets / 10000)} 만 원<br>
        <strong>평균 월 배당금:</strong> ${formatNumber(finalDividend)} 만 원<br>
        <strong>선택한 투자 전략:</strong> ${document.getElementById('investmentStrategy').value}
    `;
    document.getElementById('result').style.display = 'block';
    loading.style.display = 'none'; // 로딩 숨기기
    drawChart(yearData, assetData);
    drawFutureChart(yearData, futureAssetData);

    // 목표 진행 상황
    if (finalDividend >= goalDividend) {
        document.getElementById('goalProgress').innerHTML = "축하합니다! 목표를 달성하셨습니다!";
        document.getElementById('motivationMessage').innerHTML = "꾸준한 노력이 성과로 이어집니다!";
    } else {
        document.getElementById('goalProgress').innerHTML = "아직 목표에 도달하지 않았습니다.";
        document.getElementById('motivationMessage').innerHTML = "포기하지 마세요! 조금씩 나아가면 결국 도달할 수 있습니다!";
    }

    // 공유 버튼 표시
    document.getElementById('shareResult').style.display = 'block';

    // 로컬 스토리지에 저장
    saveToLocalStorage();
}

// 자산 성장 차트
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

// 미래 자산 성장 차트
function drawFutureChart(yearData, futureAssetData) {
    const ctx = document.getElementById('futureGrowthChart').getContext('2d');
    const futureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: yearData,
            datasets: [{
                label: '미래 자산 성장',
                data: futureAssetData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
    document.getElementById('futureGrowthChart').style.display = 'block'; // 차트 표시
}

// 숫자 포맷팅
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 페이지 로드 시 로컬 스토리지에서 불러오기
window.onload = loadFromLocalStorage;

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

// 폼 제출 시 계산 실행
document.getElementById('calculatorForm').addEventListener('submit', calculate);
