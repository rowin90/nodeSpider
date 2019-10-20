const mongoose = require("mongoose");

mongoose.Promise = Promise;

const uri = "mongodb://localhost:27017/test";
mongoose.connect(uri, { useMongoClient: true });

const db = mongoose.connection;

db.on("open", () => {
  console.log("db connected");
});

db.on("error", () => {
  console.log("db error");
});
