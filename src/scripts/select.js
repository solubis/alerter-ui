angular.module('ui.select', [])
    .directive('selectpicker', function () {
        return {
            restrict: 'C',
            priority: 100,
            link: function (scope, element, attrs) {
                element.selectpicker();
            }
        };
    })
    .directive('tagSelect', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                element.chosen({
                    width: '100%',
                    'allow_single_deselect': true
                });
            }
        }
    });
