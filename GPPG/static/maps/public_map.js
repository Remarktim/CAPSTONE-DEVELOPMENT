var highlight;
var selectedFeature = null;
var dataLoaded = false;
var mapRendered = false;

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

function checkLoadingComplete() {
  if (dataLoaded && mapRendered) {
    hideLoading();
  }
}

// Your existing loading functions remain the same
function showLoading() {
  const loadingElement = document.getElementById("loading-animation");
  if (loadingElement) {
    loadingElement.classList.remove("hidden");
    loadingElement.innerHTML = '<div class="flex items-center absolute mt-10 inset-1 justify-center"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div></div>';
  }
}

function hideLoading() {
  const loadingElement = document.getElementById("loading-animation");
  if (loadingElement) {
    loadingElement.classList.add("hidden");
    loadingElement.innerHTML = "";
    mapElement.classList.remove("hidden");
  }
}

showLoading();

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
let maxIncidents = 0;
// Fetch region data from API and populate Datamap
async function fetchRegionData() {
  try {
    const response = await fetch("/get-region-data/");
    const data = await response.json();
    Datamap = data;

    maxIncidents = Math.max(
      ...Object.values(Datamap).map(
        (region) => region.dead + region.alive + region.scales + region.illegalTrades
      )
    );
    dataLoaded = true;
    checkLoadingComplete();
  } catch (error) {
    Datamap = {};
    dataLoaded = true;
    checkLoadingComplete();
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
      const regionData = Datamap[clusterName];
  
      if (!regionData) {
        return new ol.style.Style({
          stroke: new ol.style.Stroke({ color: "#4b3621", width: 0.5 }), // Darker stroke color
          fill: new ol.style.Fill({ color: "rgba(200, 200, 200, 0.3)" }),
        });
      }
  
      const totalIncidents = regionData.dead + regionData.alive + regionData.scales + regionData.illegalTrades;
      const normalizedIntensity = Math.min(totalIncidents / maxIncidents, 1);
      const greenShade = 255 - Math.round(144 * normalizedIntensity);
      const fillColor = `rgba(0, ${greenShade}, 0, 0.3)`;
  
      return new ol.style.Style({
        stroke: new ol.style.Stroke({ color: "#4b3621", width: 0.5 }), // Darker stroke color
        fill: new ol.style.Fill({ color: fillColor }),
      });
    },
  });
  
  

  vectorLayer.getSource().on("featuresloadend", function () {
    dataLoaded = true;
    checkLoadingComplete();
  });

  vectorLayer.getSource().on("featuresloaderror", function (error) {
    console.error("Error loading features:", error);
    const loadingElement = document.getElementById("loading-animation");
    if (loadingElement) {
      loadingElement.innerHTML = '<div class="text-red-500">Error loading map data</div>';
    }
    dataLoaded = true; // Mark as loaded even on error
    checkLoadingComplete();
  });

  map.addLayer(vectorLayer);

  map.on("rendercomplete", function () {
    mapRendered = true;
    checkLoadingComplete();
  });

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
    } else {
      removeOverlay();
    }
  });
});

let chartInstance; // Store chart instance globally

// Donut chart rendering function
function drawDonutChart(regionName, dataMap) {
  const overlayElement = overlay.getElement();
  const data = dataMap[regionName];

  // Calculate total incidents and the region percentage
  const totalIncidentsPalawan = calculateTotalIncidents(dataMap);
  const regionTotal = data ? data.dead + data.alive + data.scales + data.illegalTrades : 0;
  const regionPercentage = totalIncidentsPalawan ? ((regionTotal / totalIncidentsPalawan) * 100).toFixed(2) : 0;

  // Build overlay HTML structure
  overlayElement.innerHTML = `
    <div class="bg-white p-5 rounded-2xl relative shadow-lg">
  <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
  
  <div class="info-container mb-5 text-center">
    <p class="font-bold text-lg">${regionName}</p>
    <div class="text-sm mt-2">
      <p class="font-semibold">Poaching Incidents Recorded:</p>
      <p class="text-2xl font-bold text-orange-600">${regionTotal}</p>
    </div>
    <p class="text-gray-600 mt-1"><b>${regionPercentage}%</b> of total incidents</p>
  </div>
  
  <div class="chart-container mt-5">
    <canvas id="donutChart" width="220" height="220"></canvas>
  </div>
</div>

  `;

  // Draw the chart only if there's data
  if (data) {
    const ctx = document.getElementById("donutChart").getContext("2d");

    // Destroy existing chart instance if any to prevent overlapping
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Render new chart instance
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
                return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
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
  } else {
    const chartContainer = overlayElement.querySelector(".chart-container");
    chartContainer.innerHTML = `<p class="text-center text-gray-600">No data available</p>`;
  }
}

function calculateTotalIncidents(dataMap) {
  let total = 0;
  for (const region in dataMap) {
    const regionData = dataMap[region];
    total += regionData.dead + regionData.alive + regionData.scales + regionData.illegalTrades;
  }
  return total;
}

function removeOverlay() {
  overlay.setPosition(undefined);
  featureOverlay.getSource().clear();
  highlight = null;
  selectedFeature = null;
}
