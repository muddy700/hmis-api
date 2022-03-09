const express = require("express");
const router = express.Router();
const Encounter = require("../models/Encounter");

//Object Populators
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

const symptomPopulator = {
  path: "symptoms",
  populate: { path: "symptom", select: "name -_id" },
};

const diagnosisPopulator = {
  path: "diagnosis",
  populate: { path: "diagnosis", select: "name -_id" },
};

const testTemplatePopulator = {
  path: "lab_tests",
  populate: { path: "test_template", select: "name price -_id" },
};

const testResultPopulator = {
  path: "lab_test_results",
  populate: { path: "lab_test", select: "results status invoiced -_id" },
};

//Re-usable function for checking if encounter exists
const findEncounter = async (req, res) => {
  try {
    //Check if encounter exists
    const encounter = await Encounter.findById(req.params.encounter_id)
      .populate(symptomPopulator)
      .populate(patientPopulator)
      .populate(diagnosisPopulator)
      .populate(testResultPopulator)
      .populate(appointmentPopulator)
      .populate(practitionerPopulator)
      .populate(testTemplatePopulator);
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
      .populate(symptomPopulator)
      .populate(diagnosisPopulator)
      .populate(testResultPopulator)
      .populate(appointmentPopulator)
      .populate(practitionerPopulator)
      .populate(testTemplatePopulator);
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

//Create new symptom and append to an encounter
router.post("/:encounter_id/symptoms", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    encounter.symptoms.push(req.body);
    try {
      const response = await encounter.save();
      res.status(200).send(response.symptoms);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Delete single symptom
router.delete("/:encounter_id/symptoms/:symptom_id", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    const symptom = await findSymptom(req, res, encounter);
    if (symptom) {
      try {
        const response = await Encounter.updateOne(
          { _id: req.params.encounter_id },
          { $pull: { symptoms: { _id: req.params.symptom_id } } }
        );
        res.status(200).send("Symptom deleted successfull.");
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }
  }
});

// 2: Diagnosis Endpoints

//Re-usable function for checking if diagnosis exists
const findDiagnosis = async (req, res, encounter) => {
  try {
    const diagnosis = await encounter.diagnosis.id(req.params.diagnosis_id);
    if (!diagnosis) {
      res.status(404).send({
        error: `No diagnosis found with id: ${req.params.diagnosis_id} `,
      });
      return false;
    } else {
      return diagnosis;
    }
  } catch (error) {
    res.status(404).send({
      error: `No diagnosis found with id: ${req.params.diagnosis_id} `,
    });
    return false;
  }
};

//Get all diagnosis of an encounter by encounter-id
router.get("/:encounter_id/diagnosis", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) res.status(200).send(encounter.diagnosis);
});

//Create new diagnosis and append to an encounter
router.post("/:encounter_id/diagnosis", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    encounter.diagnosis.push(req.body);
    try {
      const response = await encounter.save();
      res.status(200).send(response.diagnosis);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Delete single diagnosis
router.delete("/:encounter_id/diagnosis/:diagnosis_id", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    const diagnosis = await findDiagnosis(req, res, encounter);
    if (diagnosis) {
      try {
        const response = await Encounter.updateOne(
          { _id: req.params.encounter_id },
          { $pull: { diagnosis: { _id: req.params.diagnosis_id } } }
        );
        res.status(200).send("Diagnosis deleted successfull.");
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }
  }
});

// 2: Lab-Test Endpoints

//Re-usable function for checking if lab-test-template exists
const findTestTemplate = async (req, res, encounter) => {
  try {
    const labTestTemplate = await encounter.lab_tests.id(
      req.params.template_id
    );
    if (!labTestTemplate) {
      res.status(404).send({
        error: `No lab-Test-Template found with id: ${req.params.template_id} `,
      });
      return false;
    } else {
      return labTestTemplate;
    }
  } catch (error) {
    res.status(404).send({
      error: `No lab-Test-Template found with id: ${req.params.template_id} `,
    });
    return false;
  }
};

//Get all lab-test-template of an encounter by encounter-id
router.get("/:encounter_id/lab-tests", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) res.status(200).send(encounter.lab_tests);
});

//Create new lab-test-template and append to an encounter
router.post("/:encounter_id/lab-tests", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    encounter.lab_tests.push(req.body);
    try {
      const response = await encounter.save();
      res.status(200).send(response.lab_tests);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Delete single lab-test-template
router.delete("/:encounter_id/lab-tests/:template_id", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    const test_template = await findTestTemplate(req, res, encounter);
    if (test_template) {
      try {
        const response = await Encounter.updateOne(
          { _id: req.params.encounter_id },
          { $pull: { lab_tests: { _id: req.params.template_id } } }
        );
        res.status(200).send("lab-Test-Template deleted successfull.");
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }
  }
});

// 3: Lab-Test-Results Endpoints

//Re-usable function for checking if lab-test-result exists
const findTestResult = async (req, res, encounter) => {
  try {
    const labTestResult = await encounter.lab_test_results.id(
      req.params.result_id
    );
    if (!labTestResult) {
      res.status(404).send({
        error: `No lab-Test-Result found with id: ${req.params.result_id} `,
      });
      return false;
    } else {
      return labTestResult;
    }
  } catch (error) {
    res.status(404).send({
      error: `No lab-Test-Result found with id: ${req.params.result_id} `,
    });
    return false;
  }
};

//Get all lab-test-results of an encounter by encounter-id
router.get("/:encounter_id/lab-test-results", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) res.status(200).send(encounter.lab_test_results);
});

//Create new lab-test-result and append to an encounter
router.post("/:encounter_id/lab-test-results", async (req, res) => {
  const encounter = await findEncounter(req, res);
  if (encounter) {
    encounter.lab_test_results.push(req.body);
    try {
      const response = await encounter.save();
      res.status(200).send(response.lab_test_results);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Delete single lab-test-result
router.delete(
  "/:encounter_id/lab-test-results/:result_id",
  async (req, res) => {
    const encounter = await findEncounter(req, res);
    if (encounter) {
      const test_result = await findTestResult(req, res, encounter);
      if (test_result) {
        try {
          const response = await Encounter.updateOne(
            { _id: req.params.encounter_id },
            { $pull: { lab_test_results: { _id: req.params.result_id } } }
          );
          res.status(200).send("lab-Test-Result deleted successfull.");
        } catch (error) {
          res.status(500).send({ error: error });
        }
      }
    }
  }
);

// 4: Final Diagnosis Endpoints

//Re-usable function for checking if final-diagnosis exists
const findFinalDiagnosis = async (req, res, encounter) => {
  try {
    const diagnosis = await encounter.final_diagnosis.id(req.params.diagnosis_id);
    if (!diagnosis) {
      res.status(404).send({
        error: `No diagnosis found with id: ${req.params.diagnosis_id} `,
      });
      return false;
    } else {
      return diagnosis;
    }
  } catch (error) {
    res.status(404).send({
      error: `No diagnosis found with id: ${req.params.diagnosis_id} `,
    });
    return false;
  }
};

module.exports = router;
