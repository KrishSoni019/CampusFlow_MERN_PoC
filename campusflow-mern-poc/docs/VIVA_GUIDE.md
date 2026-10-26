# CampusFlow — Viva Preparation Guide

Use this guide to revise before your demo and viva. Read every section,
understand the reasoning, and be able to explain each part in your own words.

---

## 1. What problem does CampusFlow solve?

Students often track assignments across scattered notes, calendar apps, and
messaging threads. This makes it easy to miss deadlines, forget priorities, or
lose track of which tasks are in progress.

CampusFlow is a centralised web dashboard where a student can create a task for
each assignment, set its subject, due date and priority, and progress it
through Pending → In Progress → Completed. The dashboard always shows totals,
a completion percentage, and outstanding high-priority items in one place.

---

## 2. What does MERN mean? Why each technology?

| Letter | Technology | Why it was chosen |
|--------|------------|-------------------|
| **M** | MongoDB | Stores task documents as flexible JSON-like objects. No rigid table schema is needed — adding fields later is simple. |
| **E** | Express | A minimal Node.js framework for defining REST routes, middleware and error handling with very little boilerplate. |
| **R** | React | Builds an interactive, component-based UI. State management with `useState`/`useEffect` keeps the task list and dashboard in sync without page reloads. |
| **N** | Node.js | Server-side JavaScript runtime. Using JavaScript on both layers reduces context switching and lets code (like validation helpers) be reasoned about uniformly. |

All four layers use JavaScript/JSON, which simplifies data passing across the
entire stack.

---

## 3. How does data move through the app? (The full flow)

```
User clicks "Create task" in React
        │
        ▼
TaskForm.jsx validates client-side (title ≥ 2 chars)
        │
        ▼
api.js  →  POST /api/tasks  (JSON body via fetch)
        │
        ▼
Express router  →  tasks.routes.js  →  createTask controller
        │
        ▼
validateTaskInput() checks title, priority, status, dueDate
        │  (returns 400 if invalid)
        ▼
Task.create(pickFields(req.body))  →  Mongoose model
        │
        ▼
MongoDB stores the document  (with _id, createdAt, updatedAt)
        │
        ▼
API returns  { success: true, data: { …task } }  HTTP 201
        │
        ▼
React receives response  →  loadTasks() refresh  →  UI updates
```

Key point: **the React frontend never talks directly to MongoDB**. The Express
API mediates all database access.

---

## 4. How does REST work in this project?

REST (Representational State Transfer) uses standard HTTP methods to perform
operations on resources:

| HTTP method | CRUD operation | CampusFlow endpoint |
|-------------|---------------|----------------------|
| `GET`       | Read           | `GET /api/tasks` (list), `GET /api/tasks/:id` (single) |
| `POST`      | Create         | `POST /api/tasks` |
| `PATCH`     | Update         | `PATCH /api/tasks/:id` |
| `DELETE`    | Delete         | `DELETE /api/tasks/:id` |

Responses always return JSON in the shape `{ success, data?, message?, errors? }`.

---

## 5. What is a Mongoose model and what does it do?

Mongoose is an ODM (Object-Document Mapper) that sits between Express and
MongoDB.

- **Schema** (`Task.js`) defines the shape of a task document: which fields
  exist, their types, default values, length limits and allowed enum values.
- **Model** (`mongoose.model('Task', taskSchema)`) generates a JavaScript class
  with built-in methods: `.find()`, `.findById()`, `.create()`,
  `.findByIdAndUpdate()`, `.findByIdAndDelete()`.
- **Validation** — Mongoose validates data against the schema before writing.
  In this project a custom `validateTaskInput()` helper runs first so the API
  can return structured per-field error messages.

---

## 6. How are CRUD operations implemented?

### Create
`POST /api/tasks` → `createTask` controller → `validateTaskInput` → `Task.create()`

### Read (list)
`GET /api/tasks` → `listTasks` → builds a filter object from query params
(`q`, `status`, `priority`) → `Task.find(filter).sort(...)` → array of tasks

### Read (single)
`GET /api/tasks/:id` → `getTask` → `mongoose.isValidObjectId` check →
`Task.findById()` → single task or 404

### Update
`PATCH /api/tasks/:id` → `updateTask` → ID check → `pickFields` (whitelist)
→ validation → `Task.findByIdAndUpdate(..., { new: true, runValidators: true })`

### Delete
`DELETE /api/tasks/:id` → `deleteTask` → ID check → `Task.findByIdAndDelete()`
→ 200 with the deleted task's ID, or 404

---

## 7. How is validation handled?

Two layers:

1. **Client-side (React / TaskForm.jsx)** — checks that title has ≥ 2
   characters before the HTTP request is even sent. This gives fast user
   feedback but can always be bypassed.

2. **Server-side (validateTaskInput.js)** — independently checks title length,
   priority enum, status enum and due date format regardless of how the
   request arrived. This is the authoritative gate before any database write.

If validation fails the API returns HTTP 400 with a `{ errors: { field: message } }`
body so the frontend can highlight specific fields.

---

## 8. How is error handling done?

- **asyncHandler** wrapper in the controller catches any promise rejection and
  passes it to Express's `next(err)`.
- **errorHandler middleware** (`errorHandler.js`) catches all unhandled errors,
  maps Mongoose `ValidationError` / `CastError` to 400, and everything else to
  500. In production the 500 message is generic to avoid leaking internals.
- **notFound middleware** returns 404 JSON for any unrecognised route.
- **Client-side** (`api.js`) catches network failures (backend down) and
  surfaces a plain English message; the Dashboard shows this in an error banner
  with a "Try again" button.

---

## 9. How does persistence work?

MongoDB stores data on disk in the Docker-managed named volume
`campusflow_data`. When you restart the container the data survives. The
`serverSelectionTimeoutMS: 10000` option in `db.js` means the server will
fail fast with a clear message if MongoDB is unreachable instead of hanging.

---

## 10. Key files and what to show in a demo

| File / location | What it demonstrates |
|-----------------|----------------------|
| `apps/backend/src/models/Task.js` | Mongoose schema, field types, enums, indexes |
| `apps/backend/src/controllers/tasks.controller.js` | All four CRUD handlers, async error pattern, whitelist filtering |
| `apps/backend/src/utils/validateTask.js` | Server-side validation logic separate from the model |
| `apps/backend/src/app.js` | Middleware stack: Helmet, CORS, rate limit, routes |
| `apps/frontend/src/lib/api.js` | Centralised fetch helper, error propagation |
| `apps/frontend/src/pages/Dashboard.jsx` | State management, optimistic UI, search/filter/sort |
| `apps/frontend/src/components/TaskForm.jsx` | Controlled form, client-side validation, modal pattern |
| `apps/backend/test/validateTask.test.js` | Node.js native test runner, assertion coverage |

---

## 11. Likely viva questions and model answers

### Q1 — Why use MongoDB instead of MySQL?
> Tasks need flexible fields (optional due date, variable description length).
> MongoDB stores documents which can vary without costly schema migrations.
> For a simple CRUD PoC it is also faster to prototype. A relational database
> would be better if we needed complex joins or strict referential integrity.

### Q2 — What is the difference between `PUT` and `PATCH`?
> `PUT` replaces the entire resource; omitting a field removes it.
> `PATCH` applies a partial update — only the supplied fields are changed.
> CampusFlow uses `PATCH` so a status update does not wipe out the title.

### Q3 — What happens if the title is blank?
> The React form prevents submission with a client-side check.
> If the request reaches the API (e.g., via curl), `validateTaskInput` returns
> `{ valid: false, errors: { title: '...' } }` and the controller responds
> with HTTP 400. Nothing is written to MongoDB.

### Q4 — How does the search feature work end-to-end?
> The user types in the search box. The Dashboard filters the already-loaded
> task array in the browser using `.toLowerCase().includes(term)` — no extra
> API call needed. The backend also supports `?q=` for server-side regex search
> across title, description and course (used when loading with pre-applied
> filters).

### Q5 — What security measures are in place?
> - **Helmet** sets HTTP security headers (X-Content-Type-Options, etc.).
> - **CORS** only allows requests from the configured frontend origin.
> - **Rate limiting** caps the `/api` prefix at 300 requests per 15 minutes.
> - **Input whitelisting** (`pickFields`) ignores any unexpected body fields.
> - **Server-side validation** prevents invalid data from reaching MongoDB.
> - **x-powered-by** header disabled so Express is not advertised.

### Q6 — What is the event loop and why is it relevant?
> Node.js runs on a single thread with an event loop. I/O operations (like
> database queries) are non-blocking — Node suspends the handler, continues
> other work, and resumes when the I/O completes. `async/await` expresses this
> clearly. If we used synchronous blocking calls we would stall the entire
> server.

### Q7 — Why is `VITE_` prefix needed for environment variables?
> Vite's build tool only exposes variables prefixed with `VITE_` to the browser
> bundle for security reasons — other env vars might contain server secrets.
> `import.meta.env.VITE_API_URL` is how the frontend reads it.

### Q8 — What would you add for a production version?
> Authentication (JWT or sessions), per-user task ownership, authorisation
> middleware on every route, pagination for large task lists, integration/E2E
> tests (e.g., Playwright), deployment with managed secrets, and monitoring.

---

## 12. Suggested 4-minute demo script

1. **Open Dashboard** — show the greeting, date, stats tiles and progress bar.
2. **Create a task** — fill title, course, due date, priority. Submit. Watch the
   toast and the stats update.
3. **Edit the task** — change description and save. Show the list refreshes.
4. **Cycle the status** — click the status pill to move Pending → In Progress →
   Completed. Show dashboard counts change.
5. **Search and filter** — type in the search box; apply a priority filter.
6. **Delete a task** — confirm the dialog; show the task disappears.
7. **Open Project guide** — show the architecture diagram and endpoint table.
8. **Show backend code** — `tasks.controller.js` and `validateTask.js`.
9. **Run tests** — `npm test` in `apps/backend` to show all four tests pass.
10. **Show API directly** — `curl http://localhost:5000/api/health` in a terminal.

---

*Prepared for CampusFlow PoC — MERN Stack Assignment*
