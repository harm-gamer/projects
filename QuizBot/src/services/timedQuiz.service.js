const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async function startTimedQuiz(bot, chatId, quiz, timePerQuestion = 10) {
  bot.activeQuiz = {
    chatId,
    scores: {},
    users: {},
    currentPollId: null,
    correctOptionIndex: null,
    active: true,
  };

  for (let i = 0; i < quiz.length; i++) {
    if (!bot.activeQuiz || !bot.activeQuiz.active) break;

    const q = quiz[i];

    // Validate question format
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || q.correctIndex < 0) {
      continue;
    }

    try {
      // Send poll
      const pollMsg = await bot.sendPoll(
        chatId,
        q.question,
        q.options,
        {
          type: "quiz",
          correct_option_id: q.correctIndex,
          is_anonymous: false,
          // Don't use open_period here, we handle timing ourselves
        }
      );

      bot.activeQuiz.currentPollId = pollMsg.poll.id;
      bot.activeQuiz.correctOptionIndex = q.correctIndex;

      // Wait for the time per question (enforced delay)
      await delay(timePerQuestion * 1000);

      // Stop accepting answers for this poll after time is up
      bot.activeQuiz.currentPollId = null;

    } catch (err) {
      console.error("Error sending poll:", err);
      // Continue to next question even if error
    }
  }

  await finishQuiz(bot, chatId);
};

async function finishQuiz(bot, chatId) {
  const qz = bot.activeQuiz;
  if (!qz) return;

  qz.active = false;

  const participants = Object.keys(qz.users);

  if (participants.length === 0) {
    await bot.sendMessage(chatId, "🏁 Quiz Finished\n\n❌ No participants joined.");
    bot.activeQuiz = null;
    return;
  }

  const leaderboard = participants
    .map(id => ({
      name: qz.users[id],
      score: qz.scores[id] || 0
    }))
    .sort((a, b) => b.score - a.score)
    .map((u, i) => `${i + 1}. ${u.name} — ${u.score}`)
    .join("\n");

  await bot.sendMessage(
    chatId,
    `🏆 *Leaderboard*\n\n${leaderboard}`,
    { parse_mode: "Markdown" }
  );

  const winner = participants.sort(
    (a, b) => (qz.scores[b] || 0) - (qz.scores[a] || 0)
  )[0];

  await bot.sendMessage(
    chatId,
    `🎉 Congratulations *${qz.users[winner]}*!`,
    { parse_mode: "Markdown" }
  );

  bot.activeQuiz = null;
}
