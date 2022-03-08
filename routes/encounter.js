const express = require("express");
const router = express.Router();
const Encounter = require("../models/Encounter");

//Populators
const appointmentPopulator = {
  path: "appointment",
  select: "appointment_time practitioner patient -_id",
};

const practitionerPopulator = {
  path: "practitioner",
  select: "full_name -_id",
};

const patientPopulator = {
  path: "patient",
  select: "full_name -_id",
};

//Re-usable function for checking if encounter exists
const findEncounter = async (req, res) => {
  try {
    //Check if encounter exists
    const encounter = await Encounter.findById(req.params.encounter_id)
      .populate(patientPopulator)
      .populate(appointmentPopulator)
      .populate(practitionerPopulator);
    if (!encounter) {
      //If got null response, return error and exit function
      res.status(404).send({
        error: `No encounter found with id: ${req.params.encounter_id} `,
      });
      return false;
    } else {
      return encounter;
    }
  } catch (error) {
    //Throw error if no encounter found
    res.status(404).send({
      error: `No encounter found with id: ${req.params.encounter_id} `,
    });
    return false;
  }
};

//Get All Encounters
router.get("/", async (req, res) => {
  try {
    const encounters = await Encounter.find()
      .populate(patientPopulator)
      .populate(appointmentPopulator)
      .populate(practitionerPopulator);
    res.status(200).send(encounters);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Encounter
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const encounter = new Encounter(req.body);

  try {
    const response = await encounter.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Encounter By Id
router.get("/:encounter_id", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) res.status(200).send(encounter);
});

//Update Existing Encounter
router.put("/:encounter_id", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    //Ignore array properties
    const {
      symptoms,
      diagnosis,
      lab_tests,
      lab_test_results,
      final_diagnosis,
      medicine,
      ...remainingData
    } = req.body;

    //Loop and update only properties with data
    Object.keys(remainingData).forEach((key, index) => {
      if (remainingData[key]) {
        encounter[key] = remainingData[key];
      }
    });

    //Save changes
    try {
      const response = await encounter.save();
      res.status(200).send(response);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  }
});

//Delete an existing encounter
router.delete("/:encounter_id", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    //Delete encounter
    try {
      const response = await Encounter.deleteOne({ _id: encounter._id });
      res.status(200).send("Encounter deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete encounter
      res.status(500).send({ error: error });
    }
  }
});

//CRUD Endpoints for embedded docs

// 1: Symptoms Endpoints

//Re-usable function for checking if symptom exists
const findSymptom = async (req, res, encounter) => {
  try {
    const symptom = await encounter.symptoms.id(req.params.symptom_id);
    if (!symptom) {
      res.status(404).send({
        error: `No symptom found with id: ${req.params.symptom_id} `,
      });
      return false;
    } else {
      return symptom;
    }
  } catch (error) {
    res.status(404).send({
      error: `No symptom found with id: ${req.params.symptom_id} `,
    });
    return false;
  }
};

//Get all symptoms of an encounter by encounter-id
router.get("/:encounter_id/symptoms", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) res.status(200).send(encounter.symptoms);
});

module.exports = router;
