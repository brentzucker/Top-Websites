function barChart() {
	var margin = {top: 20, right: 80, bottom: 250, left: 80},
		width = 960 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var svg = d3.select("body").append("svg")
		.attr("class", "barchart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("top-websites.csv", type, function(error, data) {
	  if (error) throw error;

	  /* Clean up data */

	  // Split up the category names
		for (var i = 0; i < data.length; i++) {

			// Fix weird formatting (it duplicates the category name sometimes)
			var category = data[i].category.split('-');
			if (category[0].substring(category[0].length/2 + 1) === category[0].substring(0, category[0].length/2)) {
				data[i].main_category = category[0].substring(category[0].length/2 + 1);
			} else {
				data[i].main_category = category[0];
			}
			data[i].sub_category = category[1];

			if (data[i].main_category === "") {
				data[i].main_category = "Undefined";
			}
		}

		var data = d3.nest()
			.key(function(d) { return d.main_category; })
			.rollup(function(leaves) { return leaves.length; })
			.entries(data);

		data.sort(function(a, b) {
			return b.values - a.values;
		});
		console.log(data);

	  x.domain(data.map(function(d) { return d.key; }));
	  y.domain([0, d3.max(data, function(d) { return d.values; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .selectAll("text")  
	      .style("text-anchor", "end")
	      .attr("dx", "-.8em")
	      .attr("dy", ".15em")
	      .attr("transform", "rotate(-65)" );

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("values");

	  svg.selectAll(".bar")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.key); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.values); })
		  .attr("height", function(d) { return height - y(d.values); });
	});

	function type(d) {
	  d.values = +d.values;
	  return d;
	}
}