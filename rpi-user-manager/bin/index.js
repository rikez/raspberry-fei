'use strict';

const VError = require('verror');
const mongoose = require('mongoose');
const config = require('../src/config');
const registerContainer = require('../src/infra/container');
const logger = require('../src/infra/logger');

/**
 * A Handler for the microservice shutdown
 * @param {AwilixContainer} container
 * @returns
 */
function exitHandler(container) {
  return async () => {
    try {
      logger.info('Disposing the rpi-user-manager...');
      await container.dispose();
      logger.info('Disposed the rpi-user-manager');

      process.exit(0);
    } catch (error) {
      logger.error(new VError(error, 'Failed to dispose the rpi-user-manager properly'));
      process.exit(1);
    }
  };
}


/**
 * Microservice startup function
 */
async function main() {
  try {
    logger.info('Initializing the rpi-user-manager...');

    const container = registerContainer();

    process.on('SIGINT', exitHandler(container));
    process.on('SIGTERM', exitHandler(container));
    process.on('SIGHUP', exitHandler(container));

    // Starting the kafka-producer
    const producer = container.resolve('kafkaProducer');
    producer.on('error', (error) => {
      logger.error(new VError(error, 'Unexpected error on the kafka-producer'));
      process.kill(process.pid, 'SIGINT');
    });
    producer.on('warn', (error) => {
      logger.warn(new VError(error, 'Unexpected warn on the kafka-producer'));
    });
    producer.on('info', (msg, args) => {
      logger.warn({ args }, msg);
    });
    producer.on('user-subscription', (msg, args) => {
      logger.info({ args }, msg);
    });
    await producer.init();

    // Starting the mongo-client
    mongoose.connect(config.MONGO_URI, (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('Mongo connected succesfully');
      }
    });

    // Starting the express http-server
    const express = container.resolve('express');
    express.on('error', (error) => {
      logger.error(new VError(error, 'Unexpected error on the express-http-server'));
      process.kill(process.pid, 'SIGINT');
    });
    express.on('info', (message) => {
      logger.info(message);
    });
    await express.init();

    logger.info(`Initialized the rpi-user-manager on HTTP ${process.env.HTTP_PORT}`);
  } catch (error) {
    logger.error(new VError(error, 'Failed to launch the rpi-user-manager'));
    process.kill(process.pid, 'SIGINT');
  }
}

main();