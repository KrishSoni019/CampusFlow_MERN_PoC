import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 2, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    course: { type: String, trim: true, maxlength: 80, default: 'General' },
    dueDate: { type: Date, default: null },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
  },
  { timestamps: true, versionKey: false }
);

taskSchema.index({ status: 1, dueDate: 1, priority: 1 });
taskSchema.index({ title: 'text', description: 'text', course: 'text' });

export default mongoose.model('Task', taskSchema);
