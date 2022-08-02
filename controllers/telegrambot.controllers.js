import bot from "../services/telegram.bot.js";
import { User } from "../models/user.models.js";
import Api from "../services/axios.js";

export const isAuth = async (msg, agr2, callback) => {
  const chatId = msg?.chat?.id;
  try {
    if (msg.from.is_bot) throw new Error("Bots are not allowed!");
    const user = await User.findOne({ telegramId: chatId });
    if (!user) {
      await User.create({
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        telegramId: msg.from.id,
      });
    }
    if (!user?.isConsent)
      return bot.sendMessage(chatId, "This is Consent Message!", {
        reply_markup: {
          keyboard: [["Agree"], ["Not Agree"]],
        },
      });
    callback(msg, agr2);
  } catch (error) {
    bot.sendMessage(chatId, `Some Error while messaging \n${error.message}`);
  }
};

export const userAuthenticatedMessage = async (msg) => {
  return bot.sendMessage(msg?.chat?.id, "You are Authenticated!!");
};

export const agreed = async (msg) => {
  const chatId = msg?.chat?.id;
  try {
    if (msg.from.is_bot) throw new Error("Bots are not allowed!");
    const user = await User.findOne({ telegramId: chatId });
    user.isConsent = true;
    await user.save();
    const { data } = await Api.getMatchesDetails();
    const matches = data.map((match) => [match.name]);
    return bot.sendMessage(chatId, `Welcome!! You are registered!\nPlease select an match for bet`, {
      reply_markup: {
        keyboard:matches.length>5? matches.slice(0, 5):matches,
      },
    });
  } catch (error) {
    bot.sendMessage(chatId, `Some Error while messaging \n${error.message}`);
  }
};
