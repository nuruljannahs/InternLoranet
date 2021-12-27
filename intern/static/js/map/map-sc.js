marker = '';
map = '';
var arrMarker = [];
var markerClustersDevice = []
var markerClustersFeeder = []
var markerClustersGateway = []
var jdata;

var dtfeederlog = '';
var dtmainlog = '';

jdata = (function () {
    var json = null;
    $.ajax({
        async: false,
        global: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Token " + tokenori);
        },
        // url: '/sYE8kSrGbwM=/api/device/json',
        url: '/sYE8kSrGbwM=/api/device/json_v3/'+organizationid,
        dataType: "json",
        success: function (data) {
            json = data;
            // console.log('json_v3 redis');
            // console.log(json);
        }
    });
    return json;
})();

streetlight(); // FIRST OPEN SET STREETLIGHT
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
    feederpillar()
});
$("#Gateway").click(function () {
    $("#Street").removeClass('xtive');
    $("#Gateway").addClass('xtive');
    $("#Feeder").removeClass('xtive');
    // alert('gateway')
    clearInput()
    gateway()
});

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


function streetlight() {
    var zoomset = 8;
    // console.log('streetlight()');
    // console.log(jdata);
    if (jdata.length > 0) {
        var lat = parseFloat(jdata[0].latitude);
        var lng = parseFloat(jdata[0].longitude);
        zoomset = 3;
    } else {
        // hardcode
        var lat = 3.130777
        var lng = 101.68145
    }
    // lat = 1.49349975437045;
    // lng = 103.75142542412507;
    var org = document.getElementById('org').innerHTML;
    // LAT LNG TERTUKAR UNTUK SEPANG, BILA DAH BAIKI, DELETE
    // if (lat==101.639573425054){
    //     var lat = parseFloat(jdata[0].longitude);
    //     var lng = parseFloat(jdata[0].latitude);
    // }
    // console.log('lat:',lat,lng);

    map = L.map('map', {
        zoomControl: false,
        center: [-25.2702, 134.2798],
        zoom: zoomset,
        // gestureHandling: true,
        fullscreenControl: {
            pseudoFullscreen: false,
            position: 'topright'
        }
    }).setView([lat, lng], 9);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // map.scrollWheelZoom.disable()
    mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' loranet.my',
        maxZoom: 19
    }).addTo(map);
    // return;

    var switchs, alarm, status;

    // var markerClustersDevice = L.markerClusterGroup();
    markerClustersDevice = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        maxZoom: 10,
        disableClusteringAtZoom: 16,
    });

    var markers = [];
    var marker2 = [];
    function doMap(datadevices) {
        var checkfrom = false;
        // console.log(datadevices);
        var lattemp = '1.5';
        var lngtemp = '103.7';
        var point = 0.0001;
        for (var k = 0; k < datadevices.length; k++) {
            point += 0.0002
            try {
                lat = parseFloat(datadevices[k].latitude);
                lng = parseFloat(datadevices[k].longitude);
            } catch (error) {
                lat =    lattemp + point
                lng = lngtemp + point
            }
            var a = isNaN(lat);
            if (a==true) {
                lat =    lattemp + point;
                lng = lngtemp + point;
                // console.log('sini lat:',lat);
            }
            // console.log(lat,lng);
            // LAT LNG TERTUKAR UNTUK SEPANG, BILA DAH BAIKI, DELETE
            // if (checkfrom==true){
            //     lat = parseFloat(jdata[0].longitude);
            //     lng = parseFloat(jdata[0].latitude);
            // }
            // if (lat==101.639573425054){
            //     lat = parseFloat(jdata[0].longitude);
            //     lng = parseFloat(jdata[0].latitude);
            //     checkfrom = true;
            // }
            if (datadevices[k].organization == org || datadevices[k].organization == null) {
                switchs = datadevices[k].statuspower;
                alarm = datadevices[k].alarm;
                status = datadevices[k].devicestatus;
                groupid = datadevices[k].groupid
                loadtype = datadevices[k].loadtype
                // console.log(groupid)
                // console.log(k,'Grey ',devicename,', status:',status,' groupid:',groupid,' lat:',lat,' lng:',lng);
    
                try {
                    status = parseInt(status);
                } catch (error) {
                    
                }
                var sl = slblue;
                var devicename = datadevices[k].devicename;
                if (status == 1) {
                    if (alarm == 0) {
                        if (loadtype == 1) {
                            if (switchs == 1) {
                                sl = sltimer_on
                            } else {
                                sl = sltimer
                            }
                        }else{
                            if (switchs == 1) {
                                sl = slyellow;
                            } else {
                                sl = slblue;
                            }
                        }
                    } else {
                        sl = slred;
                    }
                } else {
                    sl = slgrey;
                }
    
                marker2 = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
                    icon: sl,
                    id: datadevices[k].deviceid,
                    name: devicename,
                    deveui: datadevices[k].deviceeui
                }).addTo(markerClustersDevice);
    
                marker2.on('click', markerOnClick);
    
                function markerOnClick(e) {
                    var id = this.options.id
                    markerFunction(id, false)
                }
    
                var popup = '<b>Device:</b> <a href="/sYE8kSrGbwM=/device/' + datadevices[k].deviceid + '">' + datadevices[k].devicename + '</a><br>'
                    + '<b>Voltage: </b>' + datadevices[k].voltage + '<br>'
                    + '<b>Current: </b>' + datadevices[k].current + '<br>'
                    + '<b>Power: </b>' + datadevices[k].activepower + '<br>'
                    + '<b>Date:</b> ' + datadevices[k].datecreated + '<br>';
                var popup1 = '<b>' + datadevices[k].devicename + '</b>'
                marker2.bindPopup(popup1, {
                    maxWidth: 170
                });
    
                arrMarker[k] = marker2
            } else if (org == 1) {
                // console.log('map-sc org == 1');
                switchs = datadevices[k].statuspower;
                alarm = datadevices[k].alarm;
                status = datadevices[k].devicestatus;
    
                if (status == 1) {
                    if (alarm == 0) {
                        if (loadtype == 1) {
                            if (switchs == 1) {
                                sl = sltimer_on
                            } else {
                                sl = sltimer;
                            }
                        }else{
                            if (switchs == 1) {
                                sl = slyellow;
                            } else {
                                sl = slblue;
                            }
                        }
                    } else {
                        sl = slred;
                    }
                } else {
                    sl = slgrey;
                }
    
                marker2 = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
                    icon: sl,
                    id: datadevices[k].deviceid,
                    name: datadevices[k].devicename,
                    deveui: datadevices[k].deviceeui
                }).addTo(markerClustersDevice);
    
                marker2.on('click', markerOnClick);
    
                function markerOnClick(e) {
                    var id = this.options.id;
                    markerFunction(id, false)
                }
    
                var popup = '<b>Device:</b> <a href="/sYE8kSrGbwM=/device/' + datadevices[k].deviceid + '">' + datadevices[k].devicename + '</a><br>'
                    + '<b>Voltage: </b>' + datadevices[k].voltage + '<br>'
                    + '<b>Current: </b>' + datadevices[k].current + '<br>'
                    + '<b>Power: </b>' + datadevices[k].activepower + '<br>'
                    + '<b>Date:</b> ' + datadevices[k].datecreated + '<br>';
                var popup1 = '<b>' + datadevices[k].devicename + '</b>'
                marker2.bindPopup(popup1, {
                    maxWidth: 170
                });
    
                arrMarker[k] = marker2
            }
        }
    }
    doMap(jdata);


    function myStopFunction() {
        clearInterval(myVar);
    }
    try {
        myStopFunction();
    } catch (error) {
        
    }
    function checkonoff() {
        // console.log('SINI');
        $.ajax({
            async: true,
            global: false,
            url: '/sYE8kSrGbwM=/devstat',
            success: function (data) {
                var json = data.split(",");
                for (var lo in arrMarker) {
                    var deviceeui = arrMarker[lo].options.deveui;
                    if (deviceeui == json[0]) {
                        if (json[1] == 0) {
                            arrMarker[lo].setIcon(slblue);
                            // console.log('set slblue:',deviceeui);
                        } else {
                            arrMarker[lo].setIcon(slyellow);
                            // console.log('set yellow:',deviceeui);
                        }
                    }
                }
            }
        });
    }
    // uncomment this
    // myVar = setInterval(checkonoff, 1000);


    map.addLayer(markerClustersDevice);

    function markerFunction(id, cond) {
        for (var m in arrMarker) {
            if (arrMarker[m].options.id == id) {
                var lat = arrMarker[m]._latlng.lat
                var lng = arrMarker[m]._latlng.lng
                $("#myInput").val(arrMarker[m].options.name)
                $("#kadscroll").css('display', 'block');
                $("#kad").css('display', 'block');
                $("#searchicon").css('display', 'none')
                $("#timeicon").css('display', 'inline')
                longlatS(lng, lat, lat)
                if (cond == true) {
                    arrMarker[m].openPopup();
                }
            }
        }
        get_kad_data(id)
        // console.log(id)
    }

    function get_kad_data(id) {
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
                if(role > 3){
                    $("#devicename").html("<a href='/sYE8kSrGbwM=/device/" + response.deviceid + "'>" + response.devicename + "</a><a href='/sYE8kSrGbwM=/deviceView/"+response.deviceid+"'><i class='ml-3 fas fa-cog' style='font-size:20px;color:#0078A8'></i></a>")
                }else{
                    $("#devicename").html("<a href='/sYE8kSrGbwM=/device/" + response.deviceid + "'>" + response.devicename + "</a>")
                }
                $("#deviceeui").html(response.deviceeui)
                $("#dev_main").html(response.deviceeui)
                for (var j in jdata) {
                    if (id == jdata[j].deviceid) {
                        $("#voltage").html(jdata[j].voltage)
                        $("#current").html(jdata[j].current)
                        $("#power").html(jdata[j].activepower)
                        $("#qdate").html(jdata[j].datecreated)
                        $("#lamp_img_on").html('<img width="200px" src="/'+response.imgon+'">')
                        $("#lamp_img").html('<img width="200px" src="/'+response.imgoff+'">')
                        if (jdata[j].statuspower == 1) {
                            $("#lamp_img_on").show()
                            $("#lamp_img").hide()
                            // $("#lamp_img").html('<img width="200px" src="../static/img/led-on.png">')
                        } else {
                            $("#lamp_img_on").hide()
                            $("#lamp_img").show()
                            // $("#lamp_img").html('<img width="200px" src="../static/img/led.png">')
                        }
                        log_function(response)

                    }
                }
                for (var i in ddata) {
                    if (id == ddata[i].pk) {
                        var comment = ddata[i].fields.comment;
                        var dateupdated = ddata[i].fields.dateupdated.replace('T', ' ');
                        console.log('comment ',comment);
                        if (comment == null || comment == '' || comment == 'None') {
                            $("#remark").hide()
                        } else {
                            $("#remark").show()
                            $("#remark").html(comment);
                        }
                        $("#joindate").html('Join date: ' + dateupdated);
                    }
                }
            }
        });
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
                        markerFunction(listval.split(",")[3], true);
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

    function log_function(response) {
        $('#mainlog').DataTable().destroy();
        dtmainlog = $('#mainlog').DataTable({
            "ajax": {
                url: '/sYE8kSrGbwM=/jsonMaintenanceDevice/' + response.deviceeui,
                dataSrc: function (json) {
                    // console.log('slightAlarm');
                    // console.log(json[0]);
                    return json; //return json.data;
                }
            },
            "columns": [
                { "data": "num", "defaultContent": "" },
                { "data": "datecreated", "defaultContent": "" },
                { "data": "faultytype", "defaultContent": "" },
                { "data": "username", "defaultContent": "" },
                // { "data": "img", "defaultContent": "" },
                {   "data": "img",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if(oData.img != '-'){
                            $(nTd).html(`<img src="`+oData.link+`" width="100" height="100"/><br><a href="`+oData.link+`" target="_blank">`+oData.img+`</a>`);
                        }  
                },  "defaultContent": ""},
                {   "data": "description",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if(oData.description == '') {
                            $(nTd).html(`-`);
                        }
                    },
                    "defaultContent": "" 
                },
                {
                    "data"     :     "",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (parseInt(role) > 4) {
                            $(nTd).html("<button class='buttons-ok' >Delete</button>");
                        }
                    },
                    "defaultContent": ""
                }
            ]
        });
        if (parseInt(role) < 5) {
            dtmainlog.columns(5).visible(false);
        }
    }
    $('#mainlog').on('click', 'tbody .buttons-ok', function () {
        var row = dtmainlog.row($(this).closest('tr'));
        var data_row = row.data();
        logid = data_row.logid;
        // console.log(data_row.logid);
        // return
        removemaintenance(logid,row);
    });
    $('#feederlog').on('click', 'tbody .buttons-ok', function () {
        var row = dtfeederlog.row($(this).closest('tr'));
        var data_row = row.data();
        logid = data_row.logid;
        // console.log(data_row.logid);
        // return
        removemaintenance(logid,row);
    });
    function removemaintenance(logid,row){
        var r = confirm("Are you sure to remove?");
        if (r == true) {
          row.remove().draw();
          $.ajax({
            beforeSend: function (xhr, settings) {
              if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
              }
            },
            type: 'POST',
            url: '/sYE8kSrGbwM=/removemaintenancereport',
            data: ({ logid: logid }),
            success: function (data) {
                console.log('Result :'+data);
            }
          });
        }
    }

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("myInput"), jdata);


    // map.addLayer(markerClustersDevice);
}

function feederpillar() {
    map.removeLayer(markerClustersDevice);
    map.removeLayer(markerClustersGateway);
    map.remove();
    var jsonfeeder = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            url: '/sYE8kSrGbwM=/json_feeder',
            dataType: "json",
            success: function (data) {
                json = data;
                // console.log('json_feeder');
                // console.log(json);
            }
        });
        return json;
    })();

    var zoomset = 8;
    if (jsonfeeder.length > 0) {    
        var lat = parseFloat(jsonfeeder[0].feederlatitude);
        var lng = parseFloat(jsonfeeder[0].feederlongitude);
        zoomset = 3;
    } else {
        // hardcode
        var lat = 3.130777
        var lng = 101.68145
    }
    

    map = L.map('map', {
        zoomControl: false,
        center: [-25.2702, 134.2798],
        zoom: zoomset,
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
        maxZoom: 19,
    }).addTo(map);
    // console.log(lat,lng);
    markerClustersFeeder = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        maxZoom: 10,
        disableClusteringAtZoom: 16,
    });
    for (var i = 0; i < jsonfeeder.length; i++) {
        lat = parseFloat(jsonfeeder[i].feederlatitude);
        lng = parseFloat(jsonfeeder[i].feederlongitude);
        var earth_leakage = jsonfeeder[i].earth_leakage;
        var energy = jsonfeeder[i].energy;
        var lastdatetime = jsonfeeder[i].datetime;
        var feederid = jsonfeeder[i].feederid;
        var io_input = jsonfeeder[i].io_input;
        var devicestatus = jsonfeeder[i].devicestatus;
        var feedername = jsonfeeder[i].feedername;
        var lastseen = jsonfeeder[i].lastseen;
        // console.log(lat,lng);
        var iconfeeder = feeder;
        if (devicestatus=='offline') {
            iconfeeder = feeder_yellow;
        } else if (devicestatus=='online') {
            iconfeeder = feeder_green;
        }

        marker = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            icon: iconfeeder,
            id: feederid
        }).addTo(markerClustersFeeder).on('click', markerOnClick);
        var popup = '<b>Feeder Name:</b> ' + feedername + '<br><b>Location:</b> ' + jsonfeeder[i].map_location + '<br>';
        if (io_input==1) {
            popup = '<table><tr><td colspan=3><span class="opensansbold"><a href="/sYE8kSrGbwM=/feeder/'+feederid+'">'+feedername+'</a></span></td></tr>\
            <tr><td><span class="opensansbold">Date:&nbsp</span></td> <td colspan=2>'+lastdatetime+'</td></tr>\
            <tr><td><span class="opensansbold">Status:&nbsp</span></td> <td colspan=2>'+devicestatus+'</td></tr></table>';
            // console.log('pop here');
        }
        if (energy==1 || earth_leakage==1) {
            var jsonenergy = jsonfeeder[i].objects_list_energy;
            var p1_v=p2_v=p3_v= p1_c=p2_c=p3_c=p1_p=p2_p=p3_p=total_kwh=date_created=elr1=elr2=0;
            var divenergy=divelr1=divelr2='';
            if (energy==1) {
                if (jsonenergy.length>0) {
                    if (jsonenergy[0].length > 0) {
                        // console.log(jsonenergy[0]);
                        var p1_v = jsonenergy[0][0].p1_v;
                        var p2_v = jsonenergy[0][0].p2_v;
                        var p3_v = jsonenergy[0][0].p3_v;
                        var p1_c = jsonenergy[0][0].p1_c;
                        var p2_c = jsonenergy[0][0].p2_c;
                        var p3_c = jsonenergy[0][0].p3_c;
                        divenergy = '<tr><td><span class="opensansbold">Red:&nbsp</span></td> <td>'+p1_c+' A</td><td>&nbsp'+p1_v+' V</td></tr>\
                        <tr><td><span class="opensansbold">Blue:&nbsp</span></td> <td>'+p2_c+' A</td><td>&nbsp'+p2_v+' V</td></tr>\
                        <tr><td><span class="opensansbold">Yellow:&nbsp</span></td> <td>'+p3_c+' A</td><td>&nbsp'+p3_v+' V</td></tr>';
                    }
                }
            }
            if (earth_leakage==1) {
                try {
                    if (jsonenergy[1].length > 0) {
                        var elr1 = jsonenergy[1][0].ampere;
                        var overcurrent = jsonenergy[1][1].oc;
                        divelr1 = '<tr><td><span class="opensansbold">ELR1:&nbsp</span></td> <td colspan=2>'+elr1+'/'+overcurrent+' mA</td></tr>';
                    }
                    if (jsonenergy[2].length > 0) {
                        var elr2 = jsonenergy[2][0].ampere;
                        var overcurrent = jsonenergy[2][1].oc;
                        divelr2 = '<tr><td><span class="opensansbold">ELR2:&nbsp</span></td> <td colspan=2>'+elr2+'/'+overcurrent+' mA</td></tr>';
                    }
                } catch (error) {
                    
                }
            }
            popup = '<table class="text-align-left"><tr><td colspan=3><span class="opensansbold"><a href="/feeder/'+feederid+'">'+feedername+'</a></span></td></tr>\
            <tr><td><span class="opensansbold">Date:&nbsp</span></td> <td colspan=2>'+lastdatetime+'</td></tr>\
            '+divenergy+'\
            '+divelr1+'\
            '+divelr2+'\
            <tr><td style="padding-top:10px;"><span class="opensansbold">Last Seen:&nbsp</span></td> <td style="padding-top:10px;" colspan=2>'+lastseen+'</td></table>';

        }
        marker.bindPopup(popup, {
            maxWidth: 170
        });

        function markerOnClick(e) {
            var id = this.options.id;
            var io_input = 0;
            for (var x in jsonfeeder) {
                if (jsonfeeder[x].feederid == id) {
                    feedername = jsonfeeder[x].feedername;
                    lng = jsonfeeder[x].feederlatitude;
                    lat = jsonfeeder[x].feederlongitude;
                    locationF = jsonfeeder[x].map_location;
                    img = jsonfeeder[x].img;
                    io_input = jsonfeeder[x].io_input;
                    break;
                }
            }
            $("#idbtnviewio").hide();
            if (io_input==1){
                $("#idbtnviewio").show();
                showtab(id);
            }
            $('#myInput2').val(feedername);
            $("#kadFeed").css('display', 'block');
            $("#feedername").html("<a href='/sYE8kSrGbwM=/feeder/" + id + "'>" + feedername + "</a>");
            $("#deviceeui").html(id);
            $("#longlat").html(locationF);
            $("#feeder_id").html(id);
            $("#locationF").html('  ' + lng.substr(0, 7) + ',' + lat.substr(0, 9));
            $("#lamp_imgF").html('<img width="150px" src="/'+img+'">');
            $("#searchiconF").css('display', 'none');
            $("#timeiconF").css('display', 'inline');

            feeder_log(id)
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

    function feeder_log(id) {
        // console.log('Error:'+role);
        $('#feederlog').DataTable().destroy()
        dtfeederlog = $('#feederlog').DataTable({
            "ajax": {
                url: '/sYE8kSrGbwM=/jsonMaintenanceFeeder/' + id,
                dataSrc: function (json) {
                    // console.log('slightAlarm');
                    // console.log(json[0]);
                    return json; //return json.data;
                }
            },
            "columns": [
                { "data": "num", "defaultContent": "" },
                { "data": "datecreated", "defaultContent": "" },
                { "data": "description", "defaultContent": "" },
                { "data": "username", "defaultContent": "" },
                // { "data": "img", "defaultContent": "" },
                {   "data"     :     "img",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if(oData.img != '-'){
                    $(nTd).html(`<img src="`+oData.link+`" width="100" height="100"/><br><a href="`+oData.link+`" target="_blank">`+oData.img+`</a>`);
                    }  
                }, "defaultContent": ""},
                {
                    "data"     :     "",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        if (parseInt(role) > 4) {
                            $(nTd).html("<button class='buttons-ok' >Delete</button>");
                        }
                    },
                    "defaultContent": ""
                }
            ]
        });
        if (parseInt(role) < 5) {
            dtfeederlog.columns(5).visible(false);
        }
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
}

function gateway() {
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
                // console.log('json_gateway');
                // console.log(json);
            }
        });
        return json;
    })();
    // console.log(jsongw);
    // console.log(jsongw[0].lat);
    // console.log(jsongw.length);

    var zoomset = 8;
    if (jsongw.length > 0) {    
        var lat = parseFloat(jsongw[0].latitude);
        var lng = parseFloat(jsongw[0].longitude);
        zoomset = 3;
    } else {
        // hardcode
        var lat = 3.130777
        var lng = 101.68145
    }

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
            icon: gatewayIcon
        });
        var popup = '<b>Gateway Name:</b> ' + jsongw[i].gatewayname + '<br><b>Gateway ID:</b> ' + jsongw[i].gatewayid ;
        marker.bindPopup(popup, {
            maxWidth: 170
        });
        //        .addTo(map);
        markerClustersGateway.addLayer(marker);
        arrMarker[i] = marker;
    }
    map.addLayer(markerClustersGateway);
}