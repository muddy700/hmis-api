const express = require("express");
const Role = require("../models/Role");
const router = express.Router();

module.exports = router;

//Get All Roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).send(roles);
  } catch (error) {
    // res.status(500).send("Failed to fetch roles");
    res.status(500).send({ error: error });
  }
});

//Create new role