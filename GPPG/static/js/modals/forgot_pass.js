const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const closeModal = document.getElementById("closeModal");

// Show modal when "Forgot your password?" is clicked
forgotPasswordLink.addEventListener("click", function (event) {
  event.preventDefault();
  forgotPasswordModal.classList.remove("hidden");
});

// Hide modal when "Cancel" button is clicked
closeModal.addEventListener("click", function () {
  forgotPasswordModal.classList.add("hidden");
});

// Hide modal when clicked outside modal content
window.addEventListener("click", function (event) {
  if (event.target == forgotPasswordModal) {
    forgotPasswordModal.classList.add("hidden");
  }
});
