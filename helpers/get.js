const get = (obj , path) => {
    obj = obj || {};
    for (let k of path.split('.')) {
        const value = obj[k];
        if (typeof value !== 'object') {
            return value;
        }
        obj = value;
    }
};

module.exports = get;
