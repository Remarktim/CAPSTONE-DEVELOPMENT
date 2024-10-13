document.addEventListener("DOMContentLoaded", function () {
  const flipCard = document.querySelector(".flip-card");
  const flipToSignup = document.getElementById("flipToSignup");
  const flipToSignin = document.getElementById("flipToSignin");

  flipToSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    flipCard.classList.add("flipped");
  });

  flipToSignin?.addEventListener("click", (e) => {
    e.preventDefault();
    flipCard.classList.remove("flipped");
  });

  const modal = document.getElementById("authModal");
  const loginBtn = document.getElementById("loginBtn");
  const aboutBtn = document.getElementById("aboutBtn"); // Assuming this should be 'aboutBtn'
  const signInCloseBtn = document.getElementById("SignIn_closeBtn");
  const signUpCloseBtn = document.getElementById("SignUp_closeBtn");

  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  loginBtn?.addEventListener("click", function () {
    modal.classList.remove("hidden");
  });

  aboutBtn?.addEventListener("click", function () {
    modal.classList.remove("hidden");
  });

  // Use a common function for closing modal and resetting forms
  function closeModal() {
    modal.classList.add("hidden");
    resetForms();
  }

  signInCloseBtn?.addEventListener("click", closeModal);
  signUpCloseBtn?.addEventListener("click", closeModal);

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  function resetForms() {
    signInForm?.reset();
    signUpForm?.reset();
  }

  const termsLink = document.getElementById("termsLink");
  const termsText = document.getElementById("termsText");

  termsLink?.addEventListener("click", function (event) {
    event.preventDefault();
    termsText?.classList.toggle("hidden");
  });

  const termsCheckbox = document.getElementById("termsCheckbox");
  const submitButton = document.getElementById("submitButton");

  termsCheckbox?.addEventListener("change", function () {
    if (this.checked) {
      submitButton?.removeAttribute("disabled");
      submitButton?.classList.remove("bg-gray-400", "cursor-not-allowed");
      submitButton?.classList.add("bg-black", "hover:bg-gray-900");
    } else {
      submitButton?.setAttribute("disabled", "true");
      submitButton?.classList.remove("bg-black", "hover:bg-gray-900");
      submitButton?.classList.add("bg-gray-400", "cursor-not-allowed");
    }
  });
});
