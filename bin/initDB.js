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
  console.log(`\nDELETE ${deleteResult.deletedCount} users`);

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
  console.log(`POST ${insertResult.length} users`);
}

async function initProducts() {
  /* Delete all products */

  const deleteResult = await Product.deleteMany();
  console.log(`DELETE ${deleteResult.deletedCount} products`);

  const [admin, user1] = await Promise.all([
    User.findOne({ email: "admin@example.com" }),
    User.findOne({ email: "user1@example.com" }),
  ]);

  /* Create products */

  const insertResult = await Product.insertMany([
    {
      name: "Lorem",
      price: 20,
      image: "./images/product1-1.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Ipsum",
      price: 13.99,
      image: "./images/product2-1.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Dolor sit",
      price: 9.95,
      image: "./images/product3-1.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Amet",
      price: 35,
      image: "./images/product4-1.jpg",
      owner: user1._id,
      tags: ["lifestyle"],
    },
    {
      name: "Consectetur",
      price: 66,
      image: "./images/product5-1.jpg",
      owner: admin._id,
      tags: ["motor"],
    },
    {
      name: "Adiscing elit",
      price: 42.5,
      image: "./images/product6-1.jpg",
      owner: user1._id,
      tags: ["mobile"],
    },
    {
      name: "Duis dignissim",
      price: 50,
      image: "./images/product7-1.jpg",
      owner: admin._id,
      tags: ["work"],
    },
    {
      name: "Aliquet",
      price: 4,
      image: "./images/product8-1.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Pellentesque",
      price: 7.99,
      image: "./images/product9-1.jpg",
      owner: admin._id,
      tags: ["lifestyle"],
    },
    {
      name: "Vestibulum",
      price: 16,
      image: "./images/product10-1.jpg",
      owner: admin._id,
      tags: ["work, lifestyle, mobile"],
    },
    {
      name: "Curibatur",
      price: 4200,
      image: "./images/product11-1.jpg",
      owner: admin._id,
      tags: ["motor"],
    },
    {
      name: "Maecenas",
      price: 3,
      image: "./images/product12-1.jpg",
      owner: admin._id,
      tags: ["mobile"],
    },
    {
      name: "Sed dapibus",
      price: 260,
      image: "./images/product13-1.jpg",
      owner: admin._id,
      tags: ["mobile"],
    },
    {
      name: "Metus",
      price: 899,
      image: "./images/product14-1.jpg",
      owner: admin._id,
      tags: ["work, lifestyle"],
    },
    {
      name: "At lobortis",
      price: 144.95,
      image: "./images/product15-1.jpg",
      owner: admin._id,
      tags: ["motor"],
    },
    {
      name: "Auctor",
      price: 300,
      image: "./images/product16-1.jpg",
      owner: admin._id,
      tags: ["lifestyle, mobile"],
    },
  ]);
  console.log(`POST ${insertResult.length} products`);
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
