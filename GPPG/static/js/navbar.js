// Get DOM elements
var navItems = document.getElementById("navItems");
var mobileNav = document.getElementById("mobileNav");
var hamburger = document.getElementById("hamburger");

// Function to adjust the navbar for mobile and desktop screens
function adjustNavbar() {
  let screenWidth = window.innerWidth;

  // Show hamburger and hide menu items for small screens
  if (screenWidth < 1024) {
    mobileNav.style.display = "none";
    hamburger.style.display = "flex";
  } else {
    // Show menu items and hide hamburger for large screens
    mobileNav.style.display = "flex";
    hamburger.style.display = "none";
  }
}

// Initial adjustment for the navbar
adjustNavbar();

// Adjust navbar when window is resized
window.addEventListener("resize", adjustNavbar);

// Toggle the mobile navigation menu on burger click
hamburger.addEventListener("click", function () {
  if (mobileNav.style.display === "none") {
    mobileNav.style.display = "flex"; // Show the mobile nav
  } else {
    mobileNav.style.display = "none"; // Hide the mobile nav
  }
});
