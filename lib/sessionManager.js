import session from "express-session";
import MongoStore from "connect-mongo";
import process from "node:process";

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

export const userSession = session({
  name: "nodepop-session",
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URI,
  }),
});

export function setSessionInViews(req, res, next) {
  res.locals.session = req.session;

  next();
}

export function guard(req, res, next) {
  if (!req.session.userId) {
    res.redirect(`/login?redir=${req.url}`);

    return;
  }

  next();
}
