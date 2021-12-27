am4core.ready(function() {

	var chart = am4core.create("donutchart", am4charts.PieChart);
	var donutjson = document.getElementById('jsonstat').innerHTML
	// console.log(donutjson)
	// chart.data = [{"status": "light off", "count": 170
	// 		},{"status": "light on", "count": 3
	// 		},{"status": "offline", "count": 2
	// 		}]
	chart.data = JSON.parse(donutjson);
	var pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.value = "count";
	pieSeries.dataFields.category = "status";
	pieSeries.labels.template.disabled = true;
	// Let's cut a hole in our Pie chart the size of 40% the radius
	chart.innerRadius = am4core.percent(60);
	chart.width = '100%';
	chart.position = 'center';
	// Put a thick white border around each Slice
	pieSeries.slices.template.stroke = am4core.color("#fff");
	pieSeries.slices.template.strokeWidth = 0.4;
	pieSeries.slices.template.strokeOpacity = 4;

	// const legendContainer = am4core.create('legend', am4core.Container);
	// legendContainer.width = am4core.percent(100);
	// legendContainer.height = am4core.percent(100);

	// chart.legend = new am4charts.Legend();
	// chart.legend.parent = legendContainer;
	// chart.legend.position = "right";

	// Add a legend
	chart.legend = new am4charts.Legend();
	chart.legend.labels.template.fontSize = 10;
	chart.legend.fontSize = 10;
	var markerTemplate = chart.legend.markers.template;
	markerTemplate.width = 10;
	markerTemplate.height = 10;
	chart.legend.position = "right";
	chart.legend.itemContainers.template.paddingRight = 110;
});
	