function scatterPlot() {

	var margin = {top: 20, right: 80, bottom: 30, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	// fill color
	var cValue = function(d) { return d.main_category; },
		color = d3.scale.category20();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	// graph canvas
	var svg = d3.select("body").append("svg")
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

	  x.domain(d3.extent(data, function(d) { return d.pageviews; })).nice();
	  y.domain(d3.extent(data, function(d) { return d.unique_visitors; })).nice();

	  // x-axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Page Views (U.S.)");

	  // y-axis
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Unique Visitors (U.S.)")

	  // draw dots
	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", function(d) { return x(d.pageviews); })
	      .attr("cy", function(d) { return y(d.unique_visitors); })
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
	  
	  // draw legend
	  var legend = svg.selectAll(".legend")
	      .data(color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  // draw legend colored rectangles
	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  // draw legend text
	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d;})

	});
}