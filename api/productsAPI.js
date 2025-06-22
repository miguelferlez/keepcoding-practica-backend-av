import createError from "http-errors";
import { unlink } from "node:fs/promises";
import Product from "../models/Product.js";

export async function getProducts(req, res, next) {
  try {
    const filter = {};
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const fields = req.query.fields;
    const withCount = req.query.count === "true";

    const products = await Product.list(filter, limit, skip, sort, fields);

    if (withCount) {
      const count = await Product.countDocuments(filter);
      result.total = count;
    }

    res.json({ results: products });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productId = req.params.productId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    res.json({ results: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productData = req.body;

    const product = new Product({
      ...productData,
      image: req.file?.filename,
      owner: userId,
    });

    const savedProduct = await product.save();

    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}
