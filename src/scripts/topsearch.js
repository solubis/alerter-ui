/*
 TODO Refactor as Angular directives and services
 */


/*
 * Top Search
 */
(function () {
    $('body').on('click', '#top-search > a', function (e) {
        e.preventDefault();

        $('#top-search-wrap > input').focus();

        $('#header').addClass('search-toggled');

        $('#top-search-wrap > input').keydown(function (e) {
            if (e.keyCode == 27) {
                $('#top-search-wrap > input').blur();
                $('#header').removeClass('search-toggled');
                e.stopPropagation();
            }
        });
    });

    $('body').on('click', '#top-search-close', function (e) {
        e.preventDefault();

        $('#header').removeClass('search-toggled');
    });
})();
