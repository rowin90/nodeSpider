const UserService = require("../services/use_service");
const JWTConfig = require("../cipher/jwt_config");
const JWT = require("jsonwebtoken");
const NoAuthError = require("../errors/http_errors/no_auth");

module.exports = options => {
  return (req, res, next) => {
    (async () => {
      const authorization = req.get("Authorization");
      if (!authorization || authorization.indexOf("Bearer") == -1) {
        throw new NoAuthError(null);
      }
      const token = authorization.split(" ")[1];
      if (!token) {
        throw new NoAuthError(null);
      }
      let user;
      try {
        user = JWT.verify(token, JWTConfig.SECRET);
      } catch (error) {
        throw new NoAuthError(token);
      }

      res.user = user;
    })()
      .then(() => {
        next();
      })
      .catch(e => {
        next(e);
      });
  };
};
