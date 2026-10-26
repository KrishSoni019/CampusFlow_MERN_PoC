import { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';

const emptyTask = { title: '', description: '', course: '', dueDate: '', priority: 'Medium', status: 'Pending' };

export default function TaskForm({ initialTask, onClose, onSave, saving }) {
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || '', description: initialTask.description || '', course: initialTask.course || '',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().slice(0, 10) : '',
        priority: initialTask.priority || 'Medium', status: initialTask.status || 'Pending'
      });
    } else setForm(emptyTask);
  }, [initialTask]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.title.trim().length < 2) return setError('Add a title with at least 2 characters.');
    try {
      await onSave({ ...form, title: form.title.trim(), course: form.course.trim() || 'General', dueDate: form.dueDate || null });
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div><span className="eyebrow">YOUR WORKSPACE</span><h2 id="form-title">{initialTask ? 'Edit assignment' : 'Add a new task'}</h2><p>Keep the details clear. You’ve got this.</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X size={19} /></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label className="field full"><span>Task title <b>*</b></span><input autoFocus name="title" value={form.title} onChange={change} maxLength={100} placeholder="e.g. Prepare DBMS assignment" required /></label>
          <label className="field full"><span>Description</span><textarea name="description" value={form.description} onChange={change} maxLength={1000} rows="3" placeholder="What needs to get done?" /></label>
          <div className="form-grid">
            <label className="field"><span>Course / subject</span><input name="course" value={form.course} onChange={change} maxLength={80} placeholder="e.g. Advanced DBMS" /></label>
            <label className="field"><span>Due date</span><div className="input-icon"><CalendarDays size={16} /><input type="date" name="dueDate" value={form.dueDate} onChange={change} /></div></label>
            <label className="field"><span>Priority</span><select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label className="field"><span>Status</span><select name="status" value={form.status} onChange={change}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          </div>
          {error && <div className="inline-error" role="alert">{error}</div>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving…' : initialTask ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </section>
    </div>
  );
}
