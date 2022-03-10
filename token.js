const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/User");

const secret_key = process.env.JWT_SECRET_KEY;

const generateAccessToken = async (userId) => {
  const token = jwt.sign(userId, secret_key, { expiresIn: "720m" });
  //Retrieve User Object
  try {
    const user = await User.findById(userId.userId);
    user.token = token;
    //Save token
    try {
      const response = await user.save();
      return token;
    } catch (error) {
      //Handle error when fail to save token
      // console.log("failed to save token");
      return false;
    }
  } catch (error) {
    //Handle error when fail to get user
    // console.log("failed to get user ");
    return false;
  }
};

module.exports = generateAccessToken;
