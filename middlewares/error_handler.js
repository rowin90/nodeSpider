const logger = require("../utils/loggers/logger");

function handler(options) {
  return function(err, req, res, next) {
    const errMeta = {
      query: req.query,
      url: req.originalUrl,
      userInfo: req.user
    };
    logger.error(
      "uncaught error in the middelware process",
      err.message,
      errMeta
    );
  };
}

module.exports = handler;
