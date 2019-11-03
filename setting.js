const Production = {
  logger: {
    path: "/var/logs/test/"
  },
  mongo: {
    uri: "mongodb://localhost:27017/test"
  }
};

const Debug = {
  logger: {
    path: "./logs/"
  },
  mongo: {
    uri: "mongodb://localhost:27017/test"
  }
};

if (process.env.NODE_ENV === "production") {
  module.exports = Production;
} else {
  module.exports = Debug;
}
