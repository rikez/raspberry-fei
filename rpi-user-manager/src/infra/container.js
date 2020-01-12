'use strict';

// Libraries
const { asClass, asValue, asFunction, createContainer } = require('awilix');
const KafkaProducer = require('../../lib/kafka-producer');

// Microservice configuration
const config = require('../config');
const logger = require('./logger');

// Infra
const Express = require('./express');

const getRoutes = require('../api');
const UserController = require('../api/controller');

// Middlewares 
const handlers = require('../middlewares/handlers');

/**
 * Registers the service container for the application
 * @returns
 */
function registerContainer() {
  const container = createContainer();
  container.register({
    handlers: asFunction(handlers).singleton().proxy(),
    getRoutes: asFunction(getRoutes).proxy().singleton(),
    express: asClass(Express).classic().singleton().disposer((express) => express.dispose()),
    userController: asClass(UserController).classic().singleton(),
    kafkaProducer: asClass(KafkaProducer).classic().singleton().disposer((p) => p.dispose()),
    kafkaProducerOpts: asValue({
      rdKafkaBrokerOpts: {
        'bootstrap.servers': config.KAFKA_BROKERS
      }
    }),
    port: asValue(config.HTTP_PORT),
    logger: asValue(logger)
  });

  return container;
}

module.exports = registerContainer;
