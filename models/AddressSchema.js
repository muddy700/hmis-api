const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    postal_code: String,
  },
  { versionKey: false }
);

module.exports = addressSchema;
