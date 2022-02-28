const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    role_name: { type: String, required: true },
  },
  { versionKey: false }
);

const roleModel = mongoose.model("Role", roleSchema);

module.exports = roleModel;
