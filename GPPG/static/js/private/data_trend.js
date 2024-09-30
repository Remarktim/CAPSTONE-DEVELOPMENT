let chartData = function () {
  function generateRandomData(length, min, max) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }

  function calculateCategoryTotal(category) {
    return category.reduce((sum, value) => sum + value, 0);
  }

  return {
    date: "thisyear",
    options: [
      { label: "This Year", value: "thisyear" },
      { label: "1 Year", value: "1year" },
      { label: "Last 2 Years", value: "2years" },
    ],
    showDropdown: false,
    selectedOption: 0,
    selectOption: function (index) {
      this.selectedOption = index;
      this.date = this.options[index].value;

      // Recalculate the totals based on the selected year/period
      this.total.alive = calculateCategoryTotal(this.data[this.date].data.alive);
      this.total.dead = calculateCategoryTotal(this.data[this.date].data.dead);
      this.total.scales = calculateCategoryTotal(this.data[this.date].data.scales);
      this.total.illegal_trades = calculateCategoryTotal(this.data[this.date].data.illegal_trades);

      this.renderChart(); // Render the updated chart
    },
    data: null,
    total: {
      alive: 0,
      dead: 0,
      scales: 0,
      illegal_trades: 0,
    },
    fetch: function () {
      // Simulate random data for each period
      let thisYearAlive = generateRandomData(12, 5, 30);
      let thisYearDead = generateRandomData(12, 10, 50);
      let thisYearScales = generateRandomData(12, 15, 40);
      let thisYearIllegalTrades = generateRandomData(12, 5, 20);

      let oneYearAgoAlive = generateRandomData(12, 20, 40);
      let oneYearAgoDead = generateRandomData(12, 20, 60);
      let oneYearAgoScales = generateRandomData(12, 10, 50);
      let oneYearAgoIllegalTrades = generateRandomData(12, 10, 30);

      let twoYearsAgoAlive = generateRandomData(2, 100, 200);
      let twoYearsAgoDead = generateRandomData(2, 150, 300);
      let twoYearsAgoScales = generateRandomData(2, 100, 250);
      let twoYearsAgoIllegalTrades = generateRandomData(2, 50, 150);

      this.data = {
        thisyear: {
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            alive: thisYearAlive,
            dead: thisYearDead,
            scales: thisYearScales,
            illegal_trades: thisYearIllegalTrades,
          },
        },
        "1year": {
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            alive: oneYearAgoAlive,
            dead: oneYearAgoDead,
            scales: oneYearAgoScales,
            illegal_trades: oneYearAgoIllegalTrades,
          },
        },
        "2years": {
          data: {
            labels: ["Year 1", "Year 2"],
            alive: twoYearsAgoAlive,
            dead: twoYearsAgoDead,
            scales: twoYearsAgoScales,
            illegal_trades: twoYearsAgoIllegalTrades,
          },
        },
      };

      // Calculate totals for the initial "This Year" period
      this.total.alive = calculateCategoryTotal(this.data[this.date].data.alive);
      this.total.dead = calculateCategoryTotal(this.data[this.date].data.dead);
      this.total.scales = calculateCategoryTotal(this.data[this.date].data.scales);
      this.total.illegal_trades = calculateCategoryTotal(this.data[this.date].data.illegal_trades);

      this.renderChart(); // Render the chart initially
    },
    renderChart: function () {
      let c = false;

      Chart.helpers.each(Chart.instances, function (instance) {
        if (instance.chart.canvas.id == "chart") {
          c = instance;
        }
      });

      if (c) {
        c.destroy();
      }

      let ctx = document.getElementById("chart").getContext("2d");

      let chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.data[this.date].data.labels,
          datasets: [
            {
              label: "Alive",
              backgroundColor: "rgba(102, 126, 234, 0.25)",
              borderColor: "rgba(102, 126, 234, 1)",
              pointBackgroundColor: "rgba(102, 126, 234, 1)",
              data: this.data[this.date].data.alive,
            },
            {
              label: "Dead",
              backgroundColor: "rgba(237, 100, 166, 0.25)",
              borderColor: "rgba(237, 100, 166, 1)",
              pointBackgroundColor: "rgba(237, 100, 166, 1)",
              data: this.data[this.date].data.dead,
            },
            {
              label: "Scales",
              backgroundColor: "rgba(34, 202, 236, 0.25)",
              borderColor: "rgba(34, 202, 236, 1)",
              pointBackgroundColor: "rgba(34, 202, 236, 1)",
              data: this.data[this.date].data.scales,
            },
            {
              label: "Illegal Trades",
              backgroundColor: "rgba(255, 159, 64, 0.25)",
              borderColor: "rgba(255, 159, 64, 1)",
              pointBackgroundColor: "rgba(255, 159, 64, 1)",
              data: this.data[this.date].data.illegal_trades,
            },
          ],
        },
        layout: {
          padding: {
            right: 10,
          },
        },
        options: {
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        },
      });
    },
  };
};
