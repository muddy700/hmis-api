const mongoose = require("mongoose");

const paymentModeSchema = mongoose.Schema(
  {
    payment_mode_name: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

const paymentModeModel = mongoose.model("PaymentMode", paymentModeSchema);

module.exports = paymentModeModel;
