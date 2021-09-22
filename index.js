import express from "express";
import chalk from "chalk";
import mongoose from "mongoose";

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

app.listen(constants.PORT, async () => {
  await mongoose.connect(constants.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(
    chalk.blueBright.bold(
      `
          Yep this is working 🍺
          App listen on port: ${constants.PORT} 🍕
        `
    )
  );
});
