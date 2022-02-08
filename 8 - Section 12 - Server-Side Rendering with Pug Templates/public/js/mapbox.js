/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWxleGJhamFuIiwiYSI6ImNremJpYzBmczFwYzQybm45Ym9nd3B6cWgifQ.zWzXi70c8fY8Mh2m76RMZA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/alexbajan/ckzbihdnb002114mlaenjor5k',
    scrollZoom: false,
    // center: [-118.160499, 33.828839],
    // zoom: 4,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extends the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
