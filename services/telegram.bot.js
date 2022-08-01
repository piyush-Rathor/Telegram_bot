import bot from "../configs/telegram.js";

// Matches "/echo [whatever]"
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome", {
    reply_markup: {
      keyboard: [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]],
    },
  });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Received your message");
});

bot.onText(/\/sendpic/, (msg) => {
  bot.sendPhoto(msg.chat.id,"https://drive.google.com/file/d/1si5BPV3wY3kf9gMj0CZ0KanPSbssgK6M/view?usp=sharing",
    { caption: "Here we go ! \nThis is just a caption " }
  );
});

export default bot;
