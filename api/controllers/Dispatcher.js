'use strict';

const request = require('request');

module.exports = function (API) {
  const Dispatcher = API.models.Dispatcher;

  /**
   * Dispatcher controller class
   * @constructor
   */
  class DispatcherController {
    constructor() {

      /**
       * Dispatcher registration route - Dispatchers 'signup' here - if they work as expected,
       * we'll add them to API.dispatchers
       */
      API.app.post('/dispatcher/register', function (req, res) {
        // TODO: This is weird... That is all.
        let dispatcherIp = req.ip.replace('::ffff:', '');
        let thisDispatchersURI = `${dispatcherIp}:${req.body.DISPATCHER_PORT}`;

        // Verify that we can communicate with the dispatcher where it claimed we could
        request.post(`http://${thisDispatchersURI}/apiTest`, { form: { data: 'OK' }}, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            // TODO: Verify this dispatcher hasnt already registered
            let newDispatcher = new Dispatcher({
              uri: thisDispatchersURI
            });
            newDispatcher.save();

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

    /**
     * @description
     * Checks the status of the dispatchers to ensure
     * @returns {undefined}
     */
    healthCheckEvent() {
      API.log.info('dispatcher controller health check starting');
      Dispatcher.find({}, function (err, dispatchers) {
        API.log.info('health report:', dispatchers.length);
        for (let dispatcher of dispatchers) {
          API.log.info(dispatcher.uri);
        }
      });
    }
  }
  return DispatcherController;
};
