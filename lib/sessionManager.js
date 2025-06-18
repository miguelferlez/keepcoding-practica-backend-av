import session from "express-session";

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

export const userSession = session({
  name: "nodepop-session",
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
});

export function setSessionInViews(req, res, next) {
  res.locals.session = req.session;

  next();
}
