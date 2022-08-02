import bot from "../configs/telegram.js";
import * as TelegramBot from "../controllers/telegrambot.controllers.js";

// bot.on("message", TelegramBot.isAuth);

bot.onText(/\/start/,(msg,arg2)=> TelegramBot.isAuth(msg,arg2,TelegramBot.userAuthenticatedMessage));

bot.onText(/\Agree/, TelegramBot.agreed);

bot.onText(/\/sendpic/, TelegramBot.isAuth,(msg) => {
  console.log(msg.chat.id);
  bot.sendPhoto(
    msg.chat.id,
    "https://drive.google.com/file/d/1si5BPV3wY3kf9gMj0CZ0KanPSbssgK6M/view?usp=sharing",
    { caption: "Here we go ! \nThis is just a caption " }
  );
});

export default bot;
