const mongoose = require("mongoose");
const addressSchema = require("./AddressSchema");

const vitalSignSchema = mongoose.Schema(
  {
    date_taken: { type: Date, default: Date.now },
    practitioner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: Number,
    height: Number,
    body_temperature: Number,
    blood_pressure: String,
  },
  { versionKey: false }
);

const patientSchema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    full_name: String,
    dob: Date,
    email: String,
    phone: String,
    gender: String,
    date_registered: { type: Date, default: Date.now },
    address: { type: addressSchema },
    vital_signs: [{ type: vitalSignSchema }],
  },
  { versionKey: false }
);

const patientModel = mongoose.model("Patient", patientSchema);

module.exports = { patientModel, vitalSignSchema };
