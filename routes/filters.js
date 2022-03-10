const express = require("express");
const router = express.Router();
const User = require("../models/User");

//Data Populators
const userProjector = { password: 0 };
const rolePopulator = {
  path: "role",
  select: "role_name -_id",
};

//Get All Users By Role
router.get("/roles/:role_id/users", async (req, res) => {
  try {
    const users = await User.find(
      { role: req.params.role_id },
      userProjector
    ).populate(rolePopulator);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get All Users By Gender
router.get("/users-by-gender", async (req, res) => {
  try {
    const users = await User.find(
      { gender: req.body.gender },
      userProjector
    ).populate(rolePopulator);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
