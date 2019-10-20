var express = require("express");
var router = express.Router();
// const User = require("../models/in_memo/user");
const UserService = require("../services/use_service");

/* GET users listing. */
router.get("/", function(req, res) {
  (async () => {
    const users = await UserService.getAllUsers();
    res.locals.users = users;
    res.render("users");
  })()
    .then(r => console.log(r))
    .catch(e => console.log(e));
});

router.post("/", function(req, res) {
  const { firstName, lastName, age } = req.body;
  const u = UserService.addNewUser(firstName, lastName, age);
  res.json(u);
});

router.get("/:userId", function(req, res) {
  const user = UserService.getUserById(Number(req.params.userId));
  res.locals.user = user;
  res.render("user");
});

router.post("/:userId/subscription", function(req, res, next) {
  try {
    const sub = UserService.createSubscription(
      Number(req.params.userId),
      req.body.url
    );
    res.json(sub);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
