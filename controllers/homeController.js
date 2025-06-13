export function index(req, res, next) {
  try {
    res.render("home");
  } catch (error) {
    next(error);
  }
}
