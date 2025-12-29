const parseTxt = require("../services/parser.service");
const startTimedQuiz = require("../services/timedQuiz.service");

module.exports = (bot) => {

  // Temporary storage for pending quiz
  const pendingQuiz = {};

  bot.on("document", async (msg) => {
    const chatId = msg.chat.id;
    const file = msg.document;

    if (!file.file_name.endsWith(".txt")) {
      return bot.sendMessage(chatId, "❌ Upload TXT file only");
    }

    const fileStream = await bot.getFileStream(file.file_id);
    let data = "";

    fileStream.on("data", chunk => {
      data += chunk.toString();
    });

    fileStream.on("end", async () => {
      let quiz;
      try {
        quiz = parseTxt(data);
      } catch {
        return bot.sendMessage(chatId, "❌ Failed to parse quiz file");
      }

      if (!quiz.length) {
        return bot.sendMessage(chatId, "❌ No valid questions found");
      }

      // Store quiz temporarily for this chat
      pendingQuiz[chatId] = quiz;

      await bot.sendMessage(
        chatId,
        "⏱️ Enter time per question (in seconds):\n\nExample: 10"
      );
    });
  });

  // ✅ SAFE MESSAGE HANDLER
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    // Ignore bot messages
    if (msg.from.is_bot) return;

    // Only handle if quiz is pending
    if (!pendingQuiz[chatId]) return;

    const timePerQ = parseInt(msg.text);
    if (isNaN(timePerQ) || timePerQ <= 0) {
      return bot.sendMessage(chatId, "❌ Invalid time value. Enter a number.");
    }

    const quiz = pendingQuiz[chatId];
    delete pendingQuiz[chatId]; // cleanup

    bot.sendMessage(
      chatId,
      `✅ Quiz starting...\n⏳ Time per question: ${timePerQ} seconds`
    );

    startTimedQuiz(bot, chatId, quiz, timePerQ);
  });
};
