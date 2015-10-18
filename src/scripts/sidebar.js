(function () {

    'use strict';

    angular
        .module('ui.sidebar', [])

        .run(function ($rootScope, $sidebar) {
            $rootScope.$on('$stateChangeStart', function () {
                $sidebar.close();
            })
        })

        .directive('sidebarSwitch', function () {
            return {
                restrict: 'AE',
                replace: true,
                scope: {},
                link: function (scope, element, attrs) {
                    var localStorageKey = 'iqui-sidebar-switched';

                    scope.$watch(function () {
                        return localStorage.getItem(localStorageKey);
                    }, function (value) {
                        scope.isOn = value === 'on';

                        if (value === 'on') {
                            $('body').addClass('toggled sw-toggled');
                            $('#header').removeClass('sidebar-toggled');
                        } else {
                            $('body').removeClass('toggled sw-toggled');
                        }
                    });

                    scope.onChange = function () {
                        localStorage.setItem(localStorageKey, scope.isOn ? 'on' : 'off');
                    }

                },
                template: '<div class="toggle-switch sidebar-switch">\n    <input id="tw-switch" type="checkbox" hidden="hidden" ng-change="onChange()" ng-model="isOn">\n    <label for="tw-switch" class="ts-helper"></label>\n</div>'
            };
        })

        .factory('$sidebar', function ($rootScope, $document, $timeout, $injector, $controller, $q, $compile, $templateRequest) {
            var _api = {};
            var body = $document.find('body').eq(0);

            function _getTemplatePromise(options) {
                return options.template ? $q.when(options.template) :
                    $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
            }

            function _getResolvePromises(options) {
                var promisesArr = [];

                angular.forEach(options.resolve, function (value) {
                    if (angular.isFunction(value)) {
                        promisesArr.push($q.when($injector.invoke(value)));
                    } else {
                        promisesArr.push($q.when(value));
                    }
                });

                return promisesArr;
            }

            function _createScope(options, resolves) {
                var scope;
                var ctrlLocals = {};
                var ctrlInstance;
                var i;

                options.scope = options.scope || $rootScope;

                scope = options.scope.$new();

                if (options.controller) {
                    ctrlLocals.$scope = scope;

                    i = 1;

                    angular.forEach(options.resolve, function (value, key) {
                        ctrlLocals[key] = resolves[i++];
                    });

                    ctrlInstance = $controller(options.controller, ctrlLocals);

                    if (options.controllerAs) {
                        scope[options.controllerAs] = ctrlInstance;
                    }
                } else {
                    i = 1;

                    angular.forEach(options.resolve, function (value, key) {
                        scope[key] = resolves[i++];
                    });
                }

                return scope;
            }

            function _onClickOutside(sidebar) {
                return function (event) {
                    if (!$(event.target).closest($(sidebar.element[0])).length) {
                        $timeout(function () {
                            sidebar.hide();
                        });
                    }
                }
            }

            function Sidebar(options) {
                var _this = this;
                var resolvePromise;

                options.resolve = options.resolve || {};

                if (!options.template && !options.templateUrl) {
                    throw new Error('One of template or templateUrl options is required.');
                }

                resolvePromise = $q.all([_getTemplatePromise(options)].concat(_getResolvePromises(options)));

                resolvePromise
                    .then(function (resolves) {
                        var sidebarTemplate = '<aside class="sidebar"></aside>';
                        var element = angular.element(sidebarTemplate);

                        _this.content = resolves[0];

                        _this.scope = _createScope(options, resolves);

                        _this.scope.$parent.$on('$destroy', function () {
                            _this.destroy();
                        });

                        element.html(_this.content);

                        element.addClass(options.side || 'left');

                        _this.element = $compile(element)(_this.scope);

                        body.append(_this.element);
                    });

                this.options = options;

                this.isHidden = true;

                this.$promise = resolvePromise;
            }

            Sidebar.prototype.show = function open() {
                var _this = this;
                var deferred = $q.defer();

                this.scope.$close = function (data) {
                    deferred.resolve(data);
                    _this.hide();
                };

                this.scope.$dismiss = function (data) {
                    deferred.reject(data);
                    _this.hide();
                };

                this.clickHandler = _onClickOutside(this);

                $document.on('mouseup', this.clickHandler);

                this.element.addClass('toggled');

                this.isHidden = false;

                return deferred.promise;
            };

            Sidebar.prototype.hide = function () {
                this.element.removeClass('toggled');

                this.isHidden = true;

                $document.off('mouseup', this.clickHandler);
            };

            Sidebar.prototype.toggle = function () {
                if (this.isHidden) {
                    this.show();
                } else {
                    this.hide();
                }
            };

            Sidebar.prototype.destroy = function () {
                this.hide();
            };

            _api.create = function create(options) {
                return new Sidebar(options);
            };

            _api.close = function () {
                $('#sidebar').removeClass('toggled');
                $('#header').removeClass('sidebar-toggled');
                $('#sidebar-trigger').removeClass('open');
            };

            return _api;
        });

    /**
     Deprecated management of jquery sidebar
     */

    /**
     TODO Refactor as sidebar directive and service
     */

    $('body').on('click', '#sidebar-trigger', function (e) {

        var x = $(this).data('trigger');
        var $sidebar = '#sidebar';
        var $trigger = '#sidebar-trigger';

        e.preventDefault();

        $(x).toggleClass('toggled');
        $(this).toggleClass('open');
        $('#header').toggleClass('sidebar-toggled');

        $('.sub-menu.toggled').not('.active').each(function () {
            $(this).removeClass('toggled');
            $(this).find('ul').hide();
        });

        $('.profile-menu .main-menu').hide();

        //When clicking outside
        if ($('#header').hasClass('sidebar-toggled')) {
            $(document).on('click', function (e) {
                if (($(e.target).closest($sidebar).length === 0) && ($(e.target).closest($trigger).length === 0)) {
                    setTimeout(function () {
                        $($sidebar).removeClass('toggled');
                        $('#header').removeClass('sidebar-toggled');
                        $($trigger).removeClass('open');
                    });
                }
            });
        }
    });

    //Submenu
    $('body').on('click', '.sub-menu > a', function (e) {
        e.preventDefault();
        $(this).next().slideToggle(200);
        $(this).parent().toggleClass('toggled');
    });

    $('#sidebar').removeClass('toggled');
    $('#header').removeClass('sidebar-toggled');
    $('#sidebar-trigger').removeClass('open');

}());

