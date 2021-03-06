const express = require("express");
const Medicine = require("../models/Medicine");
const router = express.Router();

//Get All Medicines
router.get("/", async (req, res) => {
  // #swagger.tags = ['Medicine']
  //  #swagger.path = '/medicines'
  //  #swagger.summary = 'List all medicines'

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
  //  #swagger.summary = 'Create new medicine'
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Medicine Info',
    schema: { $ref: "#/definitions/Medicine"}
  }
   */

  //Initialize new instance/doc
  const medicine = new Medicine(req.body);
  // const { drug_code, drug_name, price, dosage } = req.body;

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
  //  #swagger.summary = 'Get single medicine by id'

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
  //  #swagger.summary = 'Edit single medicine by id'

  try {
    //Check if document exists
    const medicine = await Medicine.findById(req.params.id);

    //Destructure Medicine-Properties For Swagger to recognize them
    const { drug_code, drug_name, price, dosage } = req.body;

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
  //  #swagger.summary = 'Delete single medicine by id'

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
