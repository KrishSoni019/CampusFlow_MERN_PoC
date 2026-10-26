# Project Report: CampusFlow — Student Task & Assignment Manager

## 1. Introduction

CampusFlow is a web-based student task and assignment manager developed as a Proof of Concept using the MERN stack. It helps students record coursework, organize deadlines, assign priorities, and track completion from a single dashboard.

## 2. Problem statement

Students may track assignments in scattered notes, messages, calendars, or memory. This can make deadlines difficult to monitor and progress hard to assess. CampusFlow demonstrates a centralized task list with subject labels, due dates, priority, and status.

## 3. Objectives

- Build an interactive and responsive React interface.
- Expose REST endpoints using Node.js and Express.
- Store task records persistently in MongoDB through Mongoose.
- Demonstrate create, read, update and delete operations end to end.
- Validate user input and handle API errors.
- Provide basic tests and setup documentation for repeatable demonstration.

## 4. Intended users and scope

The primary intended users are students who need to track assignments and study tasks. This PoC includes task management, search, filtering, sorting, a progress summary, and a technical project guide. Login, multi-user permissions, reminders, and deployment are not included in the current scope.

## 5. Technology stack

- **Frontend:** React, Vite, React Router, Fetch API and CSS.
- **Backend:** Node.js, Express, middleware and REST routes.
- **Database:** MongoDB, accessed using Mongoose.
- **Testing:** Node.js built-in test runner for task-input validation.

## 6. System architecture and data flow

1. A user creates or updates a task in the React interface.
2. The centralized frontend API helper sends an HTTP request containing JSON to Express.
3. The Express route calls the appropriate controller.
4. The controller validates incoming data and invokes the Mongoose model.
5. MongoDB stores or retrieves the task document.
6. The API returns JSON and an appropriate HTTP status code.
7. React updates the visible task list and dashboard summary.

The frontend does not connect directly to MongoDB; the backend mediates database access.

## 7. Database design

The `Task` collection contains:

| Field | Type | Purpose |
|---|---|---|
| `_id` | MongoDB ObjectId | Unique record identifier |
| `title` | String | Required task name (2–100 characters) |
| `description` | String | Optional details (up to 1,000 characters) |
| `course` | String | Subject or course name |
| `dueDate` | Date / null | Optional deadline |
| `priority` | Enum string | Low, Medium, or High |
| `status` | Enum string | Pending, In Progress, or Completed |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Latest update timestamp |

## 8. Major functionality

- Create an assignment or study task.
- Read and display all tasks from MongoDB.
- Edit task details and status.
- Delete a task after a confirmation prompt.
- Search, filter, and sort tasks.
- View total, completed, in-progress, and high-priority task counts.
- Review the API architecture, endpoint list, and viva notes in the project guide.

## 9. API design

The API exposes `GET /api/health`, `GET /api/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`, `PATCH /api/tasks/:id`, and `DELETE /api/tasks/:id`. Responses are JSON. Client input is validated on the server and invalid or missing records return appropriate client error responses.

## 10. Testing

Input-validation unit tests are included for valid data, invalid titles, unsupported enum values, and partial updates. The manual checklist in `docs/TESTING_CHECKLIST.md` covers database CRUD, search, filtering, error behavior, test execution, and the production frontend build. Record results only after running each test in the target environment.

## 11. Limitations and future enhancement

This is a limited-scope PoC. Future work could include user authentication, role-based access, private task lists per student, reminders, pagination, integration tests, automated browser tests, deployment, and audit history.

## 12. Conclusion

CampusFlow demonstrates the core MERN workflow by integrating an interactive React UI, Express REST API, and MongoDB-backed task model. It supports CRUD operations, client- and server-side validation, and basic testing/documentation suitable for a PoC demonstration.

## 13. Evidence to attach before submission

Add screenshots captured from your running app: dashboard with sample tasks, create/edit form, filtered list, completed-task state, API request/response in a REST client, and successful backend tests. Include actual test outcomes and update the report if you change the implementation.
