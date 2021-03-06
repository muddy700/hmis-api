const express = require("express");
const Symptom = require("../models/Symptom");
const router = express.Router();

//Get All Symptoms
router.get("/", async (req, res) => {
  // #swagger.tags = ['Symptoms']
  //  #swagger.path = '/symptoms'
  //  #swagger.summary = 'List all symptoms'

  try {
    const symptoms = await Symptom.find();
    res.status(200).send(symptoms);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Symptom
router.post("/", async (req, res) => {
  // #swagger.tags = ['Symptoms']
  //  #swagger.path = '/symptoms'
  //  #swagger.summary = 'Create new symptom'

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
  // #swagger.tags = ['Symptoms']
  //  #swagger.path = '/symptoms/{id}'
  //  #swagger.summary = 'Get single symptom by id'

  try {
    const symptom = await Symptom.findById(req.params.id);
    res.status(200).send(symptom);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No symptom found with id: ${req.params.id} ` });
  }
});


//Update Existing Symptom
router.patch("/:id", async (req, res) => {
  // #swagger.tags = ['Symptoms']
  //  #swagger.path = '/symptoms/{id}'
  //  #swagger.summary = 'Edit single symptom by id'

  try {
    //Check if document exists
    const symptom = await Symptom.findById(req.params.id);

    //Update only modified properties
    if (req.body.name) symptom.name = req.body.name;

    //Save changes
    try {
      const response = await symptom.save();
      res.status(200).send(symptom);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No symptom found with id: ${req.params.id} ` });
  }
});


//Delete an existing symptom
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Symptoms']
  //  #swagger.path = '/symptoms/{id}'
  //  #swagger.summary = 'Delete single symptom by id'

  try {
    //Check if document exists
    const symptom = await Symptom.findById(req.params.id);
    //If got null response, return error and exit function
    if (!symptom) {
      res
        .status(404)
        .send({ error: `No symptom found with id: ${req.params.id} ` });
      return;
    }

    //If found the doc
    //Delete the document
    try {
      const response = await Symptom.deleteOne({ _id: req.params.id });
      res.status(200).send("Symptom deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete the doc
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No symptom found with id: ${req.params.id} ` });
  }
});

module.exports = router;
