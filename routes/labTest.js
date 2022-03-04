const express = require("express");
const router = express.Router();
const LabTest = require("../models/LabTest");

//Get All LabTest
router.get("/", async (req, res) => {
  try {
    const labTests = await LabTest.find();
    res.status(200).send(labTests);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

module.exports = router;
