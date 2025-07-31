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
document.addEventListener('DOMContentLoaded', () => {
    // Tải header và footer nếu bạn đang sử dụng chung
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }
    renderCartItems(); // Gọi hàm render giỏ hàng khi DOMContentLoaded

    // Lấy nút "Proceed to Checkout"
    const checkoutButton = document.querySelector('.checkout-button'); //

    // Thêm sự kiện click cho nút
    if (checkoutButton) { //
        checkoutButton.addEventListener('click', () => { //
            const cart = getCart(); // Lấy dữ liệu giỏ hàng hiện tại

            if (cart.length > 0) { // Nếu giỏ hàng có sản phẩm
                // Đây là nơi bạn sẽ thêm logic xử lý thanh toán
                // Ví dụ: chuyển hướng đến trang thanh toán, gửi dữ liệu lên server, vv.
               
                // Hoặc: window.location.href = 'checkout_page.html'; // Chuyển hướng đến trang thanh toán

                // Sau khi thanh toán thành công, bạn có thể xóa giỏ hàng
                // saveCart([]); // Xóa giỏ hàng khỏi localStorage
                // renderCartItems(); // Cập nhật hiển thị giỏ hàng trống

            } else { // Nếu giỏ hàng trống
                alert('Your cart is empty. Please add items before proceeding to checkout.'); //
            }
        });
    } else { //
        console.error('Checkout button not found.'); //
    }
});
// === Render tóm tắt giỏ hàng trong modal ===
function renderCartSummaryInModal() {
    const cart = getCart();
    const modalItemsSummary = document.getElementById('modal-cart-items-summary');
    const modalSubtotal = document.getElementById('modal-subtotal');
    const modalShipping = document.getElementById('modal-shipping');
    const modalGrandTotal = document.getElementById('modal-grand-total');
    const qrAmountDisplay = document.getElementById('qr-amount-display');
    const codAmountDisplay = document.getElementById('cod-amount-display');

    if (!modalItemsSummary || !modalSubtotal || !modalShipping || !modalGrandTotal || !qrAmountDisplay || !codAmountDisplay) {
        console.error("One or more modal summary elements not found.");
        return;
    }

    modalItemsSummary.innerHTML = ''; // Clear existing summary

    let subtotal = 0;
    const shippingCost = 5.00; // Phí ship cố định ví dụ

    if (cart.length === 0) {
        modalItemsSummary.innerHTML = '<p>Your cart is empty.</p>';
        modalSubtotal.textContent = '$0.00';
        modalGrandTotal.textContent = '$0.00';
        qrAmountDisplay.textContent = '$0.00';
        codAmountDisplay.textContent = '$0.00';
        // Vô hiệu hóa nút Confirm Order nếu giỏ hàng trống
        document.getElementById('confirm-order-button').disabled = true;
        return;
    } else {
        document.getElementById('confirm-order-button').disabled = false;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        modalItemsSummary.appendChild(itemDiv);
    });

    const grandTotal = subtotal + shippingCost;

    modalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    modalShipping.textContent = `$${shippingCost.toFixed(2)}`;
    modalGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
    qrAmountDisplay.textContent = `$${grandTotal.toFixed(2)}`;
    codAmountDisplay.textContent = `$${grandTotal.toFixed(2)}`;
}

// ===  Xử lý chuyển đổi phương thức thanh toán ===
function handlePaymentMethodChange() {
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const qrSection = document.getElementById('qr-code-section');
    const codSection = document.getElementById('cod-section');
    // const cardSection = document.getElementById('card-section'); // Nếu có thêm phần Credit Card

    paymentOptions.forEach(radio => {
        radio.addEventListener('change', (event) => {
            qrSection.style.display = 'none';
            codSection.style.display = 'none';
            // if (cardSection) cardSection.style.display = 'none'; // Ẩn tất cả

            if (event.target.value === 'qr') {
                qrSection.style.display = 'block';
            } else if (event.target.value === 'cod') {
                codSection.style.display = 'block';
            }
            // else if (event.target.value === 'card') {
            //     if (cardSection) cardSection.style.display = 'block';
            // }
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Tải header và footer
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }
    renderCartItems(); // Gọi hàm render giỏ hàng khi DOMContentLoaded

    // Lấy các phần tử modal
    const paymentModal = document.getElementById('payment-modal');
    const checkoutButton = document.querySelector('.checkout-button');
    const closeButton = document.querySelector('.close-button');
    const confirmOrderButton = document.getElementById('confirm-order-button');

    // === Logic cho nút "Proceed to Checkout" (Hiển thị modal) ===
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length > 0) {
                renderCartSummaryInModal(); // Cập nhật tóm tắt đơn hàng trong modal
                paymentModal.style.display = 'flex'; // Hiển thị modal (dùng 'flex' để căn giữa)
                // Đảm bảo phương thức COD được chọn mặc định khi mở modal
                document.querySelector('input[name="paymentMethod"][value="cod"]').checked = true;
                document.getElementById('cod-section').style.display = 'block';
                document.getElementById('qr-code-section').style.display = 'none';

            } else {
                alert('Your cart is empty. Please add items before proceeding to checkout.');
            }
        });
    } else {
        console.error('Checkout button not found.');
    }

    // === Logic cho nút đóng modal ===
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            paymentModal.style.display = 'none'; // Ẩn modal
        });
    }

    // Đóng modal khi click ra ngoài (ngoại trừ click vào nội dung modal)
    if (paymentModal) {
        paymentModal.addEventListener('click', (event) => {
            if (event.target === paymentModal) {
                paymentModal.style.display = 'none';
            }
        });
    }

    // === Logic cho nút "Confirm Order" (Xác nhận đơn hàng) ===
    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', () => {
            const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            // Ở đây bạn sẽ thêm logic xử lý đơn hàng thực tế
            // Ví dụ: gửi thông tin đơn hàng và phương thức thanh toán lên server
            // Xóa giỏ hàng và chuyển hướng đến trang xác nhận/cảm ơn
            alert(`Order confirmed! Payment method: ${selectedPaymentMethod}. (This is a demo, no real transaction occurred.)`);
            
            saveCart([]); // Xóa giỏ hàng
            renderCartItems(); // Cập nhật hiển thị giỏ hàng
            paymentModal.style.display = 'none'; // Đóng modal
            // Optional: Chuyển hướng đến trang cảm ơn
            // window.location.href = 'thank_you_page.html';
        });
    }

    // Khởi tạo xử lý thay đổi phương thức thanh toán
    handlePaymentMethodChange();
});