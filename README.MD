# Store API

A robust and feature-rich API built with Express and MongoDB, designed to efficiently manage store-related data such as products, orders, users, and reviews. The API includes secure user authentication, role-based access control, and a suite of CRUD operations to facilitate seamless data management. It also implements essential security measures and performance enhancements, making it ideal for managing e-commerce or store-related operations

## API Reference

#### Auth Routes

```http
 POST /api/v1/auth/signup
```

```http
 POST /api/v1/auth/login
```

```http
 POST /api/v1/auth/verify-email
```

```http
 POST /api/v1/auth/reset-password
```

#### Orders Routes

```http
 GET /api/v1/orders
```

```http
 POST /api/v1/orders
```

```http
 GET /api/v1/orders/my-orders
```

```http
 GET /api/v1/orders/:id
```

```http
 PATCH /api/v1/orders/:id
```

```http
 DELETE /api/v1/orders/:id
```

#### Products Routes

```http
 GET /api/v1/products
```

```http
 POST /api/v1/products
```

```http
 POST /api/v1/products/upload
```

```http
 GET /api/v1/products/top-products
```

```http
 GET /api/v1/products/products-stats
```

```http
 GET /api/v1/products/:id
```

```http
 PATCH /api/v1/products/:id
```

```http
 DELETE /api/v1/products/:id
```

#### Reviews Routes

```http
  GET /api/v1/reviews
```

```http
  POST /api/v1/reviews
```

```http
  GET /api/v1/reviews/:id
```

```http
  PATCH /api/v1/reviews/:id
```

```http
  POST /api/v1/reviews/:id
```

#### Users Routes

```http
 GET /api/v1/users
```

```http
 GET /api/v1/users/me
```

```http
 PATCH /api/v1/users/updatePassword
```

```http
 PATCH /api/v1/users/updateMe
```

```http
 POST /api/v1/users/deleteMe
```

```http
 GET /api/v1/users/:id
```

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

| Variable             | Description                                         |
| -------------------- | --------------------------------------------------- |
| `PORT`               | The port number on which the server will run        |
| `MONGO_PASSWORD`     | MongoDB user password                               |
| `MONGO_URI`          | MongoDB connection string                           |
| `JWT_SECRET`         | Secret key for signing JWT access tokens            |
| `MAX_FILE_UPLOAD`    | Maximum file upload size (default: `1048576` bytes) |
| `JWT_REFRESH_SECRET` | Secret key for signing JWT refresh tokens           |

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
