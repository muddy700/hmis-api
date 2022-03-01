const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secret_key = process.env.JWT_SECRET_KEY;

const generateAccessToken = (userId) => {
  const token = jwt.sign(userId, secret_key, { expiresIn: "90s" });
  return token;
};

module.exports = generateAccessToken;
