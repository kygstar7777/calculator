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

// 입력 검증 함수
function validateInput(value, fieldId, errorMsg) {
    const inputField = document.getElementById(fieldId);
    const errorField = document.getElementById(`error-${fieldId}`);
    if (isNaN(value) || value < 0) {
        errorField.innerText = errorMsg;
        errorField.style.display = 'block';
        return false;
    } else {
        errorField.style.display = 'none';
        return true;
    }
}

// 계산 함수
document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const assets = parseFloat(document.getElementById('assets').value) * 10000; // 만원 단위
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 만원 단위
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000; // 만원 단위
    const dividendReinvestmentRate = parseFloat(document.getElementById('dividendReinvestmentRate').value) / 100;

    // 입력값 검증
    if (!validateInput(assets, 'assets', '유효한 자산을 입력하세요.') ||
        !validateInput(dividendYield, 'dividendYield', '유효한 배당 수익률을 입력하세요.') ||
        !validateInput(dividendGrowth, 'dividendGrowth', '유효한 배당금 성장률을 입력하세요.') ||
        !validateInput(stockGrowth, 'stockGrowth', '유효한 주식 성장률을 입력하세요.') ||
        !validateInput(monthlyInvestment, 'monthlyInvestment', '유효한 투자금을 입력하세요.') ||
        !validateInput(investmentGrowth, 'investmentGrowth', '유효한 투자 성장률을 입력하세요.') ||
        !validateInput(goalDividend, 'goalDividend', '유효한 목표 배당금을 입력하세요.') ||
        !validateInput(dividendReinvestmentRate, 'dividendReinvestmentRate', '유효한 재투자 비율을 입력하세요.')) {
        return;
    }

    document.getElementById('loading').style.display = 'block'; // 로딩 표시

    // 계산 로직
    let futureAssets = assets;
    let years = 0;
    let totalDividend = 0;
    const futureAssetValues = []; // 자산 변화를 기록할 배열
    const detailedResults = []; // 상세 결과 기록 배열

    while (totalDividend < goalDividend) {
        const annualDividend = futureAssets * dividendYield; // 연간 배당금
        futureAssets = futureAssets * (1 + dividendYield * dividendReinvestmentRate + dividendGrowth) + monthlyInvestment * 12 * (1 + investmentGrowth);
        totalDividend += annualDividend;

        detailedResults.push({
            year: years,
            annualDividend: (annualDividend / 10000).toFixed(2),
            totalAssets: (futureAssets / 10000).toFixed(2),
        });

        futureAssetValues.push(futureAssets);
        years++;

        // 무한 루프 방지
        if (years > 100) break;
    }

    const result = `목표 배당금: ${(goalDividend / 10000).toFixed(2)} 만 원에 도달하기까지 약 ${years}년이 걸립니다.`;
    document.getElementById('result').innerText = result;

    // 상세 결과 표시
    displayDetailedResults(detailedResults);

    // 차트 그리기
    drawGoalProgressChart(futureAssetValues, years);

    // 로컬 스토리지에 데이터 저장
    saveToLocalStorage();

    document.getElementById('loading').style.display = 'none'; // 로딩 숨기기
    document.getElementById('shareResult').style.display = 'block'; // 결과 공유 버튼 표시
});

// 상세 결과 표시 함수
function displayDetailedResults(results) {
    const detailedResultsDiv = document.getElementById('detailedResults');
    detailedResultsDiv.innerHTML = ''; // 기존 내용 삭제

    results.forEach(result => {
        detailedResultsDiv.innerHTML += `
            <div>
                <strong>연차:</strong> ${result.year}년<br>
                <strong>연초 배당금:</strong> ${result.annualDividend} 만 원<br>
                <strong>연말 보유 자산:</strong> ${result.totalAssets} 만 원<br>
                <hr>
            </div>
        `;
    });
}

// 차트 그리기
function drawGoalProgressChart(futureAssetValues, years) {
    const ctx = document.getElementById('goalProgress').getContext('2d');
    const labels = Array.from({ length: years }, (_, i) => `Year ${i}`);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '자산 성장',
                data: futureAssetValues.map(v => (v / 10000).toFixed(2)), // 만원 단위로 변환
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

    document.getElementById('goalProgress').style.display = 'block'; // 차트 표시
}

// 다크 모드 토글
document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// 페이지 로드 시 데이터 불러오기
window.onload = () => {
    loadFromLocalStorage();
};
