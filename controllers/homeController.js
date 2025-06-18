import Product from "../models/Product.js";

export async function index(req, res, next) {
  try {
    /* Pagination */

    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    /* Filters */

    const sort = req.query.sort;
    const filter = {};

    const products = await Product.list(filter, limit, skip, sort);

    res.locals.products = products;
    res.locals.paginationCurrent = page;
    res.locals.paginationTotal = Math.ceil(products.total / limit);

    res.render("home");
  } catch (error) {
    next(error);
  }
}
