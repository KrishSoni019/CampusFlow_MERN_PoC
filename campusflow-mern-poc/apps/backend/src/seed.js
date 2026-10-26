import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Task from './models/Task.js';

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date;
};

try {
  await connectDB();
  const existingCount = await Task.countDocuments();
  if (existingCount > 0) {
    console.log(`Seed skipped: database already contains ${existingCount} task(s).`);
  } else {
    await Task.insertMany([
      { title: 'Prepare DBMS assignment', description: 'Complete normalization examples and prepare the submission PDF.', course: 'Advanced DBMS', dueDate: daysFromNow(2), priority: 'High', status: 'In Progress' },
      { title: 'Revise React hooks', description: 'Review useState, useEffect and reusable component patterns.', course: 'Web Development', dueDate: daysFromNow(4), priority: 'Medium', status: 'Pending' },
      { title: 'Submit research proposal', description: 'Finalize objectives, methodology and references.', course: 'Research Methodology', dueDate: daysFromNow(1), priority: 'High', status: 'Pending' },
      { title: 'Practice SQL queries', description: 'Solve joins, grouping, subqueries and window-function questions.', course: 'Database Systems', dueDate: daysFromNow(6), priority: 'Low', status: 'Completed' }
    ]);
    console.log('Sample tasks inserted.');
  }
} catch (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
