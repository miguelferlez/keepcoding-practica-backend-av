import { unlink } from "node:fs";
import Product from "../models/Product.js";
import path from "node:path";

export function index(req, res, next) {
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
      await deleteProductImage(product, next);
    }
    await Product.deleteOne({ _id: productId, owner: userId });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
}

async function deleteProductImage(product, cb) {
  const imagePath = `${process.env.PRODUCT_IMAGE_DIR}/${product.image}`;
  const extension = path.extname(product.image);
  const imageName = path.basename(product.image, extension);
  const thumbnailPath =
    `${process.env.PRODUCT_IMAGE_DIR}/${imageName}_thumbnail${extension}` ??
    null;

  unlink(imagePath, cb);

  if (thumbnailPath) {
    unlink(thumbnailPath, cb);
  }
}
