const express = require("express");
const router = express.Router();
const LabTest = require("../models/LabTest");

const testTemplatePopulator = {
  path: "test_template",
  select: "-_id",
};
const labTechincianPopulator = {
  path: "lab_technician",
  select: "full_name -_id",
};
const patientPopulator = {
  path: "patient",
  select: "full_name -_id",
};

//Re-usable function for checking if labTest exists
const findLabTest = async (req, res) => {
  try {
    //Check if labTest exists
    const labTest = await LabTest.findById(req.params.id)
      .populate(patientPopulator)
      .populate(testTemplatePopulator)
      .populate(labTechincianPopulator);

    if (!labTest) {
      //If got null response, return error and exit function
      res
        .status(404)
        .send({ error: `No labTest found with id: ${req.params.id} ` });
      return false;
    } else {
      return labTest;
    }
  } catch (error) {
    //Throw error if no labTest found
    res.status(404).send({
      error: `No labTest found with id: ${req.params.id} `,
    });
    return false;
  }
};

//Get All LabTest
router.get("/", async (req, res) => {
  try {
    const labTests = await LabTest.find()
      .populate(patientPopulator)
      .populate(testTemplatePopulator)
      .populate(labTechincianPopulator);
    res.status(200).send(labTests);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New LabTest
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const labTest = new LabTest(req.body);

  try {
    const response = await labTest.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get labTest by id
router.get("/:id", async (req, res) => {
  const labTest = await findLabTest(req, res);
  if (labTest) res.status(200).send(labTest);
});

module.exports = router;
