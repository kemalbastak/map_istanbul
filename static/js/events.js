// Declare lng and lat in the global scope
let lng, lat;
let markers = [];  // Store markers globally so they can be removed later

// Create a context menu element
const contextMenu = document.createElement('div');
contextMenu.style.position = 'absolute';
contextMenu.style.display = 'none';
contextMenu.style.backgroundColor = '#fff';
contextMenu.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.2)';
contextMenu.style.padding = '10px';
contextMenu.style.borderRadius = '5px';
contextMenu.style.zIndex = '1000';  // Ensure the menu is on top of the map
document.body.appendChild(contextMenu);

// Add menu options
const menuOptions = {
    add: 'Ekle',
    closest: 'En Yakın İsparklar',
    refresh: 'Yenile',
};


// Add menu options and handle click events
Object.entries(menuOptions).forEach(([key, value]) => {
    const menuItem = document.createElement('div');
    menuItem.innerText = value;
    menuItem.style.padding = '8px';
    menuItem.style.cursor = 'pointer';

    menuItem.addEventListener('click', async () => {
        if (key === 'add') {
            const newData = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "properties": {
                    park_name: "",
                    location_name: "",
                    county_name: "",
                    park_type_id: "",
                    park_type_desc: "",
                    capacity_of_park: "",
                    working_start_time: "",
                    working_end_time: ""
                }
            }
            mapGeoData.features.push(newData)
            map.getSource('points').setData(mapGeoData)


        }
        if (key === 'closest') {
            if (lng !== undefined && lat !== undefined) {
                // Fetch the closest points
                const url = `${BASE_URL}${API_PATH.map}?closest=${lng},${lat}`;
                console.log(url);

                try {
                    const data = await fetchData(url);
                    console.log(data);
                    map.flyTo({
                        center: [lng, lat],
                        zoom: 14,
                        essential: true  // This animation is considered essential
                    });
                    map.getSource('points').setData(data)
                    mapGeoData = data


                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('Coordinates are undefined');
            }
        }

        if (key === 'refresh') {
            const url = `${BASE_URL}${API_PATH.map}`;
            const data = await fetchData(url);
            map.getSource('points').setData(data)
            map.flyTo({
                center: DEFAULT_CENTER,
                zoom: 12,
                essential: true  // This animation is considered essential
            });

        }
        contextMenu.style.display = 'none';  // Hide the menu after clicking an option
    });

    // Add hover effects
    menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#f0f0f0';
    });
    menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = '#fff';
    });

    contextMenu.appendChild(menuItem);
});

// Function to hide the context menu if the user clicks anywhere else
map.getContainer().addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

// Show the custom menu on right-click (contextmenu event)
map.on('contextmenu', (e) => {
    // Get the coordinates (lng, lat) where the click occurred
    lng = e.lngLat.lng;  // Update global lng
    lat = e.lngLat.lat;  // Update global lat

    // Convert the map coordinates to pixel coordinates for positioning the menu
    const pixelCoords = map.project([lng, lat]);

    // Position the menu at the clicked location
    contextMenu.style.left = `${pixelCoords.x}px`;
    contextMenu.style.top = `${pixelCoords.y}px`;
    contextMenu.style.display = 'block';  // Show the menu

    // Optional: Log the coordinates
    console.log(`Longitude: ${lng}, Latitude: ${lat}`);
});

map.on('zoomend', (e) => {
    const zoomLevel = map.getZoom()
    console.log(mapGeoData)
    if (zoomLevel < 8 && mapGeoData.features.length < 10)
        fetchMapFilterData(`${BASE_URL}${API_PATH.map}`, {}).then(data => {
            map.getSource('points').setData(data)
        })
})


async function fetchMapFilterData(base_url, query) {
    const queryParams = new URLSearchParams(query)
    let url
    if (query) {
        url = `${base_url}?${queryParams}`
    } else {
        url = base_url
    }
    console.log(url)
    try {
        const data = await fetchData(url);
        console.log(data);
        map.getSource('points').setData(data)
        mapGeoData = data


    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


