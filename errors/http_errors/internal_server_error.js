const HTTPBaseError = require("./http_base_error");

const ERROR_CODE = 5000000;

class InternalServerError extends HTTPBaseError {
  constructor(msg) {
    super(
      500,
      "服务器开小差了，请稍后重试",
      ERROR_CODE,
      `something wrong : ${msg}`
    );
  }
}

module.exports = InternalServerError;
