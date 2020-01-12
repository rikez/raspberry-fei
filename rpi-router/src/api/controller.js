'use strict';

const VError = require('verror');

const logger = require('../infra/logger');
const config = require('../config');

/**
 * @class RPIController
 */
class RPIController {
  /**
   * Creates an instance of RPIController.
   * @param {Producer} kafkaProducer
   * @memberof RPIController
   */
  constructor(kafkaProducer) {
    this.kafkaProducer = kafkaProducer;
  }

  /**
   * Collects the metrics coming from the Raspberry PI Request and publishes in a kafka topic
   * @method POST
   * @param {fastify.HttpRequest} request
   * @param {fastify.HttpResponse} reply
   * @memberof RPIController
   */
  async collectDHT22Metrics(request, reply) {
    try {
      logger.info(request.body, 'Received the DHT22 metrics');

      await this.kafkaProducer.publish(config.NOTIFICATION_TOPIC, request.body);

      reply.header('Content-Type', 'application/json').code(200);
      return { message: 'Data collected' };
    } catch (error) {
      logger.error(new VError(error, 'Failed to collect the DHT22 metrics'));
      
      reply.header('Content-Type', 'application/json').code(500);
      return { error: 'Internal Error', message: 'Something went wrong' };
    }
  }
}

module.exports = RPIController;