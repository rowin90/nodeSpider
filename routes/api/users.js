var express = require("express");
var router = express.Router();
// const User = require("../models/in_memo/user");
const UserService = require("../../services/use_service");
const apiRes = require("../../utils/api_response");

/* GET users listing. */
router.get("/", function(req, res, next) {
  (async () => {
    const users = await UserService.getAllUsers();
    return {
      users
    };
  })()
    .then(r => {
      res.data = r;
      apiRes(req, res);
    })
    .catch(e => {
      next(e);
    });
});

router.post("/", async function(req, res) {
  const { name, age } = req.body;
  const u = await UserService.addNewUser(name, age);
  console.log(u);

  res.json(u);
});

router.get("/:userId", function(req, res) {
  (async () => {
    let { userId } = req.params;
    try {
      const user = await UserService.getUserById(Number(userId));
      res.locals.user = user;
      res.render("user");
    } catch (error) {
      res.json(error);
    }
  })();
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
