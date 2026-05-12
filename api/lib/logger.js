'use strict';

const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  base: {
    service: 'hq-aviation-server',
    release: process.env.GIT_REV || 'unknown',
  },
});

module.exports = logger;
module.exports.default = logger;
module.exports.child = function child(bindings) {
  return logger.child(bindings);
};
