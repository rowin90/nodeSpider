var express = require("express");
var router = express.Router();
const JWT = require("jsonwebtoken");

const userRouter = require("./users");
const User = require("../../models/mongoose/user");
const crypto = require("crypto");

const pbkdf2Async = require("bluebird").promisify(crypto.pbkdf2);

const InternalServerError = require("../../errors/internal_server_error");

router.post("/login", (req, res, next) => {
  (async () => {
    const { username, password } = req.body;
    const cipher = await pbkdf2Async(
      password,
      "dasdasdasdasd",
      10000,
      512,
      "sha256"
    );
    try {
      const created = await User.insert({
        username,
        password: cipher.toString()
      });
      res.send(created);
    } catch (error) {
      next(new InternalServerError("新增用户失败 :" + error));
    }
  })();
});

router.post("/hello", (req, res) => {
  const auth = req.get("Authorization");
  if (!auth) return res.send("no auth");
  if (!auth.indexOf("Bearer ") === -1) res.send("no auth");
  const token = auth.split("Bearer ")[1];
  const user = JWT.verify(token, "dadadasd");
  res.send(user);
});

router.use("/user", userRouter);

module.exports = router;
