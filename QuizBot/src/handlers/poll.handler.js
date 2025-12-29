module.exports = (bot) => {
  bot.on("poll_answer", (answer) => {
    const qz = bot.activeQuiz;
    if (!qz || !qz.active) return;
    if (answer.poll_id !== qz.currentPollId) return;

    const user = answer.user;
    const selected = answer.option_ids[0];
    const correct = bot.polls[answer.poll_id]?.correct_option_id;

    qz.users[user.id] = user.username || user.first_name || "Anonymous";

    if (selected === correct) {
      qz.scores[user.id] = (qz.scores[user.id] || 0) + 1;
    }
  });
};
