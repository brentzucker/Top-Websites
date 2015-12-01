/* Global Variables */ 
var global_isCATEGORY_LI_LOADED = false;
var categories_to_display = [];

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

    $("ul.dropdown-menu li").each(function() {
        $(this).on('click', function() {
        	console.log('click');
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
			
			// Add to List of Categories to Display (used for updating)
			categories_to_display.push(name);

			$('ul.dropdown-menu')
			.append('<li class="category-li-container">'
						+ '<input id="' + name + '-checkbox" type="checkbox">'
						+ '<label class="category-li-text" for="' + name +'-checkbox">' + name + '</label>'
					+ '</li>');

			// Initalize all checkboxes as checked
			$('#' + name + '-checkbox').prop('checked', true);

			// TODO: add check listeners to all checkboxes
			$('#' + name + '-checkbox').change(function() {

				if (this.checked) {
					// add website to list
					categories_to_display.push(name);
				} else {
					// remove website from list
					categories_to_display.splice(categories_to_display.indexOf(name), 1);
				}
				updateBarChartByCategory(categories_to_display);
				updateScatterPlotByCategory(categories_to_display);
			});
		});

		// set isLoaded to true
		global_isCATEGORY_LI_LOADED = true;
	}
}