import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import * as home from "./controllers/homeController.js";

const app = express();

/**
 * View engine setup
 */

app.set("views", "views");
app.set("view engine", "ejs");

app.locals.appName = "Nodepop";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

//TODO: api routes

/**
 * Web application routes
 */
app.get("/", home.index);

/**
 * Catch 404 and forward to error handler
 */

app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Error handler
 */

app.use(function (err, req, res, next) {
  if (err.array) {
    err.message =
      "Invalid request: " +
      err
        .array()
        .map(
          (error) =>
            `${error.location} ${error.type} ${error.path} ${error.msg}`
        )
        .join(", ");
    err.status = 422;
  }

  res.status(err.status || 500);

  //TODO: json response for /api/ errors

  res.locals.message = err.message;
  res.locals.error = process.env.APP_ENV === "development" ? err : {};

  res.render("error");
});

export default app;
