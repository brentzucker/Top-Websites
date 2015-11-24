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

	scatterPlot(1, 1000);
	barChart();
	drawSlider();
});

function drawSlider() {

	// Append slider to bottom of body
	$('body').append($('#slider-range'));

	// Create Slider
    $( "#slider-range" ).slider({
      range: true,
      min: 1,
      max: 1000,
      values: [ 1, 1000 ],
      slide: function( event, ui ) {

        var rank = {'min': ui.values[0],
                    'max': ui.values[1]};

        $('#left_corner').html(rank['min']);
        $('#right_corner').html(rank['max']);

        console.log(rank);
      }
    });

    // Initialize left and right corners with id's
    $('span.ui-slider-handle.ui-state-default.ui-corner-all').each(function(i) {

      if ($(this).css('left') == '0px') {
        $(this).attr('id', 'left_corner');
      } else {
        $(this).attr('id', 'right_corner');
      }
    });

    // Initialize corners with default values
    $('#left_corner').html($( "#slider-range" ).slider('values', 0));
    $('#right_corner').html($( "#slider-range" ).slider('values', 1));

    // Initialize slider's width to fit under scatter plot
    var margin_left = 80 + 'px';
    var width = 960 - 80 + 'px';

    $('#slider-range').css('margin-left', margin_left);
    $('#slider-range').css('width', width);
}