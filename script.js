function calculateDividend() {
    const investment = parseFloat(document.getElementById('investment').value);
    const dividend = parseFloat(document.getElementById('dividend').value);
    const shares = parseInt(document.getElementById('shares').value);

    if (!isNaN(investment) && !isNaN(dividend) && !isNaN(shares) && shares > 0) {
        const totalDividend = dividend * shares;
        const yieldPercentage = (totalDividend / investment) * 100;
        document.getElementById('result').innerText = `연간 배당금: ${totalDividend.toFixed(2)} 원\n배당 수익률: ${yieldPercentage.toFixed(2)}%`;
    } else {
        document.getElementById('result').innerText = '입력값을 확인하세요.';
    }
}
