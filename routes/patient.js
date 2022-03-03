const express = require('express');
const router = express.Router();
const patientModule = require("../models/Patient");
const Patient = patientModule.patientModel;

//Get All Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().populate("practitioner");
    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

module.exports = router;
