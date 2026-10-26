import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowDownUp, ArrowUpRight, BookOpen, Check, CheckCheck, ChevronDown, CircleHelp, Clock3, Filter, LoaderCircle, Plus, Search, Sparkles, Target, TrendingUp } from 'lucide-react';
import { taskApi } from '../lib/api.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import EmptyState from '../components/EmptyState.jsx';

const filters = ['All tasks', 'Pending', 'In Progress', 'Completed'];
function dateGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All tasks');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await taskApi.list();
      setTasks(result.data || []);
      setApiOnline(true);
    } catch (err) {
      setError(err.message); setApiOnline(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  const counts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
    pending: tasks.filter((task) => task.status === 'Pending').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    highPriority: tasks.filter((task) => task.priority === 'High' && task.status !== 'Completed').length
  }), [tasks]);
  const completion = counts.total ? Math.round((counts.completed / counts.total) * 100) : 0;
  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || [task.title, task.description, task.course].some((value) => (value || '').toLowerCase().includes(term));
      const matchesStatus = activeFilter === 'All tasks' || task.status === activeFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
    return filtered.sort((a, b) => {
      if (sortBy === 'priority') return ({ High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]);
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks, search, activeFilter, priorityFilter, sortBy]);

  const saveTask = async (payload) => {
    setSaving(true);
    try {
      if (editingTask) {
        await taskApi.update(editingTask._id, payload);
        setNotice('Changes saved — nicely done.');
      } else {
        await taskApi.create(payload);
        setNotice('Task added to your workspace.');
      }
      setFormOpen(false); setEditingTask(null); await loadTasks();
    } finally { setSaving(false); }
  };

  const changeStatus = async (task, status) => {
    try {
      const response = await taskApi.update(task._id, { status });
      setTasks((current) => current.map((item) => item._id === task._id ? response.data : item));
      setNotice(status === 'Completed' ? 'Task completed. One less thing to think about.' : 'Task status updated.');
    } catch (err) { setError(err.message); }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return;
    try {
      await taskApi.remove(task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      setNotice('Task deleted.');
    } catch (err) { setError(err.message); }
  };

  const openCreate = () => { setEditingTask(null); setFormOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setFormOpen(true); };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div><div className="date-kicker"><Sparkles size={14} /> YOUR STUDY SPACE · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</div><h1>{dateGreeting()}, <span>let’s make progress.</span></h1><p className="page-subtitle">A little structure goes a long way. Here’s what’s on your plate.</p></div>
        <button className="button button-primary header-add" onClick={openCreate}><Plus size={17} /> New task</button>
      </header>

      <section className="stats-grid" aria-label="Task summary">
        <article className="stat-card stat-main"><div className="stat-top"><span className="stat-label">Total tasks</span><span className="stat-icon purple"><BookOpen size={18} /></span></div><div className="stat-number">{counts.total}<span className="stat-tail"> task{counts.total === 1 ? '' : 's'}</span></div><div className="stat-foot"><span className="dot dot-purple" />Across all your subjects</div></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-label">In progress</span><span className="stat-icon blue"><Clock3 size={18} /></span></div><div className="stat-number">{counts.inProgress}</div><div className="stat-foot"><span className="dot dot-blue" />Work in motion</div></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-label">Completed</span><span className="stat-icon green"><CheckCheck size={18} /></span></div><div className="stat-number">{counts.completed}</div><div className="stat-foot"><span className="dot dot-green" />{completion}% completion rate</div></article>
        <article className="stat-card"><div className="stat-top"><span className="stat-label">High priority</span><span className="stat-icon amber"><Target size={18} /></span></div><div className="stat-number">{counts.highPriority}</div><div className="stat-foot"><span className="dot dot-amber" />Needs your attention</div></article>
      </section>

      <section className="progress-banner"><div className="progress-copy"><span className="progress-icon"><TrendingUp size={19} /></span><div><h2>Your momentum</h2><p>You’ve completed <strong>{counts.completed} of {counts.total}</strong> tasks. Keep the streak going.</p></div></div><div className="progress-meter"><div className="progress-track"><span style={{ width: `${completion}%` }} /></div><strong>{completion}%</strong></div></section>

      <section className="work-section">
        <div className="section-heading"><div><div className="section-eyebrow">THE GAME PLAN</div><h2>Your assignments <span className="count-bubble">{visibleTasks.length}</span></h2></div><button className="text-button" onClick={() => { setActiveFilter('All tasks'); setPriorityFilter('All'); setSearch(''); }}>Reset filters <ArrowUpRight size={15} /></button></div>
        <div className="filter-tabs" role="tablist" aria-label="Filter by status">{filters.map((filter) => <button key={filter} role="tab" aria-selected={activeFilter === filter} className={activeFilter === filter ? 'filter-tab active' : 'filter-tab'} onClick={() => setActiveFilter(filter)}>{filter}<span>{filter === 'All tasks' ? counts.total : filter === 'Pending' ? counts.pending : filter === 'In Progress' ? counts.inProgress : counts.completed}</span></button>)}</div>
        <div className="toolbar"><label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, subjects…" aria-label="Search tasks" />{search && <button aria-label="Clear search" onClick={() => setSearch('')}>×</button>}</label><label className="select-filter"><Filter size={15} /><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select><ChevronDown size={13} /></label><label className="select-filter sort-select"><ArrowDownUp size={15} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort tasks"><option value="dueDate">Due date</option><option value="priority">Priority</option><option value="createdAt">Newest first</option></select><ChevronDown size={13} /></label></div>

        {error && <div className="error-banner" role="alert"><AlertCircle size={17} /><span>{error}</span>{!apiOnline && <button className="button button-small" onClick={loadTasks}>Try again</button>}</div>}
        {notice && <div className="success-toast" role="status"><Check size={15} />{notice}</div>}
        {loading ? <div className="loading-state"><LoaderCircle className="spin" size={26} /><span>Loading your workspace…</span></div> : visibleTasks.length ? <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={deleteTask} onStatusChange={changeStatus} />)}</div> : <EmptyState filtered={Boolean(search || priorityFilter !== 'All' || activeFilter !== 'All tasks')} onAdd={openCreate} />}
        <div className="list-footer"><span><span className={`connection-dot ${apiOnline ? 'online' : 'offline'}`} />{apiOnline ? 'Synced with your database' : 'API connection unavailable'}</span><span>CampusFlow · Built for student life</span></div>
      </section>
      {formOpen && <TaskForm initialTask={editingTask} onClose={() => { setFormOpen(false); setEditingTask(null); }} onSave={saveTask} saving={saving} />}
      <div className="help-note"><CircleHelp size={15} /><span>Tip: click a status to cycle through Pending → In Progress → Completed.</span></div>
    </div>
  );
}
