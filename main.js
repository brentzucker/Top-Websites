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

  searchBar();
	scatterPlot(1, 1000);
	barChart(1, 1000);
	drawSlider();
});

function drawSlider() {

	// Create Slider
    $("#slider-range").slider({
      range: true,
      min: 1,
      max: 1000,
      values: [ 1, 1000 ],
      slide: function( event, ui ) {

        var rank = {'min': ui.values[0],
                    'max': ui.values[1]};

        $('#left_corner').html(rank['min']);
        $('#right_corner').html(rank['max']);

        // update scatter plot
        updateScatterPlot(rank['min'], rank['max']);

        // update bar chart
        updateBarChart(rank['min'], rank['max']);
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
}

function searchBar() {

  // Get array of all website names
  var website_names = [];
  d3.csv("top-websites.csv", function(error, data) {

    data.forEach(function(d) {
      website_names.push(d.site);
    });
  });

  $('#search').on('change keyup paste', function() {
    
    // console.log(website_names);
    var search_term = $('#search').val();

    // Is term in any website name?
    var website = getWebsiteName(website_names, search_term);
    console.log(website);
    
    // $('#' + website).attr('class', 'search-result');
    document.getElementById(website).setAttribute('class', 'dot search-result');
  });
}

function getWebsiteName(website_names, search_term) {
  
  // If search term is the exact name of website
  if (website_names.indexOf(search_term) > -1) return website_names[website_names.indexOf(search_term)];
  return undefined;
}