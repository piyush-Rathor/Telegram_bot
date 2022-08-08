import bot from "../configs/telegram.js";
import * as TelegramBot from "../controllers/telegrambot.controllers.js";

bot.start((ctx, arg2) =>TelegramBot.isAuth(ctx, arg2, TelegramBot.userAuthenticatedMessage));

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('successful_payment', async (ctx, next) => { // reply in case of positive payment
  await ctx.reply('SuccessfulPayment')
})

bot.hears('pay', (ctx) => {  // this is a handler for a specific text, in this case it is "pay"
  return ctx.replyWithInvoice(getInvoice(ctx.from.id)) //  replyWithInvoice method for invoicing 
})

bot.action("Agree", TelegramBot.agreed);
bot.action("Not_Agree", TelegramBot.notAgree);

bot.on('callback_query', (ctx, msg) =>TelegramBot.isAuth(ctx, msg,async (ctx,msg,user) => {
  console.log(ctx?.update?.callback_query?.data?.toString().split(" "));
  if(ctx?.update?.callback_query?.data?.toString().split(" ")?.[0]?.toString()==="matchId")
    await TelegramBot.selectMatch(ctx,msg,user)
  else if(ctx?.update?.callback_query?.data?.toString().split(" ")?.[0]?.toString()==="betPrice")
    await TelegramBot.selectBatPrice(ctx,msg,user)
  else if(ctx?.update?.callback_query?.data?.toString().split(" ")?.[0]?.toString()==="betConfirm")
    await TelegramBot.betConfirm(ctx,msg,user)
  else if(ctx?.update?.callback_query?.data?.toString().split(" ")?.[0]?.toString()==="betReject")
    await TelegramBot.betReject(ctx,msg,user)
  else
    ctx?.reply("Hello This is working")

  ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
  ctx.answerCbQuery()
}))

export default bot;
