//General barchart template was followed but heavily modified with personalizations
/* Super Global Variables */
SUPER_GLOBAL_CATEGORY_NAMES = [];

/* Global Variables */
var clicked = {};
var numCategories;
var global_dataBarChart = [];

var margin = {top: 20, right: 80, bottom: 30, left: 10},
    width = 960/2 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var xScaleBar = d3.scale.linear()
	.range([0, width]);

var yScaleBar = d3.scale.ordinal()
	.rangeRoundBands([0, height], .1);

var xAxisBar = d3.svg.axis()
	.scale(xScaleBar)
	.orient("bottom")
	.ticks(10);

var yAxisBar = d3.svg.axis()
	.scale(yScaleBar)
	.orient("left")
    .tickValues(0);

function barChart() {

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

		// Save data in global_dataBarChart so it only has to be read in once
		global_dataBarChart = data;

		var data = d3.nest()
			.key(function(d) { return d.main_category; })
			.rollup(function(leaves) { return leaves.length; })
			.entries(data);

		// Set numCategories for filterPlot function
		numCategories = data.length;

		data.sort(function(a, b) {
			return b.values - a.values;
		});

		// Save category names in Super Global variable to pass into dropdown
		data.forEach(function(d) {
			SUPER_GLOBAL_CATEGORY_NAMES.push(d.key);

			// Add to List of Categories to Display (used for updating)
			SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.push(d.key);
		});

		// Populate the data table
	  	populateList();

		for(i = 0;i < data.length;i++){
			clicked[data[i].key] = 0;
		}

		yScaleBar.domain(data.map(function(d) { return d.key; }));
		xScaleBar.domain([0, d3.max(data, function(d) { return d.values; })]);

		graphBar.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxisBar)
		  .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Number of Websites");;

		graphBar.append("g")
		  .attr("class", "y axis")
		  .call(yAxisBar);

		graphBar.selectAll(".bar")
		  .data(data)
		  .enter()
		  .append("rect")
		  .attr("class", function(d) { return 'bar ' + d.key; })
		  .attr("y", function(d) { return yScaleBar(d.key); })
		  // .attr("height", yScaleBar.rangeBand()/2)
	  	  .attr("height", 6)
		  .attr("x", function(d) { return 0; })
		  .attr("width", function(d) { return xScaleBar(d.values); })
		  .style("fill", function(d) { return color(cValue(d)); })
		  .text(function(d) { return printCategory(d.key); })
		  .on("click", function(d) {

		  	// Toggle Clicked class
/*		  	d3.select(this)
			  .classed("bar-clicked", function (d, i) {
			    return !d3.select(this).classed("bar-clicked");
			  });
*/
			//filterPlot(d); // cancel out what mouseover did
		  	filterPlot(d);
		  })
		  .on("mouseover", function(d) {

		  	// If not clicked do the mouseover function
//		  	if (!d3.select(this).classed("bar-clicked")) {
			//if(!clicked[d.key]){
		  		hoverPlot(d);
		  		populateListForOneCategory(d.key);
		  	//}
		  })
		  .on("mouseout", function(d) {

		  	// If not clicked do the mouseout function
//		  	if (!d3.select(this).classed("bar-clicked")) {
			if(!clicked[d.key]){
				var graphScatter = d3.select("#scatter-plot");

		  		graphScatter.selectAll(".dot")
				.transition()
				.delay(100)
				.duration(400)
				.style("opacity", 1);

				graphBar.selectAll(".bar")
				.style("stroke-width", 0)
				.style("fill", function(d) { return color(cValue(d)); })
				  .text(function(d) { return printCategory(d.key); });
		  		populateList();
		  	}
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
		    return yScaleBar(d.key) + 15;
		  })
		  .text(function(d) {
		    return printCategory(d.key);
		  })
		  .style("fill", "black");

	});

	function type(d) {
	  d.values = +d.values;
	  return d;
	}
}

function updateBarChart() {
	console.log("Updating bar chart");
	// Use Global Data
    var data = global_dataBarChart;

	var data = data.filter(function(d) {
  		return (d.rank >= MIN_RANK) && (d.rank <= MAX_RANK) && (SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.indexOf(d.main_category) > -1);
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
	  .attr("class", function(d) { return 'bar ' + d.key; })
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	  .attr("y", function(d) { return yScaleBar(d.key); })
	  // .attr("height", yScaleBar.rangeBand()/2)
	  .attr("height", 6)
	  .attr("x", function(d) { return 0; })
	  .attr("width", function(d) { return xScaleBar(d.values); })
	  .style("fill", function(d) { return color(cValue(d)); })
      .text(function(d) { return printCategory(d.key); })
      .on("click", function(d) {

	  	// Toggle Clicked class
/*	  	d3.select(this)
		  .classed("bar-clicked", function (d, i) {
		    return !d3.select(this).classed("bar-clicked");
		  });
*/
//		filterPlot(d); // cancel out what mouseover did
	  	filterPlot(d);
	  })
	  .on("mouseover", function(d) {

	  	// If not clicked do the mouseover function
	  //	if (!d3.select(this).classed("bar-clicked")) {
	  		hoverPlot(d);
	  		populateListForOneCategory(d.key);
	  //	}
	  })
	  .on("mouseout", function(d) {

	  	// If not clicked do the mouseout function
	  	//if (!d3.select(this).classed("bar-clicked")) {
	  	if(!clicked[d.key]){
			var graphScatter = d3.select("#scatter-plot");
			var graphBar = d3.select("#bar-chart");
			console.log("In update unclicked mouseout");
			graphScatter.selectAll(".dot")
			.transition()
			.delay(100)
			.duration(400)
			.style("opacity", 1);

			graphBar.selectAll(".bar")
			.style("stroke-width", 0)
			.style("fill", function(d) { return color(cValue(d)); })
		    .text(function(d) { return printCategory(d.key); });
	  		populateList();
	  	}
	  });

	svg.selectAll(".bar")
	  .filter( function(d){
	  	return (clicked[d.key]);
	  })
	  .style("stroke", "black")
	  .style("stroke-width", 1)
	  .style("fill", function(d) { return color(cValue(d)); })
        .text(function(d) { return printCategory(d.key); });


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
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("fill", "black")
      .attr("class", "bartext")
      .attr("x", function(d) {
        return 3;
      })
      .attr("y", function(d) {
        return yScaleBar(d.key) + 15;
      })
      .text(function(d) {
        return printCategory(d.key);
      });
}

function hoverPlot(bar){
	var graphScatter = d3.select("#scatter-plot");
	var graphBar = d3.select("#bar-chart");

	// If bar already clicked, do nothing
	if(clicked[bar.key]){
		return;
	} else {
		for (var key in clicked){
			clicked[key] = 0;
		}
		graphBar.selectAll(".bar")
			.filter( function(d){
				return (bar.key==d.key);
			})
			.style("stroke", "black")
			.style("stroke-width", 1)
			.style("fill", function(d) { return color(cValue(d)); })
			  .text(function(d) { return printCategory(d.key); });

		graphBar.selectAll(".bar")
		.filter( function(d){
			return bar.key!=d.key;
		})
		.style("stroke-width", 0)
		.style("fill", function(d) { return color(cValue(d)); })
		  .text(function(d) { return printCategory(d.key); });

		graphScatter.selectAll(".dot")
		.filter( function (d) {
		  return (bar.key != d.main_category);
		})
		.transition()
		.delay(100)
		.duration(400)
		.style("opacity", .25);

		// Fade in clicked category
		graphScatter.selectAll(".dot")
		.filter( function (d) {
		  return (bar.key == d.main_category);
		})
		.transition()
		.delay(100)
		.duration(400)
		.style("opacity", 1);
	}
}


// Link logic when bar is brushed
function filterPlot(bar, index){
	var graphScatter = d3.select("#scatter-plot");
	var graphBar = d3.select("#bar-chart");
	// If unclicking category, refocus all nodes
	if(clicked[bar.key]){
		// Set all bars unclicked
		for(key in clicked){
			clicked[key]=0;
		}

		graphScatter.selectAll(".dot")
		.transition()
		.delay(100)
		.duration(400)
		.style("opacity", 1);

		graphBar.selectAll(".bar")
		.style("stroke-width", 0)
		.style("fill", function(d) { return color(cValue(d)); })
		  .text(function(d) { return (d.key); });
	} else {
		// console.log("Bar not clicked");
		// Fade out unclicked categories
		for(var key in clicked){
			clicked[key]=0;
		}
		clicked[bar.key]=1;
		graphBar.selectAll(".bar")
			.filter( function(d){
				return (bar.key==d.key);
			})
			.style("stroke", "black")
			.style("stroke-width", 1)
			.style("fill", function(d) { return color(cValue(d)); })
			  .text(function(d) { return printCategory(d.key); });

		graphBar.selectAll(".bar")
		.filter( function(d){
			return bar.key!=d.key;
		})
		.style("stroke-width", 0)
		.style("fill", function(d) { return color(cValue(d)); })
		  .text(function(d) { return printCategory(d.key); });

		graphScatter.selectAll(".dot")
		.filter( function (d) {
		  return (bar.key != d.main_category);
		})
		.transition()
		.delay(100)
		.duration(400)
		.style("opacity", .25);

		// Fade in clicked category
		graphScatter.selectAll(".dot")
		.filter( function (d) {
		  return (bar.key == d.main_category);
		})
		.transition()
		.delay(100)
		.duration(400)
		.style("opacity", 1);
	}
}
