// js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    // Tải header và footer nếu bạn đang sử dụng chung
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }
    renderCartItems(); // Gọi hàm render giỏ hàng khi DOMContentLoaded
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItems() {
    const cart = getCart();
    const cartTableBody = document.getElementById('cart-items-body');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartTableBody || !cartTotalElement) {
        console.error('Missing cart table body or cart total element in cart.html');
        return;
    }

    cartTableBody.innerHTML = ''; // Xóa các mặt hàng cũ
    let total = 0;

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Your cart is empty.</td></tr>';
    } else {
        cart.forEach(item => {
            const row = cartTableBody.insertRow();
            row.dataset.itemId = item.id; // Lưu ID sản phẩm vào data attribute
            row.dataset.itemSize = item.size; // Lưu size sản phẩm vào data attribute để xác định duy nhất item

            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;"></td>
                <td>${item.name}</td>
                <td>${item.size !== 'One Size' ? item.size : 'Mặc định'}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-item-id="${item.id}" data-item-size="${item.size}" style="width: 60px;">
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="remove-item-btn" data-item-id="${item.id}" data-item-size="${item.size}">Delete</button></td>
            `;
            total += item.price * item.quantity;
        });
    }

    cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // Gán lại các sự kiện sau khi render
    addCartEventListeners();
}

function addCartEventListeners() {
    // Sự kiện cho input số lượng
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', updateItemQuantity);
    });

    // Sự kiện cho nút xóa
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

function updateItemQuantity(event) {
    const itemId = parseInt(event.target.dataset.itemId);
    const itemSize = event.target.dataset.itemSize;
    const newQuantity = parseInt(event.target.value);

    if (isNaN(newQuantity) || newQuantity < 1) {
        alert('Số lượng không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 1.');
        event.target.value = event.target.defaultValue; // Đặt lại giá trị ban đầu
        return;
    }

    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId && item.size === itemSize);

    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart(cart);
        renderCartItems(); // Render lại giỏ hàng để cập nhật tổng cộng và subtotal
    }
}

function removeItemFromCart(event) {
    const itemId = parseInt(event.target.dataset.itemId);
    const itemSize = event.target.dataset.itemSize;

    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        let cart = getCart();
        cart = cart.filter(item => !(item.id === itemId && item.size === itemSize)); // Lọc bỏ item cần xóa
        saveCart(cart);
        renderCartItems(); // Render lại giỏ hàng sau khi xóa
    }
}