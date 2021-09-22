import bodyParser from "body-parser";
import cors from "cors";
import chalk from "chalk";

import { Response } from "../models/response.models.js";

export default (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
};

export const responseMiddleware = (app) => {
  app.response.success = function (message, data, displayMessage, code) {
    console.log(chalk.greenBright(message));
    this.status(200).send(
      Response("success", message, data, displayMessage, code)
    );
  };

  app.response.successfullyCreated = function (
    message,
    data,
    displayMessage,
    code
  ) {
    console.log(chalk.green(message));
    this.status(201).send(
      Response("success", message, data, displayMessage, 201)
    );
  };

  app.response.warning = function (message, data, displayMessage, code) {
    console.log(chalk.yellow(message));
    this.status(422).send(
      Response("warning", message, data, displayMessage, 422)
    );
  };

  app.response.error = function (message, data, displayMessage, code) {
    console.log(chalk.red(message));
    if (data) {
      console.log(chalk.red(data));
    }
    message = typeof message != "string" ? "Something went wrong" : message;
    this.status(400).send(
      Response("error", message, data, displayMessage, 400)
    );
  };

  app.response.unauthorizedUser = function (message) {
    console.log(chalk.blueBright("Unauthorized User"));
    this.status(401).send(
      Response(
        "error",
        message || "Unauthorized User",
        undefined,
        undefined,
        401
      )
    );
  };
};
