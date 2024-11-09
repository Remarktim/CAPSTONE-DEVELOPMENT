// Code 2: Adjusted to avoid conflicts with Code 1
var highlightDash;
var isSearchingDash = false;

function removeHighlightDash() {
  featureOverlayDash.getSource().clear();
  overlayDash.setPosition(undefined);
  isSearchingDash = false;
}

function showLoadingDash() {
  const loadingElement = document.getElementById("Loading_Animation");
  if (loadingElement) {
    loadingElement.classList.remove("hidden");
    loadingElement.innerHTML = '<div class="flex items-center   mt-40 justify-center "><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div></div>';
  }
}

function hideLoadingDash() {
  const loadingElement = document.getElementById("Loading_Animation");
  if (loadingElement) {
    loadingElement.classList.add("hidden");
    loadingElement.innerHTML = "";
  }
}

var mapDash = new ol.Map({
  target: "DashMap",
  layers: [],
  view: new ol.View({
    center: ol.proj.fromLonLat([118.7384, 9.8349]),
    zoom: 7,
    minZoom: 2,
    maxZoom: 18,
  }),
});

// Show loading animation when map starts loading
showLoadingDash();

mapDash.on("rendercomplete", function () {
  // Hide loading animation when map finishes rendering
  hideLoadingDash();
});

var vectorLayerDash = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "/static/maps/map.geojson", // Geojson file input kuno
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature) {
    const Datamap = {
      "Puerto Princesa City": 150000,
      "El Nido": 50000,
      Roxas: 150000,
      Taytay: 6969,
    };
    feature.set("population", Datamap[feature.get("ADM3_EN")] || "No data available");

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

mapDash.addLayer(vectorLayerDash);

var overlayDash = new ol.Overlay({
  element: document.createElement("div"),
  positioning: "bottom-center",
  stopEvent: false,
  offset: [0, -10],
});
mapDash.addOverlay(overlayDash);

var highlightStyleDash = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "#ff0000",
    width: 0.5,
  }),
  fill: new ol.style.Fill({
    color: "rgba(255, 0, 0, 0.1)",
  }),
});

var featureOverlayDash = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: mapDash,
  style: highlightStyleDash,
});

var highlightDash;
mapDash.on("pointermove", function (evt) {
  if (isSearchingDash) return;
  var feature = mapDash.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature !== highlightDash) {
    if (highlightDash) {
      featureOverlayDash.getSource().removeFeature(highlightDash);
    }
    if (feature) {
      featureOverlayDash.getSource().addFeature(feature);
      const properties = feature.getProperties();
      const regionName = properties.name || properties.ADM3_EN || "Unknown Region";
      const population = properties.population || "No data available";
      const coordinates = feature.getGeometry().getCoordinates();
      overlayDash.getElement().innerHTML = `<div class="bg-white p-2 rounded ">${regionName}<br>Population: ${population}</div>`;
      overlayDash.setPosition(evt.coordinate);
    } else {
      overlayDash.setPosition(undefined);
    }
    highlightDash = feature;
  }
});
