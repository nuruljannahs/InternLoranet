google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    realData = $("#jsonstat").html()
    readData = JSON.parse(realData)
    var data = google.visualization.arrayToDataTable(readData);

    var options = {
        // title: 'My Daily Activities',
        pieHole: 0.4,
        backgroundColor: '#29262F',
        // width: '100%',
        legend: {textStyle: {color: 'white'}},
        chartArea: {width: '100%', height: '100%'}
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
}