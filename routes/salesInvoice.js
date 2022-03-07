const express = require("express");
const router = express.Router();
const SalesInvoice = require("../models/SalesInvoice");

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

//Re-usable function for checking if salesInvoice exists
const findSalesInvoice = async (req, res) => {
  try {
    //Check if salesInvoice exists
    const salesInvoice = await SalesInvoice.findById(req.params.id)
      .populate(patientPopulator)
      .populate(cashierPopulator)
      .populate(paymentModePopulator);
    if (!salesInvoice) {
      //If got null response, return error and exit function
      res
        .status(404)
        .send({ error: `No sales-invoice found with id: ${req.params.id} ` });
      return false;
    } else {
      return salesInvoice;
    }
  } catch (error) {
    //Throw error if no salesInvoice found
    res
      .status(404)
      .send({ error: `No sales-invoice found with id: ${req.params.id} ` });
    return false;
  }
};

//Get All Sales Invoices
router.get("/", async (req, res) => {
  try {
    const salesInvoices = await SalesInvoice.find()
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
  const salesInvoice = new SalesInvoice(req.body);

  try {
    const response = await salesInvoice.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Get SalesInvoice By Id
router.get("/:id", async (req, res) => {
  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) res.status(200).send(salesInvoice);
});

module.exports = router;
