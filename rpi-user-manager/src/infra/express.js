'use strict';

/* istanbul ignore file */

const EventEmitter = require('events');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const VError = require('verror');

const HttpServer = require('./http');


/**
 * Wrapper around the express MVC framework
 * @class Express
 * @extends {EventEmitter}
 */
class Express extends EventEmitter {
  /**
   * Creates an instance of Express.
   * @param {number} port
   * @param {Object} logger
   * @param {Function} registerRoutes
   * @param {Object} handlers
   * @param {Function} auth
   * @memberof Express
   */
  constructor(port, logger, getRoutes, handlers) {
    super();

    this.app = express();
    this.port = port;
    this.logger = logger;
    this.getRoutes = getRoutes;
    this.handlers = handlers;
  }


  /**
   * Express server initialization
   * @memberof Express
   */
  async init() {
    try {
      const routes = this.getRoutes();

      // Remove unnecessary exposed headers
      this.app.use(helmet());
  
      // Allow json parser on body
      this.app.use(bodyParser.json());

      // Enable cross-origin requests
      this.app.use(cors());

      this.app.use(this.handlers.logging);
      this.app.use('/', routes);
      this.app.use(this.handlers.error);

      await this.registerHttpServer();
    } catch(err) {
      throw new VError(err, 'Failed to start the express server');
    }
  }


  /**
   * Disposes the express http server
   * @memberof Express
   */
  async dispose() {
    await this.httpServer.dispose();
  }


  /**
   * Creates the http server, exposing it in a port
   * @memberof Express
   */
  async registerHttpServer() {
    this.httpServer = new HttpServer(this.app, this.port);
    this.httpServer.on('error', (err) => {
      this.emit('error', err);
    });
    this.httpServer.on('info', (msg) => {
      this.emit('info', msg);
    });

    await this.httpServer.init();
  }
}

module.exports = Express;
