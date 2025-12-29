module.exports = async (bot, chatId, quiz) => {
  for (let q of quiz) {
    await bot.sendPoll(chatId, q.question, q.options, {
      type: "quiz",
      correct_option_id: q.correctIndex,
      is_anonymous: false
    });
  }
};
