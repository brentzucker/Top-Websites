/* written completely from scratch */
/* Super Global Variables */
SUPER_GLOBAL_CATEGORIES_TO_DISPLAY = [];

/* Global Variables */
var global_isCATEGORY_LI_LOADED = false;

function dropdown() {
    $("ul.dropdown-menu input[type=checkbox]").each(function() {
        $(this).change(function() {
            var line = "";
            $("ul.dropdown-menu input[type=checkbox]").each(function() {
                if($(this).is(":checked")) {
                    line += $("+ span", this).text().trim() + "; ";
                }
            });
            $("input.form-control").val(line);
        });
    });

    $('#category-dropdown-container').on('click', function() {
    	loadListItems();
    });
}

function loadListItems() {

	if (!global_isCATEGORY_LI_LOADED) {

		// Read in Categories from csv
		SUPER_GLOBAL_CATEGORY_NAMES.forEach(function(name) {

			$('ul.dropdown-menu')
			.append('<li class="category-li-container">'
						+ '<input id="' + name + '-checkbox" type="checkbox">'
						+ '<label class="category-li-text" for="' + name +'-checkbox">' + printCategory(name) + '</label>'
					+ '</li>');

			// Initalize all checkboxes as checked
			$('#' + name + '-checkbox').prop('checked', true);

			// TODO: add check listeners to all checkboxes
			$('#' + name + '-checkbox').change(function() {

				if (this.checked) {
					// add website to list
					SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.push(name);
				} else {
					// remove website from list
					SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.splice(SUPER_GLOBAL_CATEGORIES_TO_DISPLAY.indexOf(name), 1);
				}
				updateBarChart();
				updateScatterPlot();
				populateList();
			});
		});

		// set isLoaded to true
		global_isCATEGORY_LI_LOADED = true;
	}
}
