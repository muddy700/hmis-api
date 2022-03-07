const express = require("express");
const router = express.Router();
const Salesinvoice = require("../models/SalesInvoice");

const patientPopulator = {
  path: "patient",
  select: "full_name -_id",
};

const cashierPopulator = {
  path: "cashier",
  select: "full_name -_id",
};

const paymentModePopulator = {
  path: "payment_mode",
  select: "payment_mode_name -_id",
};

//Get All Sales Invoices
router.get("/", async (req, res) => {
  try {
    const salesInvoices = await Salesinvoice.find()
      .populate(patientPopulator)
      .populate(cashierPopulator)
      .populate(paymentModePopulator);
    res.status(200).send(salesInvoices);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//Create New Sales Invoice
router.post("/", async (req, res) => {
  //Initialize new instance/doc
  const salesInvoice = new Salesinvoice(req.body);

  try {
    const response = await salesInvoice.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
