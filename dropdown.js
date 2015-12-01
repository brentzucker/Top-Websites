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
		});

		// set isLoaded to true
		global_isCATEGORY_LI_LOADED = true;
	}
}