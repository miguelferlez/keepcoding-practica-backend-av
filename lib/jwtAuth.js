import jwt from "jsonwebtoken";
import createError from "http-errors";

export function guard(req, res, next) {
  const tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;

  if (!tokenJWT) {
    next(createError(401, "no token provided"));
    return;
  }

  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "invalid token"));
      return;
    }

    req.apiUserId = payload.user_id;

    next();
  });
}
