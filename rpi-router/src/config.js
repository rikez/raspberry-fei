'use strict';

/* istanbul ignore file */

require('dotenv').config(process.env.NODE_ENV == 'test' ? { path: './.env.test' } : null);

const Joi = require('joi');

const configSchema = Joi.object({
  NAME: Joi.string().default('rpi-router'),
  NOTIFICATION_TOPIC: Joi.string().required(),
  HTTP_PORT: Joi.number().required(),
  KAFKA_SERVERS: Joi.string().required()
});

const config = {
  NAME: process.env.NAME,
  HTTP_PORT: process.env.HTTP_PORT,
  KAFKA_SERVERS: process.env.KAFKA_SERVERS,
  NOTIFICATION_TOPIC: process.env.NOTIFICATION_TOPIC
};

const result = configSchema.validate(config);
if (result.error) {
  console.error(result.error);
  process.exit(1);
}

module.exports = result.value;
