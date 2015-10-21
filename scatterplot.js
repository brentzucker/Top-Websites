function scatterPlot() {

	var margin = {top: 20, right: 80, bottom: 30, left: 80},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("top-websites.csv", function(error, data) {
	  if (error) throw error;

	  data.forEach(function(d) {
	    d.unique_visitors = +d.unique_visitors;
	    d.pageviews = +d.pageviews;
	  });

	  x.domain(d3.extent(data, function(d) { return d.pageviews; })).nice();
	  y.domain(d3.extent(data, function(d) { return d.unique_visitors; })).nice();

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

	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", function(d) { return x(d.pageviews); })
	      .attr("cy", function(d) { return y(d.unique_visitors); });
	});
}