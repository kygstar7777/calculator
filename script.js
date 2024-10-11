document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // 입력 검증 함수
    const validateInput = (value, fieldId, errorMsg) => {
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
    };

    const assets = parseFloat(document.getElementById('assets').value);
    const dividendYield = parseFloat(document.getElementById('dividendYield').value);
    const dividendGrowth = parseFloat(document.getElementById('dividendGrowth').value);
    const stockGrowth = parseFloat(document.getElementById('stockGrowth').value);
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const investmentGrowth = parseFloat(document.getElementById('investmentGrowth').value);
    const goalDividend = parseFloat(document.getElementById('goalDividend').value);
    const dividendReinvestmentRate = parseFloat(document.getElementById('dividendReinvestmentRate').value);

    // 유효성 검사
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

    // 여기서 계산 로직과 차트 그리기 구현

    // 계산 완료 후 공유 버튼 활성화
    document.getElementById('shareResult').style.display = 'block';
});

// 다크 모드 토글
document.getElementById('toggle-theme').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// 페이지 로드 시 데이터 불러오기
window.onload = () => {
    loadFromLocalStorage();
};
