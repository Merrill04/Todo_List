#  Todo List App

A full-stack Todo application built with a clean monorepo structure. Features JWT-based authentication, per-user todo management, and a modern dark UI.

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens), bcryptjs |

---

---

##  Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### `todos`

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users(id), ON DELETE CASCADE |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| completed | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

##  API Endpoints

### Auth — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response `201`:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

#### `POST /api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

### Todos — `/api/todos`
> All todo endpoints require the `Authorization: Bearer <token>` header.

#### `GET /api/todos`
Fetch all todos for the authenticated user.

**Response `200`:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2024-01-01T10:00:00.000Z"
  }
]
```

---

#### `POST /api/todos`
Create a new todo.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response `201`:** Returns the created todo object.

---

#### `PUT /api/todos/:id`
Update a todo's title, description, or completed status.

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response `200`:** Returns the updated todo object.

---

#### `DELETE /api/todos/:id`
Delete a todo by ID.

**Response `200`:**
```json
{
  "message": "Todo deleted"
}
```

---

##  Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-list-app.git
cd Todo_List
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_jwt_key
```

Create the database tables in PostgreSQL:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

##  Authentication Flow

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Server returns a signed **JWT token** (expires in 7 days)
3. Frontend stores the token in `localStorage`
4. All subsequent requests to `/api/todos` include the token in the `Authorization` header
5. The `authMiddleware` on the backend verifies the token before allowing access

---

##  Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
