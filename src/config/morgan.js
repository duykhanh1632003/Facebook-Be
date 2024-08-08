const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');

// Create different IP formats for production and development
const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');

// Format for successful responses
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

// Format for error responses
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// Morgan handler for successful responses
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,  // Skip if status code is >= 400
  stream: { write: (message) => logger.info(message.trim()) },
});

// Morgan handler for error responses
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,  // Skip if status code is < 400
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};
