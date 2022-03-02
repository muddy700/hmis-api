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
module.exports = router