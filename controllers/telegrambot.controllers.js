import chalk from "chalk";
import bot from "../services/telegram.bot.js";
import { User } from "../models/user.models.js";
import { UserBets } from "../models/bets.models.js";
import Api from "../services/axios.js";
import { ObjectId } from "mongodb";
import { betPrice } from "../configs/constants.js";
import constants from "../configs/constants.js";

export const isAuth = async (ctx, msg, callback) => {
  const chatId = ctx?.chat?.id;
  try {
    if (ctx.from.is_bot) throw new Error("Bots are not allowed!");
    let user = await User.findOne({ telegramId: chatId });
    if (!user) {
      user = await User.create({
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        telegramId: ctx.from.id,
      });
      console.log(
        chalk.whiteBright(
          `\tcreated an new user with _id=> ${user._id} name => ${user.firstName} ${user.lastName} chatId=>${ctx.from.id}`
        )
      );
    }
    if (!user?.isConsent)
      return bot.telegram.sendMessage(chatId, "This is Consent Message!", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Agree",
                callback_data: `Agree`,
              },
            ],
            [{ text: "Not Agree", callback_data: `Not_Agree` }],
          ],
        },
      });
    callback(ctx, msg, user);
  } catch (error) {
    bot.telegram.sendMessage(
      chatId,
      `Some Error while messaging \n${error.message}`
    );
  }
};

export const userAuthenticatedMessage = async (msg, agr2, user) => {
  return agreed(
    msg,
    `Hello ${user.firstName} ${user.lastName}\nPlease select an match for bet`
  );
};

export const agreed = async (ctx, replyMessage = null) => {
  const chatId = ctx?.chat?.id;
  try {
    if (ctx.from.is_bot) throw new Error("Bots are not allowed!");
    const user = await User.findOne({ telegramId: chatId });
    user.isConsent = true;
    await user.save();
    console.log(
      chalk.cyanBright.bold(
        `\tnew user Consented _id=> ${user._id} name => ${user.firstName} ${user.lastName} chatId=>${ctx.from.id}`
      )
    );
    const { data } = await Api.getMatchesDetails();
    if (!data)
      return ctx.reply(`We are unable to process your request for today!!`);
    const matches = data.map((match) => [
      { text: match.name, callback_data: `matchId ${match.id}` },
    ]);
    return bot.telegram.sendMessage(
      chatId,
      `Welcome!! You are registered!\nPlease select an match for bet`,
      {
        reply_markup: {
          inline_keyboard: matches.slice(0, 5),
        },
      }
    );
  } catch (error) {
    return ctx.reply(`Some Error while messaging \n${error.message}`);
  }
};

export const notAgree = async (ctx, replyMessage = null) => {
  return ctx.reply("You can't login in the bot without Agree");
};

// export const selectMatch = async (ctx, msg, user) => {
//   const chatId = ctx?.chat?.id;
//   const matchId = ctx?.update?.callback_query?.data?.toString().split(" ")?.[1];
//   try {
//     const matchDetails = await Api.getMatchInfo(matchId);
//     if (!matchDetails)
//       return bot.telegram.sendMessage(
//         chatId,
//         `We are unable to process your request for today!!`
//       );
//     const userBets = await UserBets.findOne({
//       userId: new ObjectId(user._id),
//     });
//     let inline_keyboard = [];
//     if (userBets) {
//       const matchAllready = userBets.matches.filter(
//         (match) => match.matchId == matchId
//       );
//       if (matchAllready.length > 0) {
//         const notOpponect = matchAllready.filter((match) => !match.opponentId);
//         if (notOpponect.length > 0) {
//           inline_keyboard = betPrice.map((betPrice) => [
//             {
//               text: betPrice,
//               callback_data: `betPrice ${betPrice} ${matchAllready?.[0]?._id?.toString()}`,
//             },
//           ]);
//           return bot.telegram.sendMessage(
//             chatId,
//             `Please Select an bet Price for \n${matchDetails.data.name}`,
//             {
//               reply_markup: {
//                 inline_keyboard,
//               },
//             }
//           );
//         } else {
//           const updatedUser = await UserBets.findOneAndUpdate(
//             {
//               userId: new ObjectId(user._id),
//             },
//             { $addToSet: {  matches: { matchId, dateandTime: new Date() } }},
//             { new: true }
//           );
// inline_keyboard = betPrice.map((betPrice) => [
//   {
//     text: betPrice,
//     callback_data: `betPrice ${betPrice} ${updatedUser.matches?.[
//       updatedUser?.matches?.length - 1
//     ]?._id?.toString()}`,
//   },
// ]);
//           const totalBetCount = matchAllready.filter(
//             (match) => match.opponentId
//           );
//           return bot.telegram.sendMessage(
//             chatId,
//             `You have already placed ${totalBetCount.length} bet${
//               matchAllready.length > 1 ? `,s` : ``
//             } on this match\nSelect an option if you want to place more bets`,
//             {
//               reply_markup: {
//                 inline_keyboard,
//               },
//             }
//           );
//         }
//       } else {
//         const updatedUser = await UserBets.findOneAndUpdate(
//           {
//             userId: new ObjectId(user._id),
//           },
//           { $addToSet: {  matches: { matchId, dateandTime: new Date() } },
//           },
//           { new: true }
//         );
//         inline_keyboard = betPrice.map((betPrice) => [
//           {
//             text: betPrice,
//             callback_data: `betPrice ${betPrice} ${updatedUser.matches?.[
//               updatedUser?.matches?.length - 1
//             ]?._id?.toString()}`,
//           },
//         ]);
//         return bot.telegram.sendMessage(
//           chatId,
//           `Please Select an bet Price for \n${matchDetails.data.name}`,
//           {
//             reply_markup: {
//               inline_keyboard,
//             },
//           }
//         );
//       }
//     } else {
//       let userBet = new UserBets({
//         userId: user._id,
//         matches: [
//           {
//             matchId,
//             dateandTime: new Date(),
//           },
//         ],
//       });
//       await userBet.save();
//       inline_keyboard = betPrice.map((betPrice) => [
//         {
//           text: `${betPrice}`,
//           callback_data: `betPrice ${betPrice} ${userBet.matches?.[
//             userBet?.matches?.length - 1
//           ]?._id?.toString()}`,
//         },
//       ]);
//       return bot.telegram.sendMessage(
//         chatId,
//         `Please Select an bet Price\n${matchDetails.data.name}`,
//         {
//           reply_markup: {
//             inline_keyboard,
//           },
//         }
//       );
//     }
//   } catch (error) {
//     return ctx.reply(`Some Error while messaging \n${error.message}`);
//   }
// };

export const selectMatch = async (ctx, msg, user) => {
  const chatId = ctx?.chat?.id;
  const matchId = ctx?.update?.callback_query?.data?.toString().split(" ")?.[1];
  try {
    const matchDetails = await Api.getMatchInfo(matchId);
    if (!matchDetails)
      return bot.telegram.sendMessage(
        chatId,
        `We are unable to process your request for today!!`
      );
    console.log(chatId, matchId);
    const inline_keyboard = betPrice.map((betPrice) => [
      {
        text: betPrice,
        callback_data: `betPrice ${betPrice} ${matchId}`,
      },
    ]);
    return bot.telegram.sendMessage(
      chatId,
      `Please Select an bet Price\n${matchDetails.data.name}`,
      {
        reply_markup: {
          inline_keyboard,
        },
      }
    );
  } catch (error) {}
};

// export const selectBatPrice = async (ctx, msg, user) => {
//   const chatId = ctx?.chat?.id;
//   const userId = user?._id;
//   const betPrice = ctx?.update?.callback_query?.data
//     ?.toString()
//     .split(" ")?.[1]
//     ?.toString();
//   const betId = ctx?.update?.callback_query?.data
//     ?.toString()
//     .split(" ")?.[2]
//     ?.toString();
//   try {
//     const userBets = await UserBets.findOne({ userId });
//     const bets = userBets.matches.filter(
//       (bet) => bet._id.toString() == betId && !bet.opponentId
//     );
//     if (bets.length == 0) return ctx.reply(`something went wrong`);
//     const betsWithSamePrice = bets.filter((bet) => bet.betPrice == betPrice);
//     if (betsWithSamePrice.length > 0)
//       return ctx.reply(
//         `You are allready selected same bet price for same match`
//       );

//     console.log(bets, betId, betPrice);
//   } catch (error) {
//     return ctx.reply(`Some Error while messaging \n${error.message}`);
//   }
// };

export const selectBatPrice = async (ctx, msg, user) => {
  const chatId = ctx?.chat?.id;
  const betPrice = ctx?.update?.callback_query?.data
    ?.toString()
    .split(" ")?.[1];
  const matchId = ctx?.update?.callback_query?.data?.toString().split(" ")?.[2];
  try {
    const matchDetails = await Api.getMatchInfo(matchId);
    if (!matchDetails)
      return bot.telegram.sendMessage(
        chatId,
        `We are unable to process your request for today!!`
      );
    return bot.telegram.sendMessage(
      chatId,
      `You are selected an bet of ${betPrice} Rupee for \n${matchDetails.data.name} \nPlease Confirm`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Confirm",
                callback_data: `betConfirm ${betPrice} ${matchId}`,
              },
            ],
            [{ text: "No", callback_data: `betReject ${betPrice} ${matchId}` }],
          ],
        },
      }
    );
  } catch (error) {
    return ctx.reply(`Some Error while messaging \n${error.message}`);
  }
};

export const betConfirm = async (ctx, msg, user) => {
  const chatId = ctx?.chat?.id;
  const betPrice = ctx?.update?.callback_query?.data?.toString().split(" ")?.[1];
  const matchId = ctx?.update?.callback_query?.data?.toString().split(" ")?.[2];
  try {
    const matchDetails = await Api.getMatchInfo(matchId);
    if (!matchDetails)
      return bot.telegram.sendMessage(
        chatId,
        `We are unable to process your request for today!!`
      );
    return ctx.replyWithInvoice(getInvoice(ctx.from.id));
  } catch (error) {
    return ctx.reply(`Some Error while messaging \n${error.message}`);
  }
};

export const betReject = async (ctx, msg, user) => {
  const chatId = ctx?.chat?.id;
  const betPrice = ctx?.update?.callback_query?.data
    ?.toString()
    .split(" ")?.[1];
  const matchId = ctx?.update?.callback_query?.data?.toString().split(" ")?.[2];
  try {
    return bot.telegram.sendMessage(chatId, `This bet is Rejected `);
  } catch (error) {
    return ctx.reply(`Some Error while messaging \n${error.message}`);
  }
};

export const preCheckoutQuery = async (ctx, msg, user) => {
  try {
    console.log(`This is called!!`);
    return bot.telegram.answerPreCheckoutQuery(true);
  } catch (error) {}
};

const getInvoice = (id) => {
  const invoice = {
    chat_id: id,
    provider_token: constants.PAYMENT_API_KEY,
    start_parameter: "get_access", 
    title: `Payment of  for bet`, 
    description: `Payment of  for bet `,
    currency: "INR", // ISO 4217 Three-Letter Currency Code
    prices: [{ label: "Invoice Title", amount: 100 * 100 }], // Price breakdown, serialized list of components in JSON format 100 kopecks * 100 = 100 rubles
    payload: {
      // The payload of the invoice, as determined by the bot, 1-128 bytes. This will not be visible to the user, use it for your internal processes.
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: constants.PAYMENT_API_KEY,
    },
  };

  return invoice;
};
