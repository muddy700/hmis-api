const express = require("express");
const Diagnosis = require("../models/Diagnosis");
const router = express.Router();

//Get All Diagnosis
router.get("/", async (req, res) => {
  // #swagger.tags = ['Diagnosis']
  //  #swagger.path = '/diagnosis'

  try {
    const diagnosis = await Diagnosis.find();
    res.status(200).send(diagnosis);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Diagnosis
router.post("/", async (req, res) => {
  // #swagger.tags = ['Diagnosis']
  //  #swagger.path = '/diagnosis'

  //Initialize new instance/doc
  const diagnosis = new Diagnosis(req.body);

  try {
    const response = await diagnosis.save();
    res.status(200).send(diagnosis);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Diagnosis By Id
router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Diagnosis']
  //  #swagger.path = '/diagnosis/{id}'

  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    res.status(200).send(diagnosis);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No diagnosis found with id: ${req.params.id} ` });
  }
});

//Update Existing Diagnosis
router.patch("/:id", async (req, res) => {
  // #swagger.tags = ['Diagnosis']
  //  #swagger.path = '/diagnosis/{id}'

  try {
    //Check if document exists
    const diagnosis = await Diagnosis.findById(req.params.id);

    //Update only modified properties
    if (req.body.name) diagnosis.name = req.body.name;
    if (req.body.diagnosis_code)
      diagnosis.diagnosis_code = req.body.diagnosis_code;

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
    res
      .status(404)
      .send({ error: `No diagnosis found with id: ${req.params.id} ` });
  }
});

//Delete an existing diagnosis
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Diagnosis']
  //  #swagger.path = '/diagnosis/{id}'

  try {
    //Check if document exists
    const diagnosis = await Diagnosis.findById(req.params.id);
    //If got null response, return error and exit function
    if (!diagnosis) {
      res
        .status(404)
        .send({ error: `No diagnosis found with id: ${req.params.id} ` });
      return;
    }

    //If found the doc
    //Delete the document
    try {
      const response = await Diagnosis.deleteOne({ _id: req.params.id });
      res.status(200).send("Diagnosis deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete the doc
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No diagnosis found with id: ${req.params.id} ` });
  }
});

module.exports = router;
