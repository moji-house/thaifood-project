# Thai Street Food Delivery Platform

A comprehensive online platform for ordering Thai street food, built with React + TypeScript + Vite + Tailwind for the Frontend and Node.js + MySQL for the Backend.

## Features

### Frontend

- **Login/Register System**: Users can sign up and log in
- **Food Menu Display**: Browse food items with images, descriptions, and prices
- **Food Search**: Search and filter food items by categories
- **Shopping Cart**: Manage cart items and view order summary
- **Checkout System**: Place orders and view confirmations
- **Contact Us Page**: Support and issue reporting

### Backend

- **CRUD Operations**: Manage food items, users, and orders
- **RESTful API**: Endpoints for Frontend data operations
- **MySQL Database**: Data storage and management
- **JWT Authentication**: Secure user authentication system

## Tech Stack

### Frontend

- React with TypeScript
- Vite
- Tailwind CSS
- Axios
- Redux Toolkit
- React Router DOM

### Backend

- Node.js
- Express.js
- MySQL
- JWT
- Bcrypt
- CORS
- Dotenv

## Getting Started

### Prerequisites

- **Node.js**: Install the latest version of Node.js.
- **MySQL**: Install MySQL and set up a database.
- **Git**: Git to clone the repository.

### Installation

**Backend Setup**

```bash
cd backend
npm install

# Configure .env file
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key

npm start
```

**Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### User Routes

| Endpoint           | Method | Description       | Auth Required |
| ------------------ | ------ | ----------------- | ------------- |
| /api/user/register | POST   | Register new user | No            |
| /api/user/login    | POST   | User login        | No            |
| /api/user/logout   | POST   | User logout       | Yes           |
| /api/user/me       | GET    | Get user details  | Yes           |

### Product Routes

| Endpoint          | Method | Description       | Auth Required |
| ----------------- | ------ | ----------------- | ------------- |
| /api/products     | POST   | Create product    | Admin         |
| /api/products     | GET    | Get all products  | No            |
| /api/products/:id | GET    | Get product by ID | No            |
| /api/products/:id | PUT    | Update product    | Admin         |

## Dependencies

### Backend Dependencies

- express
- mysql2
- sequelize
- jsonwebtoken
- bcrypt
- cors
- dotenv
- nodemon

### Frontend Dependencies

- react
- react-dom
- react-router-dom
- redux
- axios
- tailwindcss
- typescript
- vite

## Contact

For questions or feedback:

- GitHub: [your-username](https://github.com/HeartThanakorn)
