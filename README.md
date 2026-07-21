# 💰 Finance Portfolio Tracker - Backend

A RESTful backend API for the **Finance Portfolio Tracker** application built using **Node.js, Express.js, Sequelize ORM, and PostgreSQL**.

The API allows users to securely manage their investment portfolio using JWT Authentication and provides CRUD operations along with a portfolio summary.

---

# Features

- User Registration & Login
- JWT Authentication
- Protected Routes
- Investment CRUD Operations
- Portfolio Summary
- PostgreSQL Database
- Sequelize ORM
- Request Validation using Joi
- Unit Testing with Jest & Supertest
- Pagination & Sorting Support
- Centralized Error Handling

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Joi Validation
- bcryptjs
- Jest
- Supertest

---

# Project Structure

```
backend/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── authController.js
│   ├── investmentController.js
│   └── portfolioController.js
│
├── middleware/
│   ├── auth.js
│   └── validation.js
│
├── migrations/
│   ├── migrate.js
│   └── seed.js
│
├── models/
│   ├── User.js
│   ├── Investment.js
│   └── index.js
│
├── routes/
│   ├── authRoutes.js
│   ├── investmentRoutes.js
│   ├── portfolioRoutes.js
│   └── index.js
│
├── services/
│   ├── authService.js
│   └── investmentService.js
│
├── tests/
│   ├── auth.test.js
│   └── investment.test.js
│
├── utils/
│   └── errorHandler.js
│
├── server.js
├── package.json
└── README.md
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <https://github.com/Harsh-Kumar-Mishra2006/Finance_Portfolio_Tracker>
```

```bash
cd Finance_Portfolio_Tracker/backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 4. Create PostgreSQL Database

Create a database named

```
finance_tracker
```

or update the database name in your `.env`.

---

## 5. Run Database Migration

```bash
npm run migrate
```

---

## 6. (Optional) Seed Sample Data

```bash
npm run seed
```

Default Test User

```
Email:
test@example.com

Password:
password123
```

---

## 7. Start Development Server

```bash
npm run dev
```

Server starts at

```
http://localhost:5000
```

---

## Production

```bash
npm start
```

---

# Environment Variables

| Variable      | Description                            |
| ------------- | -------------------------------------- |
| PORT          | Server Port                            |
| NODE_ENV      | development / production               |
| DB_HOST       | PostgreSQL Host                        |
| DB_PORT       | PostgreSQL Port                        |
| DB_DATABASE   | Database Name                          |
| DB_USER       | Database Username                      |
| DB_PASSWORD   | Database Password                      |
| DATABASE_URL  | PostgreSQL Connection URL (Production) |
| JWT_SECRET    | Secret key used to sign JWT Tokens     |
| JWT_EXPIRE    | Token Expiry (Example: 7d)             |
| BCRYPT_ROUNDS | Password Hashing Salt Rounds           |
| CLIENT_URL    | Frontend URL                           |
| API_URL       | Backend Base URL                       |

---

# API Documentation

Base URL

```
http://localhost:5000/api
```

---

# Authentication

## Register User

### POST

```
/auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {},
    "token": "JWT_TOKEN"
  }
}
```

---

## Login

### POST

```
/auth/login
```

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "token": "JWT_TOKEN"
  }
}
```

---

## Get Current User

### GET

```
/auth/me
```

### Headers

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Investments

> All Investment APIs require Authentication.

---

## Create Investment

### POST

```
/investments
```

### Headers

```
Authorization: Bearer <JWT_TOKEN>
```

### Request

```json
{
  "investment_name": "HDFC Flexi Cap Fund",
  "investment_type": "Mutual Fund",
  "invested_amount": 10000,
  "current_value": 12000,
  "purchase_date": "2026-06-01"
}
```

---

## Get All Investments

### GET

```
/investments
```

### Optional Query Parameters

| Parameter | Description       |
| --------- | ----------------- |
| limit     | Number of records |
| offset    | Pagination Offset |
| sortBy    | Field Name        |
| order     | ASC / DESC        |

Example

```
/investments?limit=10&offset=0&sortBy=created_at&order=DESC
```

---

## Get Investment By ID

### GET

```
/investments/:id
```

---

## Update Investment

### PUT

```
/investments/:id
```

### Request

```json
{
  "current_value": 14500
}
```

---

## Delete Investment

### DELETE

```
/investments/:id
```

---

# Portfolio Summary

## GET

```
/portfolio/summary
```

### Headers

```
Authorization: Bearer <JWT_TOKEN>
```

### Response

```json
{
  "success": true,
  "data": {
    "totalInvested": 50000,
    "currentValue": 62000,
    "profit": 12000,
    "profitPercentage": 24
  }
}
```

---

# Health Check

## GET

```
/health
```

Returns

```json
{
  "status": "OK",
  "environment": "development"
}
```

---

# Running Tests

Run all tests

```bash
npm test
```

Watch Mode

```bash
npm run test:watch
```

---

# Error Response Format

```json
{
  "success": false,
  "error": "Error Message"
}
```

---

# Authentication

Protected endpoints require a JWT token.

Example:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# Sample Investment Types

- Mutual Fund
- Stock
- Bond
- ETF
- Fixed Deposit
- Real Estate
- Other

---

# Deployment

The backend is production-ready and supports deployment on platforms such as:

- Render
- Railway
- Heroku
- Any Node.js hosting service with PostgreSQL support

---

# Author

**Harsh Kumar Mishra**

Finance Portfolio Tracker Backend API
