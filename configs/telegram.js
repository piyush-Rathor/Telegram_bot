import TelegramBot from 'node-telegram-bot-api';

const token = '5486892353:AAFh47Chr2GjYMpCVl52SfXYB0j_Pr5qJQQ';

// Create a bot that uses 'polling' to fetch new updates
export default new TelegramBot(token, {polling: true});

