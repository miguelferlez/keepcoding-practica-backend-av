import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import connectMongoose from "./lib/connectMongoose.js";
import * as homeController from "./controllers/homeController.js";
import * as loginController from "./controllers/loginController.js";
import * as productsController from "./controllers/productsController.js";
import * as sessionManager from "./lib/sessionManager.js";
import * as productsApi from "./api/productsAPI.js";
import * as userApi from "./api/userAPI.js";
import { upload, createThumbnail } from "./lib/uploadStorage.js";
import { guard } from "./lib/jwtAuth.js";

await connectMongoose();
console.log("Connected to MongoDB");

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

/**
 * API routes
 */

app.get("/api/products", guard, productsApi.getProducts);
app.post("/api/login", userApi.logIn);
app.post(
  "/api/products",
  guard,
  upload.single("image"),
  createThumbnail,
  productsApi.createProduct
);
app.get("/api/products/:productId", guard, productsApi.getProductById);
app.delete("/api/products/:productId", guard, productsApi.deleteProduct);

/**
 * Web application routes
 */

app.use(sessionManager.userSession);
app.use(sessionManager.setSessionInViews);
app.get("/", homeController.index);
app.get("/login", loginController.index);
app.post("/login", loginController.logIn);
app.get("/logout", loginController.logOut);
app.get("/products/new", sessionManager.guard, productsController.index);
app.post(
  "/products/new",
  sessionManager.guard,
  upload.single("image"),
  createThumbnail,
  productsController.createProduct
);
app.get(
  "/products/delete/:productId",
  sessionManager.guard,
  productsController.deleteProduct
);
app.get("/:page?", homeController.index);

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
  /* Validation errors */

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

  /* API errors */

  if (req.url.startsWith("/api/")) {
    res.json({ error: err.message });
    return;
  }

  res.locals.message = err.message;
  res.locals.error = process.env.APP_ENV === "development" ? err : {};

  res.render("error");
});

export default app;
