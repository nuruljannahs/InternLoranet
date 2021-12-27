var arrMarkerSl = [];
map = '';
marker = '';
function streetlight() {
    var jdata = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Token "+tokenori);
            },
            url: '/sYE8kSrGbwM=/api/device/json',
            dataType: "json",
            success: function (data) {
                json = data;
                // console.log(json);
            }
        });
        return json;
    })();

    autocomplete(document.getElementById("myInput"), jdata);

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
    }).setView([lat, lng], 9);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // map.scrollWheelZoom.disable()
    mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' | <a href="https://www.loranet.my">loranet.my</a>',
        maxZoom: 19
    }).addTo(map);


    markerClustersDevice = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        maxZoom: 10,
        disableClusteringAtZoom: 16,
    });


    for (var i = 0; i < jdata.length; i++) {
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

        var marker = new L.marker([(parseFloat(lat)), (parseFloat(lng))], {
            icon: sl,
            id: jdata[i].deviceid,
            name: jdata[i].devicename,
            deveui: jdata[i].deviceeui
        }).addTo(markerClustersDevice);
        
        marker.on('click', markerOnClick);

        function markerOnClick(e) {
            var id = this.options.id;
            markerFunction(id,false)
        }

        var popup = '<b>' + jdata[i].devicename + '</b>'
        marker.bindPopup(popup, {
            maxWidth: 170
        });

        markerClustersDevice.addLayer(marker)
        arrMarkerSl[i] = marker
    }
    map.addLayer(markerClustersDevice);
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
                    inp.value = listval.split(",", 1)
                    longitude = listval.split(",")[1]
                    latitude = listval.split(",")[2]

                    markerFunction(listval.split(",")[3],true)
                    
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

function markerFunction(id,cond) {
    for(var n in arrMarkerSl){
        element = arrMarkerSl[n]
        var slight = arrMarkerSl[n].options
        if(slight.id == id){
            // console.log(arrMarkerSl[n])
            setlng = arrMarkerSl[n]._latlng.lng
            setlat = arrMarkerSl[n]._latlng.lat
            zoom = slight.zoom
            if(cond==true){
                element.openPopup();
                // var popup ='poop'
                // arrMarkerSl[n]._popup.setContent(popup);
            }
            // longlatS(arrMarkerSl[n]._latlng.lng,arrMarkerSl[n]._latlng.lat,arrMarkerSl[n]._latlng.lat)
        }
    }
    var latlng = new L.LatLng(setlat, setlng);
    map.setView(latlng, 19);
    // map.removeLayer(markerClustersDevice);
}

streetlight()