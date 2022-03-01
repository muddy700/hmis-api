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
    //If got null response, return error and exit function
    if (!user) {
      res
        .status(404)
        .send({ error: `No user found with id: ${req.params.id} ` });
      return;
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error: `No User found with id: ${req.params.id} ` });
  }
});

//Update Existing User
router.patch("/:id", async (req, res) => {
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

        //Update full-name if required
        if (key === "first_name") {
          user["full_name"] =
            remainingData["first_name"] + " " + user["last_name"];
        }
        if (key === "last_name") {
          user["full_name"] =
            user["first_name"] + " " + remainingData["last_name"];
        }
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
