/*=====================Home page function=========================*/
function addToCart(productName) {
  alert(productName + " has been added to your cart!");
}


// Hamburger menu functionality
// This will now be called *after* the header is loaded
function initializeHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }
}

//================================== Xử lý hiển thị menu theo trạng thái đăng nhập===================================
function updateNavBar() {
  const user = localStorage.getItem("loggedInUser");
  const navLinks = document.getElementById("nav-links"); // Assuming nav-links is inside main-nav
  const greeting = document.getElementById("user-greeting"); // Assuming user-greeting is inside the header

  if (!navLinks) {
      console.warn("nav-links element not found. Header might not be loaded yet.");
      return;
  }

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

// Hàm để tải nội dung HTML từ một file và chèn vào một phần tử
async function loadHTML(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
    // Return true on success so we can chain
    return true;
  } catch (error) {
    console.error(`Không thể tải ${filePath}:`, error);
    return false; // Return false on failure
  }
}

// Tải header và footer khi DOM đã được tải hoàn toàn
document.addEventListener('DOMContentLoaded', () => {
  loadHTML('header-placeholder', '../common/header.html')
    .then(success => {
      if (success) {
        updateNavBar(); // Call updateNavBar AFTER header is loaded
        initializeHamburgerMenu(); // Initialize hamburger menu AFTER header is loaded
      }
    });
  loadHTML('footer-placeholder', '../common/footer.html'); // Footer can load independently
});


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