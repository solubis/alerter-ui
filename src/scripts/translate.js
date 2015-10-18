(function () {

    'use strict';

    var _i18n = window['IQ_I18N'] || {
        pl: {}
    };

    angular
        .module('ui.translate', ['ui.toaster'])

    .factory('$i18n', function () {
        return _i18n;
    })

    .provider('$translate', function () {
        var _language = 'pl';

        this.language = function (language) {
            _language = language;

            return this;
        };

        this.$get = function () {

            function translate(key) {
                var value;

                if (!angular.isDefined(key) || key === null) {
                    return '';
                }

                if (typeof key.trim === 'function') {
                    key = key.trim();
                }

                value = _i18n[_language][key];

                return value ? value : key;
            }

            return translate;
        };
    })

    .filter('translate', function ($translate) {
        return function (value) {
            return $translate(value);
        };
    })

    .directive('translate', function ($translate) {
        return {
            restrict: 'AE',
            terminal: true,
            link: function (scope, element, attrs) {
                element.html($translate(element.html()));
            }
        };
    })

    .factory('$format', function ($translate) {

        function formatString() {
            var format = arguments[0];
            var params = Array.prototype.slice.call(arguments, 1);
            var message;

            format = $translate(format);

            message = format.replace(/{(\d+)}/g, function (match, number) {
                var replacement = 'No value';

                if (typeof (params[number]) === 'undefined') {
                    replacement = match;
                } else if (params[number] === null) {
                    replacement = '(' + $translate('No value') + ')';
                } else {
                    replacement = $translate(params[number]);
                }

                return replacement;
            });

            return message;
        }

        return formatString;
    })

    .factory('$toast', function ($toaster, $format) {

        function show(type) {
            var toasterFn = $toaster[type];

            return function () {
                var message = $format.apply(this, arguments);
                var title;
                var colonIndex;
                var separatorIndex = message.indexOf('|');

                if (separatorIndex > 0) {
                    title = message.slice(0, separatorIndex).trim();
                    message = message.slice(separatorIndex + 1).trim();
                }

                colonIndex = message.indexOf(':')

                if (colonIndex > 0) {
                    message = message.slice(0, colonIndex + 1) + '<strong>' + message.slice(colonIndex + 1) + '</strong>';
                }

                toasterFn.call(null, title, message);
            }
        }

        return {
            error: show('error'),
            info: show('info'),
            warn: show('warn'),
            warning: show('warn'),
            success: show('success')
        };
    })

}());
