'use strict';

// Load configuration
global.NODE_ENV = process.env.NODE_ENV || 'development';
const DISPATCHER_PORT = process.env.npm_package_config_DISPATCHER_PORT || 8001,
  API_HOST = process.env.npm_package_config_API_HOST || 'localhost',
  API_PORT = process.env.npm_package_config_API_PORT || 8000,
  API_SCHEME = process.env.npm_package_config_API_SCHEME || 'http';

const DispatcherLib = require('./dispatcher.js');
const Dispatcher = new DispatcherLib({
  API_URI: `${API_SCHEME}://${API_HOST}:${API_PORT}`,
  DISPATCHER_PORT: DISPATCHER_PORT
});

Dispatcher.listen();

// In development, the dispatcher and the API often restart rapidly
// We'll delay the registration just slightly so that the API has time to get booted.
// In production, we expect the API to have 99.9999% uptime, and thus should register
// ASAP.
if (global.NODE_ENV === 'local' || global.NODE_ENV === 'development') {
  setTimeout(function () {
    Dispatcher.register();
  }, 1000);
} else {
  Dispatcher.register();
}

// let gameInstance;
// if (gameInstance) {
//   gameInstance.kill();
// }
// gameInstance = spawn('iojs', IOJS_OPTIONS.concat(['game/index.js']), {
//   stdio: 'inherit',
//   env: {
//     GAME_PORT: 8084,
//     NODE_ENV: NODE_ENV,
//     API_PORT: API_PORT,
//     DISPATCHER_PORT: DISPATCHER_PORT,
//     PATH: process.env.PATH
//   }
// }).on('error', function (err) {
//   throw err;
// });
// gameInstance.on('close', function (code) {
//   if (code === 8) {
//     console.log('Error detected, waiting for changes...');
//   }
// });

// TODO: Register with API

// TODO: Express? HTTP connection to API to accept buildRequests

// TODO: Logging? Export stacktrace of crashed game instances?
