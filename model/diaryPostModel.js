const mongoose = require("mongoose");

const diaryPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: { type: [Object] },
    emotion: {
      type: String,
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
