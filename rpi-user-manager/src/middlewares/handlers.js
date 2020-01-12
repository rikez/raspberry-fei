'use strict';

const { getDecoratedRequest } = require('../utils');
const logger = require('../infra/logger');

/**
 * Middleware handlers
 * @returns {{ errorHandler: Function, requestLogger: Function }}
 */
function handler() {
  /**
   * Handles all errors from the requests
   * @param {HttpException} err
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   */
  function errorHandler(err, req, res, next) {
    const { args, name, status, message, stack } = err;

    logger.error({
      request: getDecoratedRequest(req),
      error: {
        name,
        message,
        args,
        stack
      }
    }, `Failed to process the request to ${req.method} ${req.url}`);

    res.status(status || 500).json({
      error: name,
      message,
      details: args
    });
  }

  /**
   * Request logger
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   */
  function requestLogger(req, res, next) {
    logger.info(getDecoratedRequest(req), `Received request to ${req.method} ${req.url}`);
    next();
  }

  return {
    error: errorHandler,
    logging: requestLogger
  };
}

module.exports = handler;
