mapboxgl.accessToken = mapToken; // variable is set from show.ejs file, bec we can accces the .env file in public dir

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: listing.geometry.coordinates, // starting position [lng, latitude]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

//Marker add at coordinates
const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates)  //Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`)
        .setMaxWidth("300px"))
        .addTo(map);