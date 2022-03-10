const express = require("express");
const router = express.Router();
const User = require("../models/User");

//Data Populators
const userProjector = { role: 1 };
const rolePopulator = {
  path: "role",
  select: "role_name -_id",
};

module.exports = router;
