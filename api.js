const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require('fs');

const sirenaMap = JSON.parse(fs.readFileSync('./data/sirena_cities_map.json', 'utf8'));

const url = 'https://api.rasp.yandex.net/v3.0/search';
const DEFAULT_QUERY = {
    apikey: process.env.API_KEY,
    format: 'json',
    system: 'sirena'
};


const api = async ({
    from,
    to,
    date = new Date().toISOString(),
    transport_types,
    limit
}) => {

    const convertedFrom = sirenaMap[from.toLowerCase()];
    const convertedTo = sirenaMap[to.toLowerCase()];

    const query = {
        ...DEFAULT_QUERY,
        date,
        from: convertedFrom,
        to: convertedTo
    };

    const URI = `${url}?${querystring.stringify(query)}`;

    try {
        const res = await fetch(URI);
        const json = await res.json();

        const groupedSegments = json.segments
            .filter(s => {
                return new Date(s.departure).getTime() >= new Date(date).getTime();
            })
            .reduce((acc, c) => {
                const { thread: {transport_type} } = c;
                const segments = acc[transport_type] || [];
                acc[transport_type] = [
                    ...segments,
                    c
                ];
                return acc;
            }, {});

        const filteredSegments = limit
            ? Object.keys(groupedSegments).reduce((acc, k) => {
                acc[k] = groupedSegments[k].slice(0, limit);
                return acc;
            }, {})
            : groupedSegments;


        return filteredSegments;

    } catch (error) {
        console.log(error);
    }
}

module.exports = api;
