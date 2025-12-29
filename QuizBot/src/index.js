require("dotenv").config();
require("./config/env");
const bot = require("./bot");

const startQuizEngine = require("./services/quizEngine");

startQuizEngine(bot); 

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err.message);
});

