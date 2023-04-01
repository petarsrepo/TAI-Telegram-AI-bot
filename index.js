  require('dotenv').config()
  const express = require('express');
  const app = express();
  const {
    Configuration,
    OpenAIApi
  } = require("openai");
  const TelegramBot = require('node-telegram-bot-api');
  const token = process.env.BOT_TOKEN
  const bot = new TelegramBot(token, {
    polling: true
  });
  const fs = require('fs');

  bot.onText(/\/q (.+)/, (msg, body) => {

    async function getReply(query) {
      const chatId = msg.chat.id;
      const resp = await getInput(body)
      bot.sendMessage(chatId, resp);
    }

    getReply(body)

  });

  async function getInput(query) {
    const response = await runPrompt(query);
    console.log(response);
    return response;
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  async function runPrompt(prompt) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 1.33,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\"\"\""],
    });
    console.log('OpenAI API response:', response);
    return response.data.choices[0].text;
  }
