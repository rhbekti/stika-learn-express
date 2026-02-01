# Stika Learn Express API

A RESTful API built with Express, Prisma, and PostgreSQL for managing users and authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [API Endpoints List](#api-endpoints-list)

## Prerequisites

- Node.js (v18 or higher)
- Yarn (v1.22 or higher)
- PostgreSQL Database

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/stika-learn/stika-learn-express.git
   cd stika-learn-express
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

## Configuration

1. **Environment Variables**
   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

2. **Update `.env`**
   Open `.env` and set your configuration:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/stika_learn_express?schema=public"
   JWT_SECRET="your_super_secret_key"
   CORS_ORIGIN="http://localhost:3000"
   ```

## Database Setup

1. **Run Migrations**
   Initialize the database schema:

   ```bash
   npx prisma migrate dev --name init
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## Running the Application

- **Development Mode** (with Nodemon and Dotenvx)

  ```bash
  yarn dev
  ```

- **Production Mode**
  ```bash
  yarn start
  ```

The server will start at `http://localhost:3000` (or your configured PORT).

## Testing

Run the test suite using Jest:

```bash
yarn test
```

Tests cover:

- Authentication (Login/Register)
- User CRUD operations
- Health Check

## API Documentation

Interactive API documentation is available via Swagger UI when the server is running:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

## API Endpoints List

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and receive JWT token

### Users

_Requires Bearer Token Authorization_

- `GET /api/users` - Get all users
- `POST /api/user` - Create a new user (Admin)
- `GET /api/user/:id` - Get user details by ID
- `PUT /api/user/:id` - Update user details
- `DELETE /api/user/:id` - Delete a user

## Project Structure

```
stika-learn-express/
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares (Auth, etc.)
├── prisma/         # Database schema and migrations
├── routes/         # API Route definitions
├── test/           # Jest test files
├── utils/          # Utilities and validators
├── index.js        # Application entry point
└── swagger.json    # OpenAPI definition
```
