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

module.exports = router;
