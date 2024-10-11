// 계산 함수
document.getElementById('calculatorForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // 입력값 가져오기
    const assets = parseFloat(document.getElementById('assets').value) * 10000; // 만원 단위
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000; // 만원 단위
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000; // 목표 월 배당금 (만원 단위)
    const dividendReinvestmentRate = parseFloat(document.getElementById('dividendReinvestmentRate').value) / 100;

    // 초기 변수 설정
    let futureAssets = assets;
    let totalDividend = 0;
    let years = 0;
    const futureAssetValues = [];
    const detailedResults = [];

    // 목표 월 배당금에 도달할 때까지 연간 배당금을 누적
    while (totalDividend < goalDividend * 12) {
        const annualDividend = futureAssets * dividendYield; // 연간 배당금 계산
        const reinvestedDividend = annualDividend * dividendReinvestmentRate; // 재투자된 배당금 계산
        totalDividend = annualDividend; // 연간 배당금 누적

        // 자산 증가 계산 (주가 상승률 반영)
        futureAssets = futureAssets * (1 + stockGrowth) + monthlyInvestment * 12 + reinvestedDividend;

        // 배당 성장률 반영 (배당금이 매년 상승)
        dividendYield += dividendYield * dividendGrowth;

        // 투자금의 연 증가율 반영
        monthlyInvestment = monthlyInvestment * (1 + investmentGrowth); // 매년 월 투자금 증가

        // 연간 자산 및 배당금 데이터 기록
        detailedResults.push({
            year: years,
            annualDividend: (annualDividend / 10000).toFixed(2), // 만원 단위로 변환
            totalAssets: (futureAssets / 10000).toFixed(2), // 만원 단위로 변환
            reinvestedDividend: (reinvestedDividend / 10000).toFixed(2), // 재투자된 배당금
            monthlyInvestment: (monthlyInvestment / 10000).toFixed(2), // 증가된 월 투자금
        });

        futureAssetValues.push(futureAssets); // 차트에 사용될 자산 값 저장
        years++;

        // 무한 루프 방지 (최대 100년)
        if (years > 100) break;
    }

    // 최종 결과 출력
    const resultText = `
        목표 월 배당금: ${(goalDividend / 10000).toFixed(2)} 만 원에 도달하기까지 약 ${years}년이 걸립니다.<br>
        목표 도달 시 총 자산: ${(futureAssets / 10000).toFixed(2)} 만 원
    `;
    document.getElementById('result').innerHTML = resultText;
    document.getElementById('result').style.display = 'block';

    // 상세 결과 출력
    displayDetailedResults(detailedResults);

    // 자산 성장 차트 그리기
    drawGrowthChart(futureAssetValues, years);

    // 로컬 스토리지에 데이터 저장
    saveToLocalStorage();
});

// 상세 결과 출력 함수 (연차별 배당금, 자산, 재투자 배당금 표시)
function displayDetailedResults(results) {
    const detailedResultsDiv = document.getElementById('detailedResults');
    detailedResultsDiv.innerHTML = ''; // 기존 내용 삭제

    results.forEach(result => {
        detailedResultsDiv.innerHTML += `
            <div>
                <strong>연차:</strong> ${result.year + 1}년<br>
                <strong>연간 배당금:</strong> ${result.annualDividend} 만 원<br>
                <strong>연말 자산:</strong> ${result.totalAssets} 만 원<br>
                <strong>재투자된 배당금:</strong> ${result.reinvestedDividend} 만 원<br>
                <strong>연간 투자금 (연 증가율 반영):</strong> ${result.monthlyInvestment} 만 원<br>
                <hr>
            </div>
        `;
    });
}

// 자산 성장 차트 그리기 함수
function drawGrowthChart(futureAssetValues, years) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    document.getElementById('growthChart').style.display = 'block';

    const labels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '자산 성장',
                data: futureAssetValues.map(v => (v / 10000).toFixed(2)), // 만원 단위로 변환
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
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
document.getElementById('toggle-theme').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});

// 페이지 로드 시 로컬 스토리지에서 불러오기
window.onload = () => {
    loadFromLocalStorage();
};
