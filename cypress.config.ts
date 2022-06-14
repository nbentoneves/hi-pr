import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    video: false,
    supportFolder: 'src',
    specPattern: '**/*.cypress.{jsx,tsx}',
  },
});
