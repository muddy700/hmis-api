const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret_key = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send();

  jwt.verify(token, secret_key, (err, user) => {
    if (err) return res.status(403).send(err);
    req.user = user;
    // console.log(`user: ${user}, Err: ${err}`);
    next();
  });
};

module.exports = authenticateToken;
