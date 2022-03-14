const express = require("express");
const User = require("../models/User");
const createToken = require("../token");
const authenticate = require("../authentication");
const router = express.Router();

const userProjector = { password: 0, token: 0 };

//Get All Users
router.get("/", authenticate, async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users'
  // #swagger.description = 'Get all users'
  try {
    const users = await User.find({}, userProjector).populate("role");
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New User
router.post("/", async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users'
  // #swagger.description = 'Create new user'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'User Info',
           schema: { $ref: "#/definitions/User" }
    } */

  //Initialize new instance/doc
  const user = new User(req.body);

  try {
    const response = await user.save();
    //create access token
    try {
      const token = await createToken({ userId: user._id });
      res.status(200).send({ user, token });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Failed to create token.", error: error });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get User By Id
router.get("/:id", async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users/{id}'
  // #swagger.description = 'Get single user by user_id'

  try {
    const user = await User.findById(req.params.id, userProjector).populate(
      "role"
    );
    //If got null response, return error and exit function
    if (!user) {
      res
        .status(404)
        .send({ error: `No user found with id: ${req.params.id} ` });
      return;
    }
    /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'User retrieved successfull.' 
        } */
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error: `No User found with id: ${req.params.id} ` });
  }
});

//Update Existing User
router.patch("/:id", authenticate, async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users/{id}'
  // #swagger.description = 'Edit single user'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'User Info',
           schema: { $ref: "#/definitions/User" }
    } */

  try {
    //Check if user exists
    const user = await User.findById(req.params.id);

    //Ignore read only properties
    const { username, date_created, full_name, ...remainingData } = req.body;

    //Retrieve modified properties
    const modifiedProperties = Object.keys(remainingData);

    //Loop and update only properties with data
    modifiedProperties.forEach((key, index) => {
      if (!remainingData[key]) {
        // console.log(`${key} has no value`);
      } else if (key === "address") {
        //Handle embedded doc
        let oldAddress = user[key];
        const newAddress = remainingData[key];

        if (!oldAddress) user[key] = newAddress;
        else {
          //Loop and update only properties with data
          Object.keys(newAddress).forEach((prop, index) => {
            if (newAddress[prop]) oldAddress[prop] = newAddress[prop];
          });
        }
      } else {
        user[key] = remainingData[key];
      }
    });

    //Save changes
    try {
      const response = await user.save();
      res.status(200).send(user);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no user found
    res.status(404).send({ error: `No user found with id: ${req.params.id} ` });
  }
});

//Delete an existing user
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users/{id}'
  // #swagger.description = 'Delete single user by user_id'

  try {
    //Check if user exists
    const user = await User.findById(req.params.id);
    //If got null response, return error and exit function
    if (!user) {
      res
        .status(404)
        .send({ error: `No user found with id: ${req.params.id} ` });
      return;
    }

    //If user found
    //Delete user
    try {
      const response = await User.deleteOne({ _id: req.params.id });
      res.status(200).send("User deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete user
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no user found
    res.status(404).send({ error: `No user found with id: ${req.params.id} ` });
  }
});

module.exports = router;
