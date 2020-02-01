const get = require('./get');

const getCity = (entities) => {
    const cities = entities.filter(entity => entity.type === 'YANDEX.GEO');
    const [ from = null, to = null, ...others ] = cities;

    return {
        from: get(from, 'value.city'),
        to: get(to, 'value.city')
    };
};

module.exports = getCity;
