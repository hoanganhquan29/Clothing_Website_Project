/*=====================Home page function=========================*/
function addToCart(productName) {
  alert(productName + " has been added to your cart!");
}
// Hamburger menu functionality
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
  const navLinks = document.getElementById("nav-links"); 
  const greeting = document.getElementById("user-greeting"); 

  if (!navLinks) {
      console.warn("nav-links element not found. Header might not be loaded yet.");
      return;
  }

  if (user) {
    navLinks.innerHTML = `
      <li><a href="home_page.html">Home</a></li>
      <li><a href="home_page.html#products">Shop</a></li>
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
      <li><a href="home_page.html">Home</a></li>
      <li><a href="home_page.html#products">Shop</a></li>
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

    return true;
  } catch (error) {
    console.error(`Không thể tải ${filePath}:`, error);
    return false; 
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

    // Newsletter subscription handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission
            alert("You have successfully subscribed!"); // Display success message
            newsletterForm.reset(); // Clear the form fields
        });
    }
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
function logout() {
  localStorage.removeItem("loggedInUser"); // Remove user from local storage
  updateNavBar(); // Update the navigation bar to show logged-out links
  window.location.href = "index.html"; // Redirect to the home page or login page
}
// Add this to script.js or a <script> tag in home_page.html
document.addEventListener('DOMContentLoaded', () => {
    // Assuming loadHeaderFooter exists and loads your common header/footer HTML
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    } else {
        console.warn('loadHeaderFooter function not found. Header/footer placeholders might not be loaded.');
    }

    // Only call renderHomePageProducts if the current page is home_page.html
    if (document.getElementById('product-list')) {
        renderHomePageProducts();
    }
});

function getProducts() {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
}

function renderHomePageProducts() {
    const productListDiv = document.getElementById('product-list');
    if (!productListDiv) return;

    const products = getProducts();
    productListDiv.innerHTML = ''; // Clear existing products

    if (products.length === 0) {
        productListDiv.innerHTML = '<p style="text-align: center; color: #888;">No products available at the moment. Please check back later!</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', product.category); // Add category for filtering
        productCard.innerHTML = `
            <a href="product.html?product_id=${product.id}">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
            </a>
        `;
        productListDiv.appendChild(productCard);
    });

    // Re-apply filters if any were active (you'd need to store active filter in localStorage/sessionStorage)
    // For simplicity, this example just re-renders all.
}

// Update your filterProducts function (if you have one) to work with dynamic products
function filterProducts(event, category) {
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.category-bar button');
    buttons.forEach(button => button.classList.remove('active'));
    // Add active class to the clicked button
    event.target.classList.add('active');

    const products = document.querySelectorAll('.product-list .product-card');
    products.forEach(product => {
        if (category === 'all' || product.classList.contains(category)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}
function loadFeaturedProducts() {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) {
    console.error("Products grid element not found.");
    return;
  }

  const productsJSON = localStorage.getItem('products');
  let products = [];

  if (productsJSON) {
    try {
      products = JSON.parse(productsJSON);
    } catch (e) {
      console.error("Error parsing products from localStorage:", e);
      return;
    }
  } else {
    console.warn("No products found in localStorage.");
  }

  // Lấy chỉ 3 sản phẩm đầu tiên
  const featuredProducts = products.slice(0, 3);

  if (featuredProducts.length === 0) {
    productsGrid.innerHTML = '<p>No featured products to display yet. Check back soon!</p>';
    return;
  }

  productsGrid.innerHTML = ''; // Xóa nội dung hiện có

  featuredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const productLink = document.createElement('a');
    productLink.href = `product.html?product_id=${product.id}`;

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.name;

    const productName = document.createElement('h3');
    productName.textContent = product.name;

    const productPrice = document.createElement('p');
    productPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;

    productLink.appendChild(productImage);
    productLink.appendChild(productName);
    productLink.appendChild(productPrice);

    productCard.appendChild(productLink);
    productsGrid.appendChild(productCard);
  });
}

document.addEventListener('DOMContentLoaded', loadFeaturedProducts);