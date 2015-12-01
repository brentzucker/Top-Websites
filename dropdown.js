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

    loadListItems();

    $("ul.dropdown-menu li").each(function() {
        $(this).on('click', function() {
        	console.log('click');
        });
    });
}

function loadListItems() {
	$('ul.dropdown-menu')
		.append('<li class="category-li-container">'
					+ '<input type="checkbox">'
					+ '<span class="category-li-text">All</span>'
				+ '</li>');
}