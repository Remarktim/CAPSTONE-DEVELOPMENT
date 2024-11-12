function prefetchPage(url) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
}

window.onload = function () {
  window.scrollTo(0, 0);
};

//Chatbot
function chatBot() {
  return {
    messages: [],
    botTyping: false,
    isChatActive: false,
    csrfToken: "{{ csrf_token }}",

    startChat() {
      this.isChatActive = true;
      this.messages = [];
      this.messages.push({
        from: "bot",
        text: "Hi! I'm PangoBot Ask me anything about the Palawan Pangolin!",
        timestamp: new Date().getTime(),
      });
    },

    formatMessage(text) {
      return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    },

    async updateChat(inputElement) {
      const messageText = inputElement.value;
      if (messageText.trim() !== "") {
        // Add user message
        this.messages.push({
          from: "user",
          text: messageText,
          timestamp: new Date().getTime(),
        });

        inputElement.value = "";
        this.botTyping = true;

        try {
          const response = await fetch("/chat/send_message/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": this.csrfToken,
            },
            body: JSON.stringify({ message: messageText }),
          });

          const data = await response.json();

          if (data && data.status === "success" && data.response) {
            this.messages.push({
              from: "bot",
              text: data.response,
              timestamp: new Date().getTime(),
            });
          } else {
            this.messages.push({
              from: "bot",
              text: "Sorry, something went wrong. Please try again.",
              timestamp: new Date().getTime(),
            });
          }
        } catch (error) {
          console.error("Error:", error);
          this.messages.push({
            from: "bot",
            text: "Sorry, something went wrong. Please try again.",
            timestamp: new Date().getTime(),
          });
        }

        this.botTyping = false;

        // Scroll to bottom
        setTimeout(() => {
          const messagesDiv = document.getElementById("messages");
          if (messagesDiv) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
        }, 100);
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
document.addEventListener("DOMContentLoaded", function () {
  const element = document.getElementById("animated-number");
  element.classList.add("animate-slide-from-up");

  setTimeout(() => {
    element.classList.remove("animate-slide-from-up");
  }, 1000);
});

var typed = new Typed("#typing", {
  strings: ["Guardians of the Palawan Pangolin Guild", "GPPG"],
  typeSpeed: 50,
  backSpeed: 50,
  backDelay: 1000,
  loop: true,
  cursorChar: "",
  autoInsertCss: true,
  startDelay: 0,
  smartBackspace: true,
});
