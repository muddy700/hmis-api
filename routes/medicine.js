const express = require("express");
const Medicine = require("../models/Medicine");
const router = express.Router();

//Get All Medicines
router.get("/", async (req, res) => {
  // #swagger.tags = ['Medicine']
  //  #swagger.path = '/medicines'

  try {
    const medicines = await Medicine.find();
    res.status(200).send(medicines);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Medicine
router.post("/", async (req, res) => {
  // #swagger.tags = ['Medicine']
  //  #swagger.path = '/medicines'

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
  // #swagger.tags = ['Medicine']
  //  #swagger.path = '/medicines/{id}'

  try {
    const medicine = await Medicine.findById(req.params.id);
    res.status(200).send(medicine);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No medicine found with id: ${req.params.id} ` });
  }
});

//Update Existing Medicine
router.patch("/:id", async (req, res) => {
  // #swagger.tags = ['Medicine']
  //  #swagger.path = '/medicines/{id}'

  try {
    //Check if document exists
    const medicine = await Medicine.findById(req.params.id);

    //Update only modified properties
    Object.keys(req.body).forEach((prop, index) => {
      if (req.body[prop]) medicine[prop] = req.body[prop];
    });

    //Save changes
    try {
      const response = await medicine.save();
      res.status(200).send(response);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No medicine found with id: ${req.params.id} ` });
  }
});

//Delete an existing medicine
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Medicine']
  //  #swagger.path = '/medicines/{id}'

  try {
    //Check if document exists
    const medicine = await Medicine.findById(req.params.id);
    //If got null response, return error and exit function
    if (!medicine) {
      res
        .status(404)
        .send({ error: `No medicine found with id: ${req.params.id} ` });
      return;
    }

    //If found the doc
    //Delete the document
    try {
      const response = await Medicine.deleteOne({ _id: req.params.id });
      res.status(200).send("Medicine deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete the doc
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No medicine found with id: ${req.params.id} ` });
  }
});

module.exports = router;
