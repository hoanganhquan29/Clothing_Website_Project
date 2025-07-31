

document.addEventListener('DOMContentLoaded', () => {

    const dashboardSection = document.getElementById('dashboard-section');
    const productManagementSection = document.getElementById('product-management-section');
    const showDashboardBtn = document.getElementById('show-dashboard');
    const showProductManagementBtn = document.getElementById('show-product-management');
    const navButtons = document.querySelectorAll('.admin-sidebar .nav-button');

    function setActiveNav(activeButton) {
        navButtons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }

    showDashboardBtn.addEventListener('click', () => {
        dashboardSection.style.display = 'block';
        productManagementSection.style.display = 'none';
        setActiveNav(showDashboardBtn);
     
        renderDashboardStats();
        renderInventoryChart();
        renderRecentActivity(); 
    });

    showProductManagementBtn.addEventListener('click', () => {
        dashboardSection.style.display = 'none';
        productManagementSection.style.display = 'block';
        setActiveNav(showProductManagementBtn);
        
        renderProductList();
        hideProductForm(); 
    });

 
    const adminLogoutBtn = document.getElementById('admin-logout');
    adminLogoutBtn.addEventListener('click', () => {
        alert('You have been logged out.');
        localStorage.removeItem('loggedInUser'); 
        window.location.href = 'login.html'; 
        logActivity('Admin Logout', 'The administrator logged out.'); 
    });



    function getActivities() {
        return JSON.parse(localStorage.getItem('adminActivities')) || [];
    }

    function saveActivities(activities) {
        localStorage.setItem('adminActivities', JSON.stringify(activities));
    }

    function logActivity(type, description) {
        const activities = getActivities();
        const newActivity = {
            id: Date.now(), 
            type: type,
            description: description,
            timestamp: new Date().toLocaleString() 
        };
        activities.unshift(newActivity); 
       
        saveActivities(activities.slice(0, 10));
        renderRecentActivity(); 
    }

    function renderRecentActivity() {
        const recentActivityList = document.getElementById('recent-activity-list');
        if (!recentActivityList) return; // Ensure the element exists

        const activities = getActivities();
        recentActivityList.innerHTML = ''; // Clear previous entries

        if (activities.length === 0) {
            recentActivityList.innerHTML = '<p class="no-activity-message">No recent activities.</p>';
            return;
        }

        activities.forEach(activity => {
            const li = document.createElement('li');
            li.classList.add('activity-item');
            li.innerHTML = `
                <div class="activity-header">
                    <span class="activity-type">${activity.type}</span>
                    <span class="activity-timestamp">${activity.timestamp}</span>
                </div>
                <p class="activity-description">${activity.description}</p>
            `;
            recentActivityList.appendChild(li);
        });
    }


    // --- Product Management Logic ---
    const productFormContainer = document.getElementById('product-form-container');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productCategorySelect = document.getElementById('product-category');
    const productImageInput = document.getElementById('product-image');
    const productGalleryImagesInput = document.getElementById('product-gallery-images');
    const productDescriptionInput = document.getElementById('product-description');
    const submitButton = document.getElementById('submit-button');
    const formTitle = document.getElementById('form-title');
    const adminProductTableBody = document.querySelector('#admin-product-table tbody');
    const noProductsMessage = document.getElementById('no-products-message');

    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Dashboard Stats (mock data or integrate with actual data)
    function renderDashboardStats() {
        document.getElementById('total-products').textContent = products.length;

        // Get user list from localStorage and update user count
        const users = JSON.parse(localStorage.getItem('users')) || [];
        document.getElementById('total-users').textContent = users.length;
    }

    // Chart.js for Inventory Chart
    let inventoryChart;
    function renderInventoryChart() {
        const ctx = document.getElementById('inventoryChart').getContext('2d');

        const categoryCounts = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        if (inventoryChart) {
            inventoryChart.destroy(); // Destroy existing chart before creating a new one
        }

        inventoryChart = new Chart(ctx, {
            type: 'bar', // Or 'doughnut', 'pie'
            data: {
                labels: labels,
                datasets: [{
                    label: 'Product Quantity',
                    data: data,
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)', // Green
                        'rgba(54, 162, 235, 0.7)', // Blue
                        'rgba(255, 206, 86, 0.7)', // Yellow
                        'rgba(153, 102, 255, 0.7)', // Purple
                        'rgba(255, 99, 132, 0.7)',  // Red
                        'rgba(75, 192, 192, 0.7)' // Teal
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0 // Ensure y-axis labels are integers
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }


    // Show/Hide Product Form
    function showProductForm() {
        productFormContainer.style.display = 'block';
    }

    function hideProductForm() {
        productFormContainer.style.display = 'none';
        productForm.reset(); // Reset form fields
        productIdInput.value = ''; // Clear hidden ID
        formTitle.textContent = 'Add New Product';
        submitButton.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }

    document.getElementById('show-add-product-form').addEventListener('click', () => {
        hideProductForm(); // Reset form first
        showProductForm();
        productNameInput.focus();
    });

    document.getElementById('cancel-button').addEventListener('click', hideProductForm);

    // Render Product List
    function renderProductList() {
        adminProductTableBody.innerHTML = '';
        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
            adminProductTableBody.style.display = 'none'; 
        } else {
            noProductsMessage.style.display = 'none';
            adminProductTableBody.style.display = 'table-row-group'; 
            products.forEach(product => {
                const row = adminProductTableBody.insertRow();
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="${product.image}" alt="${product.name}"></td>
                    <td>${product.name}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.category}</td>
                    <td>
                        <button class="edit-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="delete-btn" data-id="${product.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                `;
            });
        }
    }

    // Handle Form Submission (Add/Edit Product)
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = productIdInput.value;
        const name = productNameInput.value;
        const price = parseFloat(productPriceInput.value);
        const category = productCategorySelect.value;
        const image = productImageInput.value;
        const galleryImages = productGalleryImagesInput.value.split(',').map(url => url.trim()).filter(url => url !== '');
        const description = productDescriptionInput.value;

        if (!name || isNaN(price) || price <= 0 || !category || !image) {
            alert('Please fill in all required fields: Product Name, Price, Category, and Main Image URL.');
            return;
        }

        if (id) {
            // Edit existing product
            const oldProduct = products.find(p => p.id == id);
            const index = products.findIndex(p => p.id == id);
            if (index > -1) {
                products[index] = { id: parseInt(id), name, price, category, image, galleryImages, description };
                logActivity('Product Updated', `Product "${oldProduct.name}" (ID: ${id}) was updated.`);
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, name, price, category, image, galleryImages, description });
            logActivity('New Product Added', `Product "${name}" (ID: ${newId}) was added.`);
        }

        localStorage.setItem('products', JSON.stringify(products));
        renderProductList();
        renderDashboardStats();
        renderInventoryChart();
        hideProductForm(); // Hide form after submission
    });

    // Handle Edit and Delete buttons on the Product List Table
    adminProductTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const productId = target.dataset.id;

        if (target.classList.contains('edit-btn')) {
            const productToEdit = products.find(p => p.id == productId);
            if (productToEdit) {
                productIdInput.value = productToEdit.id;
                productNameInput.value = productToEdit.name;
                productPriceInput.value = productToEdit.price;
                productCategorySelect.value = productToEdit.category;
                productImageInput.value = productToEdit.image;
                productGalleryImagesInput.value = (productToEdit.galleryImages || []).join(', ');
                productDescriptionInput.value = productToEdit.description;

                formTitle.textContent = 'Edit Product';
                submitButton.innerHTML = '<i class="fas fa-save"></i> Update Product';
                showProductForm();
                productNameInput.focus();
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this product?')) {
                const deletedProduct = products.find(p => p.id == productId);
                products = products.filter(p => p.id != productId);
                localStorage.setItem('products', JSON.stringify(products));
                renderProductList();
                renderDashboardStats();
                renderInventoryChart();
                if (deletedProduct) {
                    logActivity('Product Deleted', `Product "${deletedProduct.name}" (ID: ${productId}) was deleted.`);
                }
            }
        }
    });

    // Initial renders
    renderDashboardStats();
    renderInventoryChart();
    renderProductList();
    hideProductForm(); // Start with the form hidden
    showDashboardBtn.click(); // Default to showing Dashboard on page load

    // Initial render for recent activity
    renderRecentActivity();
});