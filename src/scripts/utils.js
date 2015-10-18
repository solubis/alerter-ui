(function () {

    'use strict';

    angular
        .module('ui.utils', [])

    /**
     * Service for scrolling window
     */
        .factory('$scroll', function () {
            var _api = {};

            _api.toBottom = function () {
                window.scrollTo(0, document.body.scrollHeight);
            };

            _api.toTop = function () {
                window.scrollTo(0, 0);
            };

            return _api;
        })

    /**
     * Service for formatting Bytes using MB, GB, B, KB etc.
     *
     * @method filesize
     * @param  {Mixed}   arg        String, Int or Float to transform
     * @param  {Object}  descriptor [Optional] Flags
     * @return {String}             Readable file size String
     *
     * Descriptor:
     *
     * base (number) Number base, default is 2
     * bits (boolean) Enables bit sizes, default is false
     * exponent (number) Specifies the SI suffix via exponent, e.g. 2 is MB for bytes, default is -1
     * output (string) Output of function (array, exponent, object, or string), default is string
     * round (number) Decimal place, default is 2
     * spacer (string) Character between the result and suffix, default is " "
     * suffixes (object) Dictionary of SI suffixes to replace for localization, defaults to english if no match is found
     * unix (boolean) Enables unix style human readable output, e.g ls -lh, default is false
     */
        .factory('$fileSize', function () {
            var bit = /b$/;
            var si = {
                bits: ['B', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
                bytes: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            };

            function fileSize(arg) {
                var descriptor = arguments[1] === undefined ? {} : arguments[1];

                var result = [];
                var skip = false;
                var val = 0;
                var e = undefined;
                var base = undefined;
                var bits = undefined;
                var ceil = undefined;
                var neg = undefined;
                var num = undefined;
                var output = undefined;
                var round = undefined;
                var unix = undefined;
                var spacer = undefined;
                var suffixes = undefined;

                if (isNaN(arg)) {
                    throw new Error('Invalid arguments');
                }

                bits = descriptor.bits === true;
                unix = descriptor.unix === true;
                base = descriptor.base !== undefined ? descriptor.base : 2;
                round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
                spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? '' : ' ';
                suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
                output = descriptor.output !== undefined ? descriptor.output : 'string';
                e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
                num = Number(arg);
                neg = num < 0;
                ceil = base > 2 ? 1000 : 1024;

                // Flipping a negative number to determine the size
                if (neg) {
                    num = -num;
                }

                // Zero is now a special case because bytes divide by 1
                if (num === 0) {
                    result[0] = 0;

                    if (unix) {
                        result[1] = '';
                    } else {
                        result[1] = 'B';
                    }
                } else {
                    // Determining the exponent
                    if (e === -1 || isNaN(e)) {
                        e = Math.floor(Math.log(num) / Math.log(ceil));
                    }

                    // Exceeding supported length, time to reduce & multiply
                    if (e > 8) {
                        val = val * (1000 * (e - 8));
                        e = 8;
                    }

                    if (base === 2) {
                        val = num / Math.pow(2, e * 10);
                    } else {
                        val = num / Math.pow(1000, e);
                    }

                    if (bits) {
                        val = val * 8;

                        if (val > ceil) {
                            val = val / ceil;
                            e++;
                        }
                    }

                    result[0] = Number(val.toFixed(e > 0 ? round : 0));
                    result[1] = si[bits ? 'bits' : 'bytes'][e];

                    if (!skip && unix) {
                        if (bits && bit.test(result[1])) {
                            result[1] = result[1].toLowerCase();
                        }

                        result[1] = result[1].charAt(0);

                        if (result[1] === 'B') {
                            result[0] = Math.floor(result[0]);
                            result[1] = '';
                        } else if (!bits && result[1] === 'k') {
                            result[1] = 'K';
                        }
                    }
                }

                // Decorating a 'diff'
                if (neg) {
                    result[0] = -result[0];
                }

                // Applying custom suffix
                result[1] = suffixes[result[1]] || result[1];

                // Returning Array, Object, or String (default)
                if (output === 'array') {
                    return result;
                }

                if (output === 'exponent') {
                    return e;
                }

                if (output === 'object') {
                    return {value: result[0], suffix: result[1]};
                }

                return result.join(spacer);
            }

            return fileSize;
        })

        .filter('fileSize', function ($fileSize) {
            return function (value, config) {
                return value ? $fileSize(value, config) : '';
            };
        })

        /*
         Directive for indeteriminate checkbox value
         */

        .directive('threeState', function () {
            return {
                require: '?ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters = [];
                    ngModelCtrl.$parsers = [];

                    ngModelCtrl.$render = function () {
                        var value = ngModelCtrl.$viewValue;

                        element.data('checked', value);

                        switch (value) {
                            case true:
                                element.prop('indeterminate', false);
                                element.prop('checked', true);
                                break;
                            case false:
                                element.prop('indeterminate', false);
                                element.prop('checked', false);
                                break;
                            default:
                                element.prop('indeterminate', true);
                        }
                    };

                    element.bind('click', function () {
                        var value;
                        var checkStatus = element.data('checked');

                        switch (checkStatus) {
                            case false:
                                value = true;
                                break;
                            case true:
                                value = null;
                                break;
                            default:
                                value = false;
                        }
                        ngModelCtrl.$setViewValue(value);

                        scope.$apply(ngModelCtrl.$render);
                    });
                }
            };
        })

        .directive('btnWave', function () {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    Waves.attach(element);
                    Waves.init();
                }
            }
        })

        .directive('btn', function ($timeout) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!element.is('input') && !element.hasClass('no-waves')) {
                        if (element.is('a') || element.hasClass('btn-link')) {
                            element.addClass('waves-effect waves-button');
                        } else {
                            element.addClass('waves-effect');
                        }
                    }

                    $timeout(function () {
                        Waves.init();
                    });
                }
            }
        })

        .directive('fgLine', function () {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if ($('.fg-line')[0]) {
                        $('body').on('focus', '.form-control', function () {
                            $(this).closest('.fg-line').addClass('fg-toggled');
                        });

                        $('body').on('blur', '.form-control', function () {
                            var p = $(this).closest('.form-group');
                            var i = p.find('.form-control').val();

                            if (p.hasClass('fg-float')) {
                                if (i.length == 0) {
                                    $(this).closest('.fg-line').removeClass('fg-toggled');
                                }
                            }
                            else {
                                $(this).closest('.fg-line').removeClass('fg-toggled');
                            }
                        });
                    }

                }
            }

        })

        .directive('autosize', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    $timeout(function () {
                        element.autosize();
                    });
                }
            };
        })

        .directive('tagSelect', function () {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    if (element[0]) {
                        element.chosen({
                            width: '100%',
                            'allow_single_deselect': true
                        });
                    }
                }
            }
        })

        .directive('toggleSwitch', function () {
            var id = 1;

            return {
                restrict: 'AE',
                replace: true,
                transclude: true,
                scope: {
                    ngModel: '=',
                    ngChange: '&',
                    ngDisabled: '=',
                    name: '@',
                    on:'@',
                    off:'@'
                },
                link: function (scope, element, attrs) {
                    scope.id = id++;
                },
                template: '<div class="toggle-switch" ng-class="{active: ngModel}">\n    <label for="toggle-{{ id }}" ng-if="!off && !on" class="ts-label" ng-transclude> </label>\n    <label for="toggle-{{ id }}" ng-if="off" class="ts-label before" > {{ off }}</label>\n    \n    <input id="toggle-{{ id }}" type="checkbox" hidden="hidden" name="{{ name }}" ng-model="ngModel" ng-disabled="ngDisabled" ng-change="ngChange()">\n    <label for="toggle-{{ id }}" class="ts-helper"></label>\n    \n    <label for="toggle-{{ id }}" ng-if="on" class="ts-label after" > {{ on }}</label>\n</div>'
            };
        })

        .directive('navTabs', function () {
            return {
                restrict: 'C',
                link: function (scope, element, attrs) {
                    element.addClass('tab-nav');
                }
            };
        })

        .directive('errSrc', function () {
            return {
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        return attrs['ngSrc'];
                    }, function (value) {
                        if (!value) {
                            element.attr('src', attrs.errSrc);
                        }
                    });

                    element.bind('error', function () {
                        element.attr('src', attrs.errSrc);
                    });
                }
            }
        })

        .directive('prettyCode', function ($timeout) {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                link: function (scope, element, attrs) {
                    var codeElement = element.find('code')[0];

                    if (!window.prettyPrintOne) {
                        return;
                    }

                    $timeout(function () {
                        codeElement.innerHTML = window.prettyPrintOne(codeElement.innerText)
                    });
                },
                template: '<pre class="prettyprint"><code class="language-yaml" ng-transclude></code></pre>'
            };
        })

        .directive('fileUpload', function ($utils) {
            return {
                restrict: 'E',
                template: '<div class="fileinput">\n    <div class="btn btn-primary btn-file">\n        <span class="fileinput-label">{{\'Choose file\'|translate}}</span>\n        <input type="hidden" value="" name="...">\n        <input type="file" name="">\n    </div>\n    <div class="fileinput-fileinfo alert alert-info alert-dismissible" ng-show="file">\n        <button type="button" class="close" ng-click="clear()"><span aria-hidden="true">&times;</span></button>\n        \n        <dl class="dl-horizontal">\n            <dt>{{\'Name:\'|translate}}</dt>\n            <dd>{{ file.name}}</dd>\n            <dt>{{\'Size:\'|translate}} </dt>\n            <dd>{{ file.size | fileSize}}</dd>\n            <dt>{{\'Type:\'|translate}} </dt>\n            <dd>{{ file.type }}</dd>\n        </dl>\n    </div>\n    \n</div>',
                require: 'ngModel',
                scope: {
                    validate: '&',
                    file: '=ngModel'
                },
                replace: true,
                link: function (scope, element, attr, ctrl) {
                    var input;

                    input = element.find('input');

                    if (typeof scope.validate !== 'function') {
                        scope.validate = function () {
                            return true
                        };
                    }

                    var listener = function () {
                        scope.$apply(function () {
                            var file = input[1].files[0];

                            if (file && scope.validate({$file: file})) {
                                scope.file = file;
                            }
                        });
                    };

                    input.bind('change', listener);

                    scope.clear = function () {
                        scope.file = undefined;
                    };
                }
            }
        })

        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter, {'event': event});
                        });

                        event.preventDefault();
                    }
                });
            };
        })

        .directive('ngEscape', function ($document) {
            var handlers = [];

            function unbind(handler) {
                $document.unbind('keydown keypress', handler);
            }

            function bind(handler) {
                var handlersCount = handlers.length;

                if (handlersCount > 0) {
                    unbind(handlers[handlersCount - 1]);
                }

                $document.bind('keydown keypress', handler);

                handlers.push(handler);
            }

            return function (scope, element, attrs) {
                function clickHandler(event) {
                    if (event.which === 27) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEscape, {'event': event});
                        });

                        event.preventDefault();
                    }
                }

                bind(clickHandler);

                scope.$on('$destroy', function () {
                    unbind(clickHandler);
                    handlers.pop();
                    bind(handlers[handlers.length - 1]);
                });
            };
        })

        .directive('spinner', function () {
            return {
                restrict: 'AE',
                replace: true,
                template: '<div class="spinner spinner-wave">\n          <div class="rect1"></div>\n          <div class="rect2"></div>\n          <div class="rect3"></div>\n          <div class="rect4"></div>\n          <div class="rect5"></div>\n        </div>'
            };
        })

}());
