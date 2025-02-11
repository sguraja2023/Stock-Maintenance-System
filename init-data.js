class DataInitializer {
    static initializeData() {
        // Initialize Suppliers
        const suppliers = [
            {
                id: 1,
                name: "Tech Suppliers Inc.",
                email: "orders@techsuppliers.com",
                phone: "555-0123",
                address: "123 Tech Street, Silicon Valley",
                products: [1, 2, 3]
            },
            {
                id: 2,
                name: "Global Electronics",
                email: "sales@globalelectronics.com",
                phone: "555-0456",
                address: "456 Electronics Ave, Digital City",
                products: [4, 5, 6]
            }
        ];

        // Initialize Products with Thresholds
        const stock = [
            {
                id: 1,
                name: "Laptop Pro X",
                price: 1299.99,
                stock: 15,
                threshold: 5,
                supplierId: 1
            },
            {
                id: 2,
                name: "Smartphone Y",
                price: 799.99,
                stock: 25,
                threshold: 8,
                supplierId: 1
            },
            {
                id: 3,
                name: "Tablet Z",
                price: 499.99,
                stock: 20,
                threshold: 6,
                supplierId: 1
            },
            {
                id: 4,
                name: "Wireless Earbuds",
                price: 159.99,
                stock: 30,
                threshold: 10,
                supplierId: 2
            },
            {
                id: 5,
                name: "Smart Watch",
                price: 299.99,
                stock: 12,
                threshold: 4,
                supplierId: 2
            }
        ];

        // Initialize Sales Data (last 30 days)
        const sales = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Generate random sales data
        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            // Generate 2-5 sales per day
            const dailySales = Math.floor(Math.random() * 4) + 2;
            
            for (let j = 0; j < dailySales; j++) {
                const productIndex = Math.floor(Math.random() * stock.length);
                const product = stock[productIndex];
                const quantity = Math.floor(Math.random() * 3) + 1;
                
                sales.push({
                    id: sales.length + 1,
                    date: date.toISOString(),
                    productId: product.id,
                    product: product.name,
                    quantity: quantity,
                    price: product.price,
                    total: quantity * product.price,
                    customerId: Math.floor(Math.random() * 100) + 1 // Random customer ID
                });
            }
        }

        // Initialize Purchase Orders
        const purchaseOrders = [
            {
                id: 1,
                productId: 1,
                productName: "Laptop Pro X",
                supplierId: 1,
                supplierName: "Tech Suppliers Inc.",
                quantity: 10,
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                status: 'pending'
            },
            {
                id: 2,
                productId: 5,
                productName: "Smart Watch",
                supplierId: 2,
                supplierName: "Global Electronics",
                quantity: 15,
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                status: 'completed'
            }
        ];

        // Save to localStorage
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
        localStorage.setItem('stock', JSON.stringify(stock));
        localStorage.setItem('sales', JSON.stringify(sales));
        localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));

        console.log('Sample data initialized successfully!');
        return {
            suppliers,
            stock,
            sales,
            purchaseOrders
        };
    }

    static clearData() {
        localStorage.removeItem('suppliers');
        localStorage.removeItem('stock');
        localStorage.removeItem('sales');
        localStorage.removeItem('purchaseOrders');
        console.log('All data cleared!');
    }
} 