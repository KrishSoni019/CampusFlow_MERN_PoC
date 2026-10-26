# CampusFlow test checklist

Record the actual outcome on your machine. Do not mark a test as passed unless you ran it.

| ID | Test case | Expected result | Actual result |
|---|---|---|---|
| T01 | Open `GET /api/health` | HTTP 200 and `success: true` | **Pass** — `{"success":true,"message":"CampusFlow API is running."}` HTTP 200 |
| T02 | Create task with valid title and fields | HTTP 201; task saved to MongoDB and appears in UI | **Pass** — HTTP 201, `_id` assigned, task visible in list after seed |
| T03 | Submit an empty/one-character title | HTTP 400 with validation message; no task created | **Pass** — HTTP 400, `{"errors":{"title":"Title must contain at least 2 characters."}}` |
| T04 | Edit an existing task | HTTP 200; updated value persists after refresh | **Pass** — PATCH returns HTTP 200 with updated document; field changes persist |
| T05 | Change task status | Status label and dashboard counts update | **Pass** — PATCH `{"status":"In Progress"}` returns updated doc; UI reflects new status |
| T06 | Search by task title/subject | Only matching tasks are shown | **Pass** — `GET /api/tasks?q=DBMS` returns 1 matching task; client-side search also works |
| T07 | Filter by status and priority | Task list matches both selected filters | **Pass** — `GET /api/tasks?priority=High` filters correctly; UI filter tabs work |
| T08 | Delete a task | Task is removed from MongoDB and UI | **Pass** — DELETE returns HTTP 200; subsequent GET returns 404 |
| T09 | Request a non-existent task ID | HTTP 404 and useful message | **Pass** — `GET /api/tasks/000000000000000000000000` returns HTTP 404, `{"message":"Task not found."}` |
| T10 | Stop API and reload dashboard | UI displays an API connection error and retry action | **Pass** — Dashboard shows error banner with "Try again" button when backend is down |
| T11 | Run `npm test` in `apps/backend` | All validation unit tests pass | **Pass** — 4/4 tests pass (valid task, short title, bad enum, partial update) |
| T12 | Run `npm run build` in `apps/frontend` | Vite generates a production build | **Pass** — 1,587 modules transformed, `dist/` created, no errors |

## Additional tests performed (direct API)

| ID | Test | Result |
|---|---|---|
| T13 | `GET /api/tasks/not-a-valid-id` | **Pass** — HTTP 400, `{"message":"Invalid task ID."}` |
| T14 | `GET /api/nonexistent` route | **Pass** — HTTP 404, `{"message":"Route not found: GET /api/nonexistent"}` |
| T15 | Seed script (`npm run seed`) | **Pass** — 4 sample tasks inserted; re-run skips if data exists |
| T16 | Backend starts with MongoDB connected | **Pass** — `MongoDB connected: campusflow` in logs |
| T17 | Frontend dev server starts on port 5173 | **Pass** — Vite ready in 802 ms, HTTP 200 on `http://127.0.0.1:5173/` |

## Environment

- Node.js: v22.22.2
- npm: 10.9.7
- Docker: 29.9.1 (mongo:7 image pulled and running)
- Backend: `http://localhost:5000`
- Frontend: `http://127.0.0.1:5173`
- Tests run: 2026-10-22

## How to record results

Replace **Pending** with **Pass** or **Fail**, and add evidence/screenshots separately if your faculty requires it. Re-run failed tests after fixes.
