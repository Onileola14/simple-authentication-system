# Simple Authentication System

A JWT-based authentication and role-based access control (RBAC) API built with
Express and MongoDB (Mongoose). Supports registration, login/logout,
role-protected routes, and self-service profile/password updates.

## Features

- Register / login / logout with JWT stored in an `httpOnly`, signed cookie
- Passwords hashed with `bcryptjs` before saving
- Role-based access control (`admin` / `user`) — the first account created
  becomes admin automatically; every account after that is a regular user
- Users can view/update their own profile; admins can view any user
- Dedicated password-change endpoint (separate from general profile updates)
- Request validation on register/login/update routes via `express-validator`
- Rate limiting on `/register` and `/login` to slow down brute-force attempts
- Security headers via `helmet`, CORS enabled via `cors`

## Tech stack

- Node.js / Express 5
- MongoDB / Mongoose
- jsonwebtoken, bcryptjs, cookie-parser
- express-validator, express-rate-limit, helmet, cors

## Getting started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB connection string — either a local MongoDB instance or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
git clone https://github.com/Onileola14/simple-authentication-system.git
cd simple-authentication-system
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_LIFETIME=1d
PORT=3000
NODE_ENV=development
```

| Variable       | Description                                               |
| -------------- | ----------------------------------------------------------- |
| `MONGO_URI`    | MongoDB connection string                                  |
| `JWT_SECRET`   | Secret used to sign JWTs and signed cookies — keep this private |
| `JWT_LIFETIME` | How long issued tokens stay valid, e.g. `1d`, `12h`         |
| `PORT`         | Port the server listens on (defaults to `3000` if unset)    |
| `NODE_ENV`     | Set to `production` to enable secure cookies                |

### Run

```bash
node app.js
```

The API will be available at `http://localhost:3000`.

## API Reference

Base URL: `/api/v2`

Authenticated routes expect the JWT cookie set by `/auth/login` or
`/auth/register` — no `Authorization` header is used, requests just need to
include cookies (e.g. `credentials: "include"` from the browser, or a cookie
jar in tools like Postman/curl).

### Auth routes (`/api/v2/auth`)

| Method | Endpoint    | Description                                   | Auth required |
| ------ | ----------- | ---------------------------------------------- | -------------- |
| POST   | `/register` | Create an account                              | No             |
| POST   | `/login`    | Log in, sets the auth cookie                   | No             |
| GET    | `/logout`   | Clears the auth cookie                         | No             |

`/register` and `/login` are rate-limited (10 requests per IP per 15 minutes).

**POST `/register`**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "at-least-6-characters"
}
```
`role` is not accepted from the client — it's assigned automatically
(`admin` for the very first user, `user` for everyone else).

**POST `/login`**
```json
{
  "email": "jane@example.com",
  "password": "at-least-6-characters"
}
```

### User routes (`/api/v2/user`)

| Method | Endpoint        | Description                          | Auth required        |
| ------ | --------------- | ------------------------------------- | --------------------- |
| GET    | `/`             | List all non-admin users              | Yes — admin only      |
| GET    | `/:id`          | Get a single user                     | Yes — self or admin   |
| PATCH  | `/:id`          | Update `name` / `email`               | Yes — self or admin   |
| PATCH  | `/:id/password` | Change password                       | Yes — self or admin   |
| DELETE | `/:id`          | Delete a user                         | Yes — self or admin   |

**PATCH `/:id`** only accepts `name` and `email` — `role` and `password`
cannot be changed through this route.

**PATCH `/:id/password`**
```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password-min-6-chars"
}
```

## Project structure

```
├── app.js                     # App entry point
├── db/connectDB.js            # Mongoose connection
├── controllers/
│   ├── auth.js                # register, login, logout
│   └── user.js                # get/update/delete users, change password
├── middlewares/
│   ├── authenticateUser.js    # JWT auth + role-based authorization
│   ├── error-handler.js
│   ├── notFound.js
│   ├── rateLimiter.js         # express-rate-limit config
│   └── validators.js          # express-validator chains
├── models/User.js             # Mongoose schema, password hashing
├── routes/
│   ├── authRoute.js
│   └── userRoute.js
├── utils/
│   ├── checkPermission.js     # self-or-admin access check
│   ├── createTokenUser.js     # shape of the JWT payload
│   └── jwt.js                 # sign/verify JWT, attach cookie
└── errors/                    # custom error classes
```

## Security notes

- Passwords are hashed with `bcryptjs` before being saved; the password
  field is never returned in API responses.
- JWTs are stored in an `httpOnly`, signed cookie rather than being returned
  in the response body, reducing exposure to XSS.
- `cors()` is currently open to all origins — restrict this to your
  frontend's URL before deploying to production.
- No password reset / email verification flow is implemented yet.