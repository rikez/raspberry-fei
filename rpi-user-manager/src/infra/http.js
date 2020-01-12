'use strict';

const http = require('http');
const VError = require('verror');
const EventEmitter = require('events');

/**
 * @class HttpServer
 * @extends {EventEmitter}
 */
class HttpServer extends EventEmitter {
  /**
   * Creates an instance of HttpServer.
   * @param {Object} app
   * @param {number} port
   * @memberof HttpServer
   */
  constructor(app, port) {
    super();
    this.app = http.createServer(app);
    this.port = port;
  }

  /**
   * @returns
   * @memberof HttpServer
   */
  init() {
    return new Promise((resolve, reject) => {
      this.app.on('error', (err) => {
        if (err.syscall !== 'listen') {
          this.emit('error', new VError(err, 'Unexpected error on http server'));
          return;
        }
        const bind = typeof this.port === 'string'
          ? 'Pipe ' + this.port
          : 'Port ' + this.port;

        switch (err.code) {
          case 'EACCES':
            return reject(new VError(err, `${bind} requires elevated privileges}`));
          case 'EADDRINUSE':
            return reject(new VError(err, `${bind} is already in use`));
          default:
            return reject(new VError(err, 'Unexpected error on http server'));
        }
      });
      this.app.listen(this.port, () => {
        this.emit('info', `Server is listening on ${this.port}`);
        resolve();
      });
    });
  }

  /**
   * @memberof HttpServer
   */
  dispose() {
    return new Promise((resolve, reject) => {
      this.app.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = HttpServer;