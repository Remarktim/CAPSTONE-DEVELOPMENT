// Line Chart Code for User Account Chart
// const userAccountCtx = document.getElementById("UserAccountChart").getContext("2d");

// const dataByYear = {
//   "This Year": [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 82, 90],
//   "Last Year": [28, 48, 40, 19, 86, 27, 90, 55, 70, 85, 89, 95],
// };

// const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// const yearSelected = document.getElementById("yearSelect");
// Object.keys(dataByYear).forEach((year) => {
//   const option = document.createElement("option");
//   option.value = year;
//   option.textContent = year;
//   yearSelected.appendChild(option);
// });

// let selectedYear = Object.keys(dataByYear)[0];

// let userAccountGradient = userAccountCtx.createLinearGradient(0, 0, 0, 400);
// userAccountGradient.addColorStop(0, "rgba(255, 159, 64, 0.6)");
// userAccountGradient.addColorStop(1, "rgba(75, 192, 192, 0)");

// const userAccountChartConfig = {
//   type: "line",
//   data: {
//     labels: labels,
//     datasets: [
//       {
//         label: selectedYear,
//         data: dataByYear[selectedYear],
//         fill: true,
//         backgroundColor: userAccountGradient,
//         borderColor: "rgba(255, 159, 64, 1)",
//         tension: 0.4,
//         pointRadius: 3,
//         pointBackgroundColor: "rgba(255, 159, 64, 0.6)",
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           color: "black",
//         },
//         grid: {
//           display: false,
//         },
//       },
//       x: {
//         ticks: {
//           color: "black",
//         },
//         grid: {
//           display: false,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//   },
// };

// let userAccountChart = new Chart(userAccountCtx, userAccountChartConfig);

// yearSelected.addEventListener("change", function () {
//   selectedYear = this.value;
//   userAccountChart.data.datasets[0].data = dataByYear[selectedYear];
//   userAccountChart.data.datasets[0].label = selectedYear;
//   userAccountChart.update();
// });

// Bar and Line Chart Code for Pangolin Chart
const barChartCtx = document.getElementById("PangolinChart").getContext("2d");

const initialData = [180, 70, 120, 50, 40, 90, 150, 110, 140, 80, 40, 60];
const initialLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getBarThickness() {
  return window.innerWidth <= 600 ? 20 : 50;
}

let barChart = new Chart(barChartCtx, {
  type: "bar",
  data: {
    labels: initialLabels,
    datasets: [
      {
        type: "bar",
        data: initialData,
        backgroundColor: "#C1A682",
        borderColor: "#C1A682",
        borderWidth: 1,
        barThickness: getBarThickness(),
        borderRadius: 10,
        order: 2,
      },
      {
        type: "line",
        data: initialData,
        borderColor: "#C1A682",
        borderWidth: 2,
        pointBackgroundColor: "#C1A682",
        pointBorderColor: "#C1A682",
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.3,
        order: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "black",
          maxTicksLimit: 5,
          stepSize: Math.ceil(Math.max(...initialData) / 4),
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
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  },
});

const totalElement = document.getElementById("totalDisplay");
let initialTotal = initialData.reduce((acc, curr) => acc + curr, 0);
if (totalElement) {
  totalElement.textContent = `Total: ${initialTotal}`;
}

function updateChart() {
  const startDateInput = document.getElementById("startDateInput").value;
  const endDateInput = document.getElementById("endDateInput").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);
  const totalElement = document.getElementById("totalDisplay");

  if (startDateInput && endDateInput && startDate <= endDate) {
    const startMonthIndex = startDate.getMonth();
    const endMonthIndex = endDate.getMonth();

    const filteredData = initialData.slice(startMonthIndex, endMonthIndex + 1);
    const filteredLabels = initialLabels.slice(startMonthIndex, endMonthIndex + 1);

    const totalSum = filteredData.reduce((acc, curr) => acc + curr, 0);

    barChart.data.labels = filteredLabels;
    barChart.data.datasets[0].data = filteredData;
    barChart.data.datasets[1].data = filteredData;

    barChart.options.scales.y.ticks.stepSize = Math.ceil(Math.max(...filteredData) / 4);

    barChart.update();

    if (totalElement) {
      totalElement.textContent = `Total: ${totalSum}`;
    }
  } else if (totalElement) {
    totalElement.textContent = "Invalid Date Range";
  }
}

function clearDates() {
  const totalElement = document.getElementById("totalDisplay");

  barChart.data.labels = initialLabels;
  barChart.data.datasets[0].data = initialData;
  barChart.data.datasets[1].data = initialData;

  barChart.options.scales.y.ticks.stepSize = Math.ceil(Math.max(...initialData) / 4);

  barChart.update();

  const totalSum = initialData.reduce((acc, curr) => acc + curr, 0);
  if (totalElement) {
    totalElement.textContent = `Total: ${totalSum}`;
  }

  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
}

window.onload = function () {
  const totalElement = document.getElementById("totalDisplay");
  const totalSum = initialData.reduce((acc, curr) => acc + curr, 0);
  if (totalElement) {
    totalElement.textContent = `Total: ${totalSum}`;
  }
};
