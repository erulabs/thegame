'use strict';

const request = require('request');

module.exports = function (API) {

  class DispatcherController {
    constructor() {
      API.app.post('/dispatcher/register', function (req, res) {
        let dispatcherIp = req.ip.replace('::ffff:', '');
        let thisDispatchersURI = `${dispatcherIp}:${req.body.DISPATCHER_PORT}`;

        // Verify that we can communicate with the dispatcher where it claimed we could
        request.post(`http://${thisDispatchersURI}/apiTest`, { form: { data: 'OK' }}, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            res.status(200).set({
              'token': 'SOME_DISPATCHER_TOKEN'
            }).send('OK');
          } else {
            API.log.warn(`DISPATCHER FAILED REQUEST to http://${thisDispatchersURI}/apiTest - reply was: ${body}`);
            res.status(500).send({ error: 'Failed to communicate back to the dispatchers http server' });
          }
        });
      });
    }
  }
  return DispatcherController;
};
