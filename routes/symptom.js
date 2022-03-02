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

module.exports = router;