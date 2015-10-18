describe('Translate Module', function () {

    var $translate;
    var $format;

    beforeEach(module('ui.translate'));

    beforeEach(inject(function ($injector) {
        $translate = $injector.get('$translate');
        $format = $injector.get('$format');
    }));

    it('$translate should translate (i18n)', function () {
        var result = $translate('Critical');

        expect(result).toBe('Krytyczny');
    });

    it('$format should format and translate strings', function () {
        var test;
        var translateResult = $format('Critical');
        var parametersResult = $format('Zero: {0} and array: {1} and string: {2} ', 'Zero', ['One', 'Two'], 'Three');
        var undefinedResult = $format('Undefined: {0}, null: {1}, no param: {2}', test, null);

        expect(translateResult).toBe('Krytyczny');
        expect(parametersResult).toBe('Zero: Zero and array: One,Two and string: Three');
        expect(undefinedResult).toBe('Undefined: {0}, null: (Brak wartości), no param: {2}');
    });
});
