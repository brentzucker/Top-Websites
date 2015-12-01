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
			
		// 'All' option
		$('ul.dropdown-menu')
			.append('<li class="category-li-container">'
						+ '<input id="All-checkbox" type="checkbox">'
						+ '<span class="category-li-text">All</span>'
					+ '</li>');

		// Initialize All-checkbox as checked
		$('#All-checkbox').prop('checked', true);
	
		// divider b/w all and categories
		$('ul.dropdown-menu')
			.append('<li class="divider"></li>');
	
		// Read in Categories from csv
		SUPER_GLOBAL_CATEGORY_NAMES.forEach(function(name) {
			$('ul.dropdown-menu')
			.append('<li class="category-li-container">'
						+ '<input id="' + name + '-checkbox" type="checkbox">'
						+ '<span class="category-li-text">' + name + '</span>'
					+ '</li>');

			// Initalize all checkboxes as checked
			$('#' + name + '-checkbox').prop('checked', true);

			// TODO: add check listeners to all checkboxes
			$('#' + name + '-checkbox').change(function() {

				if (this.checked) {
					console.log('checked');
				} else {
					console.log('unchecked');
				}
			});
		});

		// set isLoaded to true
		global_isCATEGORY_LI_LOADED = true;
	}
}