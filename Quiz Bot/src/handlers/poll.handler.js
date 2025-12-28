const path = require("path");
const fs = require("fs");

const scoresPath = path.join(__dirname, "../data/scores.json");

module.exports = (bot) => {
  bot.on("poll_answer", (answer) => {
    const userId = answer.user.id;

    let scores = {};
    if (fs.existsSync(scoresPath)) {
      scores = JSON.parse(fs.readFileSync(scoresPath, "utf-8"));
    }

    scores[userId] = (scores[userId] || 0) + 1;

    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
  });
};
