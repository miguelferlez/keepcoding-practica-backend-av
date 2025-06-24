<p align="center">
<img src="./public/assets/app-logo.svg" width="320" alt="Nodepop">
</p>

**Nodepop** is a practice project of the **KeepCoding** module _Advanced Backend Development with Node.js_.

## 📌 Table of Contents

- [Description](#description)
- [Author](#author)
- [Installation](#installation)
- [Usage](#usage)

## Description

**Nodepop** is a testing SSR web application for second hand goods storage service.

Users can log in and, once authenticated, get a paginated list of only owned products, upload product composed by name, price, image (optional) and given tags (optional), filter products by name, price min and max and tags via URL and product persistent deletion. API endpoints are also available to test.

Product images are locally storaged alongside their resized thumbnail version once the product is created.

This app has been localized in English and Spanish.

## Installation

Clone this repository and install its dependencies with:

```sh
git clone https://github.com/miguelferlez/keepcoding-practica-backend-av.git
cd keepcoding-practica-backend-av
npm install
```

Copy environment variables from `.env.example` to `.env`:

```sh
cp .env.example .env
```

Make sure to **check the new .env values** to match your configuration.

Use a cloud provider like [MongoDB Atlas](https://www.mongodb.com/atlas) or install and set up [MongoDB](https://www.mongodb.com/try) instance:

- Windows: install .exe
- Linux/Mac:
  ```sh
  cd to/mongodb
  mkdir data
  ./bin/mongod --dbpath ./data
  ```

(Optional) On **first deploy**, initialize the database with required collections:

```sh
npm run initDB
```

## Usage

Start a single instance or in development mode:

```sh
npm start
# or
npm run dev
```

Browse to http://localhost:3000 or the defined port at `.env` file.

Make use of testing users already defined in `bin/initDB.js`:

- `admin@example.com, 1234`
- `user1@example.com, 1234`

(Optional) Run TailwindCSS to apply custom styles in this project:

```sh
npm run style
```

### API

API endpoints available in http://localhost:3000/api-docs

- `/api/login`
  - **POST**: returns user's JSON Web Token after sending correct email and password to log in API.
- `/api/products`
  - **GET**: returns logged user's products JSON with filters (name, min, max, tags), sorting, pagination (skip, limit) and field selection. Authorization token required.
  - **POST**: returns created product JSON, form-data required for image file upload. Authorization token required.
- `/api/products/<productId>`
  - **GET**: returns existing product JSON. Authorization token required.
  - **PUT**: returns updated existing product JSON. Authorization token required.
  - **DELETE**: delete existing product. Authorization token required.

## Author

Miguel Fernández **@miguelferlez**
