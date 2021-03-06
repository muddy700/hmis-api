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
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices'
  //  #swagger.summary = 'List all sales invoices'

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
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices'
  //  #swagger.summary = 'Create new sales-invoice'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Patient Info',
           schema: { $ref: "#/definitions/SalesInvoice" }
    } */

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
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}'
  //  #swagger.summary = 'Retrieve single sales-invoice by id'

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) res.status(200).send(salesInvoice);
});

//Update Existing SalesInvoice
router.put("/:id", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}'
  //  #swagger.summary = 'Edit single sales-invoice by id'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Patient Info',
           schema: { $ref: "#/definitions/EditSalesInvoice" }
    } */

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) {
    //Loop and update only properties with data
    Object.keys(req.body).forEach((key, index) => {
      if (req.body[key] && key !== "items") {
        salesInvoice[key] = req.body[key];
      }
    });

    //Save changes
    try {
      const response = await salesInvoice.save();
      res.status(200).send(response);
    } catch (error) {
      //Throw error if failed to save changes
      res.status(400).send({ error: error });
    }
  }
});

//Delete an existing salesInvoice
router.delete("/:id", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}'
  //  #swagger.summary = 'Delete single sales-invoice by id'

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) {
    //Delete salesInvoice
    try {
      const response = await SalesInvoice.deleteOne({ _id: salesInvoice._id });
      res.status(200).send("Sales-Invoice deleted successfull.");
    } catch (error) {
      //Throw error if failed to delete salesInvoice
      res.status(500).send({ error: error });
    }
  }
});

//Re-usable function for checking if sales-item exists
const findSalesItem = async (req, res, salesInvoice) => {
  try {
    const salesItem = await salesInvoice.items.id(req.params.item_id);
    if (!salesItem) {
      res.status(404).send({
        error: `No sales-Item found with id: ${req.params.item_id} `,
      });
      return false;
    } else {
      return salesItem;
    }
  } catch (error) {
    res.status(404).send({
      error: `No sales-Item found with id: ${req.params.item_id} `,
    });
    return false;
  }
};

//Get all sales-items for a given sales invoice
router.get("/:id/sales-items", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}/sales-items'
  //  #swagger.summary = 'Retrieve all sales-items of a given sales-invoice id'

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) res.status(200).send(salesInvoice.items);
});

//Create new sales-item and append to a sales-invoice
router.post("/:id/sales-items", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}/sales-items'
  //  #swagger.summary = 'Create new sales-item'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Patient Info',
           schema: { $ref: "#/definitions/SalesItem" }
    } */

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) {
    salesInvoice.items.push(req.body);
    try {
      const response = await salesInvoice.save();
      res.status(200).send(response.items);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
});

//Get single sales-item by sales-item-id and sales-invoice-id
router.get("/:id/sales-items/:item_id", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}/sales-items/{item_id}'
  //  #swagger.summary = 'Get a single sales-item by  id'

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) {
    const sales_item = await findSalesItem(req, res, salesInvoice);
    if (sales_item) res.status(200).send(sales_item);
  }
});

//Edit single sales-item
router.patch("/:id/sales-items/:item_id", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}/sales-items/{item_id}'
  //  #swagger.summary = 'Update a single sales-item by  id'
  /* #swagger.parameters['obj'] = { 
           in: 'body',
           description: 'Patient Info',
           schema: { $ref: "#/definitions/SalesItem" }
    } */

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) {
    const sales_item = await findSalesItem(req, res, salesInvoice);
    if (sales_item) {
      //Edit only changed properties
      Object.keys(req.body).forEach((prop, index) => {
        if (req.body[prop]) {
          sales_item[prop] = req.body[prop];
        }
      });

      //Calculate grand-price
      sales_item["grand_price"] = sales_item["price"] * sales_item["quantity"];

      //Save changes
      try {
        const response = await salesInvoice.save();
        res.status(200).send(sales_item);
      } catch (error) {
        res.status(400).send({ error: error });
      }
    }
  }
});

//Delete single sales-item
router.delete("/:id/sales-items/:item_id", async (req, res) => {
  // #swagger.tags = ['Sales Invoice']
  //  #swagger.path = '/sales-invoices/{id}/sales-items/{item_id}'
  //  #swagger.summary = 'Delete a single sales-item by id'

  const salesInvoice = await findSalesInvoice(req, res);
  if (salesInvoice) {
    const sales_item = await findSalesItem(req, res, salesInvoice);
    if (sales_item) {
      try {
        const response = await SalesInvoice.updateOne(
          { _id: req.params.id },
          { $pull: { items: { _id: req.params.item_id } } }
        );
        res.status(200).send("Sales-item deleted successfull.");
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }
  }
});

module.exports = router;
