const express = require("express");
const router = express.Router();
const User = require("../models/User");

//Data Populators
const userProjector = { role: 1 };
const rolePopulator = {
  path: "role",
  select: "role_name -_id",
};

//Get All Users By RoleId
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

module.exports = router;
