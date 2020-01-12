'use strict';

const collectDHT22Metrics = {
  body: {
    type: 'object',
    required: ['requiredKey'],
    properties: {
      deviceId: { type: 'string' },
      temperature: { type: 'number' },
      humidity: { type: 'number' }
    }
  },
  response: {
    202: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    } 
  }
};

module.exports = {
  collectDHT22Metrics
};