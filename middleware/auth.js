const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, env.process.JWT_SECRET, (err, payload) => {
        if (err) {
          res.status(401).json({ message: "unauthorized" });
        } else {
          req.user = payload;
          next();
        }
      });
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
    console.log(token);
  }
};
