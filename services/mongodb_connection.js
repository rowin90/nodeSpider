const mongoose = require("mongoose");
const mongoSetting = require("../setting").mongo;

mongoose.Promise = Promise;

const uri = mongoSetting.uri;
mongoose.connect(uri, { useMongoClient: true });

const db = mongoose.connection;

db.on("open", () => {
  console.log("db connected");
});

db.on("error", () => {
  console.log("db error");
});
