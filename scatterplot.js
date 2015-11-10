function scatterPlot() {

	var xAxisScatter = d3.scale.linear()
	    .range([0, width]);

	var yAxisScatter = d3.scale.linear()
	    .range([height, 0]);

	var rScatter = d3.scale.linear()
		.range([.5, 5]);

	var xAxis = d3.svg.axis()
	    .scale(xAxisScatter)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(yAxisScatter)
	    .orient("left");

	// graph canvas
	var graphScatter = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
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

		if (d.main_category === "") {
			d.main_category = "Undefined";
		}
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
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", function(d) {
	      	return rScatter(d.time_on_site);
	      })
	      .attr("cx", function(d) { return xAxisScatter(d.pageviews); })
	      .attr("cy", function(d) { return yAxisScatter(d.unique_visitors); })
	      .style("fill", function(d) { return color(cValue(d));})
	      .on("mouseover", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html(d.site + "<br>" + 
	          			   d.main_category)
	               .style("left", (d3.event.pageX + 5) + "px")
               	   .style("top", (d3.event.pageY - 28) + "px");
      	  })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      });;
	});
}