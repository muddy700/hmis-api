const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // #swagger.tags = [' Testing']
  //  #swagger.path = '/test'
  //  #swagger.summary = 'Get greeting text'
  // #swagger.parameters['name'] = { description: 'Your Name' }

  let { name } = req.query; //Retrieve name-sent by client
  if (name) name = name.charAt(0).toUpperCase() + name.slice(1); //Capitalize first-later

  res
    .status(200)
    .send(
      `Hellow ${name || "Buddy"}! 👋, You're connected successfully. ✅✅ `
    );
});

module.exports = router;
