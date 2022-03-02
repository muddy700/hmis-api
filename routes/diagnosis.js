const express = require("express");
const Diagnosis = require("../models/Diagnosis");
const router = express.Router();

//Get All Diagnosis
router.get("/", async (req, res) => {
  try {
    const diagnosis = await Diagnosis.find();
    res.status(200).send(diagnosis);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Diagnosis
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const diagnosis = new Diagnosis({
    name: req.body.name,
  });

  try {
    const response = await diagnosis.save();
    res.status(200).send(diagnosis);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});


module.exports = router