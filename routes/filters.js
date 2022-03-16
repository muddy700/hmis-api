const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Patient = require("../models/Patient").patientModel;
const Appointment = require("../models/Appointment");

//Data Populators
const userProjector = { password: 0, token: 0 };
const rolePopulator = {
  path: "role",
  select: "role_name -_id",
};

const practitionerPopulator = {
  path: "practitioner",
  select: "full_name gender -_id",
};

const vitalSignPopulator = {
  path: "vital_signs",
  populate: practitionerPopulator,
};

const patientPopulator = { path: "patient", select: "full_name phone -_id" };

// <===== Filters For Users =====>
//Get All Users By Role
router.get("/roles/:role_id/users", async (req, res) => {
  // #swagger.tags = ['Filters']
  //  #swagger.path = '/filter/roles/{role_id}/users'

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
  // #swagger.tags = ['Filters']
  //  #swagger.path = '/filter/users-by-gender'

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
  // #swagger.tags = ['Filters']
  //  #swagger.path = '/filter/users-by-status'

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
  // #swagger.tags = ['Filters']
  //  #swagger.path = '/filter/patients-by-dob'

  try {
    const patients = await Patient.find({
      dob: req.body.dob,
      //   dob: { $gt: req.body.dob },
    }).populate(vitalSignPopulator);
    res.status(200).send(patients);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

// <===== Filters For Appointments =====>
//Get All Appointments By Doctor-Id
router.get("/doctors/:doctor_id/appointments", async (req, res) => {
  // #swagger.tags = ['Filters']
  //  #swagger.path = '/filter/doctors/{doctor_id}/appointments'

  try {
    const appointments = await Appointment.find({
      practitioner: req.params.doctor_id,
    })
      .populate(practitionerPopulator)
      .populate(patientPopulator);
    res.status(200).send(appointments);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get All Appointments By Invoice Status
router.get("/appointments-by-invoice-status", async (req, res) => {
  // #swagger.tags = ['Filters']
  //  #swagger.path = '/filter/appointments-by-invoice-status'

  try {
    const appointments = await Appointment.find({
      invoiced: req.body.invoiced,
    })
      .populate(practitionerPopulator)
      .populate(patientPopulator);
    res.status(200).send(appointments);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
