const express = require("express");
const router = express.Router();
const Salesinvoice = require("../models/SalesInvoice");

//Get All Sales Invoices
router.get("/", async (req, res) => {
  try {
    const salesInvoices = await Salesinvoice.find();
    res.status(200).send(salesInvoices);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

module.exports = router;
