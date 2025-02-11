document.addEventListener('DOMContentLoaded', () => {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const stock = JSON.parse(localStorage.getItem('stock')) || [];

    function initializeSalesChart() {
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        // Process sales data by date
        const salesByDate = {};
        sales.forEach(sale => {
            const date = sale.date.split('T')[0];
            if (!salesByDate[date]) {
                salesByDate[date] = 0;
            }
            salesByDate[date] += sale.total;
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(salesByDate),
                datasets: [{
                    label: 'Daily Sales ($)',
                    data: Object.values(salesByDate),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function initializePredictionChart() {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        
        // Process sales data for predictions
        const productSales = {};
        sales.forEach(sale => {
            if (!productSales[sale.product]) {
                productSales[sale.product] = [];
            }
            productSales[sale.product].push(sale.quantity);
        });

        // Simple linear prediction for next 7 days
        const predictions = Object.entries(productSales).map(([product, quantities]) => {
            const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;
            return {
                product,
                prediction: avg * 7 // Weekly prediction
            };
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: predictions.map(p => p.product),
                datasets: [{
                    label: 'Weekly Sales Prediction',
                    data: predictions.map(p => p.prediction),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function displayStockPredictions() {
        const predictionsDiv = document.getElementById('stockPredictions');
        const predictions = stock.map(item => {
            const itemSales = sales.filter(sale => sale.product === item.name);
            const avgDailySales = itemSales.length > 0 
                ? itemSales.reduce((acc, sale) => acc + sale.quantity, 0) / 30 
                : 0;
            
            return {
                product: item.name,
                currentStock: item.stock,
                predictedDaysLeft: Math.round(item.stock / (avgDailySales || 1))
            };
        });

        predictionsDiv.innerHTML = predictions.map(pred => `
            <div class="prediction-card">
                <h4>${pred.product}</h4>
                <p>Current Stock: ${pred.currentStock}</p>
                <p>Estimated Days Until Reorder: ${pred.predictedDaysLeft}</p>
            </div>
        `).join('');
    }

    function displayPriceAnalytics() {
        const analyticsTable = document.getElementById('priceAnalytics');
        const priceAnalysis = stock.map(item => {
            const itemSales = sales.filter(sale => sale.product === item.name);
            const avgPrice = itemSales.reduce((acc, sale) => acc + sale.price, 0) / (itemSales.length || 1);
            const suggestedPrice = avgPrice * 1.2; // Simple 20% markup suggestion

            return {
                product: item.name,
                currentPrice: item.price,
                suggestedPrice: suggestedPrice,
                confidence: itemSales.length > 10 ? 'High' : 'Low'
            };
        });

        analyticsTable.innerHTML = priceAnalysis.map(analysis => `
            <tr>
                <td>${analysis.product}</td>
                <td>$${analysis.currentPrice.toFixed(2)}</td>
                <td>$${analysis.suggestedPrice.toFixed(2)}</td>
                <td>${analysis.confidence}</td>
            </tr>
        `).join('');
    }

    // Initialize all charts and displays
    initializeSalesChart();
    initializePredictionChart();
    displayStockPredictions();
    displayPriceAnalytics();
}); 