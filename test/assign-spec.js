describe('Assign Module', function () {
    var structure = {
        name: 'Root',
        children: [
            {name: 'File 1.gif'},
            {name: 'File 2.gif'},
            {
                name: 'Folder 1',
                children: [
                    {
                        name: 'Subfolder 1',
                        children: [{name: 'Subfile 1.txt'}]
                    },
                    {name: 'File 1.jpg'},
                    {name: 'File 2.png'},
                    {name: 'Subfolder 2'},
                    {name: 'Subfolder 3'}
                ]
            },
            {name: 'Test 1'},
            {name: 'Parent', children:[{name:'test'}]}
        ]
    };

    beforeEach(module('ui.assign'));

    it('assign service should search in the tree', inject(function (Tree) {
        var tree = new Tree(structure);

        var result = tree.search('test');

        console.log(JSON.stringify(result));

        expect(result.children[0].name).toBe('Test 1');
    }));

    it('assign service should flatten the tree', inject(function (Tree) {

        var tree = new Tree(structure);

        var result = tree.flatten();

        console.log(JSON.stringify(result));

        expect(result.length).toBe(13);
        expect(result[5].name).toBe('Subfile 1.txt');
        expect(result[5].level).toBe(3);
    }));

});
