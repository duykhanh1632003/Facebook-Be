const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');

// Custom token to log error messages
morgan.token('message', (req, res) => res.locals.errorMessage || '');

// Custom token to log request body for POST requests
morgan.token('body', (req) => JSON.stringify(req.body));

// Custom token to log request headers
morgan.token('headers', (req) => JSON.stringify(req.headers));

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms :headers :body`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message :headers :body`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

// Handler for all requests to log skipped requests
const requestLogger = morgan(':method :url :status - :response-time ms', {
  stream: { write: (message) => logger.info(`Skipped request: ${message.trim()}`) },
});

module.exports = {
  successHandler,
  errorHandler,
  requestLogger,
};
