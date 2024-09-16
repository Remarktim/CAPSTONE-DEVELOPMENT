const dataByRegion = {
  mimaropa: [0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Data for Mimaropa
  region1: [1, 0, 3, 2, 1, 0, 0, 0, 1, 1, 0, 0], // Data for Region 1
  region2: [0, 0, 0, 1, 1, 0, 2, 3, 1, 0, 0, 0], // Data for Region 2
};

// Function to dynamically update the total incidents and region incidents
function updateIncidentCounts(chart) {
  const totalIncidents = chart.data.datasets[0].data.reduce(
    (acc, value) => acc + value,
    0
  ); // Sum of all data points
  const regionIncidents = chart.data.datasets[0].data.filter(
    (value) => value > 0
  ).length; // Non-zero months

  // Update the HTML elements dynamically
  document.getElementById(
    "totalIncidents"
  ).innerText = `Total Poaching Incidents: ${totalIncidents}`;
  document.getElementById(
    "regionIncidents"
  ).innerText = `Incidents: ${regionIncidents}`;
}

// Function to update the chart data dynamically based on selected region
function updateChartData(region) {
  const regionData = dataByRegion[region]; // Get the hardcoded data for the selected region

  // Update chart data dynamically
  poachingChart.data.datasets[0].data = regionData;
  poachingChart.update();

  // Update the region title
  document.getElementById("regionTitle").innerText =
    region.charAt(0).toUpperCase() + region.slice(1);

  // Dynamically update the total and region-specific incidents based on the chart data
  updateIncidentCounts(poachingChart);
}

// Initialize the Chart.js chart
const ctx = document.getElementById("poachingChart").getContext("2d");
const poachingChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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
document
  .getElementById("regionSelect")
  .addEventListener("change", function (e) {
    const selectedRegion = e.target.value;
    updateChartData(selectedRegion);
  });

// Load initial data for the default region (Mimaropa)
updateChartData("mimaropa");
