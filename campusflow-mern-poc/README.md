# CampusFlow — Student Task & Assignment Manager

**A MERN Stack Proof of Concept (PoC)** built for the *Development of Proof of Concept – MERN Stack Application* rubric.

CampusFlow gives students a simple workspace for tracking assignments and study tasks by subject, due date, priority, and progress status. It demonstrates a full React → Express REST API → MongoDB data flow, all four CRUD operations, server-side validation, error handling, and basic automated tests.

## Features

- Create, read, edit, and delete assignments/tasks.
- Track a task through **Pending → In Progress → Completed**.
- Add a subject, description, due date, and Low/Medium/High priority.
- Search by task title, description, or subject; filter by status and priority; sort by due date, priority, or newest first.
- Dashboard totals, completion percentage, in-progress count, and outstanding high-priority tasks.
- Dedicated **Project guide** page that explains system architecture, REST endpoints, and sample viva questions.
- Server-side request validation, structured JSON responses, centralized error handling, Helmet security headers, CORS configuration, and API rate limiting.
- Optional sample data seed script and automated validation tests.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, Lucide icons, CSS |
| Backend | Node.js, Express 4, REST API |
| Database | MongoDB, Mongoose ODM |
| Validation / quality | Server-side validation helper, Node.js test runner |

## Project structure

```text
campusflow-mern-poc/
├── apps/
│   ├── backend/
│   │   ├── src/config/db.js
│   │   ├── src/controllers/tasks.controller.js
│   │   ├── src/middleware/errorHandler.js
│   │   ├── src/models/Task.js
│   │   ├── src/routes/tasks.routes.js
│   │   ├── src/utils/validateTask.js
│   │   ├── src/app.js
│   │   ├── src/server.js
│   │   └── test/validateTask.test.js
│   └── frontend/
│       └── src/
│           ├── components/       # Reusable task form, card and empty state
│           ├── pages/             # Dashboard and technical guide
│           ├── lib/api.js         # Centralized API client
│           ├── App.jsx
│           └── styles.css
├── docker-compose.yml             # Optional local MongoDB
└── README.md
```

## Run it locally

### 1. Prerequisites

Install **Node.js 20 or newer** and npm. You also need either a local MongoDB instance or a MongoDB Atlas database.

### 2. Configure MongoDB

**Option A — Local MongoDB with Docker Compose** (if Docker is installed and your account can use it):

```bash
docker compose up -d mongodb
```

The default connection string is `mongodb://127.0.0.1:27017/campusflow`.

**Option B — MongoDB Atlas:** create a database and database user in Atlas, allow your current IP in Network Access, and copy the connection string. Replace the username, password and database name as appropriate. Do not commit this URI to GitHub.

### 3. Configure and install the backend

From the project root:

```bash
cd apps/backend
cp .env.example .env
```

If you use Atlas, edit `MONGODB_URI` in `apps/backend/.env`. Then run:

```bash
npm install
npm run dev
```

The API starts at `http://localhost:5000`. Keep this terminal open. The server will stop with an actionable error if it cannot connect to MongoDB.

### 4. Start the React frontend

Open a **second terminal** from the project root:

```bash
cd apps/frontend
cp .env.example .env
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### 5. Add demonstration data (optional)

Once MongoDB is connected, open a **third terminal**:

```bash
cd apps/backend
npm run seed
```

The seed script inserts four sample assignments only when the task collection is empty. It will not overwrite existing work.

## API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/tasks` | List tasks; optional `q`, `status`, and `priority` query filters |
| GET | `/tasks/:id` | Retrieve one task |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update one or more task fields |
| DELETE | `/tasks/:id` | Delete a task |

### Example: create a task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Finish DBMS assignment","course":"Advanced DBMS","priority":"High","status":"Pending","dueDate":"2026-12-01"}'
```

### Example: filter tasks

```bash
curl 'http://localhost:5000/api/tasks?status=Pending&priority=High'
```

Successful responses use JSON such as `{ "success": true, "data": [...] }`. Validation failures return HTTP `400`; missing records return `404`; unexpected errors pass through centralized error handling.

## Testing and validation

Run the server-side validation unit tests:

```bash
cd apps/backend
npm test
```

The tests cover valid task input, too-short titles, unsupported priority/status values, and partial updates. For an end-to-end manual check, follow `docs/TESTING_CHECKLIST.md` and record actual results before submission. The automated validation tests do not replace testing against a running MongoDB instance.

## Suggested demo flow (3–5 minutes)

1. Open the dashboard and explain the project problem: students can lose track of deadlines across subjects.
2. Create a task with a subject, due date and high priority.
3. Edit it, change its status, search for it and filter the list.
4. Mark it completed and show the dashboard counts/progress update.
5. Delete a sample task to demonstrate all CRUD operations.
6. Open **Project guide** to explain the React → REST API → Mongoose → MongoDB flow and discuss the endpoints.
7. Show the backend code and tests; briefly explain server-side validation and error responses.

## Environment variables

### Backend (`apps/backend/.env`)

- `PORT`: API port, default `5000`.
- `MONGODB_URI`: MongoDB connection string.
- `CLIENT_URL`: permitted frontend origin, default `http://localhost:5173`.
- `NODE_ENV`: set to `production` in a production deployment.

### Frontend (`apps/frontend/.env`)

- `VITE_API_URL`: API base URL, default `http://localhost:5000/api`.

## Current scope and future improvements

This is a learning PoC, not a production student information system. Authentication, per-user access control, pagination, deployment, automated browser tests, and persistent audit history are outside the current scope. A production version should add authenticated users, authorization checks on every task, deployment secret management, and integration/end-to-end testing.

## Academic integrity note

Use this project as a starter and learning reference. Run it on your own system, understand the code, make a few changes that reflect your own decisions, and verify the demo and tests yourself before presenting it.
