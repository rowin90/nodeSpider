var express = require("express");
var router = express.Router();
// const User = require("../models/in_memo/user");
const UserService = require("../../services/use_service");
const apiRes = require("../../utils/api_response");
const auth = require("../../middlewares/auth");

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

router.post("/", function(req, res, next) {
  (async () => {
    const { username, password, name } = req.body;
    const result = await UserService.addNewUser({ username, password, name });

    return result;
  })()
    .then(r => {
      res.data = r;
      apiRes(req, res);
    })
    .catch(e => {
      next(e);
    });
});

router.get("/:userId", function(req, res, next) {
  (async () => {
    let { userId } = req.params;
    try {
      const user = await UserService.getUserById(userId);
      return user;
    } catch (error) {
      res.json(error);
    }
  })()
    .then(r => {
      res.data = r;
      apiRes(req, res);
    })
    .catch(e => {
      next(e);
    });
});

router.post("/:userId/subscription", auth(), function(req, res, next) {
  (async () => {
    try {
      const sub = await UserService.createSubscription(
        req.params.userId,
        req.body.url
      );
      return sub;
    } catch (e) {
      next(e);
    }
  })()
    .then(r => {
      res.data = r;
      apiRes(req, res);
    })
    .catch(e => {
      next(e);
    });
});

module.exports = router;
