module.exports = () => {
    return {
        "rootDir": "./",
        "preset": "ts-jest",
        "testEnvironment": "node",
        "transform": {
            "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
        },
        "transformIgnorePatterns": [
            "node_modules/(?!variables/.*)"
        ],
        "reporters": [ "default", [ "jest-junit", { outputDirectory: "test-reports" } ] ]
    };
};
