const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {

            const copyWebPackPlugin = new CopyWebpackPlugin({
                patterns: [
                    // Copy icon to build folder
                    { from: path.resolve(__dirname, 'src/assets/icon.*'), to: path.resolve(__dirname, 'build/[name][ext]') },
                    // Copy background to build folder
                    { from: path.resolve(__dirname, 'src/assets/background.*'), to: path.resolve(__dirname, 'build/[name][ext]') }
                ],
            });

            webpackConfig.plugins = [...webpackConfig.plugins, copyWebPackPlugin];

            return webpackConfig;
        }
    },
    jest: {
        configure: (jestConfig, { env, paths, resolve, rootDir }) => {
            jestConfig.roots = ["."];
            jestConfig.setupFilesAfterEnv = ["./src/setupTests.ts"];
            jestConfig.testMatch = ["**/__tests__/**/*.{js,jsx,ts,tsx}", "**/*.{spec,test}.{js,jsx,ts,tsx}"];
            jestConfig.projects =
                [
                    {
                        "displayName": "Unit",
                        "testPathIgnorePatterns": ["/node_modules/", "/e2e/"],
                        "testMatch": ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}']
                    },
                    {
                        "displayName": "E2E",
                        "testPathIgnorePatterns": ["/node_modules/", "/src/"],
                        "testMatch": ['<rootDir>/e2e/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/e2e/**/*.{spec,test}.{js,jsx,ts,tsx}'],
                    }
                ];
            return jestConfig;
        },
    },

};