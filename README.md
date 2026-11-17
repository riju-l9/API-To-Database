# User Authentication API (Node.js + Express + PostgreSQL)

A RESTful authentication backend built with **Node.js**, **Express**, and **PostgreSQL**, featuring parameterized SQL queries, duplicate user checks, and **bcrypt** password hashing.

## Tech Stack
- **Runtime & Framework:** Node.js, Express.js
- **Database:** PostgreSQL (`pg` connection pool)
- **Security:** `bcryptjs` password hashing, `dotenv` environment configuration

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/user/register` | Validates fields, checks for existing username/email, hashes password, and creates a new user |
| `POST` | `/user/login` | Verifies credentials against hashed password in PostgreSQL and returns user info |

## Setup & Run Locally

1. **Install dependencies**
   ```bash
   npm install express pg bcryptjs dotenv
