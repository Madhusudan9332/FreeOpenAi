const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    const user = req.user;
    if (user) {
      setUser(user);
      await initBrowser();
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
    const user = req.user;
    setUser(user);
    await closePage();
    const page = await initPage();
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
    const user = req.user;
    setUser(user);
    const prompt = req.prompt;
    if(prompt){
        await scrapData(prompt);
    }else{
        throw new Error("Prompt is required.");
    }
  } catch (error) {
    res.status(500).send(`Error scraping data: ${error.message}`); // Handle errors
  }
};

const close = async (req, res) => {
    try {
        const user = req.user;
        if (user) {
          setUser(user);
          await closeBrowser();
          res.send("Browser Closed successfully!");
        } else {
          res.send("Invalid credentials");
        }
      } catch (error) {
        res.status(500).send(`Error Clossing browser: ${error.message}`);
      }
}

const openAiController = { init , newPage, aiResponce, close };

module.exports = openAiController;

