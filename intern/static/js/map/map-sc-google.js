marker = '';
map = '';
var arrMarker = [];
var markerClustersDevice = []
var markerClustersFeeder = []
var markerClustersGateway = []
var jdata;

function streetlight() {
    
    // device map
    jdata = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Token "+tokenori);
            },
            // url: '/sYE8kSrGbwM=/api/device/json',
            url: '/sYE8kSrGbwM=/api/device/json_v3/'+organizationid,
            dataType: "json",
            success: function (data) {
                // console.log('map sc /sYE8kSrGbwM=/api/device/json');
                // console.log(data);
                json = data;
                // console.log(json);
            }
        });
        return json;
    })();
    // console.log(jdata);
    // console.log(jdata[0].lat);
    // console.log(jdata.length);
    // return;

    var lat = parseFloat(jdata[0].latitude);
    var lng = parseFloat(jdata[0].longitude);
    var org = document.getElementById('org').innerHTML;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: lng},
        zoom: 7,
        mapTypeControl: false,
        streetViewControl: true
    });
    // console.log('slred2: ',slred2);
    var slred = {url:slred2, scaledSize: new google.maps.Size(15, 15)};
    var slyellow = {url:slyellow2, scaledSize: new google.maps.Size(15, 15)};
    var slgreen = {url:slgreen2, scaledSize: new google.maps.Size(15, 15)};
    var slgrey = {url:slgrey2, scaledSize: new google.maps.Size(15, 15)};
    var slblack = {url:slblack2, scaledSize: new google.maps.Size(15, 15)};
    var slblue = {url:slblue2, scaledSize: new google.maps.Size(15, 15)};
    var feeder = {url:feeder2, scaledSize: new google.maps.Size(15, 15)};
    var gateway = {url:gateway2, scaledSize: new google.maps.Size(15, 15)};

    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close(); 
    });

    var markers = [];
    var marker2 = [];
    var dict = [];
    for (var i = 0; i < jdata.length; i++) {
        if (jdata[i].organization == org) {
        // if(2 == org){
            lat = parseFloat(jdata[i].latitude);
            lng = parseFloat(jdata[i].longitude);
            switchs = jdata[i].statuspower;
            alarm = jdata[i].alarm;
            status = jdata[i].devicestatus;
            sl = slgrey;
            if (status == 1) {
                if (alarm == 0) {
                    if (switchs == 1) {
                        sl = slgreen;
                    } else {
                        
                    }
                } else {
                    sl = slred;
                }
            } else {
                sl = slblue;
            }

            // marker2 = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            //     icon: sl,
            //     id: jdata[i].deviceid,
            //     name: jdata[i].devicename,
            //     deveui: jdata[i].deviceeui
            // }).addTo(markerClustersDevice);

            // marker2.on('click', markerOnClick);

            // function markerOnClick(e){
            //     var id = this.options.id
            //     markerFunction(id,false)
            // }

            // var popup = '<b>Device:</b> <a href="/sYE8kSrGbwM=/device/' + jdata[i].deviceid + '">' + jdata[i].devicename + '</a><br>'
            //     + '<b>Voltage: </b>' + jdata[i].voltage + '<br>'
            //     + '<b>Current: </b>' + jdata[i].current + '<br>'
            //     + '<b>Power: </b>' + jdata[i].activepower + '<br>'
            //     + '<b>Date:</b> ' + jdata[i].datecreated + '<br>';
            // var popup1 = '<b>' + jdata[i].devicename + '</b>'
            // marker2.bindPopup(popup1, {
            //     maxWidth: 170
            // });
            // arrMarker[i] = marker2;
            dict.push({
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                icon: sl,
                org: jdata[i].organization,
                deviceid: jdata[i].deviceid,
                deviceeui: jdata[i].deviceeui,
                devicename: jdata[i].devicename,
                voltage: jdata[i].voltage,
                current: jdata[i].current,
                activepower: jdata[i].activepower,
                datecreated: jdata[i].datecreated,
                alarm: alarm
            });
        } else if (org == 1) {
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
            // dict.push({
            //     lat: parseFloat(lat),
            //     lng: parseFloat(lng)
            // });
        }
    }
    console.log('dict');
    console.log(dict);
    const markers2 = dict.map((dev1, i) => {
        // console.log('i:'+i+' '+dev1.icon);
        lat = parseFloat(dev1.lat);
        lng = parseFloat(dev1.lng);
        latlng = {
            lat: lat,
            lng: lng
        }
        // console.log(latlng);
        var mark = new google.maps.Marker({
          position: latlng,
        //   label: 'i',
          icon: dev1.icon
        });
        var popup = '<b>Device:</b> <a href="/sYE8kSrGbwM=/device/' + dev1.deviceid + '">' + dev1.devicename + '</a><br>'
                + '<b>Voltage: </b>' + dev1.voltage + '<br>'
                + '<b>Current: </b>' + dev1.current + '<br>'
                + '<b>Power: </b>' + dev1.activepower + '<br>'
                + '<b>Date:</b> ' + dev1.datecreated + '<br>';
        google.maps.event.addListener(mark, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(popup);
                infowindow.open(map, marker);
            }
        })(mark, i));
        return mark;
      });
      // Add a marker clusterer to manage the markers.
      new MarkerClusterer(map, markers2, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        maxZoom: 16,
      });
      return;

    // setInterval(function () {
    //     $.ajax({
    //         async: true,
    //         global: false,
    //         url: '/sYE8kSrGbwM=/devstat',
    //         success: function (data) {
    //             json = data.split(",");
    //             for (var i in arrMarker) {
    //                 deviceeui = arrMarker[i].options.deveui
    //                 if (deviceeui == json[0]) {
    //                     if (json[1] == 0) {
    //                         arrMarker[i].setIcon(slgrey);
    //                     } else {
    //                         arrMarker[i].setIcon(slgreen);
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }, 1000);
    map.addLayer(markerClustersDevice);

    function markerFunction(id,cond) {
        for (var i in arrMarker) {
            if (arrMarker[i].options.id == id) {
                var lat = arrMarker[i]._latlng.lat
                var lng = arrMarker[i]._latlng.lng
                $("#myInput").val(arrMarker[i].options.name)
                $("#kadscroll").css('display', 'block');
                $("#kad").css('display', 'block');
                $("#searchicon").css('display', 'none')
                $("#timeicon").css('display', 'inline')
                longlatS(lng, lat, lat)
                if(cond == true){
                    arrMarker[i].openPopup();
                }
            }
        }
        $.ajax({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            type: 'POST',
            url: '/sYE8kSrGbwM=/getjsondevice',
            data: ({ deviceid: id }),
            success: function (response) {
                // console.log('getjsondevice: ',response.deviceid);
                $("#devicename").html("<a href='/device/" + response.deviceid + "'>" + response.devicename + "</a>")
                $("#deviceeui").html(response.deviceeui)
                for (var j in jdata) {
                    if (id == jdata[j].deviceid) {
                        $("#voltage").html(jdata[j].voltage)
                        $("#current").html(jdata[j].current)
                        $("#power").html(jdata[j].activepower)
                        if (jdata[j].statuspower == 1) {
                            $("#lamp_img_on").show()
                            $("#lamp_img").hide()
                            // $("#lamp_img").html('<img width="200px" src="../static/img/led-on.png">')
                        } else {
                            $("#lamp_img_on").hide()
                            $("#lamp_img").show()
                            // $("#lamp_img").html('<img width="200px" src="../static/img/led.png">')
                        }
                    }
                }
                for( var i in ddata){
                    if(id == ddata[i].pk){
                        var comment = ddata[i].fields.comment;
                        var dateupdated = ddata[i].fields.dateupdated.replace('T',' ');
                        $("#remark").html(comment);
                        $("#joindate").html('Join date: '+dateupdated);
                    }
                }
            }
        });
        // console.log(id)
    }

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                // if (arr[i].devicename.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                if (arr[i].devicename.toUpperCase().indexOf(val.toUpperCase()) > -1) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].devicename.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].devicename.substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i].devicename + "," + arr[i].longitude + "," + arr[i].latitude + "," + arr[i].deviceid + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        listval = this.getElementsByTagName("input")[0].value;
                        inp.value = listval.split(",", 1);
                        longitude = listval.split(",")[1];
                        latitude = listval.split(",")[2];
                        // console.log('longitude: ', longitude);
                        // longlatS(longitude,latitude,longitude)
                        markerFunction(listval.split(",")[3],true);
                        // $("#kadscroll").css('display', 'block');
                        // $("#kad").css('display', 'block')
                        // $("#searchicon").css('display', 'none')
                        // $("#timeicon").css('display', 'inline')
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("myInput"), jdata);

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    // map.addLayer(markerClustersDevice);
}
// streetlight();
$("#Street").click(function () {
    $("#Street").addClass('xtive');
    $("#Gateway").removeClass('xtive');
    $("#Feeder").removeClass('xtive');
    $("#src_device_id").show()
    $("#src_feeder_id").hide()
    clearInput()
    map.removeLayer(markerClustersFeeder);
    map.removeLayer(markerClustersGateway);
    map.remove();
    streetlight();
});
$("#Feeder").click(function () {
    $("#Street").removeClass('xtive');
    $("#Gateway").removeClass('xtive');
    $("#Feeder").addClass('xtive');
    $("#src_device_id").hide()
    $("#src_feeder_id").show()
    clearInput()
    map.removeLayer(markerClustersDevice);
    map.removeLayer(markerClustersGateway);
    map.remove()
    var jsonfeeder = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            url: '/sYE8kSrGbwM=/json_feeder',
            dataType: "json",
            success: function (data) {
                json = data;
                // console.log(json);
            }
        });
        return json;
    })();

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

        marker = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            icon: feeder,
            id: jsonfeeder[i].feederid
        }).addTo(markerClustersFeeder).on('click', markerOnClick);
        var popup = '<b>Feeder Name:</b> ' + jsonfeeder[i].feedername + '<br><b>Location:</b> ' + jsonfeeder[i].map_location + '<br>';
        marker.bindPopup(popup, {
            maxWidth: 170
        });

        function markerOnClick(e) {
            var id = this.options.id;
            for (var x in jsonfeeder) {
                if (jsonfeeder[x].feederid == id) {
                    feedername = jsonfeeder[x].feedername
                    lng = jsonfeeder[x].feederlatitude
                    lat = jsonfeeder[x].feederlongitude
                    locationF = jsonfeeder[x].map_location
                }
            }
            $('#myInput2').val(feedername)
            $("#kadFeed").css('display', 'block')
            $("#feedername").html("<a href='/feeder/" + id + "'>" + feedername + "</a>")
            $("#deviceeui").html(id)
            $("#longlat").html(locationF)
            $("#locationF").html('  ' + lng.substr(0, 7) + ',' + lat.substr(0, 9))
            $("#lamp_imgF").html('<img width="150px" src="../static/img/feeder.png">')
            $("#searchiconF").css('display', 'none')
            $("#timeiconF").css('display', 'inline')
        }

        // .addTo(map);
        markerClustersFeeder.addLayer(marker);
        arrMarker[i] = marker;
    }
    function markerFunction(id) {
        for (var i in arrMarker) {
            if (arrMarker[i].options.id == id) {
                var lat = arrMarker[i]._latlng.lat;
                var lng = arrMarker[i]._latlng.lng;
                longlatS(lng, lat, lat);
                // console.log(arrMarker[i]);
            }
        }
        for (var x in jsonfeeder) {
            if (jsonfeeder[x].feederid == id) {
                feedername = jsonfeeder[x].feedername
            }
        }
        $("#kadFeed").css('display', 'block')
        $("#feedername").html("<a href='/feeder/" + id + "'>" + feedername + "</a>")
        $("#deviceeui").html(id)
        $("#lamp_imgF").html('<img width="150px" src="../static/img/feeder.png">')
        $("#searchiconF").css('display', 'none')
        $("#timeiconF").css('display', 'inline')
    }

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                // if (arr[i].devicename.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                if (arr[i].feedername.toUpperCase().indexOf(val.toUpperCase()) > -1) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].feedername.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].feedername.substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i].feedername + "," + arr[i].feederlongitude + "," + arr[i].feederlatitude + "," + arr[i].feederid + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        listval = this.getElementsByTagName("input")[0].value;
                        inp.value = listval.split(",")[0]
                        longitude = listval.split(",")[1]
                        latitude = listval.split(",")[2]
                        // console.log(longitude)
                        // longlatS(longitude, latitude, longitude)

                        markerFunction(listval.split(",")[3])

                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("myInput2"), jsonfeeder);

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    map.addLayer(markerClustersFeeder);
});
$("#Gateway").click(function () {
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
            url: '/sYE8kSrGbwM=/json_gateway',
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

        marker = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            icon: gateway
        });
        var popup = '<b>Gateway Name:</b> ' + jsongw[i].gatewayname + '<br><b>Gateway ID:</b> ' + jsongw[i].gatewayid + '<br>';
        marker.bindPopup(popup, {
            maxWidth: 170
        });
        //        .addTo(map);
        markerClustersGateway.addLayer(marker);
        arrMarker[i] = marker;
    }
    map.addLayer(markerClustersGateway);
});
