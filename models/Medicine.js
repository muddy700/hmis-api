const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
  drug_code: { type: String, required: true, unique: true },
  drug_name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, unique: true },
  dosage: { type: String, required: true, unique: true },
});

const medicineModel = mongoose.model("Medicine", medicineSchema);

module.exports = medicineModel;
