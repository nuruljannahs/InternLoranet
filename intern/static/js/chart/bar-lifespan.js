
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
  
  var chart = am4core.create("chart_lamplife", am4charts.XYChart);
  chart.padding(30, 30, 30, 30);
  
  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = "percent";
  categoryAxis.renderer.minGridDistance = 1;
  categoryAxis.title.text = 'Lifespan';
  categoryAxis.title.fontWeight = 100;
  categoryAxis.title.fontSize = 13;
  // categoryAxis.renderer.inversed = true;
  categoryAxis.renderer.grid.template.disabled = true;
  
  var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  valueAxis.title.text = 'Number of device';
  valueAxis.title.fontWeight = 100;
  valueAxis.title.fontSize = 13;
  valueAxis.title.align = "center";
  
  // var series = chart.series.push(new am4charts.ColumnSeries());
  // series.dataFields.categoryY = "percent";
  // series.name = "Device";
  // series.dataFields.valueX = "device";
  // series.tooltipText = "{valueX}"
  // series.columns.template.tooltipText = "{Device}: [bold]{valueX}[/]";
  // series.columns.template.strokeOpacity = 0;
  // series.columns.template.column.cornerRadiusBottomRight = 5;
  // series.columns.template.column.cornerRadiusTopRight = 5;
  
  // var labelBullet = series.bullets.push(new am4charts.LabelBullet())
  // labelBullet.label.horizontalCenter = "left";
  // labelBullet.label.dx = 10;
  // // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
  // labelBullet.label.text = "{valueX}";
  // labelBullet.locationX = 1;
  
  // // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
  // series.columns.template.adapter.add("fill", function(fill, target){
  //   return chart.colors.getIndex(target.dataItem.index);
  // });
  
  // categoryAxis.sortBySeries = series;
  // Create series
  function createSeries(field, name) {
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "percent";
    series.name = name;
    series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
    // series.columns.template.height = am4core.percent(100);
    // series.sequencedInterpolation = true;
    series.dataFields.valueX = "device";
    
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;

    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "left";
    labelBullet.label.dx = 10;
    // labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.label.text = "{valueX}";
    labelBullet.locationX = 1;

      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });
  }

  createSeries("device", "Device");
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
      url: '/sYE8kSrGbwM=/jsonviewlamp',
      cache: false,
      success: function (data) {
        // console.log('asd');
        // console.log(data);
        var allrt = [];
        var arrpercent = [10,20,30,40,50,60,70,80,90,100];
        // console.log('asal length:',data.length);
        for(b=0;b < data.length;b++){
          runningtime = data[b].runningtime;
          if (runningtime > 0){
            rn1 = ((runningtime/60)/43800) * 100; // 5years
            allrt.push(parseInt(rn1));
          }
        }
        var arr2d = [[],[],[],[],[],[],[],[],[],[],];
        // console.log('allrt.length:',allrt.length);
        for(k=0;k<allrt.length;k++){
          var dd = allrt[k];
          // console.log(dd);
          for(k2=0;k2<10;k2++){
            var per = arrpercent[k2];
            pertemp = per-10;
            if(dd<=per && dd>=pertemp){
              arr2d[k2].push(dd);
              // break;
            }
          }
        }
        res1 = []
        // console.log(arr2d);
        for(k2=0;k2<10;k2++){
          var d1 = arr2d[k2];
          // console.log(per);
          tot = 0
          // console.log('d1.length:',d1.length);
          if (d1.length>0){
            percent = 'Less '+arrpercent[k2].toString()+'%';
            d = {
              "percent": percent,
              "device": d1.length,
            }
            res1.push(d);
          }
        }
        data2 = res1;
      }
    });
    return data2;
  })();
  // data3 = [{
  //   "percent": '10%',
  //   "device": 5
  // },{
  //   "percent": '20%',
  //   "device": 9
  // },{
  //   "percent": '30%',
  //   "device": 99
  // }];
  // // console.log(data3);
  // // Add data
  // chart.data = data3; //test
  
  
  
}); // end am4core.ready()