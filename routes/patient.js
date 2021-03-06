const express = require("express");
const router = express.Router();
const patientModule = require("../models/Patient");
const Patient = patientModule.patientModel;

const patientPopulator = {
  path: "vital_signs",
  populate: { path: "practitioner", select: "full_name gender -_id" },
};

//Get All Patients
router.get("/", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients'
  //  #swagger.summary = 'List all patients'

  try {
    const patients = await Patient.find().populate(patientPopulator);
    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Patient
router.post("/", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients'
  //  #swagger.summary = 'Create a new patient'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Patient Info',
           schema: { $ref: "#/definitions/Patient" }
    } */

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
router.get("/:patient_id", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}'
  //  #swagger.summary = 'Get a patient by id'

  const patient = await findPatient(req, res);
  if (patient) res.status(200).send(patient);
});

//Update Existing Patient
router.patch("/:patient_id", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}'
  //  #swagger.summary = 'Edit a patient'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Patient Info',
           schema: { $ref: "#/definitions/Patient" }
    } */

  const patient = await findPatient(req, res);
  if (patient) {
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
  }
});

//Delete an existing patient
router.delete("/:patient_id", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}'
  //  #swagger.summary = 'Delete a patient by id'

  const patient = await findPatient(req, res);
  if (patient) {
    //Delete patient
    try {
      const response = await Patient.deleteOne({ _id: patient._id });
      res.status(200).send("Patient deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete patient
      res.status(500).send({ error: error });
    }
  }
});

//Re-usable function for checking if patient exists
const findPatient = async (req, res) => {
  try {
    //Check if patient exists
    const patient = await Patient.findById(req.params.patient_id).populate(
      patientPopulator
    );
    if (!patient) {
      //If got null response, return error and exit function
      res
        .status(404)
        .send({ error: `No patient found with id: ${req.params.patient_id} ` });
      return false;
    } else {
      return patient;
    }
  } catch (error) {
    //Throw error if no patient found
    res
      .status(404)
      .send({ error: `No patient found with id: ${req.params.patient_id} ` });
    return false;
  }
};

//Re-usable function for checking if vital-sign exists
const findVitalSign = async (req, res, patient) => {
  try {
    const vital_sign = await patient.vital_signs.id(req.params.vital_sign_id);
    if (!vital_sign) {
      res.status(404).send({
        error: `No vital-sign found with id: ${req.params.vital_sign_id} `,
      });
      return false;
    } else {
      return vital_sign;
    }
  } catch (error) {
    res.status(404).send({
      error: `No vital-sign found with id: ${req.params.vital_sign_id} `,
    });
    return false;
  }
};
//End-Points For Managing Vital Signs CRUD

//Get all vital-signs of a patient by patient-id
router.get("/:patient_id/vital-signs", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}/vital-signs'
  //  #swagger.summary = 'List all vital-signs of a patient by patient_id'

  const patient = await findPatient(req, res);
  if (patient) res.status(200).send(patient.vital_signs);
});

//Create new vital-sign and append to a patient
router.post("/:patient_id/vital-signs", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}/vital-signs'
  //  #swagger.summary = 'Create a new vital-sign of a patient'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Vital Sign Info',
           schema: { $ref: "#/definitions/VitalSign" }
    } */

  const patient = await findPatient(req, res);
  if (patient) {
    patient.vital_signs.push(req.body);
    try {
      const response = await patient.save();
      res.status(200).send(response.vital_signs);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Get single vital-sign by patient-id and vital-sign-id
router.get("/:patient_id/vital-signs/:vital_sign_id", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}/vital-signs/{vital_sign_id}'
  //  #swagger.summary = 'Retrieve single vital-sign of a patient'

  const patient = await findPatient(req, res);
  if (patient) {
    const vital_sign = await findVitalSign(req, res, patient);
    if (vital_sign) res.status(200).send(vital_sign);
  }
});

//Edit single vital-sign
router.patch("/:patient_id/vital-signs/:vital_sign_id", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}/vital-signs/{vital_sign_id}'
  //  #swagger.summary = 'Edit single vital-sign of a patient'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Vital Sign Info',
           schema: { $ref: "#/definitions/VitalSign" }
    } */

  const patient = await findPatient(req, res);
  if (patient) {
    const vital_sign = await findVitalSign(req, res, patient);
    if (vital_sign) {
      //Edit only changed properties
      Object.keys(req.body).forEach((prop, index) => {
        if (req.body[prop] && prop !== "date_taken") {
          vital_sign[prop] = req.body[prop];
        }
      });
      //Save changes
      try {
        const response = await patient.save();
        res.status(200).send(vital_sign);
      } catch (error) {
        res.status(400).send({ error: error });
      }
    }
  }
});

//Delete single vital-sign
router.delete("/:patient_id/vital-signs/:vital_sign_id", async (req, res) => {
  // #swagger.tags = ['Patient']
  //  #swagger.path = '/patients/{patient_id}/vital-signs/{vital_sign_id}'
  //  #swagger.summary = 'Delete single vital-sign of a patient'

  const patient = await findPatient(req, res);
  if (patient) {
    const vital_sign = await findVitalSign(req, res, patient);
    if (vital_sign) {
      try {
        const response = await Patient.updateOne(
          { _id: req.params.patient_id },
          { $pull: { vital_signs: { _id: req.params.vital_sign_id } } }
        );
        res.status(200).send("Vital-sign deleted successfull.");
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }
  }
});

module.exports = router;
