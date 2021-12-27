    marker='';
    map='';



    var jsonfeeder = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            url: 'json_feeder',
            dataType: "json",
            success: function (data) {
                json = data;
                console.log(json);
            }
        });
        return json;
    })();
    // console.log(jsonfeeder);
    // console.log(jsonfeeder[0].lat);
    // console.log(jsonfeeder.length);


    var lat = parseFloat(jsonfeeder[0].feederlatitude);
    var lng = parseFloat(jsonfeeder[0].feederlongitude);
    // console.log(lat,lng);

    map = L.map('map', {
            fullscreenControl: {
                pseudoFullscreen: false
            }
          }).setView([lat, lng],9);
    
    map.scrollWheelZoom.disable()
    mapLink =
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' loranet.my',
        maxZoom: 18
        }).addTo(map);

    var arrMarker = [];
    var markerClustersFeeder = L.markerClusterGroup();
    for (var i = 0; i < jsonfeeder.length; i++) {
        lat = parseFloat(jsonfeeder[i].feederlatitude);
        lng = parseFloat(jsonfeeder[i].feederlongitude);
        console.log(lat,lng);

        marker = new L.marker([(parseFloat(lat)),(parseFloat(lng))],{
            icon: feeder
        });
        var popup = '<b>Device:</b> '+jsonfeeder[i].feedername+'<br><b>Location:</b> '+jsonfeeder[i].map_location+'<br>';
        marker.bindPopup(popup,{
            maxWidth: 170
        });
//        .addTo(map);
        markerClustersFeeder.addLayer(marker);
        arrMarker[i] = marker;
    }
    map.addLayer( markerClustersFeeder );