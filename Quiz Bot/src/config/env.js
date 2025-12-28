require("dotenv").config();
console.log(process.env.BOT_TOKEN);

if (!process.env.BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN missing in .env file");
}

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN
};
