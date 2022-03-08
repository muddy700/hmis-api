const mongoose = require("mongoose");

const encounterSchema = mongoose.Schema(
  {
    date_created: { type: Date, default: Date.now, immutable: true },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    practitioner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    status: { type: Boolean, required: true }, //0-open, 1-closed
    symptoms: [
      {
        symptom: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Symptom",
          required: true,
        },
      },
    ],
    diagnosis: [
      {
        diagnosis: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Diagnosis",
          required: true,
        },
      },
    ],
    lab_tests: [
      {
        test_template: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LabTestTemplate",
          required: true,
        },
      },
    ],
    lab_test_results: [
      {
        lab_test: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LabTest",
          required: true,
        },
      },
    ],
    final_diagnosis: [
      {
        diagnosis: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Diagnosis",
          required: true,
        },
      },
    ],
    medicines: [
      {
        drug: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: { type: Number, required: true },
        grand_price: { type: Number, required: true },
        invoiced: { type: Boolean, required: true },
      },
    ],
  },
  { versionKey: false }
);

const encounterModel = mongoose.model("Encounter", encounterSchema);

module.exports = encounterModel;
