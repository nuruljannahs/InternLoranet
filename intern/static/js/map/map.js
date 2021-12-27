marker = '';
map = '';
var arrMarker = [];
var markerClustersDevice = [];
var markerClustersFeeder = [];
var markerClustersGateway = [];
var jdata;

// console.log('tokenori: '+tokenori);
function streetlight(){
    // device map
    jdata = (function() {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Token "+tokenori);
            },
            url: '/sYE8kSrGbwM=/api/device/json',
            dataType: "json",
            success: function(data) {
                // console.log('/sYE8kSrGbwM=/api/device/json 222');
                // console.log(data);
                json = data;
            }
        });
        return json;
    })();
    // console.log(jdata);
    // console.log(jdata[0].latitude);
    // console.log(jdata[0].longitude);
    // return;

    var lat = parseFloat(jdata[0].latitude);
    var lng = parseFloat(jdata[0].longitude);
    var org = document.getElementById('org').innerHTML;
    // console.log(lat,lng);

    map = L.map('map', {
        zoomControl: false,
        center: [-25.2702, 134.2798],
        zoom: 3,
        // gestureHandling: true,
        fullscreenControl: {
            pseudoFullscreen: false,
            position: 'topright'
        }
    }).setView([lat, lng], 10);

    L.control.zoom({
         position:'bottomright'
    }).addTo(map);

    map.scrollWheelZoom.disable();
    mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' loranet.my',
        maxZoom: 19
    }).addTo(map);

    var switchs, alarm, status;
    // console.log(jdata[0].latitude);
    // console.log(jdata[0].longitude);
    // return;
    // var markerClustersDevice = L.markerClusterGroup();
    markerClustersDevice = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        maxZoom: 10,
        disableClusteringAtZoom: 16,
    });

    var markers = [];
    var marker2 = [];
    function doMap(jdata){
        if(jdata[i].organization == org){
            // console.log(lat,lng);
            switchs = jdata[i].statuspower;
            alarm = jdata[i].alarm;
            status = jdata[i].devicestatus;

            if (status == 1) {
                if (alarm == 0) {
                    if (switchs == 1) {
                        sl = slgreen;
                    } else {
                        sl = slgrey;
                    }
                } else {
                    sl = slred;
                }
            } else {
                sl = slblue;
            }

            // marker = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            //     icon: sl,
            //     id: jdata[i].deviceid
            // }).addTo(markerClustersDevice).on('click', markerOnClick);

            marker2 = new L.marker([(parseFloat(lat)),(parseFloat(lng))],{
                icon: sl,
                id: jdata[i].deviceid,
                name: jdata[i].devicename
            });

            var popup = '<b>Device:</b> <a href="/device/' + jdata[i].deviceid + '">'+ jdata[i].devicename + '</a><br>'
            + '<b>Voltage: </b>' + jdata[i].voltage + '<br>'
            + '<b>Current: </b>' + jdata[i].current + '<br>'
            + '<b>Power: </b>' + jdata[i].activepower + '<br>'
            + '<b>Date:</b> ' + jdata[i].datecreated + '<br>';
            var popup1 = '<b>'+jdata[i].devicename+'</b>'
            marker2.bindPopup(popup1, {
                maxWidth: 170
            });
            markerClustersDevice.addLayer(marker2);
            arrMarker[i] = marker2
        }
        else if(org == 1){
            switchs = jdata[i].statuspower;
            alarm = jdata[i].alarm;
            status = jdata[i].devicestatus;

            if (status == 1) {
                if (alarm == 0) {
                    if (switchs == 1) {
                        sl = slgreen;
                    } else {
                        sl = slgrey;
                    }
                } else {
                    sl = slred;
                }
            } else {
                sl = slblue;
            }

            // marker = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            //     icon: sl,
            //     id: jdata[i].deviceid
            // }).addTo(markerClustersDevice).on('click', markerOnClick);

            marker2 = new L.marker([(parseFloat(lat)),(parseFloat(lng))],{
                icon: sl,
                id: jdata[i].deviceid,
                name: jdata[i].devicename
            });

            var popup = '<b>Device:</b> <a href="/device/' + jdata[i].deviceid + '">'+ jdata[i].devicename + '</a><br>'
            + '<b>Voltage: </b>' + jdata[i].voltage + '<br>'
            + '<b>Current: </b>' + jdata[i].current + '<br>'
            + '<b>Power: </b>' + jdata[i].activepower + '<br>'
            + '<b>Date:</b> ' + jdata[i].datecreated + '<br>';
            var popup1 = '<b>'+jdata[i].devicename+'</b>'
            marker2.bindPopup(popup1, {
                maxWidth: 170
            });
            markerClustersDevice.addLayer(marker2);
            arrMarker[i] = marker2
        }
    }
    for (var i = 0; i < jdata.length; i++) {
        try {
            lat = parseFloat(jdata[i].latitude);
            lng = parseFloat(jdata[i].longitude);
            doMap(jdata);
        } catch (error) {
            
        }
    }
    map.addLayer(markerClustersDevice);
}
streetlight();
$("#Street").click(function(){
    $("#Street").addClass('xtive');
    $("#Gateway").removeClass('xtive');
    $("#Feeder").removeClass('xtive');
    map.removeLayer(markerClustersFeeder);
    map.removeLayer(markerClustersGateway);
    map.remove();
    streetlight()
});
$("#Feeder").click(function(){
    $("#Street").removeClass('xtive');
    $("#Gateway").removeClass('xtive');
    $("#Feeder").addClass('xtive');
    map.removeLayer(markerClustersDevice);
    map.removeLayer(markerClustersGateway);
    map.remove()
    var jsonfeeder = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            url: 'json_feeder',
            dataType: "json",
            success: function (data) {
                json = data;
                // console.log(json);
            }
        });
        return json;
    })();
    // console.log(jsonfeeder);
    // console.log(jsonfeeder[0].lat);
    // console.log(jsonfeeder.length);


    var lat = parseFloat(jsonfeeder[0].feederlatitude);
    var lng = parseFloat(jsonfeeder[0].feederlongitude);

    map = L.map('map', {
        zoomControl: false,
        center: [-25.2702, 134.2798],
        zoom: 3,
        // gestureHandling: true,
        fullscreenControl: {
            pseudoFullscreen: false,
            position: 'topright'
        }
    }).setView([lat, lng], 9);

    // map.scrollWheelZoom.disable()
    mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' loranet.my',
        maxZoom: 19
    }).addTo(map);
    // console.log(lat,lng);
    markerClustersFeeder = L.markerClusterGroup();
    for (var i = 0; i < jsonfeeder.length; i++) {
        lat = parseFloat(jsonfeeder[i].feederlatitude);
        lng = parseFloat(jsonfeeder[i].feederlongitude);
        // console.log(lat,lng);

        marker = new L.marker([(parseFloat(lat)),(parseFloat(lng))],{
            icon: feeder
        });
        var popup = '<b>Feeder Name:</b> '+jsonfeeder[i].feedername+'<br><b>Location:</b> '+jsonfeeder[i].map_location+'<br>';
        marker.bindPopup(popup,{
            maxWidth: 170
        });
//        .addTo(map);
        markerClustersFeeder.addLayer(marker);
        arrMarker[i] = marker;
    }
    map.addLayer( markerClustersFeeder );
});
$("#Gateway").click(function(){
    $("#Street").removeClass('xtive');
    $("#Gateway").addClass('xtive');
    $("#Feeder").removeClass('xtive');
    // alert('gateway')
    map.removeLayer(markerClustersDevice);
    map.removeLayer(markerClustersFeeder);
    map.remove()
    var jsongw = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            url: 'json_gateway',
            dataType: "json",
            success: function (data) {
                json = data;
                // console.log(json);
            }
        });
        return json;
    })();
    // console.log(jsongw);
    // console.log(jsongw[0].lat);
    // console.log(jsongw.length);


    var lat = parseFloat(jsongw[0].latitude);
    var lng = parseFloat(jsongw[0].longitude);
    // console.log(lat,lng);
    map = L.map('map', {
        zoomControl: false,
        center: [-25.2702, 134.2798],
        zoom: 3,
        // gestureHandling: true,
        fullscreenControl: {
            pseudoFullscreen: false,
            position: 'topright'
        }
    }).setView([lat, lng], 9);

    // map.scrollWheelZoom.disable()
    mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' loranet.my',
        maxZoom: 19
    }).addTo(map);

    markerClustersGateway = L.markerClusterGroup();
    for (var i = 0; i < jsongw.length; i++) {
        lat = parseFloat(jsongw[i].latitude);
        lng = parseFloat(jsongw[i].longitude);
        // console.log(lat,lng);

        marker = new L.marker([(parseFloat(lat)),(parseFloat(lng))],{
            icon: gateway
        });
        var popup = '<b>Gateway Name:</b> '+jsongw[i].gatewayname+'<br><b>Gateway ID:</b> '+jsongw[i].gatewayid+'<br>';
        marker.bindPopup(popup,{
            maxWidth: 170
        });
//        .addTo(map);
        markerClustersGateway.addLayer(marker);
        arrMarker[i] = marker;
    }
    map.addLayer( markerClustersGateway );
});