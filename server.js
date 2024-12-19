const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const userRoutes = require("./route/user");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("Error in DB connection", err));

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON
app.use(express.json());

// Initialize the browser and page once
app.get("/", (req, res) => {
  res.json({
    status: true,
    domains: {
      signUp: "to signup",
      logIn: "to login",
      logOut: "to logout",
      users: "to get all users",
      init: "to initialize browser",
      newPage: "to open new page",
      aiResponce: "to scrap data from page using prompt in request body",
      close: "to close browser",
    },
  });
});
app.use(userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
