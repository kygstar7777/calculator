function calculateDividend() {
    const stockCount = document.getElementById('stock-count').value;
    const dividendRate = document.getElementById('dividend-rate').value;
    const stockPrice = document.getElementById('stock-price').value;

    if (stockCount && dividendRate && stockPrice) {
        const dividend = (stockCount * stockPrice * (dividendRate / 100)).toFixed(2);
        document.getElementById('result').textContent = `예상 배당금: ₩${dividend}`;
    } else {
        document.getElementById('result').textContent = '모든 값을 입력해주세요!';
    }
}
