const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    date_created: { type: Date, default: Date.now },
    appointment_time: { type: Date, required: true },
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
    price: { type: Number, required: true },
    status: { type: Boolean, required: true, default: 0 }, //0-open, 1-closed
    invoiced: { type: Boolean, required: true },
  },
  { versionKey: false }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = appointmentModel;
