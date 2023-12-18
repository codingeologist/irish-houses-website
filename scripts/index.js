// Map function

const tiles_1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const tiles_2 = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.esri.com">Esri, Maxar, Earthstar Geographics, and the GIS User Community</a>'
});

const tiles_3 = L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.cartodb.com">CartoDB</a>'
});

const ftrgrp = L.featureGroup();

const map = L.map("map", {
    center: [53.304621, -7.635498],
    zoom: 8,
    layers: [
        tiles_1
    ]
});

ftrgrp.addTo(map);

var baselayers = {
    "Open Street Map": tiles_1,
    "ArcGIS World Imagery": tiles_2,
    "CartoDB Dark": tiles_3
}

var overlays = {
    "property listings": ftrgrp
}

// Styling Colours
function colour_picker(value) {
    if (value < 100000) {
        return "green"
    } else if (value > 100000 && value < 250000) {
        return "orange"
    } else if (value > 250000) {
        return "red"
    }
}

// Get JSON Data
!async function () {
    let data = await fetch("https://raw.githubusercontent.com/codingeologist/irish-houses-website/main/data/export_data.json")
        .then((response) => response.json())
        .then((data) => {
            return data
        })
        .catch(error => {
            console.error(error);
        });
    for (let [key, value] of Object.entries(data)) {

        const popup = L.popup()
            .setLatLng([value["latitude"], value["longitude"]])
            .setContent('<p><b>' + value['title'] + '</b></p><p><b>Price:</b> €' + value['price'] + '</p><p><b>Date:</b>' + value['date'] + '</p>' + '</p><p><b><a href="' + value['link'] + '" target="_blank" rel="noopener noreferrer">Link</a></b></p>'
            );

        const points = L.circle([value["latitude"], value["longitude"]], {
            color: colour_picker(value["price"]),
            fillColor: colour_picker(value["price"]),
            fillOpacity: 0.5,
            radius: 20
        }).addTo(ftrgrp).bindPopup(popup);
    }
}();

L.control.layers(baselayers, overlays).addTo(map);

L.control.scale({
    position: "bottomleft"
}).addTo(map);

// Workaround to stop measure controls moving map: https://github.com/ljagis/leaflet-measure/issues/171#issuecomment-1137483548
L.Control.Measure.include({
    // set icon on the capture marker
    _setCaptureMarkerIcon: function () {
        // disable autopan
        this._captureMarker.options.autoPanOnFocus = false;

        // default function
        this._captureMarker.setIcon(
            L.divIcon({
                iconSize: this._map.getSize().multiplyBy(2)
            })
        );
    },
});

var measure = L.control.measure({
    position: "topleft",
    primaryLengthUnit: "meters",
    primaryAreaUnit: "sqmeters",
    secondaryLengthUnit: "kilometers",
    secondaryAreaUnit: "acres",
    activeColor: "#ABE67E",
    completedColor: "#C8F2BE"
}).addTo(map);