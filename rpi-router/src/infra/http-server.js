'use strict';

const VError = require('verror');
const fastify = require('fastify');
const helmet = require('helmet');
const cors = require('cors');

const logger = require('./logger');

/**
 * Simple wrapper around the fastify
 * @class HttpServer
 * @extends {EventEmitter}
 */
class HttpServer {
  /**
   * Creates an instance of HttpServer.
   * @param {Array<{ method: string, path: string, schema: fastify.schema, handler: Function }>} routeMap
   * @param {number} port
   * @memberof HttpServer
   */
  constructor(routeMap, port) {
    this.routeMap = routeMap;
    this.port = port;
    this.fastify = fastify({ logger: true });
  }

  /**
   * Http server initialization method
   * @returns {Promise<void>}
   * @memberof HttpServer
   */
  init() {
    return new Promise((resolve, reject) => {
      this.fastify.use(cors());
      this.fastify.use(helmet());

      for (const { method, path, schema, handler } of this.routeMap) {
        this.fastify[method](path, schema, handler);
      }
  
      this.fastify.listen(this.port, '0.0.0.0', (error, addr) => {
        if (error) {
          return reject(new VError(error, 'Failed to start the Http Server'));
        }

        logger.info(`Http server is ready to go on ${addr}`);
        resolve();
      });
    });
  }

  /**
   * Http server disposal
   * @memberof HttpServer
   */
  async dispose() {
    await this.fastify.close();
  }
}

module.exports = HttpServer;