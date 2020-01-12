'use strict';

const HttpException = require('./exceptions/http');


/**
 * Returns decorated request object fot better logging
 * @param {Express.Request} req
 * @returns
 */
function getDecoratedRequest(req) {
  return {
    method: req.method,
    status: req.status,
    headers: req.headers,
    url: req.url,
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    body: req.body,
    params: req.params,
    query: req.query
  };
}

/**
 * Validates the request schema
 * @param {Object} schema
 * @param {string} [from='body']
 * @returns
 */
function validateRequestSchema(schema, from = 'body') {
  return (req, res, next) => {
    const result = schema.validate(req[from], { abortEarly: false });
    if (result.error) {
      return next(new HttpException('ValidationError', 'Failed to validate the fields', 400, result.error.details));
    }

    req[from] = Object.assign({}, req[from], result.value);

    next();
  };
}

module.exports = {
  validateRequestSchema,
  getDecoratedRequest
};