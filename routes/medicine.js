const express = require("express");
const Medicine = require("../models/Medicine");
const router = express.Router();

//Get All Medicines
router.get("/", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).send(medicines);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

module.exports = router;
