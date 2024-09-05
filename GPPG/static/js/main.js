var navItems = document.getElementById("navItems");
var mobileNav = document.getElementById("mobileNav");
var hamburger = document.getElementById("hamburger");

function adjustNavbar() {
  screenWidth = parseInt(window.innerWidth);

  if (screenWidth < 541) {
    navItems.style.display = "none";
    hamburger.style.display = "flex";
  } else {
    navItems.style.display = "flex";
    hamburger.style.display = "none";
  }
}

adjustNavbar();

window.addEventListener("resize", adjustNavbar);

hamburger.addEventListener("click", function () {
  mobileNav.classList.toggle("left-[-70%]");
  hamburger.classList.toggle("fa-bars");
  hamburger.classList.toggle("fa-close");
});

const cardContainer = document.getElementById("card-container");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let currentIndex = 0;

nextBtn.addEventListener("click", () => {
  if (currentIndex < cardContainer.children.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = cardContainer.children.length - 1;
  }
  updateCarousel();
});

function updateCarousel() {
  cardContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  cardContainer.style.transition = "transform 0.5s ease";
}
