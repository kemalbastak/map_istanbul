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

            }

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
