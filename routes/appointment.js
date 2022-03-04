const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

//Get All Appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Appointment
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const appointment = new Appointment(req.body);
  
  try {
    const response = await appointment.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
