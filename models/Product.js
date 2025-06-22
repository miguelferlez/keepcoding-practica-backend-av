import { Schema, model } from "mongoose";
import { MAX_CHARS, MAX_PRICE, MIN_PRICE } from "../lib/utils.js";

const productSchema = new Schema(
  {
    name: { type: String, maxLength: MAX_CHARS, required: true },
    owner: { ref: "User", type: Schema.Types.ObjectId, index: true },
    price: { type: Number, min: MIN_PRICE, max: MAX_PRICE, required: true },
    image: String,
    tags: [String],
  },
  {
    collection: "products",
  }
);

/**
 * Model methods
 */

productSchema.statics.list = function (filter, limit, skip, sort, fields) {
  const query = Product.find(filter);

  query.limit(limit);
  query.skip(skip);
  query.sort(sort);
  query.select(fields);

  return query.exec();
};

const Product = model("Product", productSchema);

export default Product;
