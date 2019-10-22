const HTTPBaseError = require("./http_base_error");

const ERROR_CODE = 404000;

class NoFoundError extends HTTPBaseError {
  constructor(resourceName, resourceId, httpMsg) {
    super(
      404,
      httpMsg,
      ERROR_CODE,
      `${resourceName} not fount , id : ${resourceId}`
    );
  }
}

module.exports = NoFoundError;
