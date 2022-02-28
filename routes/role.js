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

//Create New Role
router.post("/", async (req, res) => {
  const role = new Role({
    role_name: req.body.role_name,
  });

  try {
    const response = await role.save();
    res.status(200).send(role);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Role By Id
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    res.status(200).send(role);
  } catch (error) {
    res.status(404).send({ error: `No role found with id: ${req.params.id} ` });
  }
});

//Update Existing Role
router.patch("/:id", async (req, res) => {
  try {
    //Check if document exists
    const role = await Role.findById(req.params.id);

    //Update only modified properties
    if (req.body.role_name) role.role_name = req.body.role_name;

    //Save changes
    try {
      const response = await role.save();
      res.status(200).send(role);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res.status(404).send({ error: `No role found with id: ${req.params.id} ` });
  }
});
