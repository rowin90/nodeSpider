const loggerSetting = require("../../setting").logger;
const winston = require("winston");
require("winston-daily-rotate-file");

const { Logger, transports } = winston;
const { DailyRotateFile } = transports;
const logger = new Logger({
  transports: [
    new DailyRotateFile({
      name: "base_logger",
      filename: `${loggerSetting.path}app.log`,
      datePatten: "yyyy-MM-dd",
      prepend: false,
      level: "info"
    })
  ]
});

module.exports = logger;
