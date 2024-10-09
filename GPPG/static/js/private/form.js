const flipCard = document.querySelector(".flip-card");
const flipToSignup = document.getElementById("flipToSignup");
const flipToSignin = document.getElementById("flipToSignin");

flipToSignup.addEventListener("click", (e) => {
  e.preventDefault();
  flipCard.classList.add("flipped");
});

flipToSignin.addEventListener("click", (e) => {
  e.preventDefault();
  flipCard.classList.remove("flipped");
});

document.getElementById("signInForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email_login").value;
  const password = document.getElementById("passwords").value;
  const loginButtonText = document.getElementById("loginButtonText");
  const loginButtonSpinner = document.getElementById("loginButtonSpinner");
  const loginSubmitButton = document.getElementById("SignIn_Submit");

  loginButtonText.classList.add("hidden");
  loginButtonSpinner.classList.remove("hidden");
  loginSubmitButton.disabled = true;

  fetch("{% url 'login' %}", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": "{{ csrf_token }}",
    },
    body: `email=${encodeURIComponent(email)}&passwords=${encodeURIComponent(password)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      loginButtonText.classList.remove("hidden");
      loginButtonSpinner.classList.add("hidden");
      loginSubmitButton.disabled = false;

      if (data.success) {
        window.location.href = "{% url 'home' %}";
      } else {
        document.getElementById("loginError").textContent = data.error;
        document.getElementById("loginError").classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      loginButtonText.classList.remove("hidden");
      loginButtonSpinner.classList.add("hidden");
      loginSubmitButton.disabled = false;
    });
});

document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const first_name = document.getElementById("first_name").value;
  const last_name = document.getElementById("last_name").value;
  const email = document.getElementById("email_signup").value;
  const phone = document.getElementById("SignUp_phoneNum").value;
  const password = document.getElementById("password").value;
  const signUpButtonText = document.getElementById("signUpButtonText");
  const signUpButtonSpinner = document.getElementById("signUpButtonSpinner");
  const signUpSubmitButton = document.getElementById("signUpSubmit");

  signUpButtonText.classList.add("hidden");
  signUpButtonSpinner.classList.remove("hidden");
  signUpSubmitButton.disabled = true;

  fetch("{% url 'signup' %}", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": "{{ csrf_token }}",
    },
    body: `first_name=${encodeURIComponent(first_name)}&last_name=${encodeURIComponent(last_name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&passwords=${encodeURIComponent(
      password
    )}`,
  })
    .then((response) => response.json())
    .then((data) => {
      signUpButtonText.classList.remove("hidden");
      signUpButtonSpinner.classList.add("hidden");
      signUpSubmitButton.disabled = false;

      if (data.success) {
        flipCard.classList.remove("flipped");
        document.getElementById("signUpForm").reset();
        document.getElementById("signUpError").classList.add("hidden");
      } else {
        document.getElementById("signUpError").textContent = data.error;
        document.getElementById("signUpError").classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      signUpButtonText.classList.remove("hidden");
      signUpButtonSpinner.classList.add("hidden");
      signUpSubmitButton.disabled = false;
    });
});
