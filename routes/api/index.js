var express = require("express");
var router = express.Router();

const userRouter = require("./users");
const UserService = require("../../services/use_service");
const apiRes = require("../../utils/api_response");

router.get("/login", function(req, res, next) {
  (async () => {
    const { username, password } = req.body;
    const result = await UserService.loginWithNamePass(username, password);
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

router.use("/user", userRouter);

module.exports = router;
