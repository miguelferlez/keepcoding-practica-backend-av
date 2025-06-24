import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import createError from "http-errors";
import Product from "../models/Product.js";
import { MAX_CHARS, MAX_PRICE, MIN_PRICE } from "../lib/utils.js";

export function index(req, res, next) {
  res.locals.error = "";
  res.locals.MAX_CHARS = MAX_CHARS;
  res.locals.MAX_PRICE = MAX_PRICE;
  res.locals.MIN_PRICE = MIN_PRICE;

  res.render("new-product");
}

export async function createProduct(req, res, next) {
  try {
    const productData = req.body;
    const userId = req.session.userId;

    const product = new Product({
      ...productData,
      image: req.file?.filename,
      owner: userId,
    });
    product.price = product.price.toFixed(2);
    product.tags = product.tags?.filter((tag) => !!tag);

    await product.save();

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.session.userId;

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
      deleteProductImage(product);
    }
    await Product.deleteOne({ _id: productId, owner: userId });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
}

async function deleteProductImage(product) {
  const imagePath = `${process.env.PRODUCT_IMAGE_DIR}/${product.image}`;
  const extension = path.extname(product.image);
  const imageName = path.basename(product.image, extension);
  const thumbnailPath = `${process.env.PRODUCT_IMAGE_DIR}/${imageName}_thumbnail${extension}`;

  await unlink(imagePath);

  if (existsSync(thumbnailPath)) {
    await unlink(thumbnailPath);
  }
}
