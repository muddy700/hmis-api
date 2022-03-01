const express = require("express");
const User = require("../models/User");
const router = express.Router();

//Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("role");
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New User
router.post("/", async (req, res) => {
  //Append full-name
  const payload = {
    ...req.body,
    full_name: req.body.first_name + " " + req.body.last_name,
  };
  //Initialize new instance/doc
  const user = new User(payload);

  try {
    const response = await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get User By Id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error: `No User found with id: ${req.params.id} ` });
  }
});

module.exports = router;
