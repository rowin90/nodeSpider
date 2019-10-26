const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: { type: String, required: true, index: 1, unique: true },

  age: { type: Number, max: 120, min: [0, "you are too young"] },
  password: { type: String }
});

const UserModel = mongoose.model("user", UserSchema);

async function insert(user) {
  const created = await UserModel.create(user);
  return created;
}
async function getOneById(id) {
  const user = await UserModel.findOne({ _id: id });
  return user;
}
async function getOneByName(name) {
  const user = UserModel.findOne({ name });
  return user;
}
async function list(params) {
  const match = {};
  let flow = UserModel.find(match);

  const users = await flow.exec();
  return users;
}
module.exports = {
  insert,
  getOneById,
  getOneByName,
  list
};
