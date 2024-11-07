
// Initialize map and overlay elements

var highlight;
var selectedFeature = null;
var map = new ol.Map({
  target: "map",
  layers: [],
  view: new ol.View({
    center: ol.proj.fromLonLat([118.7384, 9.8349]),
    zoom: 7.5,
    minZoom: 7,
    maxZoom: 18,
  }),
});

// Loading animation functions
function showLoading() {
  const loadingElement = document.getElementById("loading-animation");
  const mapElement = document.getElementById("map");
  if (loadingElement && mapElement) {
    loadingElement.classList.remove("hidden");
    loadingElement.innerHTML =
      '<div class="flex items-center absolute mt-10 inset-1 justify-center "><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div></div>';
  }
}

function hideLoading() {
  const loadingElement = document.getElementById("loading-animation");
  const mapElement = document.getElementById("map");
  if (loadingElement && mapElement) {
    loadingElement.classList.add("hidden");
    loadingElement.innerHTML = "";
    mapElement.classList.remove("hidden");
  }
}

showLoading();
map.on("rendercomplete", hideLoading);

// Function to remove highlight and overlay
function removeHighlight() {
  featureOverlay.getSource().clear();
  overlay.setPosition(undefined);
  selectedFeature = null;
}

// Overlay to display details on hover/click
var overlay = new ol.Overlay({
  element: document.createElement("div"),
  positioning: "bottom-center",
  stopEvent: true,
  offset: [0, -10],
});
map.addOverlay(overlay);

// Feature overlay for highlight effect
var highlightStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "#ff0000",
    width: 0.5,
  }),
  fill: new ol.style.Fill({
    color: "rgba(255, 0, 0, 0.1)",
  }),
});
var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: highlightStyle,
});


let Datamap = {}; // Global variable to store fetched data

// Fetch region data from API and populate Datamap
async function fetchRegionData() {
  try {
    const response = await fetch('/get-region-data/');
    const data = await response.json();
    console.log("Fetched data from API:", data); // Debugging line
    Datamap = data; // Assign the fetched data to Datamap
  } catch (error) {
    console.error("Failed to fetch region data:", error);
    Datamap = {}; // Assign an empty object if fetching fails
  }
}



// Fetch data and initialize map features
fetchRegionData().then(() => {
  if (Object.keys(Datamap).length === 0) {
    console.warn("No data available in Datamap. Map initialization halted.");
    return;
  }

  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: "/static/maps/ClusterOfPalawan_filtereds.geojson",
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
      const clusterName = feature.get("Cluster");
      feature.set("data", Datamap[clusterName] || "No data available");

      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "#ff8c00",
          width: 0.5,
        }),
        fill: new ol.style.Fill({
          color: "rgba(255, 140, 0, 0.3)",
        }),
      });
    },
  });

  map.addLayer(vectorLayer);

  map.on("pointermove", function (evt) {
    if (selectedFeature) return;

    var feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

    if (feature !== highlight) {
      if (highlight) featureOverlay.getSource().removeFeature(highlight);
      if (feature) {
        featureOverlay.getSource().addFeature(feature);
        const regionName = feature.get("Cluster") || "Unknown Region";
        overlay.getElement().innerHTML = `
          <div class="bg-white p-5 rounded-2xl relative">
            <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
            <p class="mb-5 font-bold">${regionName}</p>
            <canvas id="donutChart" width="220" height="220"></canvas>
          </div>
        `;
        overlay.setPosition(evt.coordinate);
        drawDonutChart(regionName, Datamap);
      } else {
        overlay.setPosition(undefined);
      }
      highlight = feature;
    }
  });

  map.on("click", function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

    if (feature) {
      selectedFeature = feature;
      featureOverlay.getSource().clear();
      featureOverlay.getSource().addFeature(feature);
      const regionName = feature.get("Cluster") || "Unknown Region";
      overlay.getElement().innerHTML = `
        <div class="bg-white p-5 rounded-2xl relative">
          <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
          <p class="mb-5 font-bold">${regionName}</p>
          <canvas id="donutChart" width="220" height="220"></canvas>
        </div>
      `;
      overlay.setPosition(evt.coordinate);
      drawDonutChart(regionName, Datamap);
    }
  });
});

let chartInstance; // Store chart instance globally

// Donut chart rendering function
function drawDonutChart(regionName, dataMap) {
  const ctx = document.getElementById("donutChart").getContext("2d");
  const data = dataMap[regionName];

  // Debugging data
  console.log("Drawing chart for region:", regionName);
  console.log("Data for region:", data);

  if (!data) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
    ctx.font = "16px Arial";
    ctx.fillText("No data available", 50, 110);
    return;
  }

  // Destroy existing chart instance to avoid overlapping
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Dead", "Alive", "Scales", "Illegal Trades"],
      datasets: [
        {
          data: [data.dead, data.alive, data.scales, data.illegalTrades],
          backgroundColor: ["#ffa500", "#008000", "#8b4513", "#a52a2a"],
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 10,
            usePointStyle: true,
            color: "#000",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = data.dead + data.alive + data.scales + data.illegalTrades;
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${context.label}: ${percentage}%`;
            },
          },
        },
        datalabels: {
          color: "white",
          formatter: (value) => `${value}`,
          font: { weight: "semibold" },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

function removeOverlay() {
  overlay.setPosition(undefined);
  featureOverlay.getSource().clear();
  highlight = null;
  selectedFeature = null;
}

