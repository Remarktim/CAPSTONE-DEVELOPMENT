const cardWrapper = document.getElementById("card-wrapper");
const cards = cardWrapper.querySelectorAll(".carousel-pair");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");

let currentIndex = 0;
const totalCards = cards.length;

function calculateCardsToShow() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 720) {
    return 1;
  } else {
    return 2;
  }
}

function updateVisibleCards() {
  const cardsToShow = calculateCardsToShow();
  cards.forEach((card, index) => {
    if (index >= currentIndex && index < currentIndex + cardsToShow) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

nextButton.addEventListener("click", () => {
  const cardsToShow = calculateCardsToShow();
  currentIndex = (currentIndex + cardsToShow) % totalCards;
  updateVisibleCards();
});

prevButton.addEventListener("click", () => {
  const cardsToShow = calculateCardsToShow();
  currentIndex = (currentIndex - cardsToShow + totalCards) % totalCards;
  updateVisibleCards();
});

// Ensure the cards are updated when the window is resized
window.addEventListener("resize", updateVisibleCards);

// Initialize the first view
updateVisibleCards();
