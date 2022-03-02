const express = require("express");
const LabTestTemplate = require("../models/LabTestTemplate");
const router = express.Router();

//Get All LabTestTemplate
router.get("/", async (req, res) => {
  try {
    const labTestTemplates = await LabTestTemplate.find();
    res.status(200).send(labTestTemplates);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New LabTestTemplate
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const labTestTemplate = new LabTestTemplate({
    name: req.body.name,
    price: req.body.price,
  });

  try {
    const response = await labTestTemplate.save();
    res.status(200).send(labTestTemplate);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Lab Test Template By Id
router.get("/:id", async (req, res) => {
  try {
    const labTestTemplate = await LabTestTemplate.findById(req.params.id);
    res.status(200).send(labTestTemplate);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No lab-Test-Template found with id: ${req.params.id} ` });
  }
});


//Update Existing LabTestTemplate
router.patch("/:id", async (req, res) => {
  try {
    //Check if document exists
    const labTestTemplate = await LabTestTemplate.findById(req.params.id);

    //Update only modified properties
    if (req.body.name) labTestTemplate.name = req.body.name;
    if (req.body.price) labTestTemplate.price = req.body.price;

    //Save changes
    try {
      const response = await labTestTemplate.save();
      res.status(200).send(labTestTemplate);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No lab-Test-Template found with id: ${req.params.id} ` });
  }
});
module.exports = router