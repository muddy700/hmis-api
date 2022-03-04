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

module.exports = router;
