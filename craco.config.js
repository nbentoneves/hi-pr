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
    }
};