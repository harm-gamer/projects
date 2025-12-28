const TelegramBot = require("node-telegram-bot-api");
const { BOT_TOKEN } = require("./config/env");

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

require("./handlers/command.handler")(bot);
require("./handlers/file.handler")(bot);
require("./handlers/poll.handler")(bot);

console.log("🤖 Quiz Bot Running...");
module.exports = bot;
