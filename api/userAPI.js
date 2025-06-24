import User from "../models/User.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Provides an authentication token given correct credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
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
