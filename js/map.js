document.addEventListener('DOMContentLoaded', function() {
    // Initialize the platform object
    const platform = new H.service.Platform({
        'apikey': 'dlNd27Wg53F_iDJiblkuSl1l_Vwtap5_un93Cha6NuE' // Replace with your actual API key
    });

    // Initialize the default map layers
    const defaultLayers = platform.createDefaultLayers();

    // Initialize map
    const map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            zoom: 8.5,
            center: { lat:27.65080760956513, lng:82.86991934895963 } // Chandrauta, Kapilvastu coordinates
        }
    );
//27.65080760956513, 82.86991934895963
    // Add window resize handler
    window.addEventListener('resize', () => map.getViewPort().resize());

    // Enable map interaction (pan, zoom, etc.)
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Add UI controls
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Add a marker for the school
    const schoolMarker = new H.map.Marker({
        lat: 27.65080760956513,
        lng: 82.86991934895963  // Chandrauta, Kapilvastu coordinates
    });

    // Create an info bubble
    const bubble = new H.ui.InfoBubble(
        { lat: 27.65080760956513, lng: 82.86991934895963 }, // Chandrauta, Kapilvastu coordinates
        {
            content: `
                <div style="padding: 10px;">
                    <h3>Rashtriya Secondary School</h3>
                    <p>Shivaraj-05, Chandrauta</p>
                    <p>Kapilvastu, Lumbini Province</p>
                </div>`
        }
    );

    // Add the marker to the map
    map.addObject(schoolMarker);
    
    // Add click event to show info bubble
    schoolMarker.addEventListener('tap', function() {
        ui.addBubble(bubble);
    });
}); 