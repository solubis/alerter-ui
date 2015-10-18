(function () {

    'use strict';

    angular
        .module('ui.dialog', [

            'ui.bootstrap.modal',
            'ui.bootstrap.transition',
            'ui.bootstrap.tpls'
        ])

    .factory('$dialog', function ($modal, $q, $hotkeys) {
        var _api = {};
        var _instance;
        var _result;
        var _isOpened = false;

        _api.open = function (options, flag) {
            if (_instance && !flag) {
                return $q.reject('Dialog already opened');
            }

            _instance = $modal.open(options);

            _instance.result.finally(function () {
                _instance = undefined;
            });

            return _instance.result;
        };

        _api.alert = function (title, message, acceptButtonLabel, cancelButtonLabel) {
            return _api.open(
                /*@ngInject*/
                {
                    backdrop: 'static',
                    size: 'sm',
                    template: '<div class="alert-dialog">\n    <div class="modal-header">\n <h4 class="modal-title">{{title}}</h4>\n    </div>\n\n    <div class="modal-body" ng-bind-html="message">\n    </div>\n\n    <div class="modal-footer">\n        <button class="btn btn-link" ng-class="acceptButtonLabel ? \'btn-default\':\'btn-primary\'" ng-click="cancel()">\n            {{cancelButtonLabel}}\n        </button>\n        <button class="btn btn-primary" ng-click="accept()" ng-if="acceptButtonLabel">{{acceptButtonLabel}}\n        </button>\n    </div>\n</div>\n',
                    controller: function ($scope, $modalInstance, $hotkeys) {
                        $scope.title = title;
                        $scope.message = message;
                        $scope.cancelButtonLabel = cancelButtonLabel || 'Zamknij';
                        $scope.acceptButtonLabel = acceptButtonLabel;

                        $hotkeys.bindTo($scope).add({combo:'esc', callback: function(){$scope.cancel()}});

                        $scope.cancel = function () {
                            $modalInstance.dismiss(false);
                        };

                        $scope.accept = function () {
                            $modalInstance.close(true);
                        };
                    }
                }, true);
        };

        return _api;
    })

    .factory('$ask', function ($dialog, $translate, $format) {

        function ask(title, message) {
            var params = Array.prototype.slice.call(arguments, 1);
            var acceptButtonLabel = $translate('Yes');
            var cancelButtonLabel = $translate('No');

            message = $format.apply(null, params);
            title = $translate(title);

            return $dialog.alert.call(null, title, message, acceptButtonLabel, cancelButtonLabel);
        };

        return ask;
    })
}());
