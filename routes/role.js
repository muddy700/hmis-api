const express = require("express");
const Role = require("../models/Role");
const router = express.Router();
const authenticate = require("../authentication");

//Get All Roles
router.get("/", authenticate, async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles'
  //  #swagger.summary = 'List all roles'
  // #swagger.description = 'Get all roles'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

  try {
    const roles = await Role.find();
    res.status(200).send(roles);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Role
router.post("/", authenticate, async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles'
  //  #swagger.summary = 'Create a new role'
  // #swagger.description = 'Create a new role'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

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
router.get("/:id", authenticate, async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles/{id}'
  //  #swagger.summary = 'Get a role by id'
  // #swagger.description = 'Get single role by role_id'
  // #swagger.parameters['id'] = { description: 'Role id.' }
  /* #swagger.responses[200] = { 
             schema: { $ref: "#/definitions/Role" },
             description: 'Roles retrieved successfull.' 
      } */
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

  try {
    const role = await Role.findById(req.params.id);
    if (!role)
      res
        .status(404)
        .send({ error: `No role found with id: ${req.params.id} ` });
    else res.status(200).send(role);
  } catch (error) {
    res.status(404).send({ error: `No role found with id: ${req.params.id} ` });
  }
});

//Update Existing Role
router.patch("/:id", authenticate, async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles/{id}'
  //  #swagger.summary = 'Update a role'
  // #swagger.description = 'Edit single role'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

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
router.delete("/:id", authenticate, async (req, res) => {
  // #swagger.tags = ['Role']
  //  #swagger.path = '/roles/{id}'
  //  #swagger.summary = 'Delete a role by id'
  // #swagger.description = 'Delete single role by role_id'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

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
