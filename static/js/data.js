// Initialize the MapLibre map
map.on('load', () => {
    // Add navigation controls (zoom in/out)
    map.addControl(new maplibregl.NavigationControl());

    // Fetch GeoJSON data only after the map is loaded
    fetch(`${MAP_URL}park-locations/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${USER_ACCESS_KEY.access}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON data with clustering enabled
            console.log(data)
            map.addSource('points', {
                'type': 'geojson',
                'data': data,
                'cluster': true,  // Enable clustering
                'clusterMaxZoom': 14, // Max zoom to cluster points
                'clusterRadius': 50   // Radius of each cluster when clustering points (default: 50)
            });

            // Add layers for clusters, cluster counts, and individual points
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'points',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',  // Color for small clusters
                        100,        // Cluster size thresholds
                        '#f1f075',  // Color for medium clusters
                        750,        // Cluster size thresholds
                        '#f28cb1'   // Color for large clusters
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,  // Radius for small clusters
                        100, // Cluster size thresholds
                        30,  // Radius for medium clusters
                        750, // Cluster size thresholds
                        40   // Radius for large clusters
                    ]
                }
            });

            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'points',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'points',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#11b4da',  // Color of individual points
                    'circle-radius': 6,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                }
            });

            // Handle point click events
            map.on('click', 'unclustered-point', (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const {
                    capacity_of_park,
                    county_name,
                    location_name,
                    park_name,
                    park_type_desc,
                    working_hours
                } = e.features[0].properties;
                console.log(e.features)
                const popupContent = `
                <div style="padding: 10px; font-family: Arial, sans-serif; color: #333;">
                    <h3 style="color: #2E86C1; margin-bottom: 5px;">${park_name}</h3>
                    <input type="hidden" name="id" value="${e.features[0].id}">
                    <p style="margin: 5px 0;"><strong>Adres:</strong> ${location_name}, ${county_name}</p>
                    <p style="margin: 5px 0;"><strong>Açıklama:</strong> ${park_type_desc}</p>
                    <p style="margin: 5px 0;"><strong>Kapasite:</strong> ${capacity_of_park} Araç</p>
                    <p style="margin: 5px 0;"><strong>Çalışma Saatleri:</strong> ${working_hours}</p>
                    
                    <button type="submit" class="btn btn-success" onclick="updateForm(this)">Güncelle</button>
                </div>
            `;
                new maplibregl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(popupContent)
                    .addTo(map);
            });

            // Change the cursor to pointer when hovering over points
            map.on('mouseenter', 'unclustered-point', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            // Reset the cursor when it leaves the points layer
            map.on('mouseleave', 'unclustered-point', () => {
                map.getCanvas().style.cursor = '';
            });
        })
        .catch(error => console.error('Error fetching GeoJSON data:', error));
});

updateForm = (e) => {
    console.log(e.parentNode)
    e.parentNode.innerHTML = `<div>kcb</div>`
}