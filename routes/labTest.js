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

//Create New LabTest
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const labTest = new LabTest(req.body);

  try {
    const response = await labTest.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
