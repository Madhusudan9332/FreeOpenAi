const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { setBrowser, getBrowser } = require("./jsonBrowser");
const UserModel = require("../model/user");
const {
  setUser,
  getUser,
  initBrowser,
  scrapData,
  closeBrowser,
  initPage,
  closePage,
} = require("./browser.js");

const init = async (req, res) => {
  try {
    let user = req.user;
    if (user) {
      setUser(user);
      await initBrowser();
      const browserData = await setBrowser(user._id, user.browser);
      console.log(browserData);
      try {
        await user.save();
      } catch (err) {
        throw new Error(err.message);
      }
      res.send("Browser initialized successfully!");
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(`Error initializing browser: ${error.message}`);
  }
};

const newPage = async (req, res) => {
  try {
    let user = req.user;
    const userData = await getBrowser(user._id);
    setUser(userData);
    try {
      await closePage();
    } catch (err) {
      console.log(err.message);
    }
    const page = await initPage();
    await setBrowser(user._id, user.browser, page);
    try {
      await user.save();
    } catch (err) {
      throw new Error(err.message);
    }
    res.json({
      success: true,
      url: page.url(),
      idUrl: `scrap-data?prompt=Your Prompt`,
    });
  } catch (error) {
    res.status(500).send(`Error initializing page: ${error.message}`);
  }
};

const aiResponce = async (req, res) => {
  try {
    let user = req.user;
    const userData = await getBrowser(user._id);
    setUser(userData);
    const prompt = req.prompt;
    if (prompt) {
      await scrapData(prompt);
    } else {
      throw new Error("Prompt is required.");
    }
  } catch (error) {
    res.status(500).send(`Error scraping data: ${error.message}`); // Handle errors
  }
};

const close = async (req, res) => {
  try {
    let user = req.user;
    if (user) {
      const userData = await getBrowser(user._id);
      setUser(userData);
      await closeBrowser();
      user = getUser();
      try {
        await user.save();
      } catch (err) {
        throw new Error(err.message);
      }
      res.send("Browser Closed successfully!");
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(`Error Clossing browser: ${error.message}`);
  }
};

const openAiController = { init, newPage, aiResponce, close };

module.exports = openAiController;
