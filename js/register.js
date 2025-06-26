function validateRegister() {
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;

  // Kiểm tra các trường không được bỏ trống
  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return false;
  }

  // Kiểm tra định dạng email đơn giản
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // Kiểm tra mật khẩu và xác nhận mật khẩu có giống nhau
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  // Mật khẩu tối thiểu 6 ký tự
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return false;
  }

  alert("Registration successful! You can now log in.");
  window.location.href = "login.html"; // Chuyển sang trang đăng nhập
  return false; // Ngăn form submit reload trang
}