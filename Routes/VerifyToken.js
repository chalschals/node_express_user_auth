const { func } = require("@hapi/joi");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    console.log(1);
    const verified = jwt.verify(token, process.env.TOKEN_SECERT);
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(401).send("Access Denied you");
  }
};
