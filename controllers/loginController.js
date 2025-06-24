import User from "../models/User.js";

export function index(req, res, next) {
  res.locals.error = "";
  res.locals.email = "";

  res.render("login");
}

export async function logIn(req, res, next) {
  try {
    const redir = req.query.redir;
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.locals.error = res.__("Invalid credentials");
      res.locals.email = email;

      res.render("login");

      return;
    }

    req.session.userId = user.id;
    req.session.username = user.name;

    res.redirect(redir ? redir : "/");
  } catch (error) {
    next(error);
  }
}

export function logOut(req, res, next) {
  req.session.regenerate((error) => {
    if (error) {
      next(error);

      return;
    }

    res.redirect("/");
  });
}
