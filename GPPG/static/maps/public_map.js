var highlight;
var selectedFeature = null;

function removeHighlight() {
  featureOverlay.getSource().clear();
  overlay.setPosition(undefined);
  selectedFeature = null;
}

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
  }
}

// Calculate min, max, and ranges for all clusters
const Datamap = {
  "North Palawan": { dead: 1, alive: 2, scales: 5, illegalTrades: 1 },
  "Central Palawan": { dead: 10000, alive: 30000, scales: 15000, illegalTrades: 5000 },
  "South Palawan": { dead: 20000, alive: 40000, scales: 20000, illegalTrades: 8000 },
};

function calculateDataRanges() {
  let totals = [];
  for (const region in Datamap) {
    const data = Datamap[region];
    const total = data.dead + data.alive + data.scales + data.illegalTrades;
    totals.push({ region, total });
  }
  totals.sort((a, b) => a.total - b.total);
  return {
    lowest: totals[0],
    middle: totals[1],
    highest: totals[2],
  };
}

const dataRanges = calculateDataRanges();

// Function to get cluster style based on data
function getClusterStyle(feature) {
  const clusterName = feature.get("Cluster");
  const data = Datamap[clusterName];

  if (!data)
    return new ol.style.Style({
      fill: new ol.style.Fill({ color: "rgba(229, 231, 235, 0.3)" }),
      stroke: new ol.style.Stroke({ color: "#9ca3af", width: 1 }),
    });

  const total = data.dead + data.alive + data.scales + data.illegalTrades;
  let fillColor, strokeColor;

  if (total === dataRanges.highest.total) {
    fillColor = "rgba(34, 197, 94, 0.7)";
    strokeColor = "#15803d";
  } else if (total === dataRanges.middle.total) {
    fillColor = "rgba(34, 197, 94, 0.5)";
    strokeColor = "#16a34a";
  } else {
    fillColor = "rgba(34, 197, 94, 0.3)";
    strokeColor = "#22c55e";
  }

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: fillColor }),
    stroke: new ol.style.Stroke({ color: strokeColor, width: 1 }),
  });
}

// Create vector source with loading strategy
var vectorSource = new ol.source.Vector({
  url: "/api/palawan-data/",
  format: new ol.format.GeoJSON(),
  strategy: ol.loadingstrategy.all,
});

// Create vector layer with dynamic styling
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: getClusterStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

// Initialize map
var map = new ol.Map({
  target: "map",
  layers: [vectorLayer],
  view: new ol.View({
    center: ol.proj.fromLonLat([118.7384, 9.8349]),
    zoom: 7.5,
    minZoom: 7,
    maxZoom: 18,
  }),
});

// Show loading state
showLoading();

// Handle load complete
vectorSource.on("featuresloadend", function () {
  hideLoading();
});

var overlay = new ol.Overlay({
  element: document.createElement("div"),
  positioning: "bottom-center",
  stopEvent: true,
  offset: [0, -10],
});
map.addOverlay(overlay);

var highlightStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "#059669",
    width: 2,
  }),
  fill: new ol.style.Fill({
    color: "rgba(5, 150, 105, 0.3)",
  }),
});

var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: highlightStyle,
});

// Add interaction handlers
map.on("pointermove", function (evt) {
  if (selectedFeature) {
    return;
  }

  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  handleFeatureInteraction(feature, evt.coordinate);
});

map.on("click", function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    selectedFeature = feature;
    handleFeatureInteraction(feature, evt.coordinate);
  }
});

function handleFeatureInteraction(feature, coordinate) {
  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
      const properties = feature.getProperties();
      const regionName = properties.Cluster || "Unknown Region";
      const data = Datamap[regionName];
      const total = data ? data.dead + data.alive + data.scales + data.illegalTrades : 0;

      overlay.getElement().innerHTML = `
                <div class="bg-white p-5 rounded-2xl relative shadow-lg">
                    <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
                    <p class="mb-2 font-bold">${regionName}</p>
                    <p class="mb-3 text-sm">Total Incidents: ${total.toLocaleString()}</p>
                    <canvas id="donutChart" width="220" height="220"></canvas>
                </div>
            `;
      overlay.setPosition(coordinate);
      drawDonutChart(regionName);
    } else {
      overlay.setPosition(undefined);
    }
    highlight = feature;
  }
}

function drawDonutChart(highlightRegion) {
  const ctx = document.getElementById("donutChart").getContext("2d");
  if (ctx) {
    const data = Datamap[highlightRegion];
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Dead", "Alive", "Scales", "Illegal Trades"],
        datasets: [
          {
            data: [data.dead, data.alive, data.scales, data.illegalTrades],
            backgroundColor: [
              "#ef4444", // Dead - red
              "#22c55e", // Alive - green
              "#84cc16", // Scales - lime green
              "#15803d", // Illegal Trades - dark green
            ],
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
            formatter: (value, context) => {
              const total = data.dead + data.alive + data.scales + data.illegalTrades;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value}%`;
            },
            font: {
              weight: "semibold",
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}

function removeOverlay() {
  overlay.setPosition(undefined);
  featureOverlay.getSource().clear();
  highlight = null;
  selectedFeature = null;
}
