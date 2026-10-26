import { ClipboardList, Plus } from 'lucide-react';
export default function EmptyState({ onAdd, filtered }) {
  return <div className="empty-state"><div className="empty-icon"><ClipboardList size={26} /></div><h3>{filtered ? 'No matching tasks' : 'A fresh start'}</h3><p>{filtered ? 'Try another search or adjust your filters.' : 'Your to-do list is looking peaceful. Add your first task to get started.'}</p>{!filtered && <button className="button button-primary" onClick={onAdd}><Plus size={16} /> Add your first task</button>}</div>;
}
