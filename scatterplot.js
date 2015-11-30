function scatterPlot(min_rank, max_rank) {

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

	  var index = 1;
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

		d.rank = index;
		index++;
	  });

	  var data = data.filter(function(d) {
	  	return (d.rank >= min_rank) && (d.rank <= max_rank);
	  });


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
	      // .filter(function(d) { return (d.rank >= min_rank) && (d.rank <= max_rank); })
	      .attr("class", "dot")
	      .attr("r", function(d) { return rScatter(d.time_on_site); })
	      .attr("cx", function(d) { return xAxisScatter(d.pageviews); })
	      .attr("cy", function(d) { return yAxisScatter(d.unique_visitors); })
	      .style("fill", function(d) { return color(cValue(d));})
	      .style("opacity", .25)
	      .on("mouseover", function(d) {
			$("#siteName").text(d.site);
			$("#siteCategory").text(d.main_category);
			$("#siteRank").text(d.rank);
			$("#siteGlobalRank").text(d["global rank"]);
			$("#siteVisitors").text(d.unique_visitors);
			$("#siteViews").text(d.pageviews);
			$("#siteTime").text(d.time_on_site);
      	  })
      	  .on("mouseout", function(d) {
      	  	var pageviews_sum = 0;
      	  	for (var i = 0; i < data.length; i++) {
      	  		pageviews_sum += data[i].pageviews
      	  	}
      	  	var pageviews_avg = parseInt(pageviews_sum / data.length);
      	  	$("#siteViews").text(pageviews_avg);
      	  })
	});
}
function updateScatterPlot(min_rank, max_rank) {

    // Get the data again
    d3.csv("top-websites.csv", function(error, data) {

	  	var index = 1;
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

			d.rank = index;
			index++;
		  });

		var data = data.filter(function(d) {
	  		return (d.rank >= min_rank) && (d.rank <= max_rank);
	  	});

    	// Scale the range of the data again
    	xAxisScatter.domain(d3.extent(data, function(d) { return d.pageviews; })).nice();
	  	yAxisScatter.domain(d3.extent(data, function(d) { return d.unique_visitors; })).nice();
	  	rScatter.domain(d3.extent(data, function(d) { return d.time_on_site; })).nice();


	    // Select the section we want to apply our changes to
	    var svg = d3.select("#scatter-plot").transition();

    	// Make the changes
	    svg.selectAll(".dot")
	        .duration(750)
	        .attr("r", function(d) { return Math.abs(rScatter(d.time_on_site)) > 5 ? 5 : rScatter(d.time_on_site) < 0 ? -rScatter(d.time_on_site) : rScatter(d.time_on_site); })
	      	.attr("cx", function(d) { return xAxisScatter(d.pageviews); })
	      	.attr("cy", function(d) { return yAxisScatter(d.unique_visitors); });
	    svg.select(".x.axis") // change the x axis
	        .duration(750)
	        .call(xAxis);
	    svg.select(".y.axis") // change the y axis
	        .duration(750)
	        .call(yAxis);

    });
}
