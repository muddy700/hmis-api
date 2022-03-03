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
      populate: { path: "practitioner", select: 'full_name gender -_id' },
    });
    res.status(200).send(patient);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No patient found with id: ${req.params.id} ` });
  }
});

module.exports = router;
