const puppeteer = require("puppeteer");
const { aiPrompt, aiResponce } = require("./human.js");

let user = {
  browser: null,
  page: null,
};

const setUser = (userData) => {
  user = userData;
};

const getUser = () => {
  return user;
};

const initBrowser = async () => {
  if (!user.browser) {
    user.browser = await puppeteer.launch({
      headless: true, // Change to false if you want to see the user.browser UI
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    return user.browser;
  } else {
    throw new Error("browser already initialized.");
  }
};

const initPage = async (url = "https://deepai.org/chat") => {
  if (user.browser) {
    const page = await user.browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url);
    console.log("Page initialized.");
    user.page = page;
  } else {
    throw new Error("browser not initialized. Call /init first.");
  }
};

const closePage = async () => {
  if (user.page) {
    await user.page.close();
    user.page = null;
    console.log(`Page is closed.`);
  } else {
    throw new Error(`No Previous Page found.`);
  }
};

const closeBrowser = async () => {
  if (user.browser) {
    await user.browser.close();
    user.browser = null;
    pages = {};
    console.log("browser closed.");
  } else {
    throw new Error("browser not initialized.");
  }
};

const scrapData = async (prompt) => {
  try {
    if (!user.page) {
      throw new Error("Page is not initialized. Call /initPage first.");
    }
    const page = user.page;
    if (page.url() !== "https://deepai.org/chat") {
      await page.goto("https://deepai.org/chat");
    }
    await aiPrompt(prompt, page);
    const data = await aiResponce(page);
    console.log(data);
    return data;
  } catch (err) {
    console.error("Error in scrapData:", err.message);
    throw err;
  }
};

module.exports = {
  setUser,
  getUser,
  initBrowser,
  closeBrowser,
  scrapData,
  initPage,
  closePage,
};
