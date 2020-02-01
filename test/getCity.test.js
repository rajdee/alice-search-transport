const getCity = require('../helpers/getCity');

const request = {
  "command": "в москву",
    "nlu": {
    "entities": [
      {
        "tokens": {
          "end": 2,
          "start": 0
        },
        "type": "YANDEX.GEO",
        "value": {
          "city": "москва"
        }
      }
    ],
      "tokens": [
        "в",
        "москву"
      ]
  },
  "original_utterance": "в москву",
    "type": "SimpleUtterance"
};


describe('getCity', () => {
    it('should return an object with empty cities', () => {
        const actual = getCity([]);

        expect(actual).toEqual({
            from: undefined,
            to: undefined
        });
    });

    it('should return an object with `from` and `to` city', () => {
        const actual = getCity([
            ...request.nlu.entities,
            {
                "tokens": {
                  "end": 2,
                  "start": 0
                },
                "type": "YANDEX.GEO",
                "value": {
                  "city": "севастополь"
                }
              }
        ]);

        expect(actual).toEqual({
            from: 'москва',
            to: 'севастополь'
        });
    });

    it('should return an object with `from` city', () => {
        const actual = getCity(request.nlu.entities);

        expect(actual).toEqual({
            from: 'москва',
            to: undefined
        });
    });

});
