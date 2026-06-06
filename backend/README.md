# Course Booking Application - Backend API

## Overview

This is the backend REST API for the Course Booking System built using Node.js, Express.js, MongoDB Atlas, and JWT Authentication.

The API manages:

* User Authentication
* User Profiles
* Course Management
* Course Enrollment

---

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Token (JWT)
* bcrypt
* dotenv
* cors

---

## Installation

Install dependencies:

```bash
npm install
```

Run development server:

```bash
node index.js
```

or

```bash
npm start
```

---

## Environment Variables

Create a `.env` file:

```env
MONGODB_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
PORT=4000
```

---

## API Endpoints

### User Routes

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /users/register       |
| POST   | /users/login          |
| GET    | /users/details        |
| PUT    | /users/profile        |
| PUT    | /users/reset-password |

### Course Routes

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /courses/addCourse    |
| GET    | /courses/all          |
| GET    | /courses/active       |
| GET    | /courses/specific/:id |
| PUT    | /courses/:id/archive  |
| PUT    | /courses/:id/activate |
| PUT    | /courses/update/:id   |

### Enrollment Routes

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | /enrollments/enroll         |
| GET    | /enrollments/my-enrollments |

---

## Authentication

Protected routes use JWT Bearer Authentication:

```http
Authorization: Bearer <token>
```

---

## Deployment

Backend is deployed using:

* Render

Database:

* MongoDB Atlas

---

## Author

Chinee Bermoy Marasigan
