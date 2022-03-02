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

module.exports = router;
