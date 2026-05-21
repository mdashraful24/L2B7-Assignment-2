# DevPulse

## Live URL
- Local development: `http://localhost:<PORT>`
- Production deployment: `https://l2-b7-assignment-02.vercel.app`

## Overview
DevPulse is a TypeScript-based Express API for user authentication and issue tracking. It supports role-based access control, JWT authentication, and PostgreSQL persistence.

## Features
- User signup and login with hashed passwords
- JWT-based authentication
- Role-based access control for contributors and maintainers
- Create, read, update, and delete issues
- Issue filtering and sorting
- Global error handling middleware
- PostgreSQL database initialization on startup

## Tech Stack
- Node.js
- TypeScript
- Express
- PostgreSQL
- bcryptjs
- JSON Web Tokens (`jsonwebtoken`)
- dotenv
- tsx / tsup

## Setup
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file at the project root
4. Define required environment variables
   ```env
   CONNECTION_STRING=postgres://user:password@host:port/database
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```
5. Run locally
   ```bash
   npm run dev
   ```

## API Endpoints
### Health
- `GET /`
  - Returns a simple health response from the API.

### Authentication
- `POST /api/auth/signup`
  - Registers a new user.
  - Body: `{ name, email, password, role? }`
  - Default role: `contributor`

- `POST /api/auth/login`
  - Logs in an existing user.
  - Body: `{ email, password }`
  - Response includes a JWT access token and user data.

### Issues
- `POST /api/issues`
  - Create a new issue.
  - Protected: `contributor`, `maintainer`
  - Header: `Authorization: <token>`
  - Body: `{ title, description, type, status? }`

- `GET /api/issues`
  - Retrieve all issues.
  - Supports query filters:
    - `type`
    - `status`
    - `sort` (`oldest` or default newest)

- `GET /api/issues/:id`
  - Retrieve a single issue by ID.

- `PATCH /api/issues/:id`
  - Update an issue.
  - Protected: `contributor`, `maintainer`
  - Contributors may update only their own open issues.
  - Body may include any of: `{ title, description, type, status }`

- `DELETE /api/issues/:id`
  - Delete an issue.
  - Protected: `maintainer`

## Authentication
- Use JWT in `Authorization` header
- Token is issued on login and is valid for 1 day
- Example header:
  ```http
  Authorization: <your-jwt-token>
  ```

## Database Schema Summary
### `users`
- `id`: serial primary key
- `name`: string, required
- `email`: string, unique, required
- `password`: hashed string, required
- `role`: string, default `contributor`
- `created_at`: timestamp, defaults to now
- `updated_at`: timestamp, defaults to now

### `issues`
- `id`: serial primary key
- `title`: string, required
- `description`: string, required
- `type`: string, required
- `status`: string, default `open`
- `reporter_id`: integer, stores the ID of the reporting user
- `created_at`: timestamp, defaults to now
- `updated_at`: timestamp, defaults to now

## Notes
- Database tables are created automatically when the server starts.
- Ensure `CONNECTION_STRING` points to a valid PostgreSQL database before launching the app.
