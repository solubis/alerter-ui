/**
 * Error formatting and displaying
 */

(function () {

    'use strict';

    function ErrorService($timeout, $toaster, $translate, $format) {
        this.$timeout = $timeout;
        this.$toaster = $toaster;
        this.$translate = $translate;
        this.$format = $format;
        this.warningCount = 0;
        this.criticalCount = 0;
    }

    ErrorService.prototype.format = function (error) {
        var _this = this;
        var result = '';
        var messages;
        if (!error) {
            return 'No error information';
        }
        if (!error.message) {
            return 'URL:' + error.url || 'No error information';
        }
        messages = angular.isArray(error.message) ? error.message : [error.message];
        angular.forEach(messages, function (error) {
            var params;
            if (error.parameters) {
                error.parameters = error.parameters.map(function (parameter) {
                    if (angular.isArray(parameter)) {
                        return parameter = parameter.join(', ');
                    } else {
                        return parameter;
                    }
                });
            }
            if (error.message) {
                params = [error.message].concat(error.parameters);
                result += _this.$format.apply(null, params);
            } else if (angular.isString(error)) {
                result += _this.$translate(error);
            }
        });
        if (error.url) {
            result += '</br><small>' + error.url + '</small>';
        }
        return result;
    };

    ErrorService.prototype.warning = function (title, error) {
        var _this = this;
        if (this.warningCount > 0) {
            return;
        }
        if (arguments.length === 1 && angular.isObject(title)) {
            error = title;
            title = this.$translate('Application warning');
        }
        if (typeof error === 'string') {
            error = this.$translate(error);
        } else if (error) {
            error = this.format(error);
        }
        this.warningCount++;
        this.$timeout(function () {
            return _this.warningCount = 0;
        }, 5000);
        this.$toaster.warn(this.$translate(title), error);
    };

    ErrorService.prototype.critical = function (title, error) {
        var _this = this;
        if (this.criticalCount > 0) {
            return;
        }
        if (arguments.length === 1 && angular.isObject(title)) {
            error = title;
            title = this.$format('System error (status: {0})', error.status || 0);
        } else {
            title = this.$translate(title);
        }
        if (typeof error === 'string') {
            error = this.$translate(error);
        } else if (error) {
            error = this.format(error);
        }
        this.criticalCount++;
        this.$timeout(function () {
            return _this.criticalCount = 0;
        }, 5000);
        this.$toaster.error(title, error);
    };

    angular
        .module('ui.error', [])

    /**
     * Service for scrolling window
     */
    .service('$error', ErrorService)
}());
