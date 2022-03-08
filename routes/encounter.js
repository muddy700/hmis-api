const express = require("express");
const router = express.Router();
const Encounter = require("../models/Encounter");

//Get All Encounters
router.get("/", async (req, res) => {
  try {
    const encounters = await Encounter.find();
    res.status(200).send(encounters);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Encounter
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const encounter = new Encounter(req.body);

  try {
    const response = await encounter.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
