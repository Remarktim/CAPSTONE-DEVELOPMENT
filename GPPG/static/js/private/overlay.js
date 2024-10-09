const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const Aboutss = document.getElementById("Aboutss");
const closeBtn = document.getElementById("closeBtn");
const closeBtns = document.getElementById("closeBtns");

const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");

loginBtn.addEventListener("click", function () {
  modal.classList.remove("hidden");
});

Aboutss.addEventListener("click", function () {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
  resetForms();
});

closeBtns.addEventListener("click", function () {
  modal.classList.add("hidden");
  resetForms();
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
    resetForms();
  }
});

function resetForms() {
  signInForm.reset();
  signUpForm.reset();
}

document.getElementById("termsLink").addEventListener("click", function (event) {
  event.preventDefault();
  var termsText = document.getElementById("termsText");

  if (termsText.classList.contains("hidden")) {
    termsText.classList.remove("hidden");
  } else {
    termsText.classList.add("hidden");
  }
});

document.getElementById("termsCheckbox").addEventListener("change", function () {
  var submitButton = document.getElementById("submitButton");
  if (this.checked) {
    submitButton.removeAttribute("disabled");
    submitButton.classList.remove("bg-gray-400", "cursor-not-allowed");
    submitButton.classList.add("bg-black", "hover:bg-gray-900");
  } else {
    submitButton.setAttribute("disabled", "true");
    submitButton.classList.remove("bg-black", "hover:bg-gray-900");
    submitButton.classList.add("bg-gray-400", "cursor-not-allowed");
  }
});
