const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../authentication");

//Delete Token
router.post("/", authenticate, async (req, res) => {
  // #swagger.tags = ['Auth']
  //  #swagger.path = '/logout'
  /* #swagger.parameters['request-source-domain'] = { 
           in: 'header',
           description: 'Request Source Domain',
           required: true
    } */

  try {
    const response = await User.updateOne(
      { _id: req.user.userId },
      {
        $unset: { token: 1 },
      }
    );
    res.status(200).send({ Success: true });
  } catch (error) {
    //Throw error if failed to delete token
    res.status(500).send({ error: error });
  }
});

module.exports = router;
