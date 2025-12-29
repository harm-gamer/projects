module.exports = async function sendResults(bot, qz) {
  const chatId = qz && qz.chatId;

  if (!chatId) {
    console.error("No valid chatId in quiz state. Cannot send results.");
    return;
  }

  // No participants joined
  if (!qz.users || Object.keys(qz.users).length === 0) {
    return bot.sendMessage(chatId, "❌ Quiz finished.\nNo participants joined.");
  }

  // No correct answers
  if (!qz.scores || Object.keys(qz.scores).length === 0) {
    let msg = "🏁 *Quiz Finished*\n\n";
    msg += "😔 No one answered any question correctly.";

    return bot.sendMessage(chatId, msg, { parse_mode: "Markdown" });
  }

  const sorted = Object.entries(qz.scores)
    .filter(([_, score]) => typeof score === "number")
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return bot.sendMessage(chatId, "❌ Quiz finished. No valid scores.");
  }

  let text = "🏆 *Quiz Leaderboard*\n\n";

  sorted.forEach(([id, score], i) => {
    const name = qz.users[id] || `User ${id}`;
    text += `${i + 1}. ${name} — ${score} marks\n`;
  });

  await bot.sendMessage(chatId, text.trim(), {
    parse_mode: "Markdown"
  });

  // Send winner popup
  const winnerId = sorted[0][0];
  const winnerName = qz.users[winnerId] || "Winner";

  if (winnerId) {
    await bot.sendMessage(
      winnerId,
      `🎉 Congratulations ${winnerName}!\n🏆 You won the quiz!`
    );
  } else {
    console.warn("Winner ID missing, skipping winner message.");
  }
};
