var highlight;
var selectedFeature = null;

function removeHighlight() {
  featureOverlay.getSource().clear();
  overlay.setPosition(undefined);
  selectedFeature = null;
}

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

showLoading();

map.on("rendercomplete", function () {
  hideLoading();
});

const Datamap = {
  "North Palawan": { dead: 15000, alive: 50000, scales: 25000, illegalTrades: 10000 },
  "Central Palawan": { dead: 10000, alive: 30000, scales: 15000, illegalTrades: 5000 },
  "South Palawan": { dead: 20000, alive: 40000, scales: 20000, illegalTrades: 8000 },
};

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

var overlay = new ol.Overlay({
  element: document.createElement("div"),
  positioning: "bottom-center",
  stopEvent: true,
  offset: [0, -10],
});
map.addOverlay(overlay);

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

map.on("pointermove", function (evt) {
  if (selectedFeature) {
    return;
  }

  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
      const properties = feature.getProperties();
      const regionName = properties.Cluster || "Unknown Region";
      overlay.getElement().innerHTML = `
        <div class="bg-white p-5 rounded-2xl relative">
          <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
          <p class="mb-5 font-bold">${regionName}</p>
          <canvas id="donutChart" width="220" height="220"></canvas>
        </div>
      `;
      overlay.setPosition(evt.coordinate);
      drawDonutChart(regionName);
    } else {
      overlay.setPosition(undefined);
    }
    highlight = feature;
  }
});

map.on("click", function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    selectedFeature = feature;
    featureOverlay.getSource().clear();
    featureOverlay.getSource().addFeature(feature);
    const properties = feature.getProperties();
    const regionName = properties.Cluster || "Unknown Region";
    overlay.getElement().innerHTML = `
      <div class="bg-white p-5 rounded-2xl relative">
        <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
        <p class="mb-5 font-bold">${regionName}</p>
        <canvas id="donutChart" width="220" height="220"></canvas>
      </div>
    `;
    overlay.setPosition(evt.coordinate);
    drawDonutChart(regionName);
  }
});

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
              "#ffa500",
              "#008000",
              "#8b4513",
              "#a52a2a",
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
                return `${context.label}: ${percentage}%`;
              },
            },
          },
          datalabels: {
            color: "white",
            formatter: (value, context) => {
              const total = data.dead + data.alive + data.scales + data.illegalTrades;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${value} `;
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