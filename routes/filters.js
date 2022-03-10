const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Patient = require("../models/Patient").patientModel;

//Data Populators
const userProjector = { password: 0 };
const rolePopulator = {
  path: "role",
  select: "role_name -_id",
};
const patientPopulator = {
  path: "vital_signs",
  populate: { path: "practitioner", select: "full_name gender -_id" },
};

// <===== Filters For Users =====>
//Get All Users By Role
router.get("/roles/:role_id/users", async (req, res) => {
  try {
    const users = await User.find(
      { role: req.params.role_id },
      userProjector
    ).populate(rolePopulator);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get All Users By Gender
router.get("/users-by-gender", async (req, res) => {
  try {
    const users = await User.find(
      { gender: req.body.gender },
      userProjector
    ).populate(rolePopulator);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get All Users By Status
router.get("/users-by-status", async (req, res) => {
  try {
    const users = await User.find(
      { status: req.body.status },
      userProjector
    ).populate(rolePopulator);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

// <===== Filters For Patients =====>
//Get All Patients By Date of birth
router.get("/patients-by-dob", async (req, res) => {
  try {
    const patients = await Patient.find({
      dob: req.body.dob 
    //   dob: { $gt: req.body.dob },
    }).populate(patientPopulator);
    res.status(200).send(patients);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
