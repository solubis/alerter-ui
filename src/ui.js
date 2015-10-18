(function () {

    'use strict';

    var _config = {
        version: '1.0.0-RC1'
    };

    angular
        .module('fds.ui', [
            'ui.router',
            'ui.bootstrap',
            'ui.datetimepicker',
            'ui.utils',
            'ui.dialog',
            'ui.loadingbar',
            'ui.multiselect',
            'ui.toaster',
            'ui.select',
            'ui.sidebar',
            'ui.scrollbar',
            'ui.search',
            'ui.translate',
            'ui.organisation',
            'ui.hotkeys',
            'ui.error',
            'ui.templates',
            'ui.table'
        ])

        .value('$commonVersion', _config.version)

        .run(function ($commonVersion, $log) {
            $log.info('FDS UI Framework ', $commonVersion);
        });
}());
