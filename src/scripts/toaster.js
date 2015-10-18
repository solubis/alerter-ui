(function () {

    'use strict';

    angular
        .module('ui.toaster', [
            'ngAnimate',
            'ngSanitize'
        ])

    .provider('$toaster', function () {
        var _config;

        _config = {
            'limit': 3,
            'tap-to-dismiss': true,
            'newest-on-top': true,
            'time-out': 5000,
            'aggregate': false,
            'icon-classes': {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            'body-output-type': 'trustedHtml', //  'trustedHtml', 'template'
            'body-template': 'toasterBodyTmpl.html',
            'icon-class': 'toast-info',
            'position-class': 'toast-bottom-right',
            'title-class': 'toast-title',
            'message-class': 'toast-message'
        };

        this.config = function (config) {
            angular.extend(_config, config);

            return this;
        };

        this.$get = function ($rootScope) {
            var _api;

            function _handleError(event, title) {
                $rootScope.$on(event, function (event, message) {
                    _show('error', title, message, 0);
                });
            }

            if (_config.errors) {
                for (var key in _config.errors) {
                    if (_config.errors.hasOwnProperty(key)) {
                        _handleError(key, _config.errors[key]);
                    }
                }
            }

            function _show(type, title, body, timeout, bodyOutputType) {
                if (!body) {
                    _api.toast = {
                        type: type,
                        body: title,
                        timeout: timeout,
                        bodyOutputType: bodyOutputType
                    };
                } else {
                    _api.toast = {
                        type: type,
                        title: title,
                        body: body,
                        timeout: timeout,
                        bodyOutputType: bodyOutputType
                    };
                }
                $rootScope.$broadcast('toaster-newToast');
            }

            function _showType(type) {
                return function (title, text) {
                    if (angular.isObject(text)) {
                        text = JSON.stringify(text);
                    }
                    _show(type, title, text, _config['time-out'], 'trustedHtml');
                };
            }

            function _clear() {
                $rootScope.$broadcast('toaster-clearToasts');
            }

            _api = {
                show: _show,
                alert: _showType('warning'),
                warn: _showType('warning'),
                warning: _showType('warning'),
                error: _showType('error'),
                info: _showType('info'),
                success: _showType('success'),
                clear: _clear,
                config: _config
            };

            return _api;
        };
    })

    .directive('toaster', function ($compile, $timeout, $sce, $toaster) {
        return {
            replace: true,
            restrict: 'EA',
            scope: true,
            link: function (scope, element, attrs) {

                var id = 0;
                var mergedConfig = $toaster.config;

                if (attrs.toasterOptions) {
                    mergedConfig = angular.extend({}, $toaster.config, scope.$eval(attrs.toasterOptions));
                }

                scope.config = {
                    position: mergedConfig['position-class'],
                    title: mergedConfig['title-class'],
                    message: mergedConfig['message-class'],
                    tap: mergedConfig['tap-to-dismiss']
                };

                scope.configureTimer = function configureTimer(toast) {
                    var timeout = typeof (toast.timeout) === 'number' ? toast.timeout : mergedConfig['time-out'];
                    if (timeout > 0) {
                        toast.timeout = $timeout(function () {
                            scope.removeToast(toast.id);
                        }, timeout);
                    }
                };

                function addToast(toast) {
                    toast.type = mergedConfig['icon-classes'][toast.type];
                    if (!toast.type) {
                        toast.type = mergedConfig['icon-class'];
                    }

                    id++;
                    angular.extend(toast, {
                        id: id
                    });

                    // Set the toast.bodyOutputType to the default if it isn't set
                    toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type'];
                    switch (toast.bodyOutputType) {
                    case 'trustedHtml':
                        toast.html = $sce.trustAsHtml(toast.body);
                        break;
                    case 'template':
                        toast.bodyTemplate = toast.body || mergedConfig['body-template'];
                        break;
                    }

                    scope.configureTimer(toast);

                    if (mergedConfig['newest-on-top'] === true) {
                        scope.toasters.unshift(toast);
                        if (mergedConfig.limit > 0 && scope.toasters.length > mergedConfig.limit) {
                            scope.toasters.pop();
                        }
                    } else {
                        scope.toasters.push(toast);
                        if (mergedConfig.limit > 0 && scope.toasters.length > mergedConfig.limit) {
                            scope.toasters.shift();
                        }
                    }
                }

                scope.toasters = [];
                scope.$on('toaster-newToast', function () {
                    if (!mergedConfig.aggregate || scope.toasters.length === 0) {
                        addToast($toaster.toast);
                    }
                });

                scope.$on('toaster-clearToasts', function () {
                    scope.toasters.splice(0, scope.toasters.length);
                });
            },
            controller: function ($scope, $timeout) {

                $scope.stopTimer = function (toast) {
                    if (toast.timeout) {
                        $timeout.cancel(toast.timeout);
                        toast.timeout = null;
                    }
                };

                $scope.restartTimer = function (toast) {
                    if (!toast.timeout) {
                        $scope.configureTimer(toast);
                    }
                };

                $scope.removeToast = function (id) {
                    var i = 0;
                    for (i; i < $scope.toasters.length; i++) {
                        if ($scope.toasters[i].id === id) {
                            break;
                        }
                    }
                    $scope.toasters.splice(i, 1);
                };

                $scope.remove = function (id) {
                    if ($scope.config.tap === true) {
                        $timeout(function () {
                            $scope.removeToast(id);
                        }, 100);
                    }
                };
            },
            template: '<div  id="toast-container" ng-class="config.position">' +
                '<div ng-repeat="toaster in toasters" class="toast" ng-class="toaster.type" ng-click="remove(toaster.id)" ng-mouseover="stopTimer(toaster)"  ng-mouseout="restartTimer(toaster)">' +
                '<div ng-class="config.title">{{toaster.title}}</div>' +
                '<div ng-class="config.message" ng-switch on="toaster.bodyOutputType">' +
                '<div ng-switch-when="trustedHtml" ng-bind-html="toaster.html"></div>' +
                '<div ng-switch-when="template"><div ng-include="toaster.bodyTemplate"></div></div>' +
                '<div ng-switch-default >{{toaster.body}}</div>' +
                '</div>' +
                '</div>' +
                '</div>'
        };
    })

}());
