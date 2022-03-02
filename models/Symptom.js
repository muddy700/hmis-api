const mongoose = require("mongoose");

const symptomSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true},
  },
  { versionKey: false }
);

const symptomModel = mongoose.model("Symptom", symptomSchema);

module.exports = symptomModel;
