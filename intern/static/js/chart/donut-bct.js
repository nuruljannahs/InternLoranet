anychart.onDocumentReady(function () {

    // create data
    // var data = [
    //   { x: "Light Off", value: 637166 },
    //   { x: "Light On", value: 721630 },
    //   { x: "Offline", value: 148662 },
    //   { x: "D", value: 78662 },
    //   { x: "E", value: 90000 }
    // ];
    // console.log('tokenori donut-bct.js: ',tokenori);
    json_data = (function () {
        var json = null;
        $.ajax({
            async: false,
            global: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Token "+tokenori);
            },
            url: '/sYE8kSrGbwM=/jsonviewlamp',
            // dataType: "json",
            success: function (data) {
                json = data;
                console.log('jsonviewlamp');
                console.log(json);
            }
        });
        return json;
    })();
    var count_off = 0, count_on = 0, count_offline = 0
    for (var i in json_data) {
        if (json_data[i].statuspower == 1) {
            count_on = count_on + 1
        }
        else if (json_data[i].devicestatus == 0) {
            count_offline = count_offline + 1
        }
    }
    count_off = json_data.length - count_on - count_offline

    var array_data = [
        {
            x: 'Light On', value: count_on, legendItem: {
                iconType: "circle"
            }, fill: '#FFCB04'
        },
        {
            x: 'Light Off', value: count_off, legendItem: {
                iconType: "circle"
            }, fill: '#80cbc4'
        },
        {
            x: 'Offline', value: count_offline, legendItem: {
                iconType: "circle"
            }, fill: '#303f9f'
        }
    ]

    // create a pie chart and set the data
    var chart = anychart.pie(array_data);

    /* set the inner radius
    (to turn the pie chart into a doughnut chart)*/
    chart.innerRadius("50%");

    // legend font color
    chart.legend().fontColor("white")

    // set the chart title
    // chart.title("Device Status");

    // set background color
    chart.background().fill("#37333a");

    // set the container id
    chart.container("donutchart");

    // disable context menu
    chart.contextMenu(false);

    // initiate drawing the chart
    chart.draw();
});