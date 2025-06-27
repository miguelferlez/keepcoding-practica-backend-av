import mongoose from "mongoose";
import process from "node:process";

function connectMongoose() {
  return mongoose
    .connect(process.env.DB_URL)
    .then((mongoose) => mongoose.connection);
}

export default connectMongoose;
