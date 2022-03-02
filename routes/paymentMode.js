const express = require("express");
const PaymentMode = require("../models/PaymentMode");
const router = express.Router();

//Get All PaymentModes
router.get("/", async (req, res) => {
  try {
    const paymentModes = await PaymentMode.find();
    res.status(200).send(paymentModes);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New PaymentMode
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const paymentMode = new PaymentMode({
    payment_mode_name: req.body.payment_mode_name,
  });

  try {
    const response = await paymentMode.save();
    res.status(200).send(paymentMode);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get PaymentMode By Id
router.get("/:id", async (req, res) => {
  try {
    const paymentMode = await PaymentMode.findById(req.params.id);
    res.status(200).send(paymentMode);
  } catch (error) {
    res
      .status(404)
      .send({ error: `No payment mode found with id: ${req.params.id} ` });
  }
});

//Update Existing PaymentMode
router.patch("/:id", async (req, res) => {
  try {
    //Check if document exists
    const paymentMode = await PaymentMode.findById(req.params.id);

    //Update only modified properties
    if (req.body.payment_mode_name)
      paymentMode.payment_mode_name = req.body.payment_mode_name;

    //Save changes
    try {
      const response = await paymentMode.save();
      res.status(200).send(paymentMode);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No payment mode found with id: ${req.params.id} ` });
  }
});

//Delete an existing paymentMode
router.delete("/:id", async (req, res) => {
  try {
    //Check if document exists
    const paymentMode = await PaymentMode.findById(req.params.id);
    //If got null response, return error and exit function
    if (!paymentMode) {
      res
        .status(404)
        .send({ error: `No payment mode found with id: ${req.params.id} ` });
      return;
    }

    //If found the doc
    //Delete the document
    try {
      const response = await PaymentMode.deleteOne({ _id: req.params.id });
      res.status(200).send("Payment mode deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete the doc
      res.status(500).send({ error: error });
    }
  } catch (error) {
    //Throw error if no document found
    res
      .status(404)
      .send({ error: `No payment mode found with id: ${req.params.id} ` });
  }
});

module.exports = router;
