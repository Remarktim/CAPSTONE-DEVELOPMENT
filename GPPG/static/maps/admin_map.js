var highlight;
var isSearching = false;
function searchMunicipality(event) {
  event.preventDefault();
  const searchValue = document.getElementById("search-dropdown").value.toLowerCase();
  let foundFeature = null;

  vectorLayer.getSource().forEachFeature(function (feature) {
    const properties = feature.getProperties();
    const name = properties.name || properties.NAME_2 || "";
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
    const regionName = properties.name || properties.NAME_2 || "Unknown Region";
    const population = properties.population || "No data available";
    const infoElement = document.createElement("div");
    infoElement.className = "bg-white p-2 border rounded shadow";
    infoElement.innerHTML = `
            <strong>${regionName}</strong><br>
            Population: ${population}<br>
            <button onclick="removeHighlight()" class="text-red-500 mt-2">Remove Highlight</button>
        `;
    overlay.setElement(infoElement);
    overlay.setPosition(centroid);

    isSearching = true;
  } else {
    alert("Municipality not found. Please try again.");
  }
}

function removeHighlight() {
  featureOverlay.getSource().clear();
  overlay.setPosition(undefined);
  isSearching = false;
}
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

var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "/static/maps/Region.geojson", // Geojson file input kuno
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature) {
    const Datamap = {
      "Puerto Princesa City": 150000,
      "El Nido": 50000,
      Roxas: 150000,
      Taytay: 6969,
    };
    feature.set("population", Datamap[feature.get("NAME_2")] || "No data available");

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
  stopEvent: false,
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

var highlight;
map.on("pointermove", function (evt) {
  if (isSearching) return;
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
      const regionName = properties.name || properties.NAME_2 || "Unknown Region";
      const population = properties.population || "No data available";
      const coordinates = feature.getGeometry().getCoordinates();
      overlay.getElement().innerHTML = `<div class="bg-white p-2  rounded ">${regionName}<br>Population: ${population}</div>`;
      overlay.setPosition(evt.coordinate);
    } else {
      overlay.setPosition(undefined);
    }
    highlight = feature;
  }
});
