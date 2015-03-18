/* global NODE_ENV */
'use strict';

// Load configuration
global.NODE_ENV = process.env.NODE_ENV || 'development';

const API_PORT = process.env.npm_package_config_API_PORT || 8000;

const ApiLib = require('./api.js');

const Api = new ApiLib(NODE_ENV);

Api.listen(API_PORT);
