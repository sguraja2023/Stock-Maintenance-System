document.addEventListener("DOMContentLoaded", () => {
    let users = [{ username: "admin", password: "password" }];
    let stock = JSON.parse(localStorage.getItem("stock")) || [
        { id: 1, name: "Laptop", price: 1000, stock: 5 },
        { id: 2, name: "Phone", price: 500, stock: 10 },
        { id: 3, name: "Tablet", price: 300, stock: 8 }
    ];
    let sales = JSON.parse(localStorage.getItem("sales")) || [];
    localStorage.setItem("stock", JSON.stringify(stock));
    localStorage.setItem("sales", JSON.stringify(sales));

    const LOGGED_IN_KEY = 'isLoggedIn';
    let isLoggedIn = localStorage.getItem(LOGGED_IN_KEY) === 'true';

    function authenticateUser(username, password) {
        return users.some(user => user.username === username && user.password === password);
    }

    function updateStockDisplay() {
        const stockBody = document.getElementById("stock-body");
        if (stockBody) {
            stockBody.innerHTML = stock.map((item, index) => `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>${item.stock}</td>
                    <td>
                        <button onclick="removeProduct(${index})">Delete</button>
                    </td>
                </tr>
            `).join("");
        }
    }

    window.addProduct = () => {
        const name = document.getElementById("product-name").value;
        const price = document.getElementById("product-price").value;
        const stockCount = document.getElementById("product-stock").value;
        if (name && price && stockCount) {
            stock.push({ id: stock.length + 1, name, price, stock: stockCount });
            localStorage.setItem("stock", JSON.stringify(stock));
            updateStockDisplay();
        }
    };

    window.removeProduct = (index) => {
        stock.splice(index, 1);
        localStorage.setItem("stock", JSON.stringify(stock));
        updateStockDisplay();
    };

    function renderSalesChart() {
        const ctx = document.getElementById("salesChart").getContext("2d");
        const productSales = {};

        sales.forEach(sale => {
            if (!productSales[sale.product]) {
                productSales[sale.product] = { quantity: 0, revenue: 0 };
            }
            productSales[sale.product].quantity += sale.quantity;
            productSales[sale.product].revenue += sale.total;
        });

        const labels = Object.keys(productSales);
        const quantities = labels.map(product => productSales[product].quantity);
        const revenues = labels.map(product => productSales[product].revenue);

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Quantity Sold",
                        data: quantities,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    },
                    {
                        label: "Total Revenue",
                        data: revenues,
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    window.handleLogin = () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        if (authenticateUser(username, password)) {
            isLoggedIn = true;
            localStorage.setItem(LOGGED_IN_KEY, 'true');
            document.getElementById("login-form").style.display = "none";
            document.getElementById("main-content").style.display = "block";
            updateStockDisplay();
            renderSalesChart();
        } else {
            alert("Invalid username or password!");
        }
    };

    window.handleLogout = () => {
        isLoggedIn = false;
        localStorage.setItem(LOGGED_IN_KEY, 'false');
        document.getElementById("login-form").style.display = "block";
        document.getElementById("main-content").style.display = "none";
    };

    if (isLoggedIn) {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        updateStockDisplay();
        renderSalesChart();
    } else {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("main-content").style.display = "none";
    }
});
