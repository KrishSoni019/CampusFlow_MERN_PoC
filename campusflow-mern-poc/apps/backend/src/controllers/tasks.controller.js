import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { validateTaskInput } from '../utils/validateTask.js';

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const allowedFields = ['title', 'description', 'course', 'dueDate', 'priority', 'status'];
const pickFields = (body) => Object.fromEntries(allowedFields.filter((key) => Object.hasOwn(body, key)).map((key) => [key, body[key]]));

export const listTasks = asyncHandler(async (req, res) => {
  const { q, status, priority } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (priority && priority !== 'All') filter.priority = priority;
  if (q?.trim()) {
    const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
      { course: { $regex: escaped, $options: 'i' } }
    ];
  }
  const tasks = await Task.find(filter).sort({ status: 1, dueDate: 1, createdAt: -1 }).lean();
  res.json({ success: true, count: tasks.length, data: tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid task ID.' });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
  res.json({ success: true, data: task });
});

export const createTask = asyncHandler(async (req, res) => {
  const validation = validateTaskInput(req.body);
  if (!validation.valid) return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors: validation.errors });
  const task = await Task.create(pickFields(req.body));
  res.status(201).json({ success: true, message: 'Task created successfully.', data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid task ID.' });
  const input = pickFields(req.body);
  const validation = validateTaskInput(input, { partial: true });
  if (!validation.valid) return res.status(400).json({ success: false, message: 'Please correct the highlighted fields.', errors: validation.errors });
  if (Object.keys(input).length === 0) return res.status(400).json({ success: false, message: 'Provide at least one field to update.' });
  const task = await Task.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
  res.json({ success: true, message: 'Task updated successfully.', data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid task ID.' });
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
  res.json({ success: true, message: 'Task deleted successfully.', data: { id: task._id } });
});
