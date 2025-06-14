import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    owner: { ref: "User", type: Schema.Types.ObjectId, index: true },
    price: { type: Number, min: 1, max: 99999 },
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
