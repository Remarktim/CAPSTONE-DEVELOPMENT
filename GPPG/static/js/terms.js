// Get the modal, buttons, and checkbox elements
const modal = document.getElementById("terms-modal");
const openButton = document.getElementById("terms-button");
const agreeButton = document.getElementById("agree-button");
const checkbox = document.getElementById("terms-checkbox");

// Function to open the modal
openButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

// Function to close the modal and check the checkbox
agreeButton.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  checkbox.checked = true; // Automatically check the checkbox
});

// Optional: Close the modal if user clicks outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});
