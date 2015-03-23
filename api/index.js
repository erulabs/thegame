/* global NODE_ENV */
'use strict';

// Load configuration
global.NODE_ENV = process.env.NODE_ENV || 'development';
const CONFIG = require('./config.js')[NODE_ENV];
if (CONFIG.API_PORT === undefined) {
  CONFIG.API_PORT = process.env.npm_package_config_API_PORT || 8000;
}

const ApiLib = require('./api.js');
const Api = new ApiLib();

Api.attachDB(CONFIG.db, function () {
  Api.init();
  Api.listen(CONFIG.API_PORT);
});
