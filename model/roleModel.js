const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Role name is required"] },
    status: { type: String, default: "Unactive" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("role_model", roleSchema);
