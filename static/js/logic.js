var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
d3.json(earthquakeURL, function(data) {
  createFeatures(data.features);
});
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
    })
  }
  });
  createMap(earthquakes);
}
function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3lsZXA2MjMiLCJhIjoiY2pxenZpZzNkMDJmdTRhdGNtdTIwYW0zMyJ9.4ZDdT56qleBQegExL09CZg");
    var baseMap = {
      "Light Map": lightmap,
    };

    var overlayMap = {
      "Earthquakes": earthquakes,
    };

    var myMap = L.map("map", {
      center: [
        35.00, -80.00],
      zoom: 3.00,
      layers: [lightmap, earthquakes]
    }); 

    L.control.layers(baseMap, overlayMap, {
      collapsed: false
    }).addTo(myMap);

  var legend = L.control({position: 'topright'});
    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
}  

  function getColor(d) {
    return d > 5 ? '#581845':
    d > 4  ? '#900C3F':
    d > 3  ? '#C70039':
    d > 2  ? '#FF5733':
    d > 1   ? '#FFC300':
              '#DAF7A6';
  }

  function getRadius(value){
    return value*10000
  }