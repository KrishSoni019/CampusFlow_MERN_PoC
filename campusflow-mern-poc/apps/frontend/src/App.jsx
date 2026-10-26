import { NavLink, Route, Routes } from 'react-router-dom';
import { Activity, BookOpenCheck, Github, GraduationCap, LayoutDashboard, PanelLeftClose } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx';
import HowItWorks from './pages/HowItWorks.jsx';

function Sidebar() {
  return <aside className="sidebar"><div className="brand"><div className="brand-mark"><GraduationCap size={22} /></div><div className="brand-name">campus<span>flow</span><small>STUDENT WORKSPACE</small></div></div><div className="side-label">WORKSPACE</div><nav className="sidebar-nav"><NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><LayoutDashboard size={18} /><span>Dashboard</span><span className="nav-active-dot" /></NavLink><NavLink to="/how-it-works" className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}><BookOpenCheck size={18} /><span>Project guide</span></NavLink></nav><div className="sidebar-bottom"><div className="mini-progress"><div className="mini-progress-icon"><Activity size={17}/></div><b>Small steps count.</b><p>Show up, do the work, repeat.</p></div><div className="profile-card"><div className="avatar">CF</div><div><b>CampusFlow</b><span>MERN Stack PoC</span></div><span className="online-indicator" /></div></div></aside>;
}
export default function App() {
  return <div className="app-shell"><Sidebar /><main className="main-area"><div className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>Student planner</b></div><div className="topbar-right"><span className="demo-badge"><span /> Proof of concept</span><div className="topbar-avatar"><GraduationCap size={16}/></div></div></div><div className="main-content"><Routes><Route path="/" element={<Dashboard />} /><Route path="/how-it-works" element={<HowItWorks />} /><Route path="*" element={<Dashboard />} /></Routes><footer className="app-footer"><span>© {new Date().getFullYear()} CampusFlow</span><span>Made to make student life a little lighter <span className="footer-heart">♥</span></span></footer></div></main></div>;
}
