'use strict';

const schema = require('./schema');

/**
 * Http router register
 * @param {AwilixProxy} { rpiController }
 * @returns
 */
function routeRegister({ rpiController }) {
  return [
    { method: 'post', path: '/metrics/dht22', schema: schema.collectDHT22Metrics, handler: rpiController.collectDHT22Metrics.bind(rpiController) }
  ];
}

module.exports = routeRegister;