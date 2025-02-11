// Supplier Management System
class SupplierManagement {
    constructor() {
        this.suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        this.thresholds = JSON.parse(localStorage.getItem('stockThresholds')) || {};
        this.purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
        
        this.initializeEventListeners();
        this.updateDisplay();
        this.startStockMonitoring();
    }

    initializeEventListeners() {
        document.getElementById('supplierForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSupplier();
        });
    }

    addSupplier() {
        const supplier = {
            id: Date.now(),
            name: document.getElementById('supplierName').value,
            email: document.getElementById('supplierEmail').value,
            phone: document.getElementById('supplierPhone').value,
            address: document.getElementById('supplierAddress').value,
            products: []
        };

        this.suppliers.push(supplier);
        this.saveSuppliers();
        this.updateDisplay();
    }

    setThreshold(productId, threshold) {
        this.thresholds[productId] = threshold;
        localStorage.setItem('stockThresholds', JSON.stringify(this.thresholds));
    }

    generatePurchaseOrder(product, supplier, quantity) {
        const po = {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            supplierId: supplier.id,
            supplierName: supplier.name,
            quantity: quantity,
            date: new Date().toISOString(),
            status: 'pending'
        };

        this.purchaseOrders.push(po);
        localStorage.setItem('purchaseOrders', JSON.stringify(this.purchaseOrders));
        
        // Send email notification
        this.sendEmailNotification(supplier.email, po);
    }

    async sendEmailNotification(email, purchaseOrder) {
        // In a real application, this would connect to an email service
        console.log(`Email notification sent to ${email} for PO: ${purchaseOrder.id}`);
    }

    startStockMonitoring() {
        setInterval(() => this.checkStockLevels(), 3600000); // Check every hour
    }

    checkStockLevels() {
        const stock = JSON.parse(localStorage.getItem('stock')) || [];
        
        stock.forEach(item => {
            const threshold = this.thresholds[item.id];
            if (threshold && item.stock <= threshold) {
                const supplier = this.findSupplierForProduct(item.id);
                if (supplier) {
                    const reorderQuantity = this.calculateReorderQuantity(item);
                    this.generatePurchaseOrder(item, supplier, reorderQuantity);
                }
            }
        });
    }

    calculateReorderQuantity(item) {
        // Implement ML-based prediction here
        const salesHistory = this.getSalesHistory(item.id);
        return this.predictOptimalReorderQuantity(salesHistory);
    }

    predictOptimalReorderQuantity(salesHistory) {
        // Simple moving average for now
        // In a real application, this would use more sophisticated ML models
        const recentSales = salesHistory.slice(-30); // Last 30 days
        const averageDailySales = recentSales.reduce((a, b) => a + b, 0) / recentSales.length;
        return Math.ceil(averageDailySales * 14); // 2 weeks supply
    }

    getSalesHistory(productId) {
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        return sales
            .filter(sale => sale.productId === productId)
            .map(sale => sale.quantity);
    }

    updateDisplay() {
        this.updateSupplierList();
        this.updateThresholdControls();
        this.updatePurchaseOrders();
    }

    // ... Additional helper methods for UI updates
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
    // Get data from localStorage
    const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
    const stock = JSON.parse(localStorage.getItem('stock')) || [];
    const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders')) || [];

    // Display suppliers
    function displaySuppliers() {
        const supplierList = document.getElementById('supplierList');
        supplierList.innerHTML = suppliers.map(supplier => `
            <tr>
                <td>${supplier.name}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone}</td>
                <td>${getSupplierProducts(supplier.products)}</td>
                <td>
                    <button onclick="viewPurchaseOrders(${supplier.id})" class="btn-primary">View Orders</button>
                    <button onclick="editSupplier(${supplier.id})" class="btn-secondary">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    // Get product names for supplier
    function getSupplierProducts(productIds) {
        return productIds
            .map(id => stock.find(item => item.id === id)?.name || 'Unknown')
            .join(', ');
    }

    // Display purchase orders
    function displayPurchaseOrders() {
        const poDiv = document.getElementById('purchaseOrders');
        poDiv.innerHTML = purchaseOrders.map(po => `
            <div class="purchase-order ${po.status}">
                <h3>PO #${po.id}</h3>
                <p>Product: ${po.productName}</p>
                <p>Supplier: ${po.supplierName}</p>
                <p>Quantity: ${po.quantity}</p>
                <p>Date: ${new Date(po.date).toLocaleDateString()}</p>
                <p>Status: ${po.status}</p>
            </div>
        `).join('');
    }

    // Display threshold controls
    function displayThresholdControls() {
        const thresholdDiv = document.getElementById('thresholdControls');
        thresholdDiv.innerHTML = stock.map(item => `
            <div class="threshold-control">
                <label>${item.name}</label>
                <input type="number" 
                       value="${item.threshold}" 
                       onchange="updateThreshold(${item.id}, this.value)"
                       min="1">
            </div>
        `).join('');
    }

    // Initialize displays
    displaySuppliers();
    displayPurchaseOrders();
    displayThresholdControls();

    // Make functions available globally
    window.viewPurchaseOrders = (supplierId) => {
        const supplierPOs = purchaseOrders.filter(po => po.supplierId === supplierId);
        // Implement PO display logic (modal or dedicated section)
        console.log(supplierPOs);
    };

    window.editSupplier = (supplierId) => {
        // Implement supplier edit logic
        console.log('Edit supplier:', supplierId);
    };

    window.updateThreshold = (productId, newThreshold) => {
        const stock = JSON.parse(localStorage.getItem('stock')) || [];
        const updatedStock = stock.map(item => 
            item.id === productId ? {...item, threshold: parseInt(newThreshold)} : item
        );
        localStorage.setItem('stock', JSON.stringify(updatedStock));
    };
}); 