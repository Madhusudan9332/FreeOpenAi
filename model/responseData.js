const { response } = require("express");
const mongoose = require("mongoose");

const responseDataSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    data: [
      {
        prompt: { type: String, required: true },
        aiResponse: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ResponseData = mongoose.model("ai_response_data", responseDataSchema);

module.exports = ResponseData;
