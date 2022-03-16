const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

const practitionerPopulator = {
  path: "practitioner",
  select: "full_name gender",
};

const patientPopulator = { path: "patient", select: "full_name phone" };

//Re-usable function for checking if appointment exists
const findAppointment = async (req, res) => {
  try {
    //Check if appointment exists
    const appointment = await Appointment.findById(req.params.id)
      .populate(patientPopulator)
      .populate(practitionerPopulator);

    if (!appointment) {
      //If got null response, return error and exit function
      res
        .status(404)
        .send({ error: `No appointment found with id: ${req.params.id} ` });
      return false;
    } else {
      return appointment;
    }
  } catch (error) {
    //Throw error if no appointment found
    res.status(404).send({
      error: `No appointment found with id: ${req.params.id} `,
    });
    return false;
  }
};

//Get All Appointments
router.get("/", async (req, res) => {
  // #swagger.tags = ['Appointment']
  //  #swagger.path = '/appointments'

  try {
    const appointments = await Appointment.find()
      .populate(practitionerPopulator)
      .populate(patientPopulator);
    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Appointment
router.post("/", async (req, res) => {
  // #swagger.tags = ['Appointment']
  //  #swagger.path = '/appointments'

  //Initialize new instance/doc
  const appointment = new Appointment(req.body);

  try {
    const response = await appointment.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get appointment by id
router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Appointment']
  //  #swagger.path = '/appointments/{id}'

  const appointment = await findAppointment(req, res);
  if (appointment) res.status(200).send(appointment);
});

//Update Existing appointment
router.patch("/:id", async (req, res) => {
  // #swagger.tags = ['Appointment']
  //  #swagger.path = '/appointments/{id}'

  const appointment = await findAppointment(req, res);
  if (appointment) {
    const { date_created, ...remainingData } = req.body;
    Object.keys(remainingData).forEach((prop, index) => {
      if (remainingData[prop]) appointment[prop] = remainingData[prop];
    });
    try {
      const response = await appointment.save();
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Delete an existing appointment
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Appointment']
  //  #swagger.path = '/appointments/{id}'

  const appointment = await findAppointment(req, res);
  if (appointment) {
    try {
      const response = await Appointment.deleteOne({ _id: appointment._id });
      res.status(200).send("Appointment deleted successfully.");
    } catch (error) {
      res.status(500).send({ error: error });
    }
  }
});

module.exports = router;
