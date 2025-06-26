// Lấy giỏ hàng từ localStorage hoặc tạo mới
function getCart() {
  const cart = localStorage.getItem("shoppingCart");
  return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

// Hiển thị giỏ hàng lên bảng
function renderCart() {
  const cart = getCart();
  const tbody = document.querySelector("#cart-table tbody");
  const emptyMsg = document.getElementById("empty-cart-message");

  tbody.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    return;
  } else {
    emptyMsg.style.display = "none";
  }

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><button onclick="removeFromCart(${index})">Remove</button></td>
    `;

    tbody.appendChild(tr);
  });
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Gọi khi trang load
window.addEventListener("DOMContentLoaded", () => {
  updateNavBar();
  renderCart();
});
//Them san pham vao gio hang
function addToCart(productName) {
  let cart = getCart();

  // Tìm xem sản phẩm đã có trong giỏ chưa
  const index = cart.findIndex(item => item.name === productName);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    // Giá giả định cho ví dụ (bạn có thể thay đổi hoặc thêm giá thật)
    const priceMap = {
      "Summer Dress": 29.99,
      "Denim Jacket": 49.99
    };

    cart.push({ name: productName, quantity: 1, price: priceMap[productName] || 0 });
  }

  saveCart(cart);
  alert(productName + " has been added to your cart!");
}