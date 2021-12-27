
var csrftoken = getCookie('csrftoken');
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

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
        
    // Create chart instance
    var chart = am4core.create("chart_costsaving", am4charts.XYChart);

    // Add percent sign to all numbers
    chart.numberFormatter.numberFormat = "'RM' #.#";

    // Add data
    // chart.data = [{
    //     "month": "USA",
    //     "actualcost": 3.5,
    //     "savingcost": 4.2
    // }, {
    //     "month": "UK",
    //     "actualcost": 1.7,
    //     "savingcost": 3.1
    // }];

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.cellStartLocation = 0.4;
    categoryAxis.renderer.cellEndLocation = 0.6;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.title.fontSize = 13;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Cost";
    valueAxis.title.fontWeight = 100;
    valueAxis.title.fontSize = 13;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "savingcost";
    series.dataFields.categoryX = "month";
    series.clustered = true;
    series.tooltipText = "Saving: [bold]{valueY}[/]";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopLeft = 100;
    series.columns.template.column.cornerRadiusTopRight = 100;
    
    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "actualcost";
    series.dataFields.categoryX = "month";
    series.clustered = true;
    series.tooltipText = "Actual: [bold]{valueY}[/]";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusTopLeft = 100;
    series.columns.template.column.cornerRadiusTopRight = 100;

    // var series2 = chart.series.push(new am4charts.ColumnSeries());
    // series2.dataFields.valueY = "actualcost";
    // series2.dataFields.categoryX = "month";
    // // series2.clustered = false;
    // series2.columns.template.width = am4core.percent(100);
    // series2.tooltipText = "Actual cost {categoryX} (2005): [bold]{valueY}[/]";
    // series2.strokeWidth = 1;
    // series2.tensionX = 0.7;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });

    chart.data = (function () {
        var data2 = null;
        $.ajax({
          beforeSend: function (xhr, settings) {
              if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                  xhr.setRequestHeader("X-CSRFToken", csrftoken);
              }
          },
          type: 'POST',
          async: false,
          global: false,
          // dataType: "json",
          url: '/sYE8kSrGbwM=/jsoncostsaving',
          cache: false,
          success: function (data) {
            // console.log('jsoncostsaving');
            // console.log(data2);
            data2 = data;
            return;
          }
        });
        return data2;
    })();
    
    
}); // end am4core.ready()