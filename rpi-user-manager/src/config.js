'use strict';

const Joi = require('joi');
const Dotenv = require('dotenv');

Dotenv.config(process.env.NODE_ENV == 'test' ? { path: './.env.test' } : null);

const envSchema = Joi.object({
  KAFKA_BROKERS: Joi.string().required(),
  HTTP_PORT: Joi.number().required(),
  MONGO_URI: Joi.string().required(),
  NAME: Joi.string().default('rpi-user-manager')
}).required();

const result = envSchema.validate({ 
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  HTTP_PORT: process.env.HTTP_PORT,
  MONGO_URI: process.env.MONGO_URI,
  NAME: process.env.NAME
}, { abortEarly: false });

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

module.exports = result.value;