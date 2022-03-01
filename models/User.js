const mongoose = require("mongoose");
const addressSchema = require("./AddressSchema");

const userSchema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    full_name: String,
    dob: Date,
    date_created: { type: Date, default: Date.now },
    username: { type: String, required: true, unique: true },
    email: String,
    phone: String,
    gender: String,
    profile_image: String,
    status: Boolean,
    password: { type: String, required: true, minlength: 8 },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    address: { type: addressSchema },
  },
  { versionKey: false }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
