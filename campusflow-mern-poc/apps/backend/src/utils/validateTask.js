const allowedPriorities = new Set(['Low', 'Medium', 'High']);
const allowedStatuses = new Set(['Pending', 'In Progress', 'Completed']);

export function validateTaskInput(input, { partial = false } = {}) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: { body: 'Request body must be a JSON object.' } };
  }

  if (!partial || Object.hasOwn(input, 'title')) {
    if (typeof input.title !== 'string' || input.title.trim().length < 2) {
      errors.title = 'Title must contain at least 2 characters.';
    } else if (input.title.trim().length > 100) {
      errors.title = 'Title must be 100 characters or fewer.';
    }
  }
  if (Object.hasOwn(input, 'description') && (typeof input.description !== 'string' || input.description.length > 1000)) {
    errors.description = 'Description must be text of 1,000 characters or fewer.';
  }
  if (Object.hasOwn(input, 'course') && (typeof input.course !== 'string' || input.course.trim().length > 80)) {
    errors.course = 'Course must be text of 80 characters or fewer.';
  }
  if (Object.hasOwn(input, 'priority') && !allowedPriorities.has(input.priority)) {
    errors.priority = 'Priority must be Low, Medium, or High.';
  }
  if (Object.hasOwn(input, 'status') && !allowedStatuses.has(input.status)) {
    errors.status = 'Status must be Pending, In Progress, or Completed.';
  }
  if (Object.hasOwn(input, 'dueDate') && input.dueDate !== null && input.dueDate !== '') {
    if (Number.isNaN(Date.parse(input.dueDate))) errors.dueDate = 'Due date must be a valid date.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
