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

// JavaScript for Chart.js initialization
const dataByRegion = {
  mimaropa: [0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Data for Mimaropa
  region1: [1, 0, 3, 2, 1, 0, 0, 0, 1, 1, 0, 0], // Data for Region 1
  region2: [0, 0, 0, 1, 1, 0, 2, 3, 1, 0, 0, 0], // Data for Region 2
};

// Function to dynamically update the total incidents and region incidents
function updateIncidentCounts(chart) {
  const totalIncidents = chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0); // Sum of all data points
  const regionIncidents = chart.data.datasets[0].data.filter((value) => value > 0).length; // Non-zero months

  // Update the HTML elements dynamically
  document.getElementById("totalIncidents").innerText = `Total Poaching Incidents: ${totalIncidents}`;
  document.getElementById("regionIncidents").innerText = `Incidents: ${regionIncidents}`;
}

// Function to update the chart data dynamically based on selected region
function updateChartData(region) {
  const regionData = dataByRegion[region]; // Get the hardcoded data for the selected region

  // Update chart data dynamically
  poachingChart.data.datasets[0].data = regionData;
  poachingChart.update();

  // Update the region title
  document.getElementById("regionTitle").innerText = region.charAt(0).toUpperCase() + region.slice(1);

  // Dynamically update the total and region-specific incidents based on the chart data
  updateIncidentCounts(poachingChart);
}

// Initialize the Chart.js chart
const ctx = document.getElementById("poachingChart").getContext("2d");
const poachingChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Incidents",
        data: dataByRegion.mimaropa, // Default data for Mimaropa
        borderColor: "rgba(75, 0, 0, 1)",
        backgroundColor: "rgba(75, 0, 0, 0.1)",
        borderWidth: 1,
        tension: 0.2, // Smooth the line
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
      },
    },
  },
});

// Event listener to change chart data when the region is selected
document.getElementById("regionSelect").addEventListener("change", function (e) {
  const selectedRegion = e.target.value;
  updateChartData(selectedRegion);
});

// Load initial data for the default region (Mimaropa)
updateChartData("mimaropa");

//################################################################
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
