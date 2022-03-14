const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // #swagger.tags = [' Testing']
  //  #swagger.path = '/test'

  res
    .status(200)
    .send("Hellow Buddy! 👋, You're connected successfully. ✅✅ ");
});

module.exports = router;
