'use strict';

const blocked = require('blocked');
const VError = require('verror');

const registerContainer = require('./infra/container');
const logger = require('./infra/logger');

/**
 * Handler for the applciation graceful stop
 * @param {Object} container
 * @returns
 */
function exitHandler(container) {
  return async () => {
    logger.info('Disposing the rpi-router...');
    try {
      await container.dispose();

      logger.info('Disposed the rpi-router');
      process.exit(0);
    } catch (error) {
      logger.error(new VError(error, 'Failed to shutdown application'));
      process.exit(1);
    } finally {
      logger.dispose();
    }
  };
}

/**
 * App entrypoint
 */
(async function() {
  try {
    const container = registerContainer();

    process.on('SIGHUP', exitHandler(container));
    process.on('SIGINT', exitHandler(container));
    process.on('SIGTERM', exitHandler(container));

    blocked((ms) => {
      logger.warn({ blockedInMs: ms }, `The event loop was blocked for ${ms}ms`);
    }, { threshold: 20 });

    const producer = container.resolve('kafkaProducer');
    producer.on('error', (error) => {
      logger.error(new VError(error, 'Unexpected error on kafkaProducer'));
      process.kill(process.pid, 'SIGINT');
    });
    producer.on('warn', (error) => {
      logger.warn(new VError(error, 'Unexpected warning on kafkaProducer'));
    });
    producer.on('info', (msg, args) => {
      logger.info({ args }, msg);
    });
    producer.on('delivery-report', (msg, report) => {
      logger.info({ report }, msg);
    });
    producer.on('delivery-report-error', (error) => {
      logger.error(new VError(error, 'Failed to delivery message'));
    });
    await producer.init();

    const httpServer = container.resolve('httpServer');
    await httpServer.init();

    return container;
  } catch (error) {
    logger.error(error, 'Failed to initialize the rpi-router');
    process.kill(process.pid, 'SIGINT');
  }
})();