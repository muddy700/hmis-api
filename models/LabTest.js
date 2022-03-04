const mongoose = require("mongoose");

const labTestSchema = mongoose.Schema(
  {
    date_created: { type: Date, default: Date.now, immutable: true },
    test_template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTestTemplate",
      required: true,
    },
    lab_technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    encounter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Encounter",
    // Todo: make it required: true,  after creating Encounter model
    },
    results: String,
    invoiced: { type: Boolean, required: true },
    status: { type: Boolean, required: true, default: 0 }, //0-inprogress, 1-completed
  },
  { versionKey: false }
);

const labTestModel = mongoose.model("LabTest", labTestSchema);

module.exports = labTestModel;
