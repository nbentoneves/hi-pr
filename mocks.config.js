// For a detailed explanation regarding each configuration property, visit:
// https://mocks-server.org/docs/configuration-options
// https://mocks-server.org/docs/configuration-methods

module.exports = {
  // Log level. Can be one of silly, debug, verbose, info, warn or error
  //log: "info",
  // Array of RouteHandlers to be added
  //routesHandlers: [],
  config: {
    // Allow unknown arguments
    //allowUnknownArguments: false,
  },
  plugins: {
    // Plugins to be registered
    //register: [],
    proxyRoutesHandler: {
    },
    adminApi: {
      // Root path for admin routes
      //path: "/admin",
    },
    inquirerCli: {
      // Start interactive CLI plugin or not
      //enabled: false,
      // Render emojis or not
      //emojis: true,
    },
  },
  mocks: {
    // Selected mock
    selected: "base",
    // Global delay to apply to routes
    //delay: 0,
  },
  server: {
    // Port number for the server to be listening at
    //port: 3100,
    // Host for the server
    //host: "0.0.0.0",
    cors: {
      // Use CORS middleware or not
      //enabled: true,
      // Options for the CORS middleware. Further information at https://github.com/expressjs/cors#configuration-options
      //options: {"preflightContinue":false},
    },
    jsonBodyParser: {
      // Use json body-parser middleware or not
      //enabled: true,
      // Options for the json body-parser middleware. Further information at https://github.com/expressjs/body-parser
      //options: {},
    },
    urlEncodedBodyParser: {
      // Use urlencoded body-parser middleware or not
      //enabled: true,
      // Options for the urlencoded body-parser middleware. Further information at https://github.com/expressjs/body-parser
      //options: {"extended":true},
    },
  },
  files: {
    // Define folder from where to load mocks
    //path: "mocks",
    // Enable/disable files watcher
    //watch: true,
    babelRegister: {
      // Load @babel/register
      //enabled: false,
      // Options for @babel/register
      //options: {},
    },
  },
};
