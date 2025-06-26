// Kiểm tra đăng nhập khi vào profile
if (window.location.pathname.includes("profile.html")) {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    alert("You must log in first.");
    window.location.href = "login.html";
  } else {
    document.getElementById("username-display").textContent = user;
  }
}

// Đăng xuất
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
}