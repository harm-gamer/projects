const sendResults = require("./result.service");

const TICK = 1000; // 1 second

module.exports = function startQuizEngine(bot) {
  setInterval(() => {
    const qz = bot.activeQuiz;
    if (!qz || !qz.active) return;

    // time running
    qz.remainingTime--;

    // time still left
    if (qz.remainingTime > 0) return;

    // move to next question
    qz.index++;

    // quiz finished
    if (qz.index >= qz.quiz.length) {
      qz.active = false;
      sendResults(bot, qz);
      return;
    }

    // send next question
    sendQuestion(bot, qz);
  }, TICK);
};

function sendQuestion(bot, qz) {
  const q = qz.quiz[qz.index];

  qz.remainingTime = qz.timePerQuestion;

  bot.sendPoll(qz.chatId, q.question, q.options, {
    type: "quiz",
    correct_option_id: q.correctIndex,
    is_anonymous: false
  }).then(poll => {
    qz.currentPollId = poll.poll.id;
  });
}
