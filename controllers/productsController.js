export function index(req, res, next) {
  res.locals.error = "";
  res.render("new-product");
}
