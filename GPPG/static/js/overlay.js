const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementById("closeBtn");
const closeBtns = document.getElementById("closeBtns");

const signInForm = document.getElementById("signInForm"); // Assume form has this id
const signUpForm = document.getElementById("signUpForm"); // Assume form has this id

// Show the modal when the login button is clicked
loginBtn.addEventListener("click", function () {
  modal.classList.remove("hidden");
});

// Close the modal and reset forms when the "X" button in the Sign In section is clicked
closeBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
  resetForms();
});

// Close the modal and reset forms when the "X" button in the Sign Up section is clicked
closeBtns.addEventListener("click", function () {
  modal.classList.add("hidden");
  resetForms();
});

// Close the modal and reset forms if the user clicks outside the modal content
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
    resetForms();
  }
});

// Function to reset both forms
function resetForms() {
  signInForm.reset(); // Reset the Sign In form
  signUpForm.reset(); // Reset the Sign Up form
}
