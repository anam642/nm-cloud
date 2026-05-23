require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;
const TOKEN = process.env.BOT_TOKEN;
const WORKER_URL = process.env.WORKER_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

app.get("/", (req, res) => {
    res.send("Bot running");
});

app.listen(PORT);

// ANY file handler (VERY IMPORTANT)
bot.on("message", async (msg) => {

    const fileId =
        msg.video?.file_id ||
        msg.document?.file_id ||
        msg.audio?.file_id;

    if (!fileId) {
        return; // ignore text like "hello"
    }

    try {

        const file = await bot.getFile(fileId);
        const filePath = file.file_path;

        if (!filePath) {
            return bot.sendMessage(msg.chat.id, "❌ file_path not found");
        }

        const link = `${WORKER_URL}?file=${encodeURIComponent(filePath)}`;

        bot.sendMessage(msg.chat.id, `✅ Download Link:\n${link}`);

    } catch (err) {
        console.log(err);
        bot.sendMessage(msg.chat.id, "❌ Error generating link");
    }
});
