const get = require('../helpers/get');


describe('get', () => {
    it('should return undefined if obj isn`n an object', () => {
        const actual = get(null, 'a.b');

        expect(actual).toEqual(undefined);
    });

    it('should return a value with path', () => {
        const actual = get(
            {
                a: {
                    b: 2
                }

            },
            'a.b'
        );

        expect(actual).toEqual(2);
    });
});
