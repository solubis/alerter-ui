describe('Utils Module', function () {

    beforeEach(module('ui.utils'));

    it('$fileSize should format file size', inject(function ($fileSize, fileSizeFilter) {
        expect($fileSize(123)).toBe('123 B');
        expect($fileSize(123456)).toBe('120.56 kB');
        expect($fileSize(1234, {bits: true})).toBe('9.64 kb');
        expect($fileSize(123456, {base: 10})).toBe('123.46 kB');
        expect($fileSize(123456, {round: 0})).toBe('121 kB');
        expect($fileSize(123456, {output: 'array'})[0]).toBe(120.56);

        expect(fileSizeFilter(123)).toBe('123 B');
        expect(fileSizeFilter(123456)).toBe('120.56 kB');
        expect(fileSizeFilter(1234, {bits: true})).toBe('9.64 kb');
        expect(fileSizeFilter(123456, {base: 10})).toBe('123.46 kB');
        expect(fileSizeFilter(123456, {round: 0})).toBe('121 kB');
        expect(fileSizeFilter(123456, {output: 'array'})[0]).toBe(120.56);
    }));

});
