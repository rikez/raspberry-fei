'use strict';

// Libraries
const { asClass, asValue, asFunction, createContainer } = require('awilix');

const KafkaProducer = require('../../lib/kafka/producer');

// Microservice configuration
const config = require('../config');

// Infra
const HttpServer = require('./http-server');

// Api
const RPIController = require('../api/controller');
const routeRegister = require('../api/routes');

/**
 * Registers the service container for the application
 * @returns
 */
function registerContainer() {
  const container = createContainer();

  container.register({
    routeMap: asFunction(routeRegister).proxy().singleton().singleton(),
    httpServer: asClass(HttpServer).classic().singleton().disposer((httpServer) => httpServer.dispose()),
    rpiController: asClass(RPIController).classic().singleton(),
    port: asValue(config.HTTP_PORT),
    kafkaProducer: asClass(KafkaProducer).classic().singleton().disposer((p) => p.dispose()),
    kafkaProducerOpts: asValue({
      rdKafkaBrokerOpts: {
        'bootstrap.servers': config.KAFKA_SERVERS
      }
    })
  });

  return container;
}

module.exports = registerContainer;
