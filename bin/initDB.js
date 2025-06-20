import "dotenv/config";
import process from "node:process";
import readline from "node:readline/promises";
import connectMongoose from "../lib/connectMongoose.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const connection = await connectMongoose();
console.log(`Connected to MongoDB: ${connection.name}`);

const answer = await question(
  "Are you sure you want to delete database collection? [y/N] "
);

if (answer.toLowerCase() !== "y") {
  console.log("Operation aborted");
  process.exit();
}

await initUsers();
await initProducts();
await connection.close();

/**
 * Functions
 */

async function initUsers() {
  /* Delete all users */

  const deleteResult = await User.deleteMany();
  console.log(`\nDELETED ${deleteResult.deletedCount} users`);

  /* Create users */

  const insertResult = await User.insertMany([
    {
      name: "admin",
      email: "admin@example.com",
      password: await User.hashPassword("1234"),
    },
    {
      name: "user1",
      email: "user1@example.com",
      password: await User.hashPassword("1234"),
    },
  ]);
  console.log(`INSERTED ${insertResult.length} users`);
}

async function initProducts() {
  /* Delete all products */

  const deleteResult = await Product.deleteMany();
  console.log(`DELETED ${deleteResult.deletedCount} products`);

  const [admin, user1] = await Promise.all([
    User.findOne({ email: "admin@example.com" }),
    User.findOne({ email: "user1@example.com" }),
  ]);

  /* Create products */

  const insertResult = await Product.insertMany([
    {
      name: "Lorem",
      price: 20,
      image: "product1.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Ipsum",
      price: 13.99,
      image: "product2.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Dolor sit",
      price: 9.95,
      image: "product3.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Amet",
      price: 35,
      image: "product4.jpg",
      owner: user1._id,
      tags: ["lifestyle"],
    },
    {
      name: "Consectetur",
      price: 66,
      image: "product5.jpg",
      owner: admin._id,
      tags: ["motor"],
    },
    {
      name: "Adiscing elit",
      price: 42.5,
      image: "product6.jpg",
      owner: user1._id,
      tags: ["mobile"],
    },
    {
      name: "Duis dignissim",
      price: 50,
      image: "product7.jpg",
      owner: admin._id,
      tags: ["work"],
    },
    {
      name: "Aliquet",
      price: 4,
      image: "product8.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Pellentesque",
      price: 7.99,
      image: "product9.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Vestibulum",
      price: 16,
      image: "product10.jpg",
      owner: admin._id,
      tags: ["work", "lifestyle", "mobile", "motor"],
    },
    {
      name: "Curibatur",
      price: 4200,
      image: "product11.jpg",
      owner: admin._id,
      tags: ["motor"],
    },
    {
      name: "Maecenas",
      price: 3,
      image: "product12.jpg",
      owner: admin._id,
      tags: ["mobile"],
    },
    {
      name: "Sed dapibus",
      price: 260,
      image: "product13.jpg",
      owner: admin._id,
      tags: ["mobile"],
    },
    {
      name: "Metus",
      price: 899,
      image: "product14.jpg",
      owner: admin._id,
      tags: ["work", "lifestyle"],
    },
    {
      name: "At lobortis",
      price: 144.95,
      image: "product15.jpg",
      owner: admin._id,
      tags: ["motor"],
    },
    {
      name: "Auctor",
      price: 300,
      image: "product16.jpg",
      owner: admin._id,
      tags: ["lifestyle", "mobile"],
    },
  ]);
  console.log(`INSERTED ${insertResult.length} products`);
}

async function question(prompt) {
  const ifc = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const result = await ifc.question(prompt);

  ifc.close();

  return result;
}
