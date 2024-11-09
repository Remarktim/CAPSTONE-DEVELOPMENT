var highlight;
var isSearching = false;
var isClickActive = false;

// Function to search for a municipality
function searchMunicipality(event) {
  event.preventDefault();
  const searchValue = document.getElementById("search-dropdown").value.toLowerCase();
  let foundFeature = null;

  // Show loading animation
  showLoading();

  vectorLayer.getSource().forEachFeature(function (feature) {
    const properties = feature.getProperties();
    const name = properties.name || properties.ADM3_EN || "";
    if (name.toLowerCase() === searchValue) {
      foundFeature = feature;
    }
  });

  if (foundFeature) {
    const geometry = foundFeature.getGeometry();
    const centroid = ol.extent.getCenter(geometry.getExtent());
    map.getView().fit(geometry.getExtent(), { duration: 1000, maxZoom: 10 });
    console.log("Zoomed to municipality:", searchValue);

    featureOverlay.getSource().clear();
    featureOverlay.getSource().addFeature(foundFeature);

    const properties = foundFeature.getProperties();
    const regionName = properties.name || properties.ADM3_EN || "Unknown Region";

    // Fetch data for the selected municipality
    fetchMunicipalityData(regionName);

    const infoElement = document.createElement("div");
    infoElement.innerHTML = `
      <div class="bg-white p-5 rounded-2xl relative shadow-2xl">
        <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
        <p class="mb-5 font-bold">${regionName}</p>
        <canvas id="donutchart" width="220" height="220"></canvas>
      </div>
    `;
    overlay.setElement(infoElement);
    overlay.setPosition(centroid);

    isSearching = true;
  } else {
    
    showError("Municipality not found. Please try again.");
  }

  // Hide loading animation
  hideLoading();
}

// Error message display function
function showError(message) {
  // Create error message element if it doesn’t exist
  let errorElement = document.getElementById("error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = "error-message";
    errorElement.className = "fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded shadow-lg";
    document.body.appendChild(errorElement);
  }

  // Set the message and show the element
  errorElement.textContent = message;
  errorElement.style.display = "block";

  // Hide the message after a few seconds
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 3000);
}


// Function to remove highlight from the municipality
function removeHighlight() {
  featureOverlay.getSource().clear();
  overlay.setPosition(undefined);
  isSearching = false;
  isClickActive = false;
}

// Function to show loading animation
function showLoading() {
  const loadingElement = document.getElementById("loading-animation");
  if (loadingElement) {
    loadingElement.classList.remove("hidden");
    loadingElement.innerHTML =
      '<div class="flex items-center absolute inset-0 md:ml-72 justify-center "><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div></div>';
  }
}

// Function to hide loading animation
function hideLoading() {
  const loadingElement = document.getElementById("loading-animation");
  if (loadingElement) {
    loadingElement.classList.add("hidden");
    loadingElement.innerHTML = "";
  }
}
let municipalityData = {};
// Function to fetch the incident data for a specific municipality
function fetchMunicipalityData(municity) {
  fetch(`/get-municity-data/`)
    .then(response => response.json())
    .then(data => {
      const municipalityData = data[municity];
      
      // Check if there is data for the municipality
      if (municipalityData) {
        createDoughnutChart(municipalityData); // Create the chart with data
      } else {
        // If no data exists, call createDoughnutChart with null
        createDoughnutChart(null);
      }
    })
    .catch(error => {
      console.error("Error fetching municipality data:", error);
    });
}

let chartInstance; // Store chart instance globally

// Donut chart rendering function
function createDoughnutChart(municipalityData) {
  const ctx = document.getElementById("donutchart").getContext("2d");

  // Clear the canvas before rendering new content
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Check if municipalityData is null or empty
  if (!municipalityData || Object.values(municipalityData).every(value => value === 0)) {
    // Clear any existing content and display "No recorded incidents" message
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.font = "14px Arial"; // Adjusted font size for better fit
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";

    // Draw text centered in the canvas with line break
    const message = "No recorded poaching incidents\nin this area";
    const lines = message.split("\n");

    // Adjust y position for multi-line text
    lines.forEach((line, index) => {
        ctx.fillText(line, ctx.canvas.width / 2, ctx.canvas.height / 2 - 10 + index * 20);
    });
    
    return;
}

  // If data is available, proceed with creating the chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Dead", "Alive", "Scales", "Illegal Trades"],
      datasets: [
        {
          data: [municipalityData.dead, municipalityData.alive, municipalityData.scales, municipalityData.illegalTrades],
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
              const total = municipalityData.dead + municipalityData.alive + municipalityData.scales + municipalityData.illegalTrades;
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(2);
              return `${context.label}: ${percentage}%`;
            },
          },
        },
      },
    },
  });
}


// Create a map instance
var map = new ol.Map({
  target: "map",
  layers: [],
  view: new ol.View({
    center: ol.proj.fromLonLat([118.7384, 9.8349]),
    zoom: 1,
    minZoom: 2,
    maxZoom: 18,
    extent: ol.proj.transformExtent([114, 7.5, 124.5, 25], "EPSG:4326", "EPSG:3857"),
  }),
});

showLoading();

map.on("rendercomplete", function () {
  hideLoading();
});

// Define a vector layer to load GeoJSON
var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "/static/maps/Municipals.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature) {
    const regionName = feature.get("ADM3_EN");
    feature.set("data", municipalityData[regionName] || "No data available");

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

// Overlay for displaying information about the municipality
var overlay = new ol.Overlay({
  element: document.createElement("div"),
  positioning: "bottom-center",
  stopEvent: false,
  offset: [0, -10],
});
map.addOverlay(overlay);

// Highlight style for hovered municipality
var highlightStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "#ff0000",
    width: 0.5,
  }),
  fill: new ol.style.Fill({
    color: "rgba(255, 0, 0, 0.1)",
  }),
});

// Feature overlay for highlighting municipalities
var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: highlightStyle,
});

// Map pointer move event to highlight features
// Map pointer move event to highlight features
map.on("pointermove", function (evt) {
  if (isSearching || isClickActive) return; // Ignore if searching or click active

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
      const regionName = properties.name || properties.ADM3_EN || "Unknown Region";

      overlay.getElement().innerHTML = `
        <div class="bg-white p-5 rounded-2xl relative shadow-2xl">
          <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
          <p class="mb-5 font-bold">${regionName}</p>
          <canvas id="donutchart" width="220" height="220"></canvas>
        </div>
      `;
      overlay.setPosition(evt.coordinate);
      fetchMunicipalityData(regionName);  // Trigger data fetch for this municipality
    } else {
      overlay.setPosition(undefined);
    }
    highlight = feature;
  }
});

// Map click event to select and highlight a municipality
map.on("click", function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    isClickActive = true; // Set click active state

    const properties = feature.getProperties();
    const regionName = properties.name || properties.ADM3_EN || "Unknown Region";
    const geometry = feature.getGeometry();
    const centroid = ol.extent.getCenter(geometry.getExtent());

    featureOverlay.getSource().clear(); // Remove any previous highlights
    featureOverlay.getSource().addFeature(feature); // Highlight the clicked feature

    fetchMunicipalityData(regionName); // Fetch data for the clicked municipality

    const infoElement = document.createElement("div");
    infoElement.innerHTML = `
      <div class="bg-white p-5 rounded-2xl relative shadow-2xl">
        <button onclick="removeOverlay()" class="absolute top-2 right-2 m-1 text-sm">&times;</button>
        <p class="mb-5 font-bold">${regionName}</p>
        <canvas id="donutchart" width="220" height="220"></canvas>
      </div>
    `;
    overlay.setElement(infoElement);
    overlay.setPosition(centroid);

    createDoughnutChart(municipalityData); // Render the chart here
  } else {
    removeOverlay(); // Remove overlay if clicking outside any feature
  }
});


function removeOverlay() {
  overlay.setPosition(undefined);
  featureOverlay.getSource().clear();
  highlight = null;
  selectedFeature = null;
  isClickActive = false;
  isSearching = false;
}
