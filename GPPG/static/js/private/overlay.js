document.addEventListener("DOMContentLoaded", function () {
  // Get all required DOM elements
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
  };

  // Validation functions
  const validators = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    phone: (phone) => /^[0-9]{11}$/.test(phone),
    password: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password),
  };

  // Helper functions
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
  }

  function closeModal() {
    elements.modal?.classList.add("hidden");
    resetForms();
  }

  // Card flip handlers
  elements.flipToSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    elements.flipCard?.classList.add("flipped");
  });

  elements.flipToSignin?.addEventListener("click", (e) => {
    e.preventDefault();
    elements.flipCard?.classList.remove("flipped");
  });

  // Modal handlers
  elements.loginBtn?.addEventListener("click", () => elements.modal?.classList.remove("hidden"));
  elements.aboutBtn?.addEventListener("click", () => elements.modal?.classList.remove("hidden"));
  elements.signInCloseBtn?.addEventListener("click", closeModal);
  elements.signUpCloseBtn?.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === elements.modal) closeModal();
  });

  // Terms handlers
  elements.termsLink?.addEventListener("click", (e) => {
    e.preventDefault();
    elements.termsText?.classList.toggle("hidden");
  });

  // Terms checkbox handler
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

  // Password validation
  function validatePasswords() {
    if (!elements.passwordInput || !elements.confirmPasswordInput) return false;
    const isValid = elements.passwordInput.value === elements.confirmPasswordInput.value;
    elements.passwordError?.classList.toggle("hidden", isValid);
    elements.confirmPasswordInput.classList.toggle("border-red-500", !isValid);
    return isValid;
  }

  // Real-time validation handlers
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

    // Validate field formats
    if (!validators.email(elements.emailSignupInput.value)) {
      showError("Please enter a valid email address");
      elements.emailSignupInput.classList.add("border-red-500");
      return false;
    }

    if (!validators.phone(elements.phoneInput.value)) {
      showError("Please enter a valid 11-digit phone number");
      elements.phoneInput.classList.add("border-red-500");
      return false;
    }

    if (!validators.password(elements.passwordInput.value)) {
      showError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
      elements.passwordInput.classList.add("border-red-500");
      return false;
    }

    if (!validatePasswords()) return false;

    if (!elements.termsCheckbox.checked) {
      showError("Please accept the terms and conditions");
      return false;
    }

    return true;
  }

  // Form submission handlers
  elements.signUpForm?.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    elements.buttonText.classList.add("hidden");
    elements.buttonSpinner.classList.remove("hidden");
    elements.submitButton.disabled = true;

    try {
      const response = await fetch("/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: elements.firstNameInput.value.trim(),
          last_name: elements.lastNameInput.value.trim(),
          email: elements.emailSignupInput.value.trim(),
          password: elements.passwordInput.value,
          contact: elements.phoneInput.value.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        elements.signUpForm.reset();
        window.location.href = "/home/";
      } else {
        showError(data.message || "An error occurred during signup");
      }
    } catch (error) {
      showError("An error occurred. Please try again.");
    } finally {
      elements.buttonText.classList.remove("hidden");
      elements.buttonSpinner.classList.add("hidden");
      elements.submitButton.disabled = false;
    }
  });

  elements.signInForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get CSRF token from cookie
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
          "X-CSRFToken": csrftoken, // Add this line
        },
        credentials: "include", // Add this line
        body: JSON.stringify({
          email: elements.email_login.value,
          password: elements.passwords.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/home/";
      } else {
        showError(data.message || "Invalid credentials", elements.loginError);
      }
    } catch (error) {
      showError("Check your email and password.", elements.loginError);
    } finally {
      elements.loginButtonText.classList.remove("hidden");
      elements.loginButtonSpinner.classList.add("hidden");
    }
  });
});
