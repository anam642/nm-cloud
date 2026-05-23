require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.BOT_TOKEN;

// Create Telegram Bot
const bot = new TelegramBot(TOKEN, {
    polling: true
});

// Start Command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `👋 Hello ${msg.from.first_name}!\n\n✅ Your Telegram Bot is running successfully on Render.`
    );
});

// Help Command
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `📌 Available Commands:\n\n/start - Start the bot\n/help - Show help menu`
    );
});

// Normal Messages
bot.on("message", (msg) => {
    const text = msg.text;

    if (text !== "/start" && text !== "/help") {
        bot.sendMessage(
            msg.chat.id,
            `📩 You said:\n${text}`
        );
    }
});

// Express Web Server
app.get("/", (req, res) => {
    res.send("✅ Telegram Bot is Live on Render!");
});

// Start Web Server
app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
    console.log("🤖 Telegram Bot is running...");
});