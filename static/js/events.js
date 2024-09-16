map.on('contextmenu', (e) => {
    // Get the coordinates (lng, lat) where the click occurred
    const { lng, lat } = e.lngLat;

    console.log(`Longitude: ${lng}, Latitude: ${lat}`);

    // You can also display this information in the UI if needed
    alert(`Clicked at Longitude: ${lng}, Latitude: ${lat}`);
});