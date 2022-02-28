const express = require("express");
const User = require("../models/User");
const router = express.Router();

//Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New User
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const user = new User(req.body);

  //   const user = new User({
  //     role_name: req.body.role_name,
  //   });

  try {
    const response = await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
