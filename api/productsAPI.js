import path from "node:path";
import createError from "http-errors";
import { unlink } from "node:fs/promises";
import Product from "../models/Product.js";
import { log } from "node:console";

export async function getProducts(req, res, next) {
  try {
    const filter = {};
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const fields = req.query.fields;
    const withCount = req.query.count === "true";

    const products = await Product.list(filter, limit, skip, sort, fields);
    const result = { results: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.total = count;
    }

    res.json(result);
  } catch (error) {
    console.log(error);

    next(error);
  }
}
