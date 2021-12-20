const path = require("path");
const fs = require("fs");
const rewireBabelLoader = require("craco-babel-loader");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    eslint: {
        enable: false, // linting handled outside of react-scripts
    },
    plugins: [
        {
            plugin: rewireBabelLoader,
            options: {
                includes: [
                    resolveApp("../shared"),
                    resolveApp("../../types")
                ],
            }
        }
    ]
};
