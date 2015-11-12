$(function() {
	
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