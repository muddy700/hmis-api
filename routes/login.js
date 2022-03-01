const express = require("express");
const router = express.Router();
const User = require("../models/User");
const createToken = require("../token");

//Login endpoint
router.post("/", async (req, res) => {
  //Check if user exists
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    //Handle error when get null as response
    if (!user) return res.status(400).send("Incorrect Username or Password");

    //If user found create token
    try {
      const token = await createToken({ userId: user._id });
      res.status(200).send({token});
    } catch (error) {
      //Handle error when fail to generate token
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Handle error when fail to get user info
    res.status(400).send({ error: error });
  }
});

module.exports = router;
