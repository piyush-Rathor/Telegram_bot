import { Telegraf } from "telegraf";
import CONSTANTS from "./constants.js";

const bot = new Telegraf(CONSTANTS.TELEGRAM_BOT_ID);

bot.use(Telegraf.log());

bot.on("message", (ctx) => {
  if (ctx.update.message.successful_payment != undefined) {
    ctx.reply("Thanks for the purchase!");
  } else {
    console.log(`This is`, ctx.update);
    // Handle other message types, subtypes
  }
});

bot.hears("pay", (ctx) => {
  return ctx.replyWithInvoice(getInvoice(ctx.from.id));
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true)); //

bot.on("successful_payment", async (ctx, next) => {
  await ctx.reply("SuccessfulPayment");
});

bot.launch();

export default bot;
