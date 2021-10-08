import express from "express";
import chalk from "chalk";
import mongoose from "mongoose";

import fs from "fs";
import http from "http";
import https from "https";

const app = express();
import middlewaresConfig, {
  responseMiddleware,
} from "./configs/middlewares.js";
import constants from "./configs/constants.js";

middlewaresConfig(app);

app.use((req, res, next) => {
  res.status(404).send({ code: 404, message: "Page not found" });
});

responseMiddleware(app);

let server,
  protocol = "";
let appEnv = constants.NODE_ENV;
if (appEnv === "development") {
  protocol = "HTTP";
  server = http.createServer(app);
} else {
  protocol = "HTTPS (Secure)";
  const privateKey = fs.readFileSync("server.key","utf-8");
  const publicKey = fs.readFileSync("server.cert","utf-8");
  server = https.createServer(
    {
      key: privateKey,
      cert: publicKey,
    },
    app
  );
}
server.listen(constants.PORT, async () => {
  await mongoose.connect(constants.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(
    chalk.blueBright.bold(
      `
        Yep this is working 🍺
        App listen on port: ${constants.PORT} 🍕
        Env: ${constants.NODE_ENV} 🦄
        `
    )
  );
});
