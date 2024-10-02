const ctx = document.getElementById("poachingChart").getContext("2d");
const poachingChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Poaching Incidents",
        data: [150, 60, 180, 40, 30, 90, 170, 120, 100, 60, 50, 70],
        backgroundColor: "rgba(255, 165, 0, 0.8)",
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.5,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 200,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#fff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});
