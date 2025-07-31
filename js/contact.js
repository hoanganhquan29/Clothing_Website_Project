function submitContactForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in all fields.");
    return false;
  }

  alert("Thank you for your message, " + name + "! We’ll get back to you soon.");
  return false; 
}