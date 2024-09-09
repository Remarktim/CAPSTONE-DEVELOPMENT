window.onload = function () {
  window.scrollTo(0, 0);
};

//Chatbot
function chatBot() {
  return {
    messages: [],
    botTyping: false,
    isChatActive: false,
    showExitModal: false,

    startChat() {
      this.isChatActive = true;
    },

    exitChat() {
      this.isChatActive = false;
      this.resetChat();
      this.showExitModal = false;
    },

    // Reset chats
    resetChat() {
      this.messages = [];
    },

    updateChat(inputElement) {
      const messageText = inputElement.value;
      if (messageText.trim() !== "") {
        this.messages.push({
          from: "user",
          text: messageText,
          timestamp: new Date().getTime(),
        });

        inputElement.value = "";

        this.botTyping = true;
        setTimeout(() => {
          this.messages.push({
            from: "bot",
            text: "This is a response from the bot.",
            timestamp: new Date().getTime(),
          });
          this.botTyping = false;
        }, 1000);
      }
    },
  };
}
//################################################################

// Images
function openModal(image) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = image.src;
  modal.classList.remove("hidden");
}

function closeModal(event) {
  const modal = document.getElementById("imageModal");
  if (event.target === modal || event.type === "click") {
    modal.classList.add("hidden");
  }
}
// ################################################################

//Videos
function closeModals() {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  modalVideo.pause();
  modalVideo.src = ""; // Stop the video from playing
  modal.classList.add("hidden");
}

function openFullScreen(videoElement) {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  modalVideo.src = videoElement.src;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  modalVideo.play();
}

function closeModalsOnClickOutside(event) {
  const modal = document.getElementById("videoModal");
  const videoContainer = modal.querySelector(".relative");
  if (!videoContainer.contains(event.target)) {
    closeModals();
  }
}
// ################################################################
