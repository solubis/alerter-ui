/*
 * Custom Scrollbars
 */

(function () {

    'use strict';

    angular
        .module('ui.scrollbar', [])

        .service('nicescrollService', function () {
            var ns = {};

            ns.niceScroll = function (selector, color, cursorWidth) {
                $(selector).niceScroll({
                    cursorcolor: color,
                    cursorborder: 0,
                    cursorborderradius: 0,
                    cursorwidth: cursorWidth,
                    bouncescroll: true,
                    mousescrollstep: 100,
                    autohidemode: false
                });
            };

            return ns;
        })

        .directive('scrollbar', function (nicescrollService) {
            return {
                restrict: 'AE',
                link: function (scope, element, attrs) {
                    element.niceScroll({
                        cursorcolor: attrs['scrollbarColor'] || 'rgba(0,0,0,0.5)',
                        cursorborder: 0,
                        cursorborderradius: 0,
                        cursorwidth: attrs['scrollbarWidth'] || '5px',
                        bouncescroll: true,
                        mousescrollstep: 100
                    });
                }
            };
        })

        .directive('html', function (nicescrollService) {
            return {
                restrict: 'E',
                link: function (scope, element) {
                    if (!element.hasClass('ismobile')) {
                        if (!$('.login-content')[0]) {
                            nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '5px');
                        }
                    }
                }
            }
        })

        //Table

        .directive('tableResponsive', function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '5px');
                    }
                }
            }
        })

        .directive('chosenResults', function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '5px');
                    }
                }
            }
        })

        .directive('tabNav', function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.3)', '1px');
                    }
                }
            }
        })

        //For custom class

        .directive('cOverflow', function (nicescrollService) {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    if (!$('html').hasClass('ismobile')) {
                        nicescrollService.niceScroll(element, 'rgba(0,0,0,0.4)', '5px');
                    }
                }
            }
        })
}());
