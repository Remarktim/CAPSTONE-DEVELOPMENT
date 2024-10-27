document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    modal: document.getElementById("authModal"),
    flipCard: document.querySelector(".flip-card"),
    flipToSignup: document.getElementById("flipToSignup"),
    flipToSignin: document.getElementById("flipToSignin"),
    loginBtn: document.getElementById("loginBtn"),
    aboutBtn: document.getElementById("aboutBtn"),
    signInCloseBtn: document.getElementById("SignIn_closeBtn"),
    signUpCloseBtn: document.getElementById("SignUp_closeBtn"),
    signInForm: document.getElementById("signInForm"),
    signUpForm: document.getElementById("signUpForm"),
    termsLink: document.getElementById("termsLink"),
    termsText: document.getElementById("termsText"),
    termsCheckbox: document.getElementById("termsCheckbox"),
    submitButton: document.getElementById("submitButton"),
    passwordInput: document.getElementById("password"),
    confirmPasswordInput: document.getElementById("confirmPassword"),
    passwordError: document.getElementById("passwordError"),
    signUpError: document.getElementById("signUpError"),
    firstNameInput: document.getElementById("firstName"),
    lastNameInput: document.getElementById("lastName"),
    emailSignupInput: document.getElementById("email_signup"),
    phoneInput: document.getElementById("SignUp_phoneNum"),
    loginError: document.getElementById("loginError"),
    email_login: document.getElementById("email_login"),
    passwords: document.getElementById("passwords"),
    buttonText: document.getElementById("signUpButtonText"),
    buttonSpinner: document.getElementById("signUpButtonSpinner"),
    loginButtonText: document.getElementById("loginButtonText"),
    loginButtonSpinner: document.getElementById("loginButtonSpinner"),
    loginSubmitBtn: document.querySelector("#signInForm button[type='submit']"),
  };

  //######################################################################################
  // Sign in
  elements.email_login?.addEventListener("input", function () {
    this.classList.remove("border-red-500");
    clearError(elements.loginError);
    validateLoginFields();
  });

  elements.passwords?.addEventListener("input", function () {
    this.classList.remove("border-red-500");
    clearError(elements.loginError);
    validateLoginFields();
  });

  const validators = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone) => /^[0-9]{11}$/.test(phone),
    password: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password),
  };

  function showError(message, errorElement = elements.signUpError) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }

  function clearError(errorElement = elements.signUpError) {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  }

  function resetForms() {
    elements.signInForm?.reset();
    elements.signUpForm?.reset();
    clearError();
    clearError(elements.loginError);
    elements.email_login?.classList.remove("border-red-500");
    elements.passwords?.classList.remove("border-red-500");
  }

  function closeModal() {
    elements.modal?.classList.add("hidden");
    resetForms();
  }

  const signUpFields = [elements.firstNameInput, elements.lastNameInput, elements.emailSignupInput, elements.phoneInput, elements.passwordInput, elements.confirmPasswordInput];

  signUpFields.forEach((field) => {
    field?.addEventListener("input", function () {
      this.classList.remove("border-red-500");

      if (signUpFields.every((f) => f?.value.trim())) {
        clearError();
      }

      if (this === elements.emailSignupInput && this.value && !validators.email(this.value)) {
        showError("Please enter a valid email address");
        this.classList.add("border-red-500");
      } else if (this === elements.phoneInput && this.value && !validators.phone(this.value)) {
        showError("Please enter a valid 11-digit phone number");
        this.classList.add("border-red-500");
      } else if (this === elements.passwordInput && this.value && !validators.password(this.value)) {
        showError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
        this.classList.add("border-red-500");
      } else if (this === elements.confirmPasswordInput) {
        validatePasswords();
      }
    });
  });

  elements.flipToSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    elements.flipCard?.classList.add("flipped");
  });

  elements.flipToSignin?.addEventListener("click", (e) => {
    e.preventDefault();
    elements.flipCard?.classList.remove("flipped");
  });

  elements.loginBtn?.addEventListener("click", () => elements.modal?.classList.remove("hidden"));
  elements.aboutBtn?.addEventListener("click", () => elements.modal?.classList.remove("hidden"));
  elements.signInCloseBtn?.addEventListener("click", closeModal);
  elements.signUpCloseBtn?.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === elements.modal) closeModal();
  });

  elements.termsLink?.addEventListener("click", (e) => {
    e.preventDefault();
    elements.termsText?.classList.toggle("hidden");
  });

  elements.termsCheckbox?.addEventListener("change", function () {
    if (this.checked) {
      elements.submitButton?.removeAttribute("disabled");
      elements.submitButton?.classList.remove("bg-gray-400", "cursor-not-allowed");
      elements.submitButton?.classList.add("bg-black", "hover:bg-gray-900");
    } else {
      elements.submitButton?.setAttribute("disabled", "true");
      elements.submitButton?.classList.remove("bg-black", "hover:bg-gray-900");
      elements.submitButton?.classList.add("bg-gray-400", "cursor-not-allowed");
    }
  });

  function validateLoginFields() {
    const emailFilled = elements.email_login?.value.trim();
    const passwordFilled = elements.passwords?.value.trim();

    if (emailFilled && passwordFilled) {
      elements.loginSubmitBtn?.removeAttribute("disabled");
      elements.loginSubmitBtn?.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      elements.loginSubmitBtn?.setAttribute("disabled", "true");
      elements.loginSubmitBtn?.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  function validatePasswords() {
    if (!elements.passwordInput || !elements.confirmPasswordInput) return false;
    const isValid = elements.passwordInput.value === elements.confirmPasswordInput.value;
    elements.passwordError?.classList.toggle("hidden", isValid);
    elements.confirmPasswordInput.classList.toggle("border-red-500", !isValid);
    return isValid;
  }

  elements.passwordInput?.addEventListener("input", function () {
    if (this.value && !validators.password(this.value)) {
      this.classList.add("border-red-500");
      showError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
    } else {
      this.classList.remove("border-red-500");
      clearError();
    }
    validatePasswords();
  });

  elements.phoneInput?.addEventListener("input", function () {
    if (this.value && !validators.phone(this.value)) {
      this.classList.add("border-red-500");
      showError("Please enter a valid 11-digit phone number");
    } else {
      this.classList.remove("border-red-500");
      clearError();
    }
  });

  elements.emailSignupInput?.addEventListener("input", function () {
    if (this.value && !validators.email(this.value)) {
      this.classList.add("border-red-500");
      showError("Please enter a valid email address");
    } else {
      this.classList.remove("border-red-500");
      clearError();
    }
  });

  // Form validation
  // Validate login form
  function validateLoginForm() {
    clearError(elements.loginError);

    // Reset border colors
    elements.email_login.classList.remove("border-red-500");
    elements.passwords.classList.remove("border-red-500");

    let isValid = true;
    let errorMessage = [];

    if (!elements.email_login.value.trim()) {
      elements.email_login.classList.add("border-red-500");
      errorMessage.push("Email is required");
      isValid = false;
    }

    if (!elements.passwords.value.trim()) {
      elements.passwords.classList.add("border-red-500");
      errorMessage.push("Password is required");
      isValid = false;
    }

    if (!isValid) {
      showError(errorMessage.join(" and "), elements.loginError);
    }

    return isValid;
  }
  // Validate Sign Up form
  function validateForm() {
    clearError();

    const requiredFields = [
      { field: elements.firstNameInput, name: "First name" },
      { field: elements.lastNameInput, name: "Last name" },
      { field: elements.emailSignupInput, name: "Email" },
      { field: elements.phoneInput, name: "Phone number" },
      { field: elements.passwordInput, name: "Password" },
      { field: elements.confirmPasswordInput, name: "Confirm password" },
    ];

    // Check required fields
    for (const { field, name } of requiredFields) {
      if (!field?.value.trim()) {
        showError(`${name} is required`);
        field.classList.add("border-red-500");
        return false;
      }
      field.classList.remove("border-red-500");
    }

    if (!validators.email(elements.emailSignupInput?.value)) {
      showError("Please enter a valid email address");
      elements.emailSignupInput?.classList.add("border-red-500");
      return false;
    }

    if (!validators.phone(elements.phoneInput?.value)) {
      showError("Please enter a valid 11-digit phone number");
      elements.phoneInput?.classList.add("border-red-500");
      return false;
    }

    if (!validators.password(elements.passwordInput?.value)) {
      showError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
      elements.passwordInput?.classList.add("border-red-500");
      return false;
    }

    if (!validatePasswords()) return false;

    if (!elements.termsCheckbox?.checked) {
      showError("Please accept the terms and conditions");
      return false;
    }

    return true;
  }

  elements.signUpForm?.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    elements.buttonText?.classList.add("hidden");
    elements.buttonSpinner?.classList.remove("hidden");
    elements.submitButton.disabled = true;

    try {
      const response = await fetch("/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: elements.firstNameInput?.value.trim(),
          last_name: elements.lastNameInput?.value.trim(),
          email: elements.emailSignupInput?.value.trim(),
          password: elements.passwordInput?.value,
          contact: elements.phoneInput?.value.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        elements.signUpForm?.reset();
        window.location.href = "/home/";
      } else {
        showError(data.message || "An error occurred during signup");
      }
    } catch (error) {
      showError("An error occurred. Please try again.");
    } finally {
      elements.buttonText?.classList.remove("hidden");
      elements.buttonSpinner?.classList.add("hidden");
      elements.submitButton.disabled = false;
    }
  });

  elements.signInForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    const csrftoken = getCookie("csrftoken");

    elements.loginButtonText.classList.add("hidden");
    elements.loginButtonSpinner.classList.remove("hidden");

    try {
      const response = await fetch("/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({
          email: elements.email_login.value,
          password: elements.passwords.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/home/";
      } else {
        showError("Check your email and password", elements.loginError);
      }
    } catch (error) {
      showError("Check your email and password.", elements.loginError);
    } finally {
      elements.loginButtonText.classList.remove("hidden");
      elements.loginButtonSpinner.classList.add("hidden");
    }
  });
});
