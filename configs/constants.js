import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SSL_KEY: process.env.SSL_KEY,
  SSL_CERT: process.env.SSL_CERT,
  TELEGRAM_BOT_ID: process.env.TELEGRAM_KEY,
  CRICKET_PUBLIC_API_KEY: process.env.CRICKET_PUBLIC_API_KEY,
  PAYMENT_API_KEY:process.env.SMART_GLOBLE_Test
};

export const awsCredentials = {
  id: process.env.AWS_ID,
  secret_key: process.env.AWS_SECRET_KEY,
  bucket_name: process.env.AWS_BUCKET_NAME,
};

export const betPrice = [5, 10, 20];