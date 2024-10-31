//############################################################################################################
// Data for Website Views
const WebsiteViews_ChartData = {
  thisYear: {
    labels: ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Sep", "Nov", "Dec"],
    data: [50, 60, 80, 10, null, 120, 140, 160, 180],
  },
  lastYear: {
    labels: ["Jan", "Mar", "Apr", "May", "Jul", "Sep", "Oct", "Dec"],
    data: [40, 70, 100, 110, null, 130, 150, 170],
  },
};

function WebsiteViews_sumData(data) {
  return data.reduce((sum, value) => sum + (value !== null ? value : 0), 0);
}

const thisYearSum = WebsiteViews_sumData(WebsiteViews_ChartData.thisYear.data);
const lastYearSum = WebsiteViews_sumData(WebsiteViews_ChartData.lastYear.data);

const WebsiteViews_PieData = {
  labels: ["This Year", "Last Year"],
  datasets: [
    {
      data: [thisYearSum, lastYearSum],
      backgroundColor: ["rgba(63,7,3)", "rgba(255, 159, 64, 1)"],
      borderWidth: 0,
    },
  ],
};

const WebsiteViews_ctx = document.getElementById("yearPieChart").getContext("2d");
const WebsiteViews_pieChart = new Chart(WebsiteViews_ctx, {
  type: "pie",
  data: WebsiteViews_PieData,
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = thisYearSum + lastYearSum;
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return tooltipItem.label + ": " + value + " (" + percentage + "%)";
          },
        },
      },
      datalabels: {
        color: "#fff",
        formatter: function (value, context) {
          const total = thisYearSum + lastYearSum;
          const percentage = ((value / total) * 100).toFixed(2);
          return value + " (" + percentage + "%)";
        },
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
  },
  plugins: [ChartDataLabels],
});

//############################################################################################################
// Bar Chart for Poaching
const PoachingChart_ctx = document.getElementById("PoachingChart").getContext("2d");

// Function to get responsive bar thickness
function getBarThickness() {
    return window.innerWidth <= 600 ? 15 : 30;
}

// Global chart instance
let barChart = null;

// Initial data and labels
let initialData, initialLabels;

// Function to initialize or update the chart
function initializeChart(chartData, labels) {
    // Create or update the chart
    if (!barChart) {
        // Create new chart
        barChart = new Chart(PoachingChart_ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    data: chartData,
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1,
                    barThickness: getBarThickness(),
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: "black",
                            precision: 0
                        },
                        grid: { 
                            display: false 
                        },
                    },
                    x: {
                        ticks: { 
                            color: "black" 
                        },
                        grid: { 
                            display: false 
                        },
                    },
                },
                plugins: {
                    legend: { 
                        display: false
                    },
                },
                animation: {
                    duration: 1000,
                    easing: "easeInOutQuart",
                },
            },
        });
    } else {
        // Update existing chart
        barChart.data.labels = labels;
        barChart.data.datasets[0].data = chartData;
        barChart.update();
    }

    // Calculate and display total
    const totalSum = chartData.reduce((acc, curr) => acc + curr, 0);
    document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;
}

// Function to fetch chart data
async function fetchChartData() {
    try {
        const response = await fetch('/get-chart-data/');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Sum up incidents for each month across all statuses
        const monthlyTotals = data.alive_trend.overall.map((_, monthIndex) => 
            Object.values(data).reduce((total, statusData) => 
                total + statusData.overall[monthIndex], 0)
        );

        // Store initial data and labels
        initialData = monthlyTotals;
        initialLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return monthlyTotals;
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return new Array(12).fill(0);
    }
}

// Function to update chart with date filtering
async function updateChart() {
    const startDateInput = document.getElementById("startDateInput").value;
    const endDateInput = document.getElementById("endDateInput").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    try {
        if (startDateInput && endDateInput && startDate <= endDate) {
            const startMonthIndex = startDate.getMonth();
            const endMonthIndex = endDate.getMonth();

            const filteredData = initialData.slice(startMonthIndex, endMonthIndex + 1);
            const filteredLabels = initialLabels.slice(startMonthIndex, endMonthIndex + 1);

            // Update chart with filtered data
            initializeChart(filteredData, filteredLabels);
        } else {
            document.getElementById("totalDisplay").innerText = `Invalid Date Range`;
        }
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// Function to clear dates and reset chart
async function clearDates() {
    // Reset date inputs
    document.getElementById("startDateInput").value = "";
    document.getElementById("endDateInput").value = "";

    // Update chart with full data
    initializeChart(initialData, initialLabels);
}

// Initialize chart on page load
window.addEventListener('load', async function () {
    try {
        const initialData = await fetchChartData();
        initializeChart(initialData, initialLabels);
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
});

// Responsive chart resizing
window.addEventListener('resize', function() {
    if (barChart) {
        barChart.resize();
    }
});

//############################################################################################################
// Line Chart Code for Illegal Trades
const userAccountCtx = document.getElementById("IllegalTrade_Chart").getContext("2d");

const dataByYear = {
  "This Year": [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 82, 90],
  "Last Year": [28, 48, 40, 19, 86, 27, 90, 55, 70, 85, 89, 95],
};

const IllegalTrade_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const yearSelect = document.getElementById("yearSelect");
Object.keys(dataByYear).forEach((year) => {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
});

let selectedYear = Object.keys(dataByYear)[0];

let userAccountGradient = userAccountCtx.createLinearGradient(0, 0, 0, 400);
userAccountGradient.addColorStop(0, "rgba(255, 159, 64, 0.6)");
userAccountGradient.addColorStop(1, "rgba(75, 192, 192, 0)");

const userAccountChartConfig = {
  type: "line",
  data: {
    labels: IllegalTrade_labels,
    datasets: [
      {
        label: selectedYear,
        data: dataByYear[selectedYear],
        fill: true,
        backgroundColor: userAccountGradient,
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

let userAccountChart = new Chart(userAccountCtx, userAccountChartConfig);

yearSelect.addEventListener("change", function () {
  selectedYear = this.value;
  userAccountChart.data.datasets[0].data = dataByYear[selectedYear];
  userAccountChart.data.datasets[0].label = selectedYear;
  userAccountChart.update();
});

//############################################################################################################
// Bar two Chart Code for Dead and alive
const DeadAliveChart_ctx = document.getElementById("DeadAliveChart").getContext("2d");

const DeadAlive_dataThisYear = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Alive",
      data: [12, 19, 3, 5, 2, 3, 7, 10, 13, 9, 8, 14],
      backgroundColor: "rgba(63,7,3)",
      borderColor: "rgba(63,7,3)",
      borderWidth: 1,
      borderRadius: 10,
    },
    {
      label: "Dead",
      data: [5, 9, 13, 15, 12, 8, 5, 14, 10, 11, 9, 13],
      backgroundColor: "rgb(251, 146, 60)",
      borderColor: "rgb(249, 115, 22)",
      borderWidth: 1,
      borderRadius: 10,
    },
  ],
};

const DeadAlive_dataLastYear = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Alive",
      data: [15, 10, 8, 12, 7, 14, 9, 6, 5, 11, 8, 10],
      backgroundColor: "rgba(63,7,3)",
      borderColor: "rgba(63,7,3)",
      borderWidth: 1,
      borderRadius: 10,
    },
    {
      label: "Dead",
      data: [7, 12, 10, 5, 8, 7, 9, 13, 12, 9, 6, 11],
      backgroundColor: "rgb(251, 146, 60)",
      borderColor: "rgb(249, 115, 22)",
      borderWidth: 1,
      borderRadius: 10,
    },
  ],
};

let DeadAlive_currentChart = new Chart(DeadAliveChart_ctx, {
  type: "bar",
  data: DeadAlive_dataThisYear,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          padding: 30,
          usePointStyle: true,
          color: "black",
        },
      },
    },
  },
});

document.getElementById("DeadAlive_yearSelector").addEventListener("change", function () {
  const selectedYear = this.value;
  const container = document.getElementById("container");

  if (selectedYear === "thisYear") {
    DeadAlive_currentChart.data = DeadAlive_dataThisYear;
  } else {
    DeadAlive_currentChart.data = DeadAlive_dataLastYear;
  }

  DeadAlive_currentChart.update();
});

//############################################################################################################
// Horizontal Chart for Found Scales

const FoundScales_ctx = document.getElementById("FoundScales_horizontalBarChart").getContext("2d");

const FoundScales_dataThisYear = [65, 0, 80, 81, 0, 55, 40, 0, 0, 50, 0, 20];
const FoundScales_dataLastYear = [0, 48, 0, 19, 86, 1, 90, 2, 0, 30, 0, 40];
const FoundScales_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Filter function to remove months with no data
function FoundScales_filterData(data, labels) {
  const filteredData = [];
  const filteredLabels = [];

  data.forEach((value, index) => {
    if (value !== 0) {
      // Only keep months with non-zero data
      filteredData.push(value);
      filteredLabels.push(labels[index]);
    }
  });

  return { filteredData, filteredLabels };
}

let FoundScales_filteredThisYear = FoundScales_filterData(FoundScales_dataThisYear, FoundScales_labels);
let FoundScales_filteredLastYear = FoundScales_filterData(FoundScales_dataLastYear, FoundScales_labels);

let chartData = {
  labels: FoundScales_filteredThisYear.filteredLabels,
  datasets: [
    {
      label: "This Year",
      data: FoundScales_filteredThisYear.filteredData,
      backgroundColor: "rgb(251, 146, 60)",
      borderRadius: 10,
    },
  ],
};

const config = {
  type: "bar",
  data: chartData,
  options: {
    indexAxis: "y",
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        ticks: {
          color: "black",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

const horizontalBarChart = new Chart(FoundScales_ctx, config);

function horizontalBar_updateChart(selectedYear) {
  if (selectedYear === "thisYearData") {
    horizontalBarChart.data.labels = FoundScales_filteredThisYear.filteredLabels;
    horizontalBarChart.data.datasets[0].data = FoundScales_filteredThisYear.filteredData;
    horizontalBarChart.data.datasets[0].label = "This Year";
    horizontalBarChart.data.datasets[0].backgroundColor = "rgb(251, 146, 60)";
  } else if (selectedYear === "lastYearData") {
    horizontalBarChart.data.labels = FoundScales_filteredLastYear.filteredLabels;
    horizontalBarChart.data.datasets[0].data = FoundScales_filteredLastYear.filteredData;
    horizontalBarChart.data.datasets[0].label = "Last Year";
    horizontalBarChart.data.datasets[0].backgroundColor = "rgb(251, 146, 60)";
  }

  horizontalBarChart.update(); // Update the chart with new data
}

// Add event listener to the dropdown
document.getElementById("FoundScales_yearSelect").addEventListener("change", function () {
  const selectedYear = this.value;
  horizontalBar_updateChart(selectedYear);
});
