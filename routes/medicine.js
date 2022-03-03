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

//Create New Medicine
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const medicine = new Medicine(req.body);

  try {
    const response = await medicine.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get Medicine By Id
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    res.status(200).send(medicine);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No medicine found with id: ${req.params.id} ` });
  }
});


module.exports = router;
