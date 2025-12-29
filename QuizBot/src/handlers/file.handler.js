const parseTxt = require("../services/parser.service");
const startTimedQuiz = require("../services/timedQuiz.service");

module.exports = (bot) => {
  bot.on("document", async (msg) => {
    const chatId = msg.chat.id;
    const file = msg.document;

    if (!file.file_name.endsWith(".txt")) {
      return bot.sendMessage(chatId, "❌ Upload TXT file only");
    }

    const fileStream = await bot.getFileStream(file.file_id);
    let data = "";

    fileStream.on("data", (chunk) => {
      data += chunk.toString();
    });

    fileStream.on("end", async () => {
      let quiz;
      try {
        quiz = parseTxt(data);
      } catch {
        return bot.sendMessage(chatId, "❌ Invalid quiz format");
      }

      if (!quiz.length) {
        return bot.sendMessage(chatId, "❌ No valid questions found");
      }

      await bot.sendMessage(
        chatId,
        "⏱️ Enter time per question (in seconds):"
      );

      const timerListener = (reply) => {
        // 🔒 ONLY accept text message from same chat
        if (
          reply.chat.id !== chatId ||
          !reply.text ||
          reply.text.startsWith("/")
        ) {
          return;
        }

        const time = parseInt(reply.text.trim());

        if (isNaN(time) || time <= 0) {
          return bot.sendMessage(chatId, "❌ Please enter a valid number");
        }

        bot.removeListener("message", timerListener);

        bot.sendMessage(
          chatId,
          `✅ Quiz starting\n⏳ ${time} seconds per question`
        );

        startTimedQuiz(bot, chatId, quiz, time);
      };

      bot.on("message", timerListener);
    });
  });
};
