
async function aiPrompt(prompt,page) {
  await page.waitForSelector(".chatbox");
  const chatboxes = await page.$$(".chatbox"); // Get all chatboxes
  const lastChatbox = chatboxes[chatboxes.length - 1]; // Use the last chatbox

  if (lastChatbox) {
    await lastChatbox.click(); // Focus the chatbox
    await lastChatbox.type(prompt); // Enter the prompt text
    await lastChatbox.press("Enter"); // Press Enter to submit the prompt
  } else {
    throw new Error("Chatbox not found.");
  }
}

async function aiResponce(page) {
  await page.waitForSelector(".outputBox");
  const outputBoxes = await page.$$(".outputBox"); // Get all output boxes
  const lastOutputBox = outputBoxes[outputBoxes.length - 1]; // Use the last output box

  if (lastOutputBox) {
    // Extract the text from the last output box
    const outputText = await page.evaluate((el) => el.innerText, lastOutputBox);
    console.log("AI Response:", outputText);
    return outputText; // Return the response text
  } else {
    throw new Error("Output box not found.");
  }
}

module.exports = { aiPrompt, aiResponce };
