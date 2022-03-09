const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret_key = process.env.JWT_SECRET_KEY;
const custom_header = process.env.AUTH_HEADER;
const allowed_domain = process.env.SOURCE_DOMAIN;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const request_domain = req.headers[custom_header];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send();
  else if (!request_domain) return res.status(401).send(request_domain);
  else if (request_domain !== allowed_domain) return res.status(401).send();
  else {
    jwt.verify(token, secret_key, (err, user) => {
      if (err) return res.status(401).send(err);
      req.user = user;
      next();
    });
  }
};

module.exports = authenticateToken;
