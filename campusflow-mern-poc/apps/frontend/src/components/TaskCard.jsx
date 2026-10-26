import { CalendarDays, Circle, CircleCheck, Clock3, Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

function getDueLabel(value) {
  if (!value) return 'No due date';
  const date = new Date(value);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(date); due.setHours(0, 0, 0, 0);
  const days = Math.round((due - today) / 86400000);
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && task.status !== 'Completed';
  return (
    <article className={`task-card ${task.status === 'Completed' ? 'task-done' : ''}`}>
      <button className={`status-check ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => onStatusChange(task, task.status === 'Completed' ? 'Pending' : 'Completed')} aria-label={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'} title="Toggle completion">
        {task.status === 'Completed' ? <CircleCheck size={21} /> : <Circle size={21} />}
      </button>
      <div className="task-main">
        <div className="task-title-line"><h3>{task.title}</h3><div className="task-menu-wrap"><button className="icon-button task-more" aria-label="Task actions" onClick={() => setMenuOpen((v) => !v)}><MoreHorizontal size={19} /></button>{menuOpen && <div className="task-menu"><button onClick={() => { setMenuOpen(false); onEdit(task); }}><Edit3 size={14} /> Edit task</button><button className="danger-text" onClick={() => { setMenuOpen(false); onDelete(task); }}><Trash2 size={14} /> Delete task</button></div>}</div></div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta"><span className="course-pill">{task.course || 'General'}</span><span className={`priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span><span className={`due-meta ${overdue ? 'overdue' : ''}`}><CalendarDays size={13} />{getDueLabel(task.dueDate)}</span></div>
      </div>
      <button className={`status-label status-${task.status.toLowerCase().replace(' ', '-')}`} onClick={() => onStatusChange(task, task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Pending')} title="Click to cycle status">
        {task.status === 'In Progress' && <Clock3 size={12} />}{task.status === 'Completed' && <CircleCheck size={12} />}{task.status === 'Pending' && <Circle size={12} />}{task.status}
      </button>
    </article>
  );
}
