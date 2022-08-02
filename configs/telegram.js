import TelegramBot from 'node-telegram-bot-api';
import CONSTANTS from "./constants.js"

// Create a bot that uses 'polling' to fetch new updates
export default new TelegramBot(CONSTANTS.TELEGRAM_BOT_ID, {polling: true});

