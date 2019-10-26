var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require("morgan");
const httpErrHandler = require("./middlewares/http_error_handler");
const errHandler = require("./middlewares/error_handler");
const NotFoundError = require("./errors/resource_no_found_error");
const logger = require("./utils/loggers/logger");
require("./services/mongodb_connection");

var apiIndex = require("./routes/api/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiIndex);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use(function(req, res, next) {
  if (!res.headersSent) {
    next(new NotFoundError(req.method, req.path, "没有找到您要的资源"));
  }
});

app.use(httpErrHandler());
app.use(errHandler());

process.on("uncaughtException", err => {
  logger.error("uncaughtException", { err });
});

process.on("unhandledRejection", (reason, p) => {
  logger.error("unhandledRejection", { reason, p });
});

// error handler
// app.use(function(err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
