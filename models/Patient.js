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
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
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

patientSchema.pre("save", function (next) {
  const patient = this;

  if (
    this.isNew ||
    this.isModified("first_name") ||
    this.isModified("last_name")
  ) {
    patient.full_name = patient.first_name + " " + patient.last_name;
    next();
  } else {
    next();
  }
});

const patientModel = mongoose.model("Patient", patientSchema);

module.exports = { patientModel, vitalSignSchema };
