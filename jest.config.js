const ignorePaths = [
    '<rootDir>/node_modules',
];

module.exports = {
    coveragePathIgnorePatterns: [
        ...ignorePaths
    ],
    testPathIgnorePatterns: [
        ...ignorePaths,
        '<rootDir>/coverage'
    ],
    verbose: false
};
