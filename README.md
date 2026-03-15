# Todo App API (Express + JWT + SQLite)

A small backend Todo application built with Node.js and Express.

It includes:
- User registration and login
- JWT-based route protection
- Todo CRUD APIs per authenticated user
- In-memory SQLite database (resets on server restart)

## Tech Stack

- Node.js
- Express
- JSON Web Token (`jsonwebtoken`)
- Password hashing with `bcryptjs`
- SQLite via Node built-in `node:sqlite`

## Project Structure

```text
src/
	server.js
	db.js
	middleware/
		authMiddleware.js
	routes/
		authRoutes.js
		todoRoutes.js
public/
	index.html
```

## Prerequisites

- Node.js (version with support for `node:sqlite`)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
JWT_SECRET=your_super_secret_key
```

## Run the Server

```bash
npm run dev
```

Server base URL:

```text
http://localhost:8000
```

## API Endpoints

### Auth

1. Register

`POST /auth/register`

Request body:

```json
{
	"username": "raja2005",
	"password": "123123"
}
```

Response:

```json
{
	"token": "<jwt-token>"
}
```

2. Login

`POST /auth/login`

Request body:

```json
{
	"username": "raja2005",
	"password": "123123"
}
```

Response:

```json
{
	"token": "<jwt-token>"
}
```

### Todos (Protected)

All `/todos` routes require the `Authorization` header.

Example header value:

```text
Authorization: <jwt-token>
```

1. Get all todos

`GET /todos`

2. Create todo

`POST /todos`

Request body:

```json
{
	"task": "Finish the backend development"
}
```

3. Update todo completion

`PUT /todos/:id`

Request body:

```json
{
	"completed": 1
}
```

4. Delete todo

`DELETE /todos/:id`

## Quick Testing

Use the requests in `todo-app.rest` with VS Code REST Client extension, or use Postman/cURL.

## Notes

- The database runs in memory (`:memory:`), so data is not persisted after restart.
- A default todo is inserted when a user registers.
