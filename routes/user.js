const express = require("express");
const User = require("../models/User");
const createToken = require("../token");
const authenticate = require("../authentication");
const router = express.Router();
const AWS = require("aws-sdk");

const dotenv = require("dotenv");
dotenv.config();
const aws_id = process.env.AWS_ID;
const aws_secret = process.env.AWS_SECRET;
const aws_bucket = process.env.AWS_BUCKET;

const userProjector = { password: 0, token: 0 };

//Create S3 service object
const S3 = new AWS.S3({
  accessKeyId: aws_id,
  secretAccessKey: aws_secret,
});

//Function to upload images/files to AWS-S3
const sendFile = async (req) => {
  const params = {
    Bucket: aws_bucket,
    Key: "profiles-pictures/" + req.file.originalname,
    Body: req.file.buffer,
  };

  try {
    const response = await S3.upload(params).promise();
    // console.log(response);
    return response.Location;
  } catch (error) {
    console.log({ error: error });
    return false;
  }
};

//Get All Users
router.get("/", authenticate, async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users'
  //  #swagger.summary = 'List all users'
  // #swagger.description = 'Get all users'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */
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
  //  #swagger.summary = 'Create a new user'
  // #swagger.description = 'Create new user'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'User Info',
           schema: { $ref: "#/definitions/AddUser" }
    } */

  //Initialize new instance/doc
  const user = new User(req.body);

  //Check if request has profile-image attached
  if (req.file) {
    const imageURL = await sendFile(req);
    if (imageURL) user["profile_image"] = imageURL;
    else {
      return res.status(500).send({ error: "Failed to save image" });
    }
  }

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
router.get("/:id", authenticate, async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users/{id}'
  //  #swagger.summary = 'Get a user by id'
  // #swagger.description = 'Get single user by user_id'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

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
  //  #swagger.summary = 'Update a user'
  // #swagger.description = 'Edit single user'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'User Info',
           schema: { $ref: "#/definitions/EditUser" }
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

    //Check if request has profile-image attached
    if (req.file) {
      const imageURL = await sendFile(req);
      if (imageURL) user["profile_image"] = imageURL;
      else {
        return res.status(500).send({ error: "Failed to save image" });
      }
    }

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
router.delete("/:id", authenticate, async (req, res) => {
  // #swagger.tags = ['User']
  //  #swagger.path = '/users/{id}'
  //  #swagger.summary = 'Delete a user by id'
  // #swagger.description = 'Delete single user by user_id'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

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
