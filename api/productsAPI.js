import createError from "http-errors";
import { unlink } from "node:fs/promises";
import Product from "../models/Product.js";

/**
 * @swagger
 * /api/products:
 *   get:
 *     security:
 *       - tokenAuth: []
 *     tags:
 *       - Products
 *     description: Returns a list of products associated to the logged user.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of results to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of results to omit (for pagination)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort criterion (e.g. `price`,`-name`, etc)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Partial seach by name of products
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Minimum price of a product
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Maximum price of a product
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by given tags (`lifestyle`, `motor`, `mobile` or `work`)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: List separated by commas of specific fields to returns
 *       - in: query
 *         name: count
 *         schema:
 *           type: boolean
 *         description: If `true`, includes the total number of products
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: './models/Product'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
export async function getProducts(req, res, next) {
  try {
    const userId = req.apiUserId;

    /* Pagination */

    const limit = req.query.limit;
    const skip = req.query.skip;

    /* Filters */

    const sort = req.query.sort;
    const filter = { owner: userId };
    const filterByName = req.query.name;
    const filterByPriceMin = req.query.min;
    const filterByPriceMax = req.query.max;
    const filterByTags = req.query.tags;

    /* Views */

    const fields = req.query.fields;
    const withCount = req.query.count === "true";

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

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     security:
 *       - tokenAuth: []
 *     tags:
 *       - Products
 *     description: Returns a product associated to an id.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique product id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: './models/Product'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export async function getProductById(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productId = req.params.productId;

    const product = await Product.findOne({ _id: productId, owner: userId });

    if (!product) {
      next(createError(404, "product not found"));

      return;
    }

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

export async function updateProduct(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productId = req.params.productId;
    const productData = req.body;

    productData.image = req.file?.filename;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        owner: userId,
      },
      productData,
      {
        new: true,
      }
    );

    res.json({ result: updatedProduct });
  } catch (error) {
    next(error);
  }
}
