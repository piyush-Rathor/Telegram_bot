import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SSL_KEY: process.env.SSL_KEY,
  SSL_CERT: process.env.SSL_CERT,
};

export const awsCredentials = {
  id: process.env.AWS_ID,
  secret_key: process.env.AWS_SECRET_KEY,
  bucket_name: process.env.AWS_BUCKET_NAME,
};
