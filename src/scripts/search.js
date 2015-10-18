(function () {

    'use strict';

    angular.module('ui.search', ['ui.bootstrap.typeahead'])
        .directive('iqSearch', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                template: '<div class="search search-{{ theme }}-theme"\n ng-class="{ \'search-is-focused\': model,\n                 \'search-is-closed\': closed }">\n    <div class="search-container">\n        <label class="search-label"><i class="md md-search"></i></label>\n        <input type="text" class="search-input" \n               placeholder="{{ placeholder }}"\n               ng-model="model">\n        <span class="search-cancel" ng-click="clear()"><i class="md md-cancel"></i></span>\n    </div>\n</div>',
                scope: true,

                compile: function compile(template, attrs) {
                    var $input = template.find('.search-input');

                    if (attrs.ngEnter) {
                        $input.attr('ng-enter', attrs.ngEnter);
                    }

                    angular.forEach(attrs.$attr, function (key, name) {
                        var rest = key.substring(4);

                        if (name.indexOf('find') == 0) {
                            $input.attr('typeahead' + rest, attrs[name]);
                        }
                    });

                    return function postLink(scope, element, attrs, controller, transclude) {
                        var $input = element.find('.search-input');
                        var $label = element.find('.search-label');
                        var $searchFilter = element.find('.search');
                        var $searchFilterContainer = element.find('.search-container');

                        scope.find = attrs.find;
                        scope.findTemplateUrl = attrs.findTemplateUrl;
                        scope.theme = attrs.theme;
                        scope.placeholder = attrs.placeholder;
                        scope.closeWithValue = attrs.closeWithValue;

                        scope.closed = angular.isDefined(attrs.closed);

                        if (angular.isUndefined(scope.theme)) {
                            scope.theme = 'dark';
                        }

                        attrs.$observe('filterWidth', function (filterWidth) {
                            $searchFilterContainer.css({width: filterWidth});
                        });

                        // Events
                        $input
                            .on('blur', function () {
                                if (angular.isDefined(attrs.closed) && (!$input.val() || scope.closeWithValue)) {
                                    if (scope.closeWithValue) {
                                        scope.$apply(function () {
                                            scope.model = undefined;
                                        })
                                    }
                                    $searchFilter.velocity({
                                        width: 40
                                    }, {
                                        duration: 400,
                                        easing: 'easeOutQuint',
                                        queue: false
                                    });

                                }
                            });

                        $label.on('click', function () {
                            if (angular.isDefined(attrs.closed)) {
                                $searchFilter.velocity({
                                    width: attrs.filterWidth ? attrs.filterWidth : 240
                                }, {
                                    duration: 400,
                                    easing: 'easeOutQuint',
                                    queue: false
                                });

                                $timeout(function () {
                                    $input.focus();
                                }, 401);
                            } else {
                                $input.focus();
                            }
                        });

                        scope.clear = function () {
                            scope.model = undefined;

                            $input.focus();
                        };
                    }
                }
            };
        }]);

}());
