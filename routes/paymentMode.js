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

module.exports = router;
