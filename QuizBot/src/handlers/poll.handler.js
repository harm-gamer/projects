module.exports = (bot) => {
  bot.on("poll_answer", (answer) => {
    const qz = bot.activeQuiz;
    if (!qz || !qz.active) return;

    // Ignore expired polls
    if (answer.poll_id !== qz.currentPollId) return;

    if (!answer.option_ids.length) return;

    const user = answer.user;
    const selected = answer.option_ids[0];

    qz.users[user.id] =
      user.username || user.first_name || "Anonymous";

    if (selected === qz.correctOptionIndex) {
      qz.scores[user.id] = (qz.scores[user.id] || 0) + 1;
    }
  });
};
