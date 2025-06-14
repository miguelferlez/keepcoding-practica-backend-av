import mongoose from "mongoose";

function connectMongoose() {
  return mongoose
    .connect(process.env.DB_URL)
    .then((mongoose) => mongoose.connection);
}

export default connectMongoose;
