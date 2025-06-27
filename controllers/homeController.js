import Product from "../models/Product.js";
import { existsSync } from "node:fs";
import process from "node:process";

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
    const filterByName = req.query.name;
    const filterByPriceMin = req.query.min;
    const filterByPriceMax = req.query.max;
    const filterByTags = req.query.tags;

    if (filterByName) {
      filter.name = { $regex: filterByName, $options: "i" };
    }

    if (filterByPriceMin) {
      filter.price = { ...filter.price, $gte: Number(filterByPriceMin) };
    }

    if (filterByPriceMax) {
      filter.price = { ...filter.price, $lte: Number(filterByPriceMax) };
    }

    if (filterByTags) {
      const tags = Array.isArray(filterByTags)
        ? filterByTags
        : filterByTags.split(",");
      filter.tags = { $in: tags };
    }

    const products = await Product.list(filter, limit, skip, sort);
    const total = await Product.find(filter).countDocuments();

    /* Use thumbnail as image if available */

    for (let product of products) {
      if (product.image) {
        const thumbnail = product.image.replace(/\.(?=[^.]+$)/, "_thumbnail.");
        if (existsSync(`${process.env.PRODUCT_IMAGE_DIR}/${thumbnail}`)) {
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

    if (req.query.page > res.locals.paginationTotal) {
      res.redirect(`/?page=${res.locals.paginationTotal}`);
    }

    res.render("home");
  } catch (error) {
    next(error);
  }
}
