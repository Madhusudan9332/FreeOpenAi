const CdpBrowser = require('../class/cdpBrowser');
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
    browser: { type: mongoose.Schema.Types.Mixed, default: null },
    page: { type: mongoose.Schema.Types.Mixed, default: null },
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

userSchema.post('findOne', function (doc) {
  if (doc && doc.browser) {
    doc.browser = new CdpBrowser(doc.browser.protocol);
  }
});

const User = mongoose.model("OpanAiUsers", userSchema);

module.exports = User;
