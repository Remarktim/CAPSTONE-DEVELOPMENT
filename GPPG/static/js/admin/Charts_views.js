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
const IllegalTradeChart_ctx = document.getElementById("IllegalTrade_Chart").getContext("2d");

const IllegalTrade_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const yearSelect = document.getElementById("yearSelect");

// Initialize the chart
let IllegalTradeGradient =  IllegalTradeChart_ctx.createLinearGradient(0, 0, 0, 400);
IllegalTradeGradient.addColorStop(0, "rgba(255, 159, 64, 0.6)");
IllegalTradeGradient.addColorStop(1, "rgba(75, 192, 192, 0)");

const IllegalTradeChartConfig = {
  type: "line",
  data: {
    labels: IllegalTrade_labels,
    datasets: [
      {
        label: "", // Will be set dynamically
        data: [], // Will be set dynamically
        fill: true,
        backgroundColor: IllegalTradeGradient,
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

let IllegalTradeChart = new Chart( IllegalTradeChart_ctx, IllegalTradeChartConfig);

function fetchDataIllegalTrade() {
  fetch(`/get-chart-data?period=overall&status=Illegal Trade`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Data:", data); // Log the full fetched data

      // Check the response structure
      if (!data || typeof data !== 'object') {
        console.error("Fetched data is not an object:", data);
        return;
      }

      // Access the correct key with bracket notation
      const trends = data["illegal trade_trend"];
      if (!trends || !trends.yearly) {
        console.error("Invalid data format. Expected 'illegal trade_trend':", data);
        return; // Exit the function if the data structure is not as expected
      }

      // Extract the years from the data response
      const years = Object.keys(trends.yearly);

      // Populate the year dropdown
      years.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });

      const selectedYear = years[0]; // Set the default selected year
      updateChart(selectedYear, trends); // Update the chart with the initial year data
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to update the chart with data for the selected year
function updateChart(year, trends) {
  const chartData = trends.yearly[year];

  if (!chartData) {
    console.error("No data available for the selected year:", year);
    return; // Exit the function if there's no data for the selected year
  }

  IllegalTradeChart.data.datasets[0].data = chartData;
  IllegalTradeChart.data.datasets[0].label = year; // Update label to show selected year
  IllegalTradeChart.update();
}

// Initialize the fetch on page load
fetchDataIllegalTrade();


yearSelect.addEventListener("change", function () {
  const selectedYear = this.value;
  fetch(`/get-chart-data?period=${selectedYear}&status=Illegal Trade`)
    .then((response) => response.json())
    .then((data) => {
      updateChart(selectedYear, data); // Update the chart with the new year data
    })
    .catch((error) => {
      console.error("Error fetching data for the selected year:", error);
    });
});


//############################################################################################################
// Bar two Chart Code for Dead and alive
const DeadAliveChartCtx = document.getElementById("DeadAliveChart").getContext("2d");

// Initialize the chart with empty data
let DeadAlive_currentChart = new Chart(DeadAliveChartCtx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Alive",
        data: [], // Will be populated dynamically
        backgroundColor: "rgba(63,7,3)",
        borderColor: "rgba(63,7,3)",
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: "Dead",
        data: [], // Will be populated dynamically
        backgroundColor: "rgb(251, 146, 60)",
        borderColor: "rgb(249, 115, 22)",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  },
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

// Fetch data from API and populate chart options dynamically
function fetchData() {
  fetch(`/get-chart-data?status=Dead,Alive&period=overall`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Data:", data);

      // Extract years and data for "Alive" and "Dead" statuses
      const aliveTrend = data["alive_trend"].yearly;
      const deadTrend = data["dead_trend"].yearly;
      const availableYears = Object.keys(aliveTrend);

      // Populate the year dropdown
      const yearSelect = document.getElementById("DeadAlive_yearSelector");
      availableYears.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });

      // Set initial data for the first available year
      updateChartData(availableYears[0], aliveTrend, deadTrend);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Update chart data for the selected year
function updateChartData(selectedYear, aliveTrend, deadTrend) {
  if (aliveTrend[selectedYear] && deadTrend[selectedYear]) {
    DeadAlive_currentChart.data.datasets[0].data = aliveTrend[selectedYear];
    DeadAlive_currentChart.data.datasets[1].data = deadTrend[selectedYear];
    DeadAlive_currentChart.update();
  } else {
    console.error("No data available for the selected year:", selectedYear);
  }
}

// Event listener for year selection
document.getElementById("DeadAlive_yearSelector").addEventListener("change", function () {
  const selectedYear = this.value;
  fetchData(); // Refresh data based on new selection
});

// Fetch data on page load
fetchData();

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
