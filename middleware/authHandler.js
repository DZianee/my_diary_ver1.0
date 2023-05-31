const httpError = require("./httpErrors");
const jwt = require("jsonwebtoken");

const authHandler = {
  verifyToken: (req, res, next) => {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET_CODE, (err, user) => {
        if (err) httpError.forbidden(res, err);
        else next();
      });
    } catch (error) {
      if (!bearerToken) httpError.notAuth(res);
      console.log(error);
    }
  },
};

module.exports = authHandler;
