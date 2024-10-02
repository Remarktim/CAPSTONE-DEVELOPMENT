const dataByYear = {
  2023: [180, 70, 120, 50, 40, 90, 150, 110, 140, 80, 40, 60],
  2022: [200, 80, 130, 70, 50, 100, 170, 120, 150, 90, 60, 80],
  2021: [150, 60, 110, 40, 30, 80, 130, 90, 120, 70, 50, 40],
};

const labelsByYear = {
  2023: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  2022: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  2021: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

let selectedYear = "2023"; // Default year
let chartData = dataByYear[selectedYear];
let chartLabels = labelsByYear[selectedYear];

const ctx = document.getElementById("barChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: chartLabels,
    datasets: [
      {
        label: "Total",
        data: chartData,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  },
});

document.getElementById("yearSelect").addEventListener("change", function () {
  selectedYear = this.value;
  chartData = dataByYear[selectedYear];
  chartLabels = labelsByYear[selectedYear];

  // Update the chart with the data for the selected year
  chart.data.labels = chartLabels;
  chart.data.datasets[0].data = chartData;
  chart.update();

  // Update the total display
  const totalSum = chartData.reduce((acc, curr) => acc + curr, 0);
  document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;
});

function updateChart() {
  const startDateInput = document.getElementById("startDateInput").value;
  const endDateInput = document.getElementById("endDateInput").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (startDateInput && endDateInput && startDate <= endDate) {
    const startMonthIndex = startDate.getMonth();
    const endMonthIndex = endDate.getMonth();

    const filteredData = chartData.slice(startMonthIndex, endMonthIndex + 1);
    const filteredLabels = chartLabels.slice(startMonthIndex, endMonthIndex + 1);

    let totalSum = 0;
    for (let i = 0; i < filteredData.length; i++) {
      totalSum += filteredData[i];
    }

    chart.data.labels = filteredLabels;
    chart.data.datasets[0].data = filteredData;
    chart.update();

    document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;
  } else {
    document.getElementById("totalDisplay").innerText = `Invalid Date Range`;
  }
}

function clearDates() {
  chart.data.labels = chartLabels;
  chart.data.datasets[0].data = chartData;
  chart.update();

  const totalSum = chartData.reduce((acc, curr) => acc + curr, 0);
  document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;

  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
}

window.onload = function () {
  const totalSum = chartData.reduce((acc, curr) => acc + curr, 0);
  document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;
};

document.getElementById("dropdownToggle").addEventListener("click", function () {
  const dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.classList.toggle("hidden");
});
