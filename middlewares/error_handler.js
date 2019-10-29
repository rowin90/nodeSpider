const logger = require("../utils/loggers/logger");

function handler(options) {
  return function(err, req, res, next) {
    const errMeta = {
      query: req.query,
      url: req.originalUrl,
      userInfo: req.user
    };
    logger.error(
      "uncaught error in the middleware process",
      err.message,
      errMeta
    );
    res.json({ errMeta });
  };
}

module.exports = handler;
