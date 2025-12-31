# Math Calculation API - Backend

A RESTful API for managing mathematical calculations with a tree-based structure. Built with Express.js, TypeScript, PostgreSQL, and Prisma ORM with JWT authentication.

## 🏗️ Architecture

This project follows a **layered architecture** pattern for separation of concerns and maintainability:

```
┌─────────────────────────────────────────────────────────┐
│                     HTTP Requests                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Routes Layer                            │
│  - Define API endpoints and HTTP methods                │
│  - Apply middleware (validation, authentication)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               Controllers Layer                          │
│  - Handle HTTP requests and responses                    │
│  - Validate input and format output                      │
│  - Delegate business logic to services                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                Services Layer                            │
│  - Implement business logic                              │
│  - Orchestrate data operations                           │
│  - Handle complex calculations and validations           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Repositories Layer                          │
│  - Abstract database operations                          │
│  - Provide CRUD operations                               │
│  - Use Prisma Client for database access                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Data Layer (PostgreSQL)                     │
│  - Store users and calculation nodes                     │
│  - Enforce data integrity and relationships              │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema and models
│   └── migrations/        # Database migration files
├── src/
│   ├── config/           # Configuration files (auth, database)
│   ├── controllers/      # HTTP request handlers
│   │   ├── AuthController.ts
│   │   ├── CalculationController.ts
│   │   └── UserController.ts
│   ├── services/         # Business logic layer
│   │   ├── AuthService.ts
│   │   ├── CalculationService.ts
│   │   └── UserService.ts
│   ├── repositories/     # Data access layer (CRUD operations)
│   │   ├── UserRepository.ts
│   │   └── CalculationRepository.ts
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── calculationRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── index.ts
│   ├── middleware/       # Custom middleware
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── validators.ts
│   ├── types/            # TypeScript type definitions
│   ├── models/           # Data models and validation
│   ├── data/             # Database connection utilities
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── Dockerfile            # Docker configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## 📊 Database Models

### Entity Relationship Diagram (ERD)

![Database ERD](./ERD-tables.png)

### Database Schema

The application uses **PostgreSQL** with **Prisma ORM** for type-safe database access.

#### Users Table (`users`)

Stores user account information and authentication credentials.

| Field           | Type        | Description                  | Constraints      |
| --------------- | ----------- | ---------------------------- | ---------------- |
| `id`            | UUID        | Unique user identifier       | Primary Key      |
| `username`      | VARCHAR(50) | Unique username for login    | Unique, Not Null |
| `password_hash` | TEXT        | Bcrypt hashed password       | Not Null         |
| `avatar_url`    | TEXT        | URL to user's avatar image   | Nullable         |
| `role`          | ENUM        | User role: `user` or `admin` | Default: `user`  |
| `created_at`    | TIMESTAMP   | Account creation timestamp   | Default: now()   |

**Relationships:**

- One user can have many calculation nodes (1:N)

#### Calculation Nodes Table (`calculation_nodes`)

Stores calculation operations in a tree structure where each node represents a mathematical operation.

| Field              | Type      | Description                                         | Constraints           |
| ------------------ | --------- | --------------------------------------------------- | --------------------- |
| `id`               | UUID      | Unique node identifier                              | Primary Key           |
| `root_id`          | UUID      | Reference to the root node of the tree              | Foreign Key, Nullable |
| `parent_id`        | UUID      | Reference to the parent node                        | Foreign Key, Nullable |
| `operation`        | ENUM      | Operation type: `START`, `ADD`, `SUB`, `MUL`, `DIV` | Not Null              |
| `input_value`      | DOUBLE    | The input value for this operation                  | Not Null              |
| `calculated_value` | DOUBLE    | The result after applying the operation             | Not Null              |
| `user_id`          | UUID      | Reference to the user who created this node         | Foreign Key, Not Null |
| `created_at`       | TIMESTAMP | Node creation timestamp                             | Default: now()        |

**Relationships:**

- Each node belongs to one user (N:1)
- Each node can have one parent node (N:1, self-referential)
- Each node can have multiple children nodes (1:N, self-referential)
- Each node belongs to one root node (N:1, self-referential)

**Indexes:**

- `idx_calculation_nodes_root_id` on `root_id`
- `idx_calculation_nodes_parent_id` on `parent_id`
- `idx_calculation_nodes_user_id` on `user_id`

**Cascade Deletion:**

- When a user is deleted, all their calculation nodes are deleted
- When a parent node is deleted, all its children are deleted
- When a root node is deleted, all nodes in that tree are deleted

### Enums

#### Role

```typescript
enum Role {
  user   // Regular user with standard permissions
  admin  // Administrator with elevated permissions
}
```

#### OperationType

```typescript
enum OperationType {
  START  // Initial value (root node)
  ADD    // Addition operation
  SUB    // Subtraction operation
  MUL    // Multiplication operation
  DIV    // Division operation
}
```

## 📚 API Endpoints

Base URL: `http://localhost:5000/api`

### Health Check

#### `GET /health`

Check if the API is running.

**Access:** Public

**Response:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-31T20:58:48.000Z"
}
```

---

### Authentication

#### `POST /auth/register`

Register a new user account.

**Access:** Public

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "SecurePassword123!",
  "avatarUrl": "https://example.com/avatar.jpg" // Optional
}
```

**Validation:**

- `username`: 3-50 characters, alphanumeric with underscores
- `password`: Minimum 6 characters
- `avatarUrl`: Valid URL (optional)

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "role": "user",
      "created_at": "2025-12-31T20:58:48.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

#### `POST /auth/login`

Login with username and password.

**Access:** Public

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Users

All user endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### `GET /users/profile`

Get current user's profile.

**Access:** Private (Authenticated users)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "role": "user",
    "created_at": "2025-12-31T20:58:48.000Z"
  }
}
```

---

#### `PUT /users/profile`

Update current user's profile.

**Access:** Private (Authenticated users)

**Request Body:**

```json
{
  "username": "new_username", // Optional
  "password": "NewPassword123!", // Optional
  "avatarUrl": "https://new.jpg" // Optional
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "new_username",
    "avatar_url": "https://new.jpg",
    "role": "user",
    "created_at": "2025-12-31T20:58:48.000Z"
  }
}
```

---

#### `GET /users`

Get all users (admin only).

**Access:** Private (Admin only)

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "role": "user",
      "created_at": "2025-12-31T20:58:48.000Z"
    }
  ]
}
```

---

#### `DELETE /users/:id`

Delete a user account.

**Access:** Private (Own account or Admin)

**Success Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Calculations

#### `GET /calculations`

Get all calculation trees (public view).

**Access:** Public

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "root-node-uuid",
      "operation": "START",
      "input_value": 10,
      "calculated_value": 10,
      "user": {
        "username": "john_doe",
        "avatar_url": "https://example.com/avatar.jpg"
      },
      "created_at": "2025-12-31T20:58:48.000Z",
      "children": [
        {
          "id": "child-node-uuid",
          "operation": "ADD",
          "input_value": 5,
          "calculated_value": 15,
          "user": {
            "username": "jane_doe",
            "avatar_url": "https://example.com/avatar2.jpg"
          },
          "created_at": "2025-12-31T21:00:00.000Z",
          "children": []
        }
      ]
    }
  ]
}
```

---

#### `POST /calculations/start`

Start a new calculation tree.

**Access:** Private (Authenticated users)

**Request Body:**

```json
{
  "initialValue": 10
}
```

**Validation:**

- `initialValue`: Must be a number

**Success Response (201):**

```json
{
  "success": true,
  "message": "Calculation started successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "root_id": "550e8400-e29b-41d4-a716-446655440000",
    "parent_id": null,
    "operation": "START",
    "input_value": 10,
    "calculated_value": 10,
    "user_id": "user-uuid",
    "created_at": "2025-12-31T20:58:48.000Z"
  }
}
```

---

#### `POST /calculations/add-operation`

Add an operation to an existing calculation tree.

**Access:** Private (Authenticated users)

**Request Body:**

```json
{
  "parentId": "parent-node-uuid",
  "operation": "ADD",
  "inputValue": 5
}
```

**Validation:**

- `parentId`: Must be a valid UUID
- `operation`: Must be one of: `ADD`, `SUB`, `MUL`, `DIV`
- `inputValue`: Must be a number
- For `DIV` operation, `inputValue` cannot be 0

**Success Response (201):**

```json
{
  "success": true,
  "message": "Operation added successfully",
  "data": {
    "id": "new-node-uuid",
    "root_id": "root-node-uuid",
    "parent_id": "parent-node-uuid",
    "operation": "ADD",
    "input_value": 5,
    "calculated_value": 15,
    "user_id": "user-uuid",
    "created_at": "2025-12-31T21:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Cannot divide by zero"
}
```

---

#### `GET /calculations/user/me`

Get all calculations created by the current user.

**Access:** Private (Authenticated users)

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "root-node-uuid",
      "operation": "START",
      "input_value": 10,
      "calculated_value": 10,
      "created_at": "2025-12-31T20:58:48.000Z",
      "children": []
    }
  ]
}
```

---

#### `GET /calculations/:id`

Get a specific calculation tree by root ID.

**Access:** Private (Authenticated users)

**URL Parameters:**

- `id`: Root node UUID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "root-node-uuid",
    "operation": "START",
    "input_value": 10,
    "calculated_value": 10,
    "user": {
      "username": "john_doe",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "created_at": "2025-12-31T20:58:48.000Z",
    "children": [
      {
        "id": "child-node-uuid",
        "operation": "ADD",
        "input_value": 5,
        "calculated_value": 15,
        "user": {
          "username": "jane_doe",
          "avatar_url": "https://example.com/avatar2.jpg"
        },
        "created_at": "2025-12-31T21:00:00.000Z",
        "children": []
      }
    ]
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Calculation not found"
}
```

---

#### `DELETE /calculations/:id`

Delete a calculation tree.

**Access:** Private (Owner or Admin)

**URL Parameters:**

- `id`: Root node UUID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Calculation deleted successfully"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "You don't have permission to delete this calculation"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v16 or higher)
- npm or yarn

### Local Installation

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your settings:

   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/MathCalculation?schema=public
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Generate Prisma Client:**

   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations:**

   ```bash
   npm run prisma:migrate
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Docker Installation

See the [Docker Setup](#-docker-setup) section below for running with Docker Compose.

---

## 🐳 Docker Setup

### Running with Docker Compose

The easiest way to run the entire application (frontend, backend, and database) is using Docker Compose.

1. **Navigate to the project root:**

   ```bash
   cd task-2
   ```

2. **Start all services:**

   ```bash
   docker-compose up
   ```

   Or run in detached mode:

   ```bash
   docker-compose up -d
   ```

3. **Create database migrations** (first time setup):

   After the containers are running, execute:

   ```bash
   docker-compose exec backend npx prisma migrate dev --name init
   ```

   This will:

   - Create the database schema
   - Generate Prisma Client
   - Apply migrations to the database

4. **Access the services:**
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000
   - PostgreSQL: localhost:5433 (mapped from container's 5432)

### Docker Services

The `docker-compose.yml` defines three services:

- **db**: PostgreSQL 16 database
  - Port: 5433 (host) → 5432 (container)
  - Data persisted in `postgres_data` volume
- **backend**: Node.js/Express API
  - Port: 5000
  - Hot reload enabled via volume mounts
  - Waits for database health check
- **frontend**: Next.js application
  - Port: 3000
  - Hot reload enabled via volume mounts

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build

# Execute commands in backend container
docker-compose exec backend npm run prisma:studio
docker-compose exec backend npm run prisma:migrate

# Clean restart (removes volumes)
docker-compose down -v
docker-compose up --build
```

### Creating Migrations After Container Startup

If you make changes to the Prisma schema (`prisma/schema.prisma`), create a new migration:

```bash
# Create and apply migration
docker-compose exec backend npx prisma migrate dev --name your_migration_name

# Or just apply existing migrations
docker-compose exec backend npx prisma migrate deploy
```

---

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting

Configuration is in `.eslintrc.json` and `tsconfig.json`.

---

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### How it works:

1. User registers or logs in
2. Server returns a JWT token
3. Client includes token in subsequent requests

### Using the token:

Include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token expiration:

Tokens expire after 24 hours (configurable via `JWT_EXPIRES_IN` env variable).

---

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Start a calculation (replace TOKEN with your JWT)
curl -X POST http://localhost:5000/api/calculations/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"initialValue":10}'

# Add an operation (replace TOKEN and PARENT_ID)
curl -X POST http://localhost:5000/api/calculations/add-operation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"parentId":"PARENT_ID","operation":"ADD","inputValue":5}'
```

### Using Postman or Thunder Client

1. Import the endpoints
2. Set up environment variables for base URL and token
3. Test each endpoint with sample data

---

## 📦 Dependencies

### Production

- **express** - Web framework
- **@prisma/client** - Prisma ORM client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **helmet** - Security headers
- **cors** - CORS middleware
- **express-validator** - Request validation
- **dotenv** - Environment variables

### Development

- **typescript** - TypeScript compiler
- **prisma** - Prisma CLI
- **ts-node-dev** - TypeScript development server
- **eslint** - Code linting
- **@types/** - TypeScript type definitions

---

## 🔧 Troubleshooting

### Database connection issues

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. For Docker: Use `db:5432` (service name)
4. For local: Use `localhost:5432`

### Prisma issues

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database in browser
npm run prisma:studio
```

### Port already in use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

---

## 📝 License

ISC

---

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and architecture patterns.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
