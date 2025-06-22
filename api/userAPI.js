import User from "../models/User.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";

export async function logIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      next(createError(401, "invalid credentials"));

      return;
    }

    jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (error, tokenJWT) => {
        if (error) {
          next(error);
          return;
        }
        res.json({ tokenJWT });
      }
    );
  } catch (error) {
    next(error);
  }
}
