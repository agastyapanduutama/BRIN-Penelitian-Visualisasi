<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css" />

<!-- Tambahkan tag <link> untuk gaya CSS -->
<!-- <link rel="stylesheet" href="<?php echo base_url('node_modules/leaflet-arrowheads/dist/leaflet-arrowheads.css'); ?>"> -->


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

    html,
    body,
    #mapID {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }



    .norwayLink {
        color: #0078A8;
    }

    .norwayLink:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>

<div class="container-fluid">

    <nav class="navbar  navbar-expand-lg navbar-light bg-light ">
        <div class="container-fluid">

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                    <li class="navbar-brand">
                        <img src="<?= base_url('assets/image/logo.png') ?>" width="250" alt="">
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Model Map
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


    <div class="row">
        <div class="col-9">
            <div id="map"></div>

        </div>
        <div class="col-3">
            <div class="form-group">
                <label for="">Lokasi</label>
                <select name="" class="form-control" id="">
                    <option value="">Zona Sesar Lembang</option>
                    <option value="">Lembang</option>
                    <option value="">Bandung</option>
                </select>
            </div>
            <label for="">Rentang Waktu</label>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="subjek" value="1" id="subjek1">
                <label class="form-check-label" for="subjek1">
                    Semua Data
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="subjek" value="1" id="subjek1">
                <label class="form-check-label" for="subjek1">
                    10 Tahun
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="subjek" value="1" id="subjek1">
                <label class="form-check-label" for="subjek1">
                    5 Tahun
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="subjek" value="1" id="subjek1">
                <label class="form-check-label" for="subjek1">
                    1 Tahun
                </label>
            </div>
        </div>
    </div>



</div>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet-providers@1.13.0/leaflet-providers.js"></script>
<script src="<?php echo base_url('node_modules/leaflet-arrowheads/src/leaflet-arrowheads.js'); ?>"></script>
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

    var defaultLayer = tileLayers['Esri.WorldImagery'];
    defaultLayer.addTo(map);

    var polylineLayer = L.layerGroup().addTo(map); // Create a layer group for polylines

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

    function addGaris() {
        // Create polylines and markers for each location
        locations.forEach(function(location) {
            var polyline = L.polyline(location, {
                color: 'red',
                weight: 3
            }).addTo(polylineLayer); // Add polylines to the polyline layer

            var startMarker = L.marker(location[0], {
                icon: L.icon({
                    iconUrl: 'https://static.vecteezy.com/system/resources/previews/016/314/339/original/red-circle-red-dot-icon-free-png.png',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                }),
            }).addTo(map);

            var endMarker = L.marker(location[1]).addTo(map);
        });
    }

    // Create polylines and markers for each location
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

    //     var endMarker = L.marker(location[1]).addTo(map);
    // });
</script>

<script>
    var locations = [
        [
            [-6.8305383054373685, 107.63336344181536],
            [-6.830793968677474, 107.63642115868387]
        ],
        // Koordinat lainnya...
    ];

    locations.forEach(function(location) {
        var polyline = L.polyline(location, {
            color: 'red',
            weight: 3
        }).addTo(map);

        L.polylineDecorator(polyline, {
            patterns: [{
                offset: '50%',
                repeat: 100,
                symbol: L.Symbol.arrowHead({
                    pixelSize: 10,
                    polygon: false,
                    pathOptions: {
                        stroke: true,
                        color: 'blue'
                    }
                })
            }]
        }).addTo(map);
    });
</script>