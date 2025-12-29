const sendResults = require("./result.service");

const TICK = 1000; // 1 second

module.exports = function startQuizEngine(bot) {
  // Store interval id to clear it later
  let intervalId = setInterval(() => {
    const qz = bot.activeQuiz;

    // Defensive check: stop if no active quiz
    if (!qz || !qz.active || !qz.quiz) {
      clearInterval(intervalId);
      return;
    }

    // Decrement timer
    qz.remainingTime--;

    // If time left, do nothing
    if (qz.remainingTime > 0) return;

    // Move to next question
    qz.index++;

    // Quiz finished condition
    if (qz.index >= qz.quiz.length) {
      qz.active = false;

      // Clear the interval here!
      clearInterval(intervalId);

      sendResults(bot, qz);
      return;
    }

    // Send next question
    sendQuestion(bot, qz);
  }, TICK);
};

function sendQuestion(bot, qz) {
  const q = qz.quiz[qz.index];

  // Reset timer for next question
  qz.remainingTime = qz.timePerQuestion;

  bot.sendPoll(qz.chatId, q.question, q.options, {
    type: "quiz",
    correct_option_id: q.correctIndex,
    is_anonymous: false
  }).then(poll => {
    qz.currentPollId = poll.poll.id;
  });
}
