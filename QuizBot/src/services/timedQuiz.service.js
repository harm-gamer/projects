module.exports = function startQuiz(bot, chatId, quiz, timePerQuestion = 10) {
  bot.activeQuiz = {
    chatId,
    quiz,
    index: 0,
    timePerQuestion,
    remainingTime: timePerQuestion,
    scores: {},
    users: {},
    currentPollId: null,
    active: true
  };

  // first question
  const q = quiz[0];
  bot.sendPoll(chatId, q.question, q.options, {
    type: "quiz",
    correct_option_id: q.correctIndex,
    is_anonymous: false
  }).then(poll => {
    bot.activeQuiz.currentPollId = poll.poll.id;
  });
};
