const mongoose = require("mongoose");

const salesItemSchema = mongoose.Schema(
  {
    collection_name: { type: String, required: true },
    item_id: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    grand_price: { type: Number, required: true },
  },
  { versionKey: false }
);

const salesInvoiceSchema = mongoose.Schema(
  {
    date_created: { type: Date, default: Date.now, immutable: true },
    due_date: { type: Date, default: Date.now },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment_mode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMode",
      required: true,
    },
    items: [{ type: salesItemSchema }],
    total_amount: { type: Number, required: true },
    status: { type: Boolean, required: true, default: 0 }, //0-pending, 1-paid
  },
  { versionKey: false }
);

const salesInvoiceModel = mongoose.model("SalesInvoice", salesInvoiceSchema);

module.exports = salesInvoiceModel;
