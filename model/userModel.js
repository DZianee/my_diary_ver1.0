const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    lastLogin: {
      type: Date,
    },
    avatar: {
      type: Number
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [7, "Password must have length at least 7 letters"],
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role_model",
      required: [true, "Role is required"],
    },
    status: {
      type: String,
      default: "Unactive",
    },
    emotion: {
      type: String,
      required: [true, "Must leave the diary's emotion expression"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user_model", userSchema);
