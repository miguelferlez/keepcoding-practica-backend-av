import Product from "../models/Product.js";
import { existsSync } from "node:fs";

export async function index(req, res, next) {
  try {
    const userId = req.session.userId;

    /* Pagination */

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    /* Filters */

    const sort = req.query.sort;
    const filter = { owner: userId };

    const products = await Product.list(filter, limit, skip, sort);
    const total = await Product.find(filter).countDocuments();

    for (let product of products) {
      if (product.image) {
        const thumbnail = product.image.replace(/\.(?=[^.]+$)/, "_thumbnail.");
        if (existsSync(`public/images/${thumbnail}`)) {
          product.image = thumbnail;
        }
      } else {
        product.image = "product-placeholder.jpg";
      }
    }

    res.locals.products = products;
    res.locals.username = req.session.username;
    res.locals.productsTotal = total;
    res.locals.paginationCurrent = page;
    res.locals.paginationTotal = Math.ceil(total / limit);

    res.render("home");
  } catch (error) {
    next(error);
  }
}
