import { Telegraf,Markup } from "telegraf";
import { Keypair } from "@solana/web3.js";

const bot = new Telegraf("8368414041:AAHlTjKuN2WgPMPscYWFhXFHJgPjklvjkoc");

let USERS : Record<number,Keypair> = {};

let keyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback('generate wallet',"generate_wallet"),
        Markup.button.callback('show publicKey',"show_publicKey"),
    ]
]);

bot.start(async (ctx) =>{
    let userId = ctx.from?.id;
    if(!userId) return;

    let WelcomeMessage = "Welcome to Bonk Bot";
    return ctx.reply(WelcomeMessage,{
        parse_mode: 'Markdown',
        ...keyboard
    })
})

bot.action("generate_wallet", async(ctx) =>{
    const userId = ctx.from?.id;
    if(!userId) return;
    const key = Keypair.generate();
    USERS[userId] = key;
    return ctx.answerCbQuery("Wallet generating...");
})

bot.action("show_publlicKey",async(ctx) =>{
    return ctx.reply("showing public key...");
})

await bot.launch();