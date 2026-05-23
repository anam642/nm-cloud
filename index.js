require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.BOT_TOKEN;
const WORKER_URL = process.env.WORKER_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

// server check
app.get("/", (req, res) => {
    res.send("Bot is running");
});

app.listen(PORT, () => {
    console.log("Server running on", PORT);
});

// /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Send me a video to get download link.");
});

// video handler
bot.on("video", async (msg) => {
    try {
        const fileId = msg.video.file_id;

        const file = await bot.getFile(fileId);
        const filePath = file.file_path;

        const link = `${WORKER_URL}?file=${encodeURIComponent(filePath)}`;

        bot.sendMessage(msg.chat.id, "Download Link:\n" + link);

    } catch (err) {
        console.log(err);
        bot.sendMessage(msg.chat.id, "Error generating link");
    }
});
