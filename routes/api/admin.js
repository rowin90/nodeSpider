var express = require("express");
var router = express.Router();
const SpiderService = require("../../services/spider_service");

const apiRes = require("../../utils/api_response");

router.post("/spider", function(req, res, next) {
  (async () => {
    const { service } = req.body;
    const createdSpider = await SpiderService.registerSpider(service);
    return {
      spider: createdSpider
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

module.exports = router;
