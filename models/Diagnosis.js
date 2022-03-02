const mongoose = require("mongoose");

const diagnosisSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

const diagnosisModel = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = diagnosisModel;
