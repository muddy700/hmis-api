const express = require("express");
const Diagnosis = require("../models/Diagnosis");
const router = express.Router();

//Get All Diagnosis
router.get("/", async (req, res) => {
  try {
    const diagnosis = await Diagnosis.find();
    res.status(200).send(diagnosis);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});


module.exports = router