# Store API

A robust and feature-rich API built with Express and MongoDB, designed to efficiently manage store-related data such as products, orders, users, and reviews. The API includes secure user authentication, role-based access control, and a suite of CRUD operations to facilitate seamless data management. It also implements essential security measures and performance enhancements, making it ideal for managing e-commerce or store-related operations

## API Reference

#### Auth Routes

- **POST** `/api/v1/auth/signup`: Register a new user
- **POST** `/api/v1/auth/login`: Log in an existing user
- **POST** `/api/v1/auth/verify-email`: Verify user's email
- **POST** `/api/v1/auth/reset-password`: Reset the user's password

#### Orders Routes

- **GET** `/api/v1/orders`: Get all orders (Admin only)
- **POST** `/api/v1/orders`: Create a new order
- **GET** `/api/v1/orders/my-orders`: Get the current user's orders
- **GET** `/api/v1/orders/:id`: Get a specific order by ID
- **PATCH** `/api/v1/orders/:id`: Update a specific order (Admin only)
- **DELETE** `/api/v1/orders/:id`: Delete a specific order by ID

#### Products Routes

- **GET** `/api/v1/products`: Get all products
- **POST** `/api/v1/products`: Create a new product
- **POST** `/api/v1/products/upload`: Upload product images
- **GET** `/api/v1/products/top-products`: Get the top products
- **GET** `/api/v1/products/products-stats`: Get product statistics
- **GET** `/api/v1/products/:id`: Get a specific product by ID
- **PATCH** `/api/v1/products/:id`: Update a specific product (Admin only)
- **DELETE** `/api/v1/products/:id`: Delete a specific product (Admin only)

#### Reviews Routes

- **GET** `/api/v1/reviews`: Get all reviews
- **POST** `/api/v1/reviews`: Create a new review
- **GET** `/api/v1/reviews/:id`: Get a specific review by ID
- **PATCH** `/api/v1/reviews/:id`: Update a specific review
- **DELETE** `/api/v1/reviews/:id`: Delete a specific review

#### Users Routes

- **GET** `/api/v1/users`: Get all users (Admin only)
- **GET** `/api/v1/users/me`: Get the currently logged-in user's details
- **PATCH** `/api/v1/users/updatePassword`: Update the current user's password
- **PATCH** `/api/v1/users/updateMe`: Update the current user's details
- **POST** `/api/v1/users/deleteMe`: Deactivate the current user's account
- **GET** `/api/v1/users/:id`: Get a specific user by ID

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB, Mongoose

**Third parties:** bcryptjs, jsonwebtoken, nodemailer, uuid, cookie-parser, nodemon, cors, http-status-codes, morgan, helmetexpress-mongo-sanitize

## Run Locally

Clone the project

```bash
  git clone git@github.com:EnigmaXV/Store-API.git
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Start the server in production

```bash
  npm run prod
```

Import Products

```bash
  npm run import-products
```

Delete Products

```bash
  npm run delete-products
```

Import Orders

```bash
  npm run import-orders
```

Delete Orders

```bash
  npm run delete-orders
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

| Variable             | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `PORT`               | The port number on which the server will run (default: `5000`) |
| `MONGO_PASSWORD`     | MongoDB user password                                          |
| `MONGO_URI`          | MongoDB connection string                                      |
| `JWT_SECRET`         | Secret key for signing JWT access tokens                       |
| `MAX_FILE_UPLOAD`    | Maximum file upload size (default: `1048576` bytes)            |
| `JWT_REFRESH_SECRET` | Secret key for signing JWT refresh tokens                      |

## Features

- All CRUD operations
- User Authentication (sign up, login, logout)
- User Authorization
- Email verification
- Password reset functionality
- Sending multiple cookies
- Hashing passwords
- Aggregation pipeline
- Locking user email after 5 failed login attempts
- Upload Images
