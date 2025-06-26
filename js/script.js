/*=====================Home page function=========================*/
function addToCart(productName) {
  alert(productName + " has been added to your cart!");
}
/*=======================Contact page function==================*/


/*========================Login page function======================*/

/*======================Profile page function=====================*/
// Kiểm tra đăng nhập khi vào profile



//================================== Xử lý hiển thị menu theo trạng thái đăng nhập===================================
function updateNavBar() {
  const user = localStorage.getItem("loggedInUser");
  const navLinks = document.getElementById("nav-links");
  const greeting = document.getElementById("user-greeting");

  if (!navLinks) return;

  if (user) {
    navLinks.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="index.html#products">Shop</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="profile.html">Profile</a></li>
      <li><a href="cart.html">My Cart</a></li>
      <li><a href="#" onclick="logout()">Logout</a></li>
    `;

    if (greeting) {
  greeting.innerHTML = `
    <img src="https://i.pravatar.cc/150?u=${user}" alt="Avatar" />
    Hi, ${user}
  `;
}

  } else {
    navLinks.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="index.html#products">Shop</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="login.html">Login</a></li>
      <li><a href="register.html">Register</a></li>
      <li><a href="cart.html">My Cart</a></li>
    `;

    if (greeting) {
      greeting.textContent = "";
    }
  }
}

// Gọi hàm sau khi trang load
window.addEventListener("DOMContentLoaded", updateNavBar);
/*=================================Register page function===============================*/

/*===================My cart page function==========================*/

/*Thanh loc san pham*/
function filterProducts(event, category) {
  if (event) event.preventDefault();

  // Toggle active button
  document.querySelectorAll('.category-bar button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Lọc sản phẩm
  const allProducts = document.querySelectorAll('.product-card');
  allProducts.forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}


