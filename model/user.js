const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    basicInfo: {
      fName: { type: String, default: null },
      mName: { type: String, default: null },
      lName: { type: String, default: null },
      DOB: { type: String, default: "DD-MM-YYYY" },
      Address: { type: String, default: "India" },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    browser: { type: String, default: null },
    page: { type: String, default: null },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER", "MODERATOR"],
      default: "USER",
    },
    token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
