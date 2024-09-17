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
            mapGeoData = data

            map.addSource('points', {
                'type': 'geojson',
                'data': mapGeoData,
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
                const feature = e.features[0]
                const coordinates = feature.geometry.coordinates.slice();
                const {
                    uid,
                    capacity_of_park,
                    county_name,
                    location_name,
                    park_name,
                    park_type_desc,
                    working_start_time,
                    working_end_time,
                } = e.features[0].properties;
                console.log(e.features[0].properties);
                const dataIndex = mapGeoData.features.findIndex(f =>
                    f.geometry.coordinates[0] === feature.geometry.coordinates[0] &&
                    f.geometry.coordinates[1] === feature.geometry.coordinates[1]
                );
                console.log(dataIndex)
                const popupContent = `
                <form id="parkUpdateForm" style="padding: 10px; font-family: Arial, sans-serif; color: #333;">
    <div class="form-group">
        <label for="parkName"><strong>Park Adı:</strong></label>
        <input type="text" class="form-control" id="parkName" name="park_name" value="${park_name}">
    </div>

    <div class="form-group">
        <input type="hidden" name="id" value="${uid}">
    </div>

    <div class="form-group">
        <input type="hidden" name="index" value="${dataIndex}">
    </div>

    <div class="form-group">
        <label for="locationName"><strong>Adres:</strong></label>
        <input type="text" class="form-control" id="locationName" name="location_name" value="${location_name}">
    </div>
    <div class="form-group">
        <label for="countyName"><strong>İlçe:</strong></label>
        <input type="text" class="form-control" id="countyName" name="county_name" value="${county_name}">
    </div>

    <div class="form-group">
        <label for="parkTypeDesc"><strong>Açıklama:</strong></label>
        <input type="text" class="form-control" id="parkTypeDesc" name="park_type_desc" value="${park_type_desc}">
    </div>

    <div class="form-group">
        <label for="capacityOfPark"><strong>Kapasite:</strong></label>
        <input type="number" class="form-control" id="capacityOfPark" name="capacity_of_park" value="${capacity_of_park}">
    </div>

    <div class="form-group">
        <label for="workingStartTime"><strong>Başlangıç:</strong></label>
        <input type="text" class="form-control" id="workingStartTime" name="working_start_time" value="${working_start_time ? working_start_time : ""}">
    </div>
    <div class="form-group">
        <label for="workingEndTime"><strong>Bitiş:</strong></label>
        <input type="text" class="form-control" id="workingEndTime" name="working_end_time" value="${working_end_time ? working_end_time : ""}">
    </div>
    <input type="hidden" name="coordinates" id="coordinates" value="${coordinates}">

    <button type="button" class="btn btn-success" id="submitForm" onclick="updateForm(this)">Güncelle</button>
</form>

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

function updateForm(button) {
    const form = document.getElementById('parkUpdateForm');

    // Extract data from form
    const parkId = form.querySelector('input[name="id"]').value;
    const parkName = form.querySelector('input[name="park_name"]').value;
    const locationName = form.querySelector('input[name="location_name"]').value;
    const countyName = form.querySelector('input[name="county_name"]').value;
    const parkTypeDesc = form.querySelector('input[name="park_type_desc"]').value;
    const capacityOfPark = form.querySelector('input[name="capacity_of_park"]').value;
    const workingStartTime = form.querySelector('input[name="working_start_time"]').value;
    const workingEndTime = form.querySelector('input[name="working_end_time"]').value;
    const coordinates = form.querySelector('input[name="coordinates"]').value;


    const fetchUrl = parkId !== 'undefined' || null || '' ? `${MAP_URL}park-locations/${parkId}/` : `${MAP_URL}park-locations/`
    const fetchMethod = parkId !== 'undefined' || null || '' ? `PUT` : `POST`

    console.log(fetchUrl, parkId, typeof parkId)
    // Create the updated data object
    const updatedData = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coordinates.split(',').map(Number)
            },
            "properties": {
                park_name: parkName,
                location_name: locationName,
                county_name: countyName,
                park_type_id: parkTypeDesc,
                park_type_desc: parkTypeDesc,
                capacity_of_park: capacityOfPark,
                working_start_time: workingStartTime ? workingStartTime : null,
                working_end_time: workingEndTime ? workingEndTime : null
            }
        }
    ;
    console.log(updatedData)
    // Send PUT request
    fetchData(fetchUrl, {
        method: fetchMethod,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${USER_ACCESS_KEY.access}`  // Replace with your token key
        },
        body: JSON.stringify(updatedData)
    })
        .then(data => {

            if (fetchMethod === 'PUT') {
                const dataIndex = mapGeoData.features.findIndex(x => x.id === parkId)
                mapGeoData.features[dataIndex] = data;
                console.log('Update successful', data);
                map.getSource('points').setData(mapGeoData)
            }
            if (fetchMethod === 'POST') {
                mapGeoData.features[mapGeoData.features.length - 1] = data



                console.log('Update successful', data);
                map.getSource('points').setData(mapGeoData)
            }


            alert('Park information updated successfully!');
        })
        .catch(error => {
            console.error('Error updating park:', error);
        });
}

