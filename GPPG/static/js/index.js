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
          let botResponse = "";

          // Define responses based on the given conversation
          if (messageText.toLowerCase() === "hi") {
            botResponse = "Hi! How can I help you today?";
          } else if (messageText.toLowerCase() === "do you know pangolin?") {
            botResponse =
              "Yes, I know pangolins! They are fascinating creatures. \n\nDo you have a question about them, or are you just curious about them? I can tell you some interesting facts about them, like:\n\n* **They are the only mammals that are fully covered in scales.**\n* **They are shy, nocturnal animals that live in Africa and Asia.**\n* **They eat ants and termites, using their long, sticky tongues.**\n* **They are unfortunately endangered due to poaching and habitat loss.**\n\nWhat would you like to know?";
          } else if (messageText.toLowerCase() === "give me an idea about pangolin") {
            botResponse =
              "It's great that you want to help pangolins! They desperately need our support. Here's what you can do:\n\n**1. Spread Awareness:**\n\n* **Educate yourself:** Learn about pangolin threats and their importance. Share what you learn with friends and family.\n* **Use social media:** Share information about pangolin conservation, and support organizations working to protect them.\n* **Sign petitions:** Support petitions calling for stronger laws against pangolin poaching and habitat destruction.\n\n**2. Support Conservation Efforts:**\n\n* **Donate to reputable organizations:** Organizations like the World Wildlife Fund (WWF) and the International Union for Conservation of Nature (IUCN) are working to protect pangolins.\n* **Volunteer your time:** Many organizations need volunteers for various tasks, like fundraising, education, and research.\n\n**3. Be a Conscious Consumer:**\n\n* **Avoid products made from pangolin scales:** Sadly, their scales are used in traditional medicine and other markets.\n* **Choose sustainable products:** Support companies that are committed to ethical and sustainable practices, which can help protect their habitats.\n\n**4. Advocate for Change:**\n\n* **Contact your government representatives:** Urge them to support pangolin conservation policies and legislation.\n* **Support initiatives:** Help raise awareness about pangolin conservation by participating in events, campaigns, and fundraisers.\n\nRemember, even small actions can make a difference. By spreading awareness, supporting conservation, and making informed choices, we can all play a role in protecting these amazing creatures.\n\nLet me know if you'd like more information about specific organizations, initiatives, or anything else that can help you get involved!";
          } else if (messageText.toLowerCase() === "can you teach me to code?") {
            botResponse =
              "I can definitely help you learn to code! To get started, I need a little more information from you:\n\n**1. What language do you want to learn?**\n\nThere are many programming languages, each with its own strengths and uses. Some popular choices include:\n\n* **Python:** A beginner-friendly language, great for web development, data science, and automation.\n* **JavaScript:** Used for interactive web pages, front-end development, and mobile apps.\n* **Java:** A robust language for enterprise applications, Android development, and more.\n* **C++:** Powerful for game development, performance-critical applications, and systems programming.\n\n**2. What's your experience level?**\n\nAre you a complete beginner, or do you have some coding experience? Knowing this will help me tailor the learning resources and exercises to your level.\n\n**3. What are your goals?**\n\nWhat do you want to be able to do with coding? Do you want to build websites, analyze data, create games, or something else?\n\n**4. How do you want to learn?**\n\nDo you prefer interactive tutorials, coding challenges, online courses, or a combination of methods?\n\nOnce I have this information, I can point you to the best resources, provide guidance on how to get started, and even help you with specific coding concepts and problems. Let's get coding!";
          } else {
            botResponse = "I'm not sure how to respond to that. Can you ask me something else?";
          }

          this.messages.push({
            from: "bot",
            text: botResponse,
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
