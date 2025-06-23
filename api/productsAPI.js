import createError from "http-errors";
import { unlink } from "node:fs/promises";
import Product from "../models/Product.js";

export async function getProducts(req, res, next) {
  try {
    const userId = req.apiUserId;

    const filter = { owner: userId };
    const limit = req.query.limit;
    const skip = req.query.skip;
    const sort = req.query.sort;
    const fields = req.query.fields;
    const withCount = req.query.count === "true";

    const products = await Product.list(filter, limit, skip, sort, fields);
    const results = { results: products };

    if (withCount) {
      const count = await Product.countDocuments(filter);
      results.total = count;
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productId = req.params.productId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    res.json({ result: product });
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

export async function deleteProduct(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      console.warn(`user ${userId} tried to delete a non-existing product`);
      next(createError(404, "product not found"));

      return;
    }

    if (product.owner.toString() !== userId) {
      console.warn(`user ${userId} tried to delete a product of another user`);
      next(createError(401, "unauthorized to delete this product"));

      return;
    }

    if (product.image) {
      await deleteProductImage(product);
    }
    await Product.deleteOne({ _id: productId, owner: userId });

    res.json();
  } catch (err) {
    next(err);
  }
}

async function deleteProductImage(product) {
  const imagePath = `${process.env.PRODUCT_IMAGE_DIR}/${product.image}`;
  const extension = path.extname(product.image);
  const imageName = path.basename(product.image, extension);
  const thumbnailPath =
    `${process.env.PRODUCT_IMAGE_DIR}/${imageName}_thumbnail${extension}` ??
    null;

  unlink(imagePath);

  if (thumbnailPath) {
    unlink(thumbnailPath);
  }
}
