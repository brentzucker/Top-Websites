var clicked = {};

function barChart(min_rank, max_rank) {

	var margin = {top: 20, right: 80, bottom: 30, left: 10},
	    width = 960/2 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	/* Global Variables used for Update */
	xScaleBar = d3.scale.linear()
		.range([0, width]);

	yScaleBar = d3.scale.ordinal()
		.rangeRoundBands([0, height], .1);

	xAxisBar = d3.svg.axis()
		.scale(xScaleBar)
		.orient("bottom")
		.ticks(10);

	yAxisBar = d3.svg.axis()
		.scale(yScaleBar)
		.orient("left")
        .tickValues(0);

    // graph canvas
	var graphBar = d3.select("#bar-chart")
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

			// set rank as index
			data[i].rank = i+1;
		}

		var data = data.filter(function(d) {
	  		return (d.rank >= min_rank) && (d.rank <= max_rank);
	  	});

		var data = d3.nest()
			.key(function(d) { return d.main_category; })
			.rollup(function(leaves) { return leaves.length; })
			.entries(data);
		
		
		for(i = 0;i < data.length;i++){
			clicked[data[i].key] = 0;
			console.log(data[i].key);
		}
		console.log(clicked);

		data.sort(function(a, b) {
			return b.values - a.values;
		});

	  yScaleBar.domain(data.map(function(d) { return d.key; }));
	  xScaleBar.domain([0, d3.max(data, function(d) { return d.values; })]);

	  graphBar.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxisBar);

	  graphBar.append("g")
		  .attr("class", "y axis")
		  .call(yAxisBar);

	  graphBar.selectAll(".bar")
		  .data(data)
		  .enter()
		  .append("rect")
		  .attr("class", "bar")
		  .attr("y", function(d) { return yScaleBar(d.key); })
		  .attr("height", yScaleBar.rangeBand())
		  .attr("x", function(d) { return 0; })
		  .attr("width", function(d) { return xScaleBar(d.values); })
		  .style("fill", function(d) { return color(cValue(d)); })
          .text(function(d) { return d.key; })
          .on("click", function(d){
							filterPlot(d);
					  });
	
      graphBar.selectAll(".bartext")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bartext")
          .attr("x", function(d) {
            return 3;
          })
          .attr("y", function(d) {
            return yScaleBar(d.key) + yScaleBar.rangeBand()/2 + 4;
          })
          .text(function(d) {
            return d.key;
          })
          .style("fill", "black");

	});

	function type(d) {
	  d.values = +d.values;
	  return d;
	}
}

function updateBarChart(min_rank, max_rank) {

    // Get the data again
    d3.csv("top-websites.csv", function(error, data) {
	  	
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

			// set rank as index
			data[i].rank = i+1;
		}

		var data = data.filter(function(d) {
	  		return (d.rank >= min_rank) && (d.rank <= max_rank);
	  	});

	  	var data = d3.nest()
			.key(function(d) { return d.main_category; })
			.rollup(function(leaves) { return leaves.length; })
			.entries(data);

		data.sort(function(a, b) {
			return b.values - a.values;
		});

    	// Scale the range of the data again 
    	yScaleBar.domain(data.map(function(d) { return d.key; }));
	  	xScaleBar.domain([0, d3.max(data, function(d) { return d.values; })]);


	    // Select the section we want to apply our changes to
	    var svg = d3.select("#bar-chart");

	    /* Update Bar Chart Values */ 

    	// Remove all bars
    	svg.selectAll(".bar")
    		.remove();
    	
    	// New value of bars
    	svg.selectAll(".bar")
		  .data(data)
		  .enter()
		  .append("rect")
		  .attr("class", "bar")
		  .attr("y", function(d) { return yScaleBar(d.key); })
		  .attr("height", yScaleBar.rangeBand())
		  .attr("x", function(d) { return 0; })
		  .attr("width", function(d) { return xScaleBar(d.values); })
		  .style("fill", function(d) { return color(cValue(d)); })
          .text(function(d) { return d.key; });

	    // svg.selectAll(".bar")
	    //     .duration(750)
	    //     // .remove()
	    //     .attr("y", function(d) { return yScaleBar(d.key); })
		  	// .attr("height", yScaleBar.rangeBand())
		  	// .attr("x", function(d) { return 0; })
		  	// .attr("width", function(d) { return xScaleBar(d.values); })
		  	// .style("fill", function(d) { return color(cValue(d)); });
	    
	    /* Update Axis */
	    svg.select(".x.axis")
	    	.transition() // change the x axis
	        .duration(750)
	        .call(xAxisBar);
	    svg.select(".y.axis")
	    	.transition() // change the y axis
	        .duration(750)
	        .call(yAxisBar);

	    /* Update Bar Chart Text */ 
	    svg.selectAll(".bartext")
	    	.remove();

	    svg.selectAll(".bartext")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bartext")
          .attr("x", function(d) {
            return 3;
          })
          .attr("y", function(d) {
            return yScaleBar(d.key) + yScaleBar.rangeBand()/2 + 4;
          })
          .text(function(d) {
            return d.key;
          });

    });
  }
  // Link logic when bar is brushed
  function filterPlot(bar){
	  // If category not clicked, set clicked
	  if(!(clicked[bar.key])){
			  clicked[bar.key] = 1;
	  } else {
		  clicked[bar.key] = 0;
	  }
	    
	  // Fade out unclicked categories
	  var graphScatter = d3.select("#scatter-plot");
	  var graphBar = d3.select("#bar-chart");
	  graphBar.selectAll(".bar")
		.filter( function(d){
			return (clicked[d.key]);
		})
		.attr("style", "outline: thin solid black;")
		.style("fill", function(d) { return color(cValue(d)); })
          .text(function(d) { return d.key; });

	  graphBar.selectAll(".bar")
		.filter( function(d){
			return (!clicked[d.key]);
		})
		.attr("style", "outline: none;")
		.style("fill", function(d) { return color(cValue(d)); })
          .text(function(d) { return d.key; });
	
		
	  graphScatter.selectAll(".dot")
	  .filter( function (d) {
		  return (!clicked[d.main_category]);
      })
      .transition()
      .delay(100)
      .duration(400)
      .style("opacity", .25);
      
      // Fade in clicked category
      graphScatter.selectAll(".dot")
	  .filter( function (d) {
		  return (clicked[d.main_category]);
      })
      .transition()
      .delay(100)
      .duration(400)
      .style("opacity", 1);
}

