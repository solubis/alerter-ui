(function () {

    'use strict';

    angular.module('ui.datetimepicker', [
        'mgcrea.ngStrap.datepicker',
        'mgcrea.ngStrap.timepicker'])

        .config(function ($datepickerProvider, $timepickerProvider) {
            angular.extend($datepickerProvider.defaults, {
                dateType: 'unix',
                startWeek: 1,
                autoclose: 1
            });

            angular.extend($timepickerProvider.defaults, {
                timeFormat: 'HH:mm:ss',
                timeType: 'unix',
                length: 10,
                autoclose: 0
            });
        })

        .directive('isDirty', function () {
            return {
                restrict: 'AE',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    attrs.$observe('isDirty', function (value) {
                        if (value) {
                            ngModelCtrl.$setDirty();
                        }
                    })
                }
            };
        })

        .directive('datetimepicker', function ($parse, $dateParser, $datepicker, $timepicker, $locale) {

            function getTimestampFromDate(date) {
                var timestamp = date;

                if (date && angular.isDate(date)) {
                    timestamp = moment(date).unix();
                }

                return timestamp;
            }

            function getDateFromTimestamp(timestamp) {
                var date = timestamp;

                if (timestamp && !angular.isDate(timestamp)) {
                    date = moment.unix(timestamp).toDate();
                }

                return date;
            }

            function dashCase(name) {
                return name.replace(/[A-Z]/g, function (letter, pos) {
                    return (pos ? '-' : '') + letter.toLowerCase();
                });
            }

            return {
                restrict: 'EA',
                require: 'ngModel',
                replace: true,
                priority: 1,
                scope: {
                    ngModel: '='
                },
                templateUrl: 'template/datetimepicker/datetimepicker.html',
                compile: function compile(template, attrs) {
                    var inputs;
                    var dateInput;
                    var timeInput;

                    inputs = template.find('input');
                    dateInput = angular.element(inputs[0]);
                    timeInput = angular.element(inputs [1]);

                    angular.forEach(['autoclose', 'dateFormat', 'dateType'], function (key) {
                        if (angular.isDefined(attrs[key])) {
                            dateInput.attr(dashCase(key), attrs[key]);
                        }
                    });

                    angular.forEach(['autoclose', 'timeFormat', 'timeType'], function (key) {
                        if (angular.isDefined(attrs[key])) {
                            timeInput.attr(dashCase(key), attrs[key]);
                        }
                    });

                    if (angular.isDefined(attrs['name'])) {
                        dateInput.attr('name', attrs['name']);
                        timeInput.attr('name', attrs['name'] + 'Time');
                    }

                    return function postLink(scope, element, attrs, ngModelCtrl) {
                        var dateFormat;
                        var timeFormat;
                        var inputs = element.find('input');

                        element.removeClass('form-control');

                        if (attrs['ngDisabled'] && attrs['ngDisabled'] === 'true') {
                            inputs.attr('disabled', true);
                        } else {
                            inputs.removeAttr('disabled');
                        }

                        if (angular.isDefined(attrs['dateOnly'])) {
                            scope.dateOnly = attrs['dateOnly'] === 'true';
                        }

                        if (angular.isDefined(attrs['dateFormat'])) {
                            dateFormat = attrs.dateFormat;
                        } else {
                            dateFormat = $datepicker.defaults.dateFormat;
                        }

                        scope.dateFormat = $locale.DATETIME_FORMATS[dateFormat] || dateFormat;

                        if (angular.isDefined(attrs['timeFormat'])) {
                            timeFormat = attrs.timeFormat;
                        } else {
                            timeFormat = $timepicker.defaults.timeFormat;
                        }

                        scope.timeFormat = $locale.DATETIME_FORMATS[timeFormat] || timeFormat;

                        if (angular.isDefined(attrs['dateType'])) {
                            scope.dateType = attrs.dateType;
                        } else {
                            scope.dateType = $datepicker.defaults.dateType;
                        }

                        scope.touchDate = function () {
                            scope.isDirty = true;
                        };

                        attrs.$observe('minDate', function (value) {
                            if (scope.dateType === 'unix') {
                                scope.minDate = getDateFromTimestamp(value);
                            } else {
                                scope.minDate = value;
                            }
                        });

                        attrs.$observe('maxDate', function (value) {
                            if (scope.dateType !== 'unix') {
                                scope.maxDate = getDateFromTimestamp(value);
                            } else {
                                scope.minDate = value;
                            }
                        });
                    }
                }
            }
        }
    );

}());
