import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import KML from "ol/format/KML";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
import {defaults as defaultControls, FullScreen} from 'ol/control';
import VectorSource from "ol/source/Vector";

var key = "B8yUK9pt66Us42qhIm1y";
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var raster = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" + key,
    maxZoom: 20
  })
});

var vector = new VectorLayer({
  source: new VectorSource({
    url: "data/kml/PlaceRepair.kml",
    format: new KML()
  })
});

var map = new Map({
  controls: defaultControls().extend([
    new FullScreen()
  ]),
  layers: [raster, vector],
  target: document.getElementById("map"),
  view: new View({
    center: [105.77703235791, 21.071062799676],
    projection: "EPSG:4326",
    zoom: 12
  })
});

var displayFeatureInfo = function(pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function(feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get("name"));
    }
    document.getElementById("info").innerHTML = info.join(", ") || "(unknown)";
    map.getTarget().style.cursor = "pointer";
  } else {
    document.getElementById("info").innerHTML = "&nbsp;";
    map.getTarget().style.cursor = "";
  }
};

map.on("pointermove", function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on("click", function(evt) {
  displayFeatureInfo(evt.pixel);
});
