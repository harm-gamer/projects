const fs = require("fs");
const path = require("path");
const parseTxt = require("../services/parser.service");
const sendQuiz = require("../services/quiz.service");

module.exports = (bot) => {
  bot.on("document", async (msg) => {
    const chatId = msg.chat.id;
    const file = msg.document;

    if (!file.file_name.endsWith(".txt")) {
      return bot.sendMessage(chatId, "❌ Upload TXT file only");
    }

    const filePath = path.join(__dirname, "../data/quizzes", file.file_name);
    const fileStream = await bot.getFileStream(file.file_id);

    let data = "";
    fileStream.on("data", chunk => data += chunk);
    fileStream.on("end", () => {
      const quiz = parseTxt(data);
      sendQuiz(bot, chatId, quiz);
    });
  });
};
