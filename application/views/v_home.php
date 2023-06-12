<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous">
</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css" />

<!-- Tambahkan tag <link> untuk gaya CSS -->
<!-- <link rel="stylesheet" href="http://osl.bingkaikodeku.my.id/visualisasi/node_modules/leaflet-arrowheads/dist/leaflet-arrowheads.css"> -->


<style>
    #map {
        height: 500px;
    }

    #map-select {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
    }
</style>

<div class="">

    <nav class="navbar  navbar-expand-lg navbar-dark bg-danger ">
        <div class="container-fluid">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                    <a class="navbar-brand" href="#">
                        <img src="https://intra.brin.go.id/public/themes/intra/assets/pages/img/logo-big.png" alt="" height="24" class="d-inline-block align-text-top">
                    </a>

                    <a class="navbar-brand" href="#">
                        Visualisasi Sesar Lembang
                    </a>

                    <li class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Thema Map
                        </a>
                        <ul class="dropdown-menu">
                            <select class="form-control" id="map-type" onchange="changeMapType()">
                                <option value="Esri.WorldImagery">Esri World Imagery</option>
                                <option value="Esri.WorldTerrain">Esri World Terrain</option>
                                <option value="OpenStreetMap.Mapnik">OpenStreetMap</option>
                                <option value="OpenTopoMap">OpenTopoMap</option>
                                <option value="Stamen_Terrain">Statment Terain</option>
                            </select>
                        </ul>
                    </li>

                </ul>

            </div>
        </div>
    </nav>

    <div id="map"></div>




</div>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet-providers@1.13.0/leaflet-providers.js"></script>
<script src="http://osl.bingkaikodeku.my.id/visualisasi/node_modules/leaflet-arrowheads/src/leaflet-arrowheads.js">
</script>
<script>
    var map = L.map('map').setView([-6.830021650901877, 107.636265594017], 15);

    var tileLayers = {
        'Esri.WorldImagery': L.tileLayer.provider('Esri.WorldImagery', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 18,
        }),
        'Esri.WorldTerrain': L.tileLayer.provider('Esri.WorldTerrain', {
            attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
            maxZoom: 18,
        }),
        'OpenStreetMap.Mapnik': L.tileLayer.provider('OpenStreetMap.Mapnik', {
            maxZoom: 18,
        }),
        'OpenTopoMap': L.tileLayer.provider('OpenTopoMap', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }),
        'Stamen_Terrain': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
            subdomains: 'abcd',
            maxZoom: 18,
            ext: 'png',
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
    };

    var defaultLayer = tileLayers['OpenStreetMap.Mapnik'];
    defaultLayer.addTo(map);

    // var polylineLayer = L.layerGroup().addTo(map); // Create a layer group for polylines

    function changeMapType() {
        var select = document.getElementById('map-type');
        var selectedValue = select.value;
        var selectedLayer = tileLayers[selectedValue];

        if (selectedLayer) {
            map.eachLayer(function(layer) {
                if (layer !== polylineLayer) {
                    map.removeLayer(layer);
                }
            });

            selectedLayer.addTo(map);
            addGaris()
        }
    }

    // Define arrays of coordinates for multiple polylines
    var locations = [
        <?php foreach ($lokasi as $lok) : ?>[
                [<?= $lok->location_start ?>],
                [<?= $lok->location_end ?>]
            ],
        <?php endforeach ?>

    ];

    var polylineLayer = L.layerGroup().addTo(map); // Create a layer group for polylines

    function addGaris() {
        // Create polylines and markers for each location
        locations.forEach(function(location) {
            // var polyline = L.polyline(location, {
            //     color: 'red',
            //     weight: 1
            // }).addTo(polylineLayer); // Add polylines to the polyline layer

            // var startMarker = L.marker(location[0], {
            //     icon: L.icon({
            //         iconUrl: 'https://static.vecteezy.com/system/resources/previews/016/314/339/original/red-circle-red-dot-icon-free-png.png',
            //         iconSize: [30, 30],
            //         iconAnchor: [15, 15],
            //     }),
            // }).addTo(map);

            // var startMarker = L.marker(location[0], {
            //     icon: L.divIcon({
            //         className: 'arrowhead-icon',
            //         html: '<img src="https://srgi.big.go.id/images/icon/line_arrow_l.png" class="arrowhead-image">',
            //         iconSize: [120, 1],
            //         iconAnchor: [60, 0.4], // Set anchor point at half of the width and height
            //     }),
            // }).addTo(map);

            var endMarker = L.marker(location[1], {
                icon: L.divIcon({
                    className: 'arrowhead-icon1',
                    html: '<img src="https://srgi.big.go.id/images/icon/line_arrow_l.png" class="arrowhead-image1">',
                    iconSize: [120, 1],
                    iconAnchor: [60, 0.4], // Set anchor point at half of the width and height
                }),
            }).addTo(map);

            // Calculate rotation angle
            var dx = location[1][0] - location[0][0];
            var dy = location[1][1] - location[0][1];

            var rotation = Math.atan2(location[1][1] - location[0][1], location[1][0] - location[0][0]) * (180 / Math.PI);


            // var rotation = Math.atan2(dy, dx) * (180 / Math.PI);
            // var rotation = Math.atan2(dy, dx) * 180 / Math.PI;

            // alert(rotation)

            var rot = rotation + 270;

            // Apply rotation to the arrowhead marker image
            // var arrowheadImage = startMarker.getElement().querySelector('.arrowhead-image');
            var arrowheadImageEnd = endMarker.getElement().querySelector('.arrowhead-image1');
            // arrowheadImage.style.transform = 'rotate(' + rot + 'deg)';
            arrowheadImageEnd.style.transform = 'rotate(' + rot + 'deg)';
        });
    }

    addGaris();

    // // Create polylines and markers for each location
    // locations.forEach(function(location) {
    //     var polyline = L.polyline(location, {
    //         color: 'red',
    //         weight: 3
    //     }).addTo(polylineLayer); // Add polylines to the polyline layer

    //     var startMarker = L.marker(location[0], {
    //         icon: L.icon({
    //             iconUrl: 'https://static.vecteezy.com/system/resources/previews/016/314/339/original/red-circle-red-dot-icon-free-png.png',
    //             iconSize: [30, 30],
    //             iconAnchor: [15, 15],
    //         }),
    //     }).addTo(map);

    //     var endMarker = L.marker(location[1], {
    //         icon: L.divIcon({
    //             className: 'arrowhead-icon',
    //             html: '<img src="https://srgi.big.go.id/images/icon/line_arrow_l.png" class="arrowhead-image">',
    //             iconSize: [50, 50],
    //             iconAnchor: [25, 25], // Adjust the anchor point to center the arrowhead
    //         }),
    //     }).addTo(map);

    //     // Calculate rotation angle
    //     var dx = location[1][0] - location[0][0];
    //     var dy = location[1][1] - location[0][1];
    //     var rotation = Math.atan2(dy, dx) * (180 / Math.PI);

    //     // Apply rotation to the arrowhead marker image
    //     var arrowheadImage = endMarker.getElement().querySelector('.arrowhead-image');
    //     arrowheadImage.style.transform = 'rotate(' + rotation + 'deg)';
    // });
</script>

<script>
    // Membuat polyline
    // var coordinates = [
    //     [51.505, -0.09],
    //     [51.51, -0.1],
    //     [51.51, -0.12]
    // ];
    // var polyline = L.polyline(coordinates, {
    //     color: 'red',
    //     weight: 3
    // }).addTo(map);

    // Menambahkan arrowheads pada polyline menggunakan leaflet-arrowheads
    // L.polylineDecorator(polyline, {
    //     patterns: [{
    //         offset: '50%',
    //         repeat: 100,
    //         symbol: L.Symbol.arrowHead({
    //             pixelSize: 10,
    //             polygon: false,
    //             pathOptions: {
    //                 stroke: true,
    //                 color: 'blue'
    //             }
    //         })
    //     }]
    // }).addTo(map);
</script>