
document.addEventListener('DOMContentLoaded', () => {
 
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }
    loadProductDetails();
    loadRelatedProducts();
    const addToCartButton = document.getElementById('add-to-cart-btn');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addProductToCart);
    } else {
        console.error('Add to Cart button not found.');
    }
});
function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('product_id')); 
    if (isNaN(productId)) {
        console.error('Product ID not found or invalid in URL. Redirecting to home page.'); 
        alert('Product not found!'); 
        window.location.href = 'home_page.html'; 
        return;
    }
    const products = getProducts(); 
    const product = products.find(p => p.id === productId); 

    if (product) {
        const mainImage = document.getElementById('main-image'); //
        const productName = document.getElementById('product-name'); //
        const productPrice = document.getElementById('product-price'); //
        const productDescription = document.getElementById('product-description'); //
        const ratingStarsDiv = document.getElementById('rating-stars'); //
        const thumbnailsContainer = document.getElementById('thumbnails'); // Lấy container của thumbnails

        // Cập nhật hình ảnh chính
        if (mainImage) {
            mainImage.src = product.image; //
            mainImage.alt = product.name; //
        } else {
            console.error('Element with ID "main-image" not found.'); //
        }

        // Cập nhật thông tin sản phẩm
        if (productName) productName.textContent = product.name; //
        if (productPrice) productPrice.textContent = `$${product.price.toFixed(2)}`; //
        if (productDescription) productDescription.textContent = product.description; //

        // Cập nhật sao đánh giá (ví dụ: hiển thị 4 sao đầy)
        if (ratingStarsDiv) {
            ratingStarsDiv.innerHTML = ''; // Xóa các sao hiện có
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i'); //
                star.className = i < 4 ? 'fas fa-star' : 'far fa-star'; // Giả sử sử dụng FontAwesome
                ratingStarsDiv.appendChild(star); //
            }
        }

        // Cập nhật thumbnails
        // Cập nhật thumbnails
        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = ''; // Xóa thumbnails hiện có

            // allImagesForThumbnails giờ chỉ chứa các ảnh từ galleryImages
            let allImagesForThumbnails = []; 
            if (product.galleryImages && Array.isArray(product.galleryImages)) {
                product.galleryImages.forEach(imgUrl => {
                    // Chỉ thêm ảnh phụ vào danh sách thumbnail
                    if (imgUrl) { 
                        allImagesForThumbnails.push(imgUrl);
                    }
                });
            }

            if (allImagesForThumbnails.length > 0) {
                allImagesForThumbnails.forEach(imgSrc => {
                    const thumbnailImg = document.createElement('img');
                    thumbnailImg.src = imgSrc;
                    thumbnailImg.alt = product.name + ' thumbnail';
                    thumbnailImg.classList.add('thumbnail');
                    thumbnailImg.onclick = () => { mainImage.src = imgSrc; };
                    thumbnailsContainer.appendChild(thumbnailImg);
                });
            } else {
                // Tùy chọn: hiển thị thông báo nếu không có ảnh phụ
                // thumbnailsContainer.innerHTML = '<p>No additional images.</p>';
            }
        }

    } else {
        console.error('Product with ID ' + productId + ' not found in localStorage. Redirecting to home page.'); //
        alert('Product not found!'); //
        window.location.href = 'home_page.html'; // Chuyển hướng nếu không tìm thấy sản phẩm
    }
}


function addProductToCart() {
    const urlParams = new URLSearchParams(window.location.search); 
    const productId = parseInt(urlParams.get('product_id')); 
    const sizeSelect = document.getElementById('size'); 
    const size = sizeSelect ? sizeSelect.value : 'One Size'; 
    const quantityInput = document.getElementById('quantity'); 
    const quantity = parseInt(quantityInput ? quantityInput.value : 1); 
    if (sizeSelect && !size) { 
        alert('Please select a size before adding to cart.'); 
        return;
    }
    if (isNaN(quantity) || quantity < 1) {
        alert('Quantity must be a positive number.'); 
        return;
    }
    const products = getProducts(); 
    const productToAdd = products.find(p => p.id === productId); 

    if (productToAdd) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]'); 
        const newItem = {
            id: productToAdd.id, 
            name: productToAdd.name, 
            price: productToAdd.price, 
            image: productToAdd.image, 
            size: size, 
            quantity: quantity 
        };
        const existingItemIndex = cart.findIndex(item => item.id === newItem.id && item.size === newItem.size); 

        if (existingItemIndex > -1) {
     
            cart[existingItemIndex].quantity += newItem.quantity; 
        } else {

            cart.push(newItem); //
        }

        localStorage.setItem('cart', JSON.stringify(cart)); //
        alert('Product added to cart successfully!'); //
        // Tùy chọn: Chuyển hướng đến trang giỏ hàng hoặc cập nhật biểu tượng giỏ hàng nhỏ
        // window.location.href = 'cart.html';
    } else {
        alert('No product found with the given ID.'); //
    }
}

function loadRelatedProducts() {
    const products = getProducts(); // Lấy tất cả sản phẩm
    const currentProductId = parseInt(new URLSearchParams(window.location.search).get('product_id')); //

    // Lọc bỏ sản phẩm hiện tại và chọn ngẫu nhiên một vài sản phẩm khác
    const relatedProducts = products.filter(p => p.id !== currentProductId) //
                                    .sort(() => 0.5 - Math.random()) // Xáo trộn
                                    .slice(0, 4); // Lấy tối đa 4 sản phẩm liên quan

    const relatedContainer = document.getElementById('related-container'); //
    if (!relatedContainer) return; //
    relatedContainer.innerHTML = ''; //

    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p style="text-align: center; color: #888;">No related products found.</p>'; //
        return;
    }

    relatedProducts.forEach(product => {
        const productCard = document.createElement('div'); //
        productCard.classList.add('product-card'); // Giả sử có kiểu product-card
        productCard.innerHTML = `
            <a href="product.html?product_id=${product.id}">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
            </a>
        `; //
        relatedContainer.appendChild(productCard); //
    });
}// js/product.js
document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer (assuming from script.js)
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }
    loadProductDetails();
    loadRelatedProducts();

    // Attach event listener to the "Add to Cart" button
    const addToCartButton = document.getElementById('add-to-cart-btn');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addProductToCart);
    } else {
        console.error('Add to Cart button not found.');
    }
});

// Assuming getProducts() is defined in script.js or a common utility file
// If not, you need to add it here, or ensure script.js is loaded before product.js
function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('product_id')); // Lấy ID từ URL

    // Kiểm tra xem productId có hợp lệ không
    if (isNaN(productId)) {
        console.error('Product ID not found or invalid in URL. Redirecting to home page.'); //
        alert('Product not found!'); //
        window.location.href = 'home_page.html'; // Chuyển hướng nếu ID không hợp lệ
        return;
    }

    const products = getProducts(); // Lấy tất cả sản phẩm từ localStorage
    const product = products.find(p => p.id === productId); // Tìm sản phẩm theo ID

    if (product) {
        const mainImage = document.getElementById('main-image'); //
        const productName = document.getElementById('product-name'); //
        const productPrice = document.getElementById('product-price'); //
        const productDescription = document.getElementById('product-description'); //
        const ratingStarsDiv = document.getElementById('rating-stars'); //
        const thumbnailsContainer = document.getElementById('thumbnails'); // Lấy container của thumbnails

        // Cập nhật hình ảnh chính
        if (mainImage) {
            mainImage.src = product.image; //
            mainImage.alt = product.name; //
        } else {
            console.error('Element with ID "main-image" not found.'); //
        }

        // Cập nhật thông tin sản phẩm
        if (productName) productName.textContent = product.name; //
        if (productPrice) productPrice.textContent = `$${product.price.toFixed(2)}`; //
        if (productDescription) productDescription.textContent = product.description; //

        // Cập nhật sao đánh giá (ví dụ: hiển thị 4 sao đầy)
        if (ratingStarsDiv) {
            ratingStarsDiv.innerHTML = ''; // Xóa các sao hiện có
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i'); //
                star.className = i < 4 ? 'fas fa-star' : 'far fa-star'; // Giả sử sử dụng FontAwesome
                ratingStarsDiv.appendChild(star); //
            }
        }

        // Cập nhật thumbnails
        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = ''; // Xóa thumbnails hiện có

            let allImagesForThumbnails = []; //

            if (product.image) {
                allImagesForThumbnails.push(product.image); //
            }

            // Ensure product.galleryImages exists and is an array before attempting to iterate
            // Đã sửa từ product.images sang product.galleryImages
            if (product.galleryImages && Array.isArray(product.galleryImages)) {
                product.galleryImages.forEach(imgUrl => {
                    if (imgUrl && !allImagesForThumbnails.includes(imgUrl)) {
                        allImagesForThumbnails.push(imgUrl);
                    }
                });
            }

            if (allImagesForThumbnails.length > 0) {
                allImagesForThumbnails.forEach(imgSrc => {
                    const thumbnailImg = document.createElement('img'); //
                    thumbnailImg.src = imgSrc; //
                    thumbnailImg.alt = product.name + ' thumbnail'; //
                    thumbnailImg.classList.add('thumbnail'); //
                    thumbnailImg.onclick = () => { mainImage.src = imgSrc; }; // Khi nhấp vào thumbnail, cập nhật ảnh chính
                    thumbnailsContainer.appendChild(thumbnailImg); //
                });
            } else {
                // You can add a placeholder or message if no images are found
            }
        }

    } else {
        console.error('Product with ID ' + productId + ' not found in localStorage. Redirecting to home page.'); //
        alert('Product not found!'); //
        window.location.href = 'home_page.html'; // Chuyển hướng nếu không tìm thấy sản phẩm
    }
}

// Function to add product to cart (modified)
function addProductToCart() {
    const urlParams = new URLSearchParams(window.location.search); //
    const productId = parseInt(urlParams.get('product_id')); //
    const sizeSelect = document.getElementById('size'); // Lấy phần tử select size
    const size = sizeSelect ? sizeSelect.value : 'One Size'; // Lấy giá trị size

    // Lấy phần tử input quantity
    const quantityInput = document.getElementById('quantity'); //
    const quantity = parseInt(quantityInput ? quantityInput.value : 1); //

    if (sizeSelect && !size) { // Chỉ kiểm tra nếu phần tử chọn kích thước tồn tại
        alert('Please select a size before adding to cart.'); //
        return;
    }

    if (isNaN(quantity) || quantity < 1) {
        alert('Quantity must be a positive number.'); //
        return;
    }

    const products = getProducts(); //
    const productToAdd = products.find(p => p.id === productId); //

    if (productToAdd) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]'); //

        // Tạo một đối tượng item cho giỏ hàng
        const newItem = {
            id: productToAdd.id, //
            name: productToAdd.name, //
            price: productToAdd.price, //
            image: productToAdd.image, // Lưu ảnh chính
            size: size, //
            quantity: quantity //
        };

        // Kiểm tra nếu sản phẩm với cùng ID và SIZE đã có trong giỏ hàng
        const existingItemIndex = cart.findIndex(item => item.id === newItem.id && item.size === newItem.size); //

        if (existingItemIndex > -1) {
            // Nếu đã có, cập nhật số lượng
            cart[existingItemIndex].quantity += newItem.quantity; //
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            cart.push(newItem); //
        }

        localStorage.setItem('cart', JSON.stringify(cart)); //
        alert('Product added to cart successfully!'); //
        // Tùy chọn: Chuyển hướng đến trang giỏ hàng hoặc cập nhật biểu tượng giỏ hàng nhỏ
        // window.location.href = 'cart.html';
    } else {
        alert('No product found with the given ID.'); //
    }
}

function loadRelatedProducts() {
    const products = getProducts(); // Lấy tất cả sản phẩm
    const currentProductId = parseInt(new URLSearchParams(window.location.search).get('product_id')); //

    // Lọc bỏ sản phẩm hiện tại và chọn ngẫu nhiên một vài sản phẩm khác
    const relatedProducts = products.filter(p => p.id !== currentProductId) //
                                    .sort(() => 0.5 - Math.random()) // Xáo trộn
                                    .slice(0, 4); // Lấy tối đa 4 sản phẩm liên quan

    const relatedContainer = document.getElementById('related-container'); //
    if (!relatedContainer) return; //
    relatedContainer.innerHTML = ''; //

    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = '<p style="text-align: center; color: #888;">No related products found.</p>'; //
        return;
    }

    relatedProducts.forEach(product => {
        const productCard = document.createElement('div'); //
        productCard.classList.add('product-card'); // Giả sử có kiểu product-card
        productCard.innerHTML = `
            <a href="product.html?product_id=${product.id}">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
            </a>
        `; //
        relatedContainer.appendChild(productCard); //
    });
}