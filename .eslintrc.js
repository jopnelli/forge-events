module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'google',
        'eslint:recommended',
        'plugin:react/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    rules: {
        "max-len": ["error", 400],
        "valid-jsdoc": 0,
        "require-jsdoc": 0,
    },
    settings: {
        react: {
            version: "16"
        }
    },
};
