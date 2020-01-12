'use strict';

/**
 * Encapsulates the error in a convenient format
 * @class HttpException
 * @extends {Error}
 */
class HttpException extends Error {
  /**
   * Creates an instance of HttpException.
   * @param {string} name
   * @param {string} message
   * @param {number} status
   * @memberof HttpException
   */
  constructor(name, message, status, args) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = name || this.constructor.name;

    this.message = message || 'Internal error';

    this.args = args;

    this.status = status || 500;
  }
}

module.exports = HttpException;