const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const copyWebPackPlugin = new CopyWebpackPlugin({
        patterns: [
          // Copy icon to build folder
          {
            from: path.resolve(__dirname, 'src/assets/icon.*'),
            to: path.resolve(__dirname, 'build/[name][ext]'),
          },
          // Copy background to build folder
          {
            from: path.resolve(__dirname, 'src/assets/background.*'),
            to: path.resolve(__dirname, 'build/[name][ext]'),
          },
        ],
      });

      webpackConfig.plugins = [...webpackConfig.plugins, copyWebPackPlugin];

      return webpackConfig;
    },
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      jestConfig.roots = ['.'];
      jestConfig.setupFilesAfterEnv = ['./src/setupTests.ts'];
      jestConfig.testMatch = [
        '**/__tests__/**/*.{ts,tsx}',
        '**/*.{spec,test}.{ts,tsx}',
        '!**/__tests__/**/*.cypress.{ts,tsx}',
      ];
      //FIXME: Revert the code coverage limits (70, 80, 80, 80)
      jestConfig.coverageThreshold = {
        global: {
          branches: 50,
          functions: 50,
          lines: 80,
          statements: 80,
        },
      };
      jestConfig.collectCoverageFrom = [
        'src/**/*.{ts,tsx}',
        '!src/index.tsx',
        '!src/testing/*',
        '!src/store/hooks.ts',
        '!src/**/*.cypress.{ts,tsx}',
        '!src/**/*.d.ts',
      ];
      jestConfig.projects = [
        {
          displayName: 'Unit',
          testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
          testMatch: [
            '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
            '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
          ],
        },
        {
          displayName: 'E2E',
          testPathIgnorePatterns: ['/node_modules/', '/src/'],
          testMatch: [
            '<rootDir>/e2e/**/__tests__/**/*.{ts,tsx}',
            '<rootDir>/e2e/**/*.{spec,test}.{ts,tsx}',
          ],
        },
      ];
      return jestConfig;
    },
  },
};
