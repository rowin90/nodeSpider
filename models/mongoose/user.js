const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const crypto = require("crypto");

const pbkdf2Async = require("util").promisify(crypto.pbkdf2);
const passwordConfig = require("../../cipher/password_config");

const HttpReqParamError = require("../../errors/http_errors/http_request_params_error");

const UserSchema = new Schema({
  name: { type: String, required: true, index: 1 },

  age: { type: Number, max: 120, min: [0, "you are too young"] },
  username: { type: String, required: true, unique: true },
  password: { type: String }
});

const UserModel = mongoose.model("user", UserSchema);

async function insert(user) {
  const created = await UserModel.create(user);
  return created;
}
async function getOneById(id) {
  const user = await UserModel.findOne({ _id: id }, { password: 0 });
  return user;
}
async function getOneByName(name) {
  const user = UserModel.findOne({ name }, { password: 0 });
  return user;
}
async function list(params) {
  const match = {};
  let flow = UserModel.find(match);
  flow.select({ password: 0 });
  const users = await flow.exec();
  return users;
}

async function createdUserByNamePass(user) {
  const usernameDupUser = await UserModel.findOne(
    {
      $or: [
        {
          username: user.username
        },
        {
          name: user.name
        }
      ]
    },
    { _id: 1 }
  );

  if (usernameDupUser) {
    throw new HttpReqParamError(
      "username",
      "用户名或者昵称已经被占用了，请再找一个吧",
      `duplicate username:${user.username}`
    );
  }

  const passToSave = await pbkdf2Async(
    user.password,
    passwordConfig.SALT,
    passwordConfig.ITERATIONS,
    passwordConfig.KEY_LENGTH,
    passwordConfig.DIGEST
  );
  const created = await insert({
    username: user.username,
    password: passToSave,
    name: user.name
  });

  return {
    _id: created._id,
    username: created.username,
    name: created.name
  };
}

async function getUserByNamePass(username, password) {
  const passToFind = await pbkdf2Async(
    password,
    passwordConfig.SALT,
    passwordConfig.ITERATIONS,
    passwordConfig.KEY_LENGTH,
    passwordConfig.DIGEST
  );

  const found = await UserModel.findOne(
    {
      username,
      password: passToFind
    },
    {
      password: 0
    }
  );

  return found;
}
module.exports = {
  insert,
  getOneById,
  getOneByName,
  list,
  createdUserByNamePass,
  getUserByNamePass
};
