$(function() {
	
	margin = {top: 20, right: 80, bottom: 30, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


	// Fill Color
	cValue = function(d) { 
			if ('key' in d) {
				return d.key; 
			} else if ('main_category' in d) {
				return d.main_category;
			}
		},
    color = d3.scale.category20();

	scatterPlot();
	barChart();
});

$(function() {
	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: 1000,
		values: [ 0, 1000 ],
		slide: function( event, ui ) {
			// $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		}
	});
});