const previousCalculations = [];

document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    calculate();
});

document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.calculator').classList.toggle('dark-mode');
});

document.getElementById('save-calculation').addEventListener('click', function() {
    const resultDiv = document.getElementById('result');
    if (resultDiv.innerHTML) {
        previousCalculations.push(resultDiv.innerHTML);
        alert("계산 결과가 저장되었습니다.");
    } else {
        alert("계산 결과가 없습니다.");
    }
});

document.getElementById('view-history').addEventListener('click', function() {
    if (previousCalculations.length > 0) {
        alert("저장된 계산 결과:\n" + previousCalculations.join("\n"));
    } else {
        alert("저장된 계산 결과가 없습니다.");
    }
});

function calculate() {
    const assets = parseFloat(document.getElementById('assets').value) * 10000;
    const dividendYield = parseFloat(document.getElementById('dividendYield').value) / 100;
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value) / 100;
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value) / 100;
    let monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value) * 10000;
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value) / 100;
    const goalDividend = parseFloat(document.getElementById('goalDividend').value) * 10000;

    if (assets < 0 || monthlyInvestment < 0 || goalDividend < 0) {
        alert("모든 입력 값은 0 이상이어야 합니다.");
        return;
    }

    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block'; // 로딩 스피너 보이기

    let currentAssets = assets;
    let years = 0;

    // 계산을 수행
    while (currentAssets * dividendYield < goalDividend) {
        currentAssets += monthlyInvestment * 12; // 연간 투입금 추가
        currentAssets *= (1 + stockGrowth); // 자산 성장률 적용
        monthlyInvestment *= (1 + investmentGrowth); // 월 추가 투입금 증가율 적용
        years++;
    }

    const totalInvestment = assets + (monthlyInvestment * 12 * years);

    // 결과 표시
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; // 결과 영역 표시
    resultDiv.innerHTML = `
        <strong>계산 결과:</strong><br>
        <span>목표 월 배당금 달성까지 예상 소요 기간: <strong>${years}년</strong></span><br>
        <span>총 투자 금액: <strong>${(totalInvestment / 10000).toFixed(2)} 만 원</strong></span><br>
        <span>최종 자산: <strong>${(currentAssets / 10000).toFixed(2)} 만 원</strong></span>
    `;
    loadingDiv.style.display = 'none'; // 로딩 스피너 숨기기
}
