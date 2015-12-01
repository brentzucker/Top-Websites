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
}