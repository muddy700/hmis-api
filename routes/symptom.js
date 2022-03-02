const express = require("express");
const Symptom = require("../models/Symptom");
const router = express.Router();

//Get All Symptoms
router.get("/", async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.status(200).send(symptoms);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Symptom
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const symptom = new Symptom({
    name: req.body.name,
  });

  try {
    const response = await symptom.save();
    res.status(200).send(symptom);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Symptom By Id
router.get("/:id", async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    res.status(200).send(symptom);
  } catch (error) {
    res.status(404).send({ error: `No symptom found with id: ${req.params.id} ` });
  }
});

module.exports = router;
