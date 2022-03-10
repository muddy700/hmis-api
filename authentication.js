const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/User");
dotenv.config();
const secret_key = process.env.JWT_SECRET_KEY;
const custom_header = process.env.AUTH_HEADER;
const allowed_domain = process.env.SOURCE_DOMAIN;

const getUserInfo = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    return false;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const request_domain = req.headers[custom_header];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send();
  else if (!request_domain) return res.status(401).send();
  //No Custom Header passed
  else if (request_domain !== allowed_domain) return res.status(401).send();
  else {
    jwt.verify(token, secret_key, async (err, user) => {
      if (err) return res.status(401).send(err);
      const userInfo =  await getUserInfo(user.userId)
      if (!userInfo.token || token !== userInfo.token) {
        // console.log(token, userInfo.token);
        return res.status(403).send();
      }
      req.user = user;
      next();
    });
  }
};


const getUser = async(id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch (error) {
    return false
    
  }
}

module.exports = authenticateToken;
