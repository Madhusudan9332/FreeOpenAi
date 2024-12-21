const responseDataModel = require("../model/responseData");
const { ObjectId } = require("mongodb");
const {
  setUser,
  getUser,
  initBrowser,
  scrapData,
  closeBrowser,
  initPage,
  closePage,
} = require("./browser.js");

const usersBrowser = [
  {
    id: new ObjectId("67642ba6de1a21a948a8789e"),
    browser: null,
    page: null,
    data: [],
    currentPageId: null,
  },
];

const init = async (req, res) => {
  try {
    let user = req.user;
    user.browser = null;
    if (user) {
      setUser(user);
      await initBrowser();
      user = getUser();
      usersBrowser.push({
        id: user._id,
        browser: user.browser,
        page: user.page,
        data: user.data || [],
        currentPageId: null,
      });
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

const gotoPage = async (req, res) => {
  try {
    let user = req.user;
    let pageId = req.headers.pageid;
    const promptData = await responseDataModel.findById(pageId);
    const textPrompt = convertToText(promptData.data);
    const userData = usersBrowser.filter((data) => {
      const id1 = new ObjectId(user._id);
      const id2 = new ObjectId(data.id);
      if (id1.equals(id2)) {
        console.log("true Event");
        return true;
      }
    });
    setUser(userData[0]);
    user = getUser();
    await closePage();
    console.log("resarting page...");
    await initPage();
    user = getUser();
    console.log("page restarted");
    await scrapData(`Our previous Conversation was : ${textPrompt}`);
    user = getUser();
    // console.log("usersBrowser then :", usersBrowser);
    for(let userData of usersBrowser){
      const id1 = new ObjectId(user.id);
      const id2 = new ObjectId(userData.id);
      if(id1.equals(id2)){
        userData.page = user.page;
        userData.currentPageId = promptData._id;
      }
    }
    // console.log("usersBrowser now :", usersBrowser);
    res.json({
      success: true,
      idUrl: `/aiResponce use prompt in body or header`,
    });
  } catch (err) {
    res.status(500).send(`Error Finding page: ${err.message}`);
  }
};

const newPage = async (req, res) => {
  try {
    let user = req.user;
    const userData = usersBrowser.filter((data) => {
      const id1 = new ObjectId(user._id);
      const id2 = new ObjectId(data.id);
      if (id1.equals(id2)) {
        console.log("true Event");
        return true;
      }
    });
    setUser(userData[0]);
    try {
      await closePage();
    } catch (err) {
      console.log(err.message);
    }
    const page = await initPage();
    // console.log("usersBrowser then :", usersBrowser);
    for (const data of usersBrowser) {
      try {
        const id1 = new ObjectId(user._id);
        const id2 = new ObjectId(data.id);

        if (id1.equals(id2)) {
          data.page = page;
          const pageData = {
            userId: id1,
            data: [
              {
                prompt: "...",
                aiResponse: "Hii, I am ALM. How can I Assist you?",
              },
            ],
          };
          const resp = await responseDataModel.create(pageData);
          data.data.push(resp._id);
          data.currentPageId = resp._id;
          user.data.push(resp._id);
          await user.save();
        }
      } catch (error) {
        console.error("Error processing user:", error);
      }
    }

    // console.log("usersBrowser now :", usersBrowser);
    res.json({
      success: true,
      url: page,
      idUrl: `/aiResponce use prompt in body or header`,
    });
  } catch (error) {
    res.status(500).send(`Error initializing page: ${error.message}`);
  }
};

const aiResponce = async (req, res) => {
  try {
    let user = req.user;
    let aiName = user.aiName;
    const userData = usersBrowser.filter((data) => {
      const id1 = new ObjectId(user._id);
      const id2 = new ObjectId(data.id);
      if (id1.equals(id2)) {
        console.log("true Event");
        return true;
      }
    });
    setUser(userData[0]);
    // console.log("userData[0] is : ", userData[0]);
    const prompt = req.headers.prompt || req.body.prompt;
    const myPrompt = `Note: Your Ai name is ${aiName} reply only when ask, If User Wants to Change Ai name only then responce that goto "get: url/setAiName/:aiName" , otherwise give only ai responce of given prompt -> ${prompt}`;
    if (prompt) {
      let data = await scrapData(myPrompt);
      data = data.replace("\n\nCopy\nSearch Web\nSummarize\nDelete", "");
      const resp = await responseDataModel.findById(userData[0].currentPageId);
      resp.data.push({
        prompt: prompt,
        aiResponse: data,
      });
      try {
        await resp.save();
      } catch (err) {
        throw new Error(err.message);
      }
      res.json({
        success: true,
        aiResponce: data,
      });
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
      const userData = usersBrowser.filter((data) => {
        const id1 = new ObjectId(user._id);
        const id2 = new ObjectId(data.id);
        if (id1.equals(id2)) {
          console.log("true Event");
          return true;
        }
      });
      setUser(userData[0]);
      await closeBrowser();
      usersBrowser.forEach((data) => {
        const id1 = new ObjectId(user._id);
        const id2 = new ObjectId(data.id);
        if (id1.equals(id2)) {
          data.browser = null;
          data.page = null;
        }
      });
      user.browser = null;
      user.page = null;
      await user.save();
      res.send("Browser Closed successfully!");
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(`Error Clossing browser: ${error.message}`);
  }
};

const openAiController = { init, gotoPage, newPage, aiResponce, close };

const convertToText = (data) => {
  return data
    .map(
      (item) => `Prompt: "${item.prompt}"\nAI Response: "${item.aiResponse}"\n`
    )
    .join("\n");
};

module.exports = openAiController;

