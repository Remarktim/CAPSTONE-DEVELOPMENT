const initialData = [180, 70, 120, 50, 40, 90, 150, 110, 140, 80, 40, 60];
const initialLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ctx = document.getElementById("barChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: initialLabels,
    datasets: [
      {
        label: "Total",
        data: initialData,
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

function updateChart() {
  const startDateInput = document.getElementById("startDateInput").value;
  const endDateInput = document.getElementById("endDateInput").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (startDateInput && endDateInput && startDate <= endDate) {
    const startMonthIndex = startDate.getMonth();
    const endMonthIndex = endDate.getMonth();

    const filteredData = initialData.slice(startMonthIndex, endMonthIndex + 1);
    const filteredLabels = initialLabels.slice(startMonthIndex, endMonthIndex + 1);

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
  chart.data.labels = initialLabels;
  chart.data.datasets[0].data = initialData;
  chart.update();

  let totalSum = initialData.reduce((acc, curr) => acc + curr, 0);
  document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;

  document.getElementById("startDateInput").value = "";
  document.getElementById("endDateInput").value = "";
}

window.onload = function () {
  let totalSum = initialData.reduce((acc, curr) => acc + curr, 0);
  document.getElementById("totalDisplay").innerText = `Total: ${totalSum}`;
};

document.getElementById("dropdownToggle").addEventListener("click", function () {
  const dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.classList.toggle("hidden");
});
