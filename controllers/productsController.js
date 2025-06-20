import Product from "../models/Product.js";

export function index(req, res, next) {
  res.locals.error = "";
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
    console.log(req.file.filename);

    await product.save();

    res.redirect("/");
  } catch (error) {
    next(error);
  }
}
