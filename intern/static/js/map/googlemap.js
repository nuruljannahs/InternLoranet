// console.log('Google Maps');
marker = '';
map = '';
var arrMarker = [];
var markerClustersDevice = [];
var markerClustersFeeder = [];
var markerClustersGateway = [];
var jdata;
// function initMap() {
//   }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
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
                // console.log('/sYE8kSrGbwM=/api/device/json');
                // console.log(data);
                json = data;
            }
        });
        return json;
    })();
    // console.log(jdata);
    // console.log(jdata[0].lat);
    // console.log(jdata.length);


    var lat = parseFloat(jdata[0].latitude);
    var lng = parseFloat(jdata[0].longitude);
    var org = document.getElementById('org').innerHTML;
    org = parseInt(org);
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: lng},
        zoom: 7
    });
    infoWindow = new google.maps.InfoWindow;
    // console.log(lat,lng);

    // map = L.map('map', {
    //     zoomControl: false,
    //     center: [-25.2702, 134.2798],
    //     zoom: 3,
    //     // gestureHandling: true,
    //     fullscreenControl: {
    //         pseudoFullscreen: false,
    //         position: 'topright'
    //     }
    // }).setView([lat, lng], 10);

    // L.control.zoom({
    //      position:'bottomright'
    // }).addTo(map);

    // map.scrollWheelZoom.disable()
    // mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; ' + mapLink + ' loranet.my',
    //     maxZoom: 19
    // }).addTo(map);

    // var switchs, alarm, status;
    // return;
    // var markerClustersDevice = L.markerClusterGroup();
    markerClustersDevice = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        maxZoom: 10,
        disableClusteringAtZoom: 16,
    });

    var markers = [];
    var marker2 = [];
    var dict = [];
    // console.log('jdata len:'+jdata.length);
    for (var i = 0; i < jdata.length; i++) {
        // if(2 == org){
        if(jdata[i].organization == org){
            lat = parseFloat(jdata[i].latitude);
            lng = parseFloat(jdata[i].longitude);
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
            arrMarker[i] = marker2;
            dict.push({
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            })
        }
        else if(org == 1){
            lat = parseFloat(jdata[i].latitude);
            lng = parseFloat(jdata[i].longitude);
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
            arrMarker[i] = marker2;
            dict.push({
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            })
        }
    }
    // console.log(dict);
    // map.addLayer(markerClustersDevice);
    const markers2 = dict.map((location, i) => {
        // console.log('i:'+i);
        return new google.maps.Marker({
          position: location,
        //   label: 'i',
        });
      });
      // Add a marker clusterer to manage the markers.
      new MarkerClusterer(map, markers2, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      });
}
// streetlight();