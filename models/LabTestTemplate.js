const mongoose = require("mongoose");

const labTestTemplateSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
  },
  { versionKey: false }
);

const labTestTemplateModel = mongoose.model(
  "LabTestTemplate",
  labTestTemplateSchema
);

module.exports = labTestTemplateModel;
