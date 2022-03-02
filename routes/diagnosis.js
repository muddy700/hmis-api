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

//Get Diagnosis By Id
router.get("/:id", async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    res.status(200).send(diagnosis);
  } catch (error) {
    res.status(404).send({ error: `No diagnosis found with id: ${req.params.id} ` });
  }
});



//Update Existing Diagnosis
router.patch("/:id", async (req, res) => {
  try {
    //Check if document exists
    const diagnosis = await Diagnosis.findById(req.params.id);

    //Update only modified properties
    if (req.body.name) diagnosis.name = req.body.name;

    //Save changes
    try {
      const response = await diagnosis.save();
      res.status(200).send(diagnosis);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res.status(404).send({ error: `No diagnosis found with id: ${req.params.id} ` });
  }
});

module.exports = router