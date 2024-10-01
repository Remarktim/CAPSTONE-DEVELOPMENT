let chartData = function () {
  function calculateCategoryTotal(category) {
    return category.reduce((sum, value) => sum + value, 0);
  }

  return {
    date: "overall", // Default to overall
    options: [{ label: "Overall Trend", value: "overall" }], // Start with overall trend
    selectedOption: 0, // Default selection to the first option (overall)
    total: {
      alive: 0,
      dead: 0,
      scales: 0,
      illegal_trade: 0,
    },
    data: null,
    chart: null, // Add a property to hold the chart instance

    selectOption: function (index) {
      this.selectedOption = index; 
      this.date = this.options[index].value;
    
      // Clear chart before fetching new data to avoid confusion
      if (this.chart) {
          this.chart.destroy();
          this.chart = null; // Reset the chart instance
      }
    
      this.fetch(); 
    },
    

    // Fetch available years and set them in the dropdown
    fetchAvailableYears: function () {
      this.options = [{ label: "Overall Trend", value: "overall" }]; 

      fetch('/get-available-years')
        .then((response) => response.json())
        .then((years) => {
          // Add available years to the options
          years.forEach(year => {
            this.options.push({ label: year.toString(), value: year });
          });

          this.selectedOption = 0; 
          this.fetch(); 
        })
        .catch((error) => {
          console.error("Error fetching available years:", error);
        });
    },

    // Fetch data based on selected option
    fetch: function () {
      let self = this;
    
      // Fetch data based on the selected date (year or overall)
      fetch(`/get-poaching-trends?period=${self.date}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data); // Log the fetched data
    
          // Clear existing data and set up new data structure
          self.data = {
            overall: {
              data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                alive: data.overall_trend.alive || [],
                dead: data.overall_trend.dead || [],
                scales: data.overall_trend.scales || [],
                illegal_trade: data.overall_trend.illegal_trade || [],
              },
            },
          };
    
          // Add yearly data to self.data
          Object.keys(data.yearly_reports).forEach(year => {
            self.data[year] = {
              data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                alive: data.yearly_reports[year].alive || [],
                dead: data.yearly_reports[year].dead || [],
                scales: data.yearly_reports[year].scales || [],
                illegal_trade: data.yearly_reports[year].illegal_trade || [],
              },
            };
          });
    
          // Calculate totals for the selected year
          const selectedData = self.data[self.date];
          if (selectedData) {
            self.total.alive = calculateCategoryTotal(selectedData.data.alive);
            self.total.dead = calculateCategoryTotal(selectedData.data.dead);
            self.total.scales = calculateCategoryTotal(selectedData.data.scales);
            self.total.illegal_trade = calculateCategoryTotal(selectedData.data.illegal_trade);
          }
    
          self.renderChart(); // Render the updated chart
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      },
    

    init: function () {
      this.fetchAvailableYears();  // Fetch dropdown options first
      this.fetch();  // Fetch the initial chart data
    },

    renderChart: function () {
      if (!this.data || !this.data[this.date]) {
          console.error("Data is not available for the selected date:", this.date);
          return; // Exit the function if data is not available
      }
    
      let ctx = document.getElementById("chart").getContext("2d");
      if (!ctx) {
          console.error("Canvas context not found!");
          return;
      }
    
      // Create the new chart with the selected year's data or overall
      const selectedData = this.data[this.date].data;
      this.chart = new Chart(ctx, {
          type: "line",
          data: {
              labels: selectedData.labels,
              datasets: [
                  {
                      label: "Alive",
                      backgroundColor: "rgba(102, 126, 234, 0.25)",
                      borderColor: "rgba(102, 126, 234, 1)",
                      pointBackgroundColor: "rgba(102, 126, 234, 1)",
                      data: selectedData.alive,
                  },
                  {
                      label: "Dead",
                      backgroundColor: "rgba(255, 99, 132, 0.25)",
                      borderColor: "rgba(255, 99, 132, 1)",
                      pointBackgroundColor: "rgba(255, 99, 132, 1)",
                      data: selectedData.dead,
                  },
                  {
                      label: "Scales",
                      backgroundColor: "rgba(54, 162, 235, 0.25)",
                      borderColor: "rgba(54, 162, 235, 1)",
                      pointBackgroundColor: "rgba(54, 162, 235, 1)",
                      data: selectedData.scales,
                  },
                  {
                      label: "Illegal Trades",
                      backgroundColor: "rgba(255, 206, 86, 0.25)",
                      borderColor: "rgba(255, 206, 86, 1)",
                      pointBackgroundColor: "rgba(255, 206, 86, 1)",
                      data: selectedData.illegal_trade,
                  },
              ],
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true,
                  },
              },
          },
      });
    }
    
  };
};

// Fetch available years when the chartData object is created
let dataChart = chartData();
dataChart.init(); // Initialize the chart data fetching and setup
