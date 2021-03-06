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

//Get All LabTest Lab Test
router.get("/", async (req, res) => {
  // #swagger.tags = ['Lab Test']
  //  #swagger.path = '/lab-tests'
  //  #swagger.summary = 'Retrieve all lab-tests'

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
  // #swagger.tags = ['Lab Test']
  //  #swagger.path = '/lab-tests'
  //  #swagger.summary = 'Create new lab-test'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Lab-Test Details',
           schema: { $ref: "#/definitions/LabTest" }
    } */

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
  // #swagger.tags = ['Lab Test']
  //  #swagger.path = '/lab-tests/{id}'
  //  #swagger.summary = 'Retrieve single lab-test by id'

  const labTest = await findLabTest(req, res);
  if (labTest) res.status(200).send(labTest);
});

//Update Existing labTest
router.patch("/:id", async (req, res) => {
  // #swagger.tags = ['Lab Test']
  //  #swagger.path = '/lab-tests/{id}'
  //  #swagger.summary = 'Edit single lab-test by id'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Lab-Test Details',
           schema: { $ref: "#/definitions/LabTest" }
    } */

  const labTest = await findLabTest(req, res);
  if (labTest) {
    // const { date_created, ...remainingData } = req.body;
    Object.keys(req.body).forEach((prop, index) => {
      if (req.body[prop]) labTest[prop] = req.body[prop];
    });
    try {
      const response = await labTest.save();
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Delete an existing labTest
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Lab Test']
  //  #swagger.path = '/lab-tests/{id}'
  //  #swagger.summary = 'Delete single lab-test by id'

  const labTest = await findLabTest(req, res);
  if (labTest) {
    try {
      const response = await LabTest.deleteOne({ _id: labTest._id });
      res.status(200).send("LabTest deleted successfully.");
    } catch (error) {
      res.status(500).send({ error: error });
    }
  }
});

module.exports = router;
