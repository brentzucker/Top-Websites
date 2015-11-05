function barChart() {
    var margin = {top: 20, right: 80, bottom: 30, left: 80},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

	var yScale = d3.scale.ordinal()
		.rangeRoundBands([0, height], .1);

	var xScale = d3.scale.linear()
		.range([0, width]);

    // fill color
    var cValue = function(d) { return d.key; },
    color = d3.scale.category20();

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(10);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
        .tickValues(0);

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

	  yScale.domain(data.map(function(d) { return d.key; }));
	  xScale.domain([0, d3.max(data, function(d) { return d.values; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis);

	  svg.selectAll(".bar")
		  .data(data)
		  .enter()
		  .append("rect")
		  .attr("class", "bar")
		  .attr("y", function(d) { return yScale(d.key); })
		  .attr("height", yScale.rangeBand())
		  .attr("x", function(d) { return 0; })
		  .attr("width", function(d) { return xScale(d.values); })
		  .style("fill", function(d) { return color(cValue(d)); })
          .text(function(d) { return d.key; });
	
      svg.selectAll(".bartext")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bartext")
          .attr("x", function(d) {
            return 3;
          })
          .attr("y", function(d) {
            return yScale(d.key) + yScale.rangeBand()/2 + 4;
          })
          .text(function(d) {
            return d.key;
          });

	});

	function type(d) {
	  d.values = +d.values;
	  return d;
	}
}