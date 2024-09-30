let chartData = function () {
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
  
        this.fetch(); // Fetch the new data based on the selected period
      },
      data: null,
      total: {
        alive: 0,
        dead: 0,
        scales: 0,
        illegal_trades: 0,
      },
      fetch: function () {
        let self = this;
  
        // Fetch data from the Django backend
        fetch(`/get-poaching-trends?period=${self.date}`)
          .then((response) => response.json())
          .then((data) => {
            self.data = {
              thisyear: {
                data: {
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  alive: data.alive || [],
                  dead: data.dead || [],
                  scales: data.scales || [],
                  illegal_trades: data.illegal_trades || [],
                },
              },
            };
  
            // Calculate totals for each category
            self.total.alive = calculateCategoryTotal(self.data[this.date].data.alive);
            self.total.dead = calculateCategoryTotal(self.data[this.date].data.dead);
            self.total.scales = calculateCategoryTotal(self.data[this.date].data.scales);
            self.total.illegal_trades = calculateCategoryTotal(self.data[this.date].data.illegal_trades);
  
            self.renderChart(); // Render the updated chart
          });
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
            tooltips: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(tooltipItem, data) {
                  let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                  let value = tooltipItem.yLabel; // Get the Y value of the point
                  return datasetLabel + ': ' + value; // Display dataset label and value
                }
              },
            },
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
  