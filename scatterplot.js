var GLOBAL_DATA_SCATTERPLOT = [];

function scatterPlot() {

	var margin = {top: 20, right: 0, bottom: 30, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	/* Global Variables (So that way update can reference them) */
	xAxisScatter = d3.scale.linear()
	    .range([0, width]);

	yAxisScatter = d3.scale.linear()
	    .range([height, 0]);

	rScatter = d3.scale.linear()
		.range([.5, 5]);

	xAxis = d3.svg.axis()
	    .scale(xAxisScatter)
	    .orient("bottom");

	yAxis = d3.svg.axis()
	    .scale(yAxisScatter)
	    .orient("left");

	// graph canvas
	var graphScatter = d3.select("#scatter-plot")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// tooltip area to the webpage
	var tooltip = d3.select("#tooltip")
	    .attr("class", "tooltip")
	    .style("opacity", 0);

	d3.csv("top-websites.csv", function(error, data) {
	  if (error) throw error;

	  data.forEach(function(d) {

	    d.unique_visitors = +d.unique_visitors;
	    d.pageviews = +d.pageviews;

	    // Organize categories
		var category = d.category.split('-');
		if (category[0].substring(category[0].length/2 + 1) === category[0].substring(0, category[0].length/2)) {
			d.main_category = category[0].substring(category[0].length/2 + 1);
		} else {
			d.main_category = category[0];
		}
		d.sub_category = category[1];
	  });

	  // Save data in GLOBAL_DATA_SCATTERPLOT so it only has to be read in once
	  GLOBAL_DATA_SCATTERPLOT = data;

	  xAxisScatter.domain(d3.extent(data, function(d) { return d.pageviews; })).nice();
	  yAxisScatter.domain(d3.extent(data, function(d) { return d.unique_visitors; })).nice();
	  rScatter.domain(d3.extent(data, function(d) { return d.time_on_site; }));

	  // xAxisScatter-axis
	  graphScatter.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Page Views (U.S.)");

	  // yAxisScatter-axis
	  graphScatter.append("g")
	      .attr("class", "yAxisScatter axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Unique Visitors (U.S.)")

	  // draw dots
	  graphScatter.selectAll(".dot")
	      .data(data)
	      .enter()
	      .append("circle")
	      .attr("class", "dot")
	      .attr("id", function(d) { return d.site; })
	      .attr("r", function(d) { return rScatter(d.time_on_site); })
	      .attr("cx", function(d) { return xAxisScatter(d.pageviews); })
	      .attr("cy", function(d) { return yAxisScatter(d.unique_visitors); })
	      .style("fill", function(d) { return color(cValue(d));})
	      .on("click", function(d) {
	      	var win = window.open('http://' + d.site, '_blank');
	      	if(win){
    			//Browser has allowed it to be opened
    			win.focus();
			} else {
    			//Broswer has blocked it
    			alert('To visit site, please allow popups.');
			}
	      })
	      .on("mouseover", function(d) {
			updateDetailsOnDemandForWebsite(d);
      	  })
      	  .on("mouseout", function(d) {
      	  	updateDetailsOnDemandForAverage(data);
      	  })
	});
}

function updateScatterPlot() {

    // Use Global Data
    var data = GLOBAL_DATA_SCATTERPLOT;

	var website_names_all = [];
	data.forEach(function(d) {
	    d.unique_visitors = +d.unique_visitors;
	    d.pageviews = +d.pageviews;

	    // Organize categories
		var category = d.category.split('-');
		if (category[0].substring(category[0].length/2 + 1) === category[0].substring(0, category[0].length/2)) {
			d.main_category = category[0].substring(category[0].length/2 + 1);
		} else {
			d.main_category = category[0];
		}
		d.sub_category = category[1];

		// List all website names
		website_names_all.push(d.site);
	  });

	var data = data.filter(function(d) {
  		return (d.rank >= MIN_RANK) && (d.rank <= MAX_RANK) && (SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.indexOf(d.main_category) > -1);
  	});

  	// Get List of remaining website names
  	var website_names_filtered = [];
  	data.forEach(function(d) { website_names_filtered.push(d.site); });

  	// Hide dots not selected
  	for (var i = 0; i < website_names_all.length; i++) {

  		var w = document.getElementById(website_names_all[i]);
  		var classes = w.getAttribute('class');

  		// If the website name is not in the filtered list, hide it
  		if (website_names_filtered.indexOf(website_names_all[i]) < 0) {

  			if (classes.indexOf('hide') < 0) {
  				w.setAttribute('class', classes + ' hide');
  			}
  		} else {
  			// Make sure dot does not have class 'hide'
  			classes = classes.replace('hide', '');
  			w.setAttribute('class', classes);
  		}
  	}

	// Re Scale the selected range of the data
	xAxisScatter.domain(d3.extent(data, function(d) { return d.pageviews; })).nice();
  	yAxisScatter.domain(d3.extent(data, function(d) { return d.unique_visitors; })).nice();
  	rScatter.domain(d3.extent(data, function(d) { return d.time_on_site; })).nice();


    // Select the section we want to apply our changes to
    var svg = d3.select("#scatter-plot");

	// Update Dots
    svg.selectAll(".dot")
    	.transition()
        .duration(750)
        .attr("r", function(d) { return Math.abs(rScatter(d.time_on_site)) > 5 ? 5 : rScatter(d.time_on_site) < 0 ? -rScatter(d.time_on_site) : rScatter(d.time_on_site); })
      	.attr("cx", function(d) { return xAxisScatter(d.pageviews); })
      	.attr("cy", function(d) { return yAxisScatter(d.unique_visitors); });

    // Update axises
    svg.select(".x.axis") // change the x axis
    	.transition()
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
    	.transition()
        .duration(750)
        .call(yAxis);
}