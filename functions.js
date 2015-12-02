/* Search Functions */

function searchBar() {

  // Get array of all website names
  var website_names = [];
  var website_objects = {};
  d3.csv("top-websites.csv", function(error, data) {

    data.forEach(function(d) {
      website_names.push(d.site);
      website_objects[d.site] = d;
    });
  });

  $('#search').on('change keyup paste', function() {

    console.log(website_objects);

    var search_term = $('#search').val();

    // Is term in any website name?
    var website = getWebsiteName(website_names, search_term);
    console.log(website);

    // Unhighlight old search result
    var previous_search_result = document.getElementsByClassName('search-result');
    for (var i = 0; i < previous_search_result.length; i++) {
      previous_search_result[i].setAttribute('class', 'dot');
    }

    // If the Website is found
    if (website !== undefined) {

      // Update Details on Demand
      var d = website_objects[website];
      updateDetailsOnDemandForWebsite(d);

      // Highlight Search Result
      document.getElementById(website).setAttribute('class', 'dot search-result');

      var r = Math.abs(rScatter(d.time_on_site)) > 5 ? 5 : rScatter(d.time_on_site) < 0 ? -rScatter(d.time_on_site) : rScatter(d.time_on_site);

      // Blink for 2 seconds
      var BLINK_TIME = 2000;
      var BLINKS = 4;
      var BLINK_SIZE = r * 4;


      for (var i = 0; i < BLINKS; i++) {
        d3.selectAll('.search-result')
          .transition()
          .delay(i * BLINK_TIME/BLINKS)
          .duration(BLINK_TIME/BLINKS)
            .attr("r", function(d) {
              return i % 2 == 0 ? BLINK_SIZE : r;
            });
      }
    }
  });
}

function getWebsiteName(website_names, search_term) {

  // Remove extra whitespace
  search_term = search_term.trim();

  // Edge cases
  if (search_term.length == 0) return undefined;

  // If search term is the exact name of a website
  if (website_names.indexOf(search_term) > -1) {
    return website_names[website_names.indexOf(search_term)];
  }

  // If search term is contained in name of a website
  for (var i = 0; i < website_names.length; i++) {
      if (website_names[i].indexOf(search_term) > -1) {
        return website_names[i];
      }
  }

  // Not found, return undefined
  return undefined;
}

/* Slider Functions */

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
      updateScatterPlot();

      // update bar chart
      updateBarChart();

      // update data table
      populateList();
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

/* Details on Demand Functions */

function updateDetailsOnDemandForWebsite(d) {
  $("#siteName").text(d.site);
  $("#siteCategory").text(d.main_category);
  $("#siteRank").text(numberWithCommas(d.rank));
  $("#siteGlobalRank").text(numberWithCommas(d["global rank"]));
  $("#siteVisitors").text(numberWithCommas(d.unique_visitors));
  $("#siteViews").text(numberWithCommas(d.pageviews));
  $("#siteTime").text(numberWithCommas(d.time_on_site));
}

function populateList() {

  var data = GLOBAL_DATA_SCATTERPLOT.filter(function(d) {
      return (d.rank >= MIN_RANK) && (d.rank <= MAX_RANK) && (SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.indexOf(d.main_category) > -1);
    });

  // clear old list
  $("#data-table").html('');
  
  data.forEach(function(d) {
    $("#data-table")
      .append('<tr>'
                + '<td>' + d.site + '</td>'
                + '<td>' + d.main_category + '</td>'
                + '<td>' + numberWithCommas(d.rank) + '</td>'
                + '<td>' + numberWithCommas(d['global rank']) + '</td>'
                + '<td>' + numberWithCommas(d.unique_visitors) + '</td>'
                + '<td>' + numberWithCommas(d.pageviews) + '</td>'
                + '<td>' + numberWithCommas(d.time_on_site) + '</td>'
              + '</tr>');
  });
}

function updateDetailsOnDemandForAverage(data) {

  var pageviews_sum = 0;
  var visitors_sum = 0;
  var time_sum = 0;
  for (var i = 0; i < data.length; i++) {
    pageviews_sum += parseInt(data[i].pageviews);
    visitors_sum += parseInt(data[i].unique_visitors);
    time_sum += parseInt(data[i].time_on_site);
  }
  var pageviews_avg = parseInt(pageviews_sum / data.length);
  var visitors_avg = parseInt(visitors_sum / data.length);
  var time_avg = parseInt(time_sum / data.length);

  $("#siteName").text("All Websites");
  $("#siteViews").text(numberWithCommas(pageviews_avg));
  $("#siteCategory").text("N/A");
  $("#siteRank").text("1-1000");
  $("#siteGlobalRank").text("1-1000");
  $("#siteVisitors").text(numberWithCommas(visitors_avg));
  $("#siteTime").text(numberWithCommas(time_avg));
}

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
