// Map function
const map = L.map('map').setView([53.304621, -7.635498], 8);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Get JSON Data
!async function () {
    let data = await fetch("../data/export_data.json")
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
            .setContent('<p><b>' + value['title'] + '</b></p><p><b>Price:</b> €' + value['price'] + '</p><p><b>Date:</b>' + value['date'] + '</p>' + '</p><p><b><a href=">' + value['link'] + '" target="_blank" rel="noopener noreferrer">Link</a></b></p>'
            );

        const points = L.circle([value["latitude"], value["longitude"]], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 20
        }).addTo(map).bindPopup(popup);
    }
}();