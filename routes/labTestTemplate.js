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

module.exports = router