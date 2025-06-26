function validateLogin() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return false;
  }

  //Giả lập đăng nhập thành công
  localStorage.setItem("loggedInUser", username);

  // Chuyển hướng sau khi login
  window.location.href = "profile.html";

  return false; // ngăn reload trang
}