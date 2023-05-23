const mongoose = require("mongoose");

const diaryPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Must have a content"],
    },
    image: { type: [Object] },
    emotion: {
      type: String,
      required: [true, "Must leave the diary's emotion expression"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_model",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("diary_post_model", diaryPostSchema);
