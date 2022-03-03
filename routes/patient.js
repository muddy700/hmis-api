const express = require("express");
const router = express.Router();
const patientModule = require("../models/Patient");
const Patient = patientModule.patientModel;

//Get All Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Patient
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const patient = new Patient(req.body);

  try {
    const response = await patient.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Patient By Id
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate({
      path: "vital_signs",
      populate: { path: "practitioner", select: "full_name gender -_id" },
    });
    res.status(200).send(patient);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No patient found with id: ${req.params.id} ` });
  }
});

//Update Existing Patient
router.patch("/:id", async (req, res) => {
  try {
    //Check if patient exists
    const patient = await Patient.findById(req.params.id);

    //Ignore read only properties
    const { full_name, date_registered, vital_signs, ...remainingData } =
      req.body;

    //Retrieve modified properties
    const modifiedProperties = Object.keys(remainingData);

    //Loop and update only properties with data
    modifiedProperties.forEach((key, index) => {
      if (!remainingData[key]) {
        // console.log(`${key} has no value`);
      } else if (key === "address") {
        //Handle embedded doc
        let oldAddress = patient[key];
        const newAddress = remainingData[key];

        if (!oldAddress) patient[key] = newAddress;
        else {
          //Loop and update only properties with data
          Object.keys(newAddress).forEach((prop, index) => {
            if (newAddress[prop]) oldAddress[prop] = newAddress[prop];
          });
        }
      } else {
        patient[key] = remainingData[key];
      }
    });

    //Save changes
    try {
      const response = await patient.save();
      res.status(200).send(response);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no patient found
    res
      .status(404)
      .send({ error: `No patient found with id: ${req.params.id} ` });
  }
});


//Delete an existing patient
router.delete("/:id", async (req, res) => {
  try {
    //Check if patient exists
    const patient = await Patient.findById(req.params.id);
    //If got null response, return error and exit function
    if (!patient) {
      res
        .status(404)
        .send({ error: `No patient found with id: ${req.params.id} ` });
      return;
    }

    //If patient found
    //Delete patient
    try {
      const response = await Patient.deleteOne({ _id: req.params.id });
      res.status(200).send("Patient deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete patient
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no patient found
    res.status(404).send({ error: `No patient found with id: ${req.params.id} ` });
  }
});


module.exports = router;
