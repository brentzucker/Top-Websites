// Completely written from scratch
$(function() {

	// Fill Color
	cValue = function(d) {
			if ('key' in d) {
				return d.key;
			} else if ('main_category' in d) {
				return d.main_category;
			}
		},
    color = d3.scale.category20();

  searchBar();
  dropdown();
	scatterPlot();
	barChart(1, 1000);
	drawSlider();

  // Populate the data table
  populateList();
});
