const express = require("express");
const Role = require("../models/Role");
const router = express.Router();

//Get All Roles
router.get("/", async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles'
  // #swagger.description = 'Get all roles'
  try {
    const roles = await Role.find();
    res.status(200).send(roles);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Role
router.post("/", async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles'
  // #swagger.description = 'Create new role'

  //Initialize new instance/doc
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
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles/{id}'
  // #swagger.description = 'Get single role by role_id'
  // #swagger.parameters['id'] = { description: 'Role id.' }

  try {
    const role = await Role.findById(req.params.id);
    if (!role)
      res
        .status(404)
        .send({ error: `No role found with id: ${req.params.id} ` });
    /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Role" },
               description: 'Roles retrieved successfull.' 
        } */ else res.status(200).send(role);
  } catch (error) {
    res.status(404).send({ error: `No role found with id: ${req.params.id} ` });
  }
});

//Update Existing Role
router.patch("/:id", async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles/{id}'
  // #swagger.description = 'Edit single role'

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

//Delete an existing role
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles/{id}'
  // #swagger.description = 'Delete single role by role_id'

  try {
    //Check if document exists
    const role = await Role.findById(req.params.id);
    //If got null response, return error and exit function
    if (!role) {
      res
        .status(404)
        .send({ error: `No role found with id: ${req.params.id} ` });
      return;
    }

    //If found the doc
    //Delete the document
    try {
      const response = await Role.deleteOne({ _id: req.params.id });
      res.status(200).send("Role deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete the doc
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res.status(404).send({ error: `No role found with id: ${req.params.id} ` });
  }
});

module.exports = router;
