const fs = require("fs");
const path = require("path");

const scoresPath = path.join(__dirname, "../data/scores.json");

module.exports = (bot) => {
  bot.onText(/\/result/, (msg) => {
    let scores = {};

    if (fs.existsSync(scoresPath)) {
      scores = JSON.parse(fs.readFileSync(scoresPath, "utf-8"));
    }

    let result = "🏆 Quiz Results 🏆\n\n";

    if (Object.keys(scores).length === 0) {
      result += "No participants yet.";
    } else {
      for (let user in scores) {
        result += `User ${user} → ${scores[user]}\n`;
      }
    }

    bot.sendMessage(msg.chat.id, result);
  });
};
