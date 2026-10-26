import { ArrowDown, Braces, Database, GitBranch, Globe2, Layers3, Server, ShieldCheck, Workflow } from 'lucide-react';

const endpoints = [
  ['GET', '/api/tasks', 'Read all tasks; optional q, status and priority filters'],
  ['GET', '/api/tasks/:id', 'Read one task by its MongoDB ID'],
  ['POST', '/api/tasks', 'Create a task after request validation'],
  ['PATCH', '/api/tasks/:id', 'Update selected task fields'],
  ['DELETE', '/api/tasks/:id', 'Delete a task by ID'],
  ['GET', '/api/health', 'Check whether the API is responding']
];
export default function HowItWorks() {
  return <div className="guide-page">
    <header className="page-header"><div><div className="date-kicker"><Workflow size={14} /> PROJECT DOCUMENTATION</div><h1>Under the hood, <span>CampusFlow.</span></h1><p className="page-subtitle">A quick technical walkthrough you can use during your PoC demonstration and viva.</p></div></header>
    <section className="guide-card"><div className="section-eyebrow">SYSTEM ARCHITECTURE</div><h2>Four layers. One connected workflow.</h2><p className="guide-intro">CampusFlow follows a clean client–server architecture. The React client never connects directly to MongoDB; all data access passes through the Express API.</p>
      <div className="architecture-flow">
        <div className="architecture-node client-node"><div className="arch-icon"><Globe2 size={21} /></div><div><b>React frontend</b><span>Vite · React Router · Fetch API</span><small>Forms, filters, task dashboard</small></div></div><div className="flow-arrow"><ArrowDown size={18} /><span>HTTP request / JSON response</span></div>
        <div className="architecture-node server-node"><div className="arch-icon"><Server size={21} /></div><div><b>Express + Node.js API</b><span>REST routes · controllers · middleware</span><small>Validation, errors, CORS, rate limiting</small></div></div><div className="flow-arrow"><ArrowDown size={18} /><span>Mongoose model operations</span></div>
        <div className="architecture-node db-node"><div className="arch-icon"><Database size={21} /></div><div><b>MongoDB database</b><span>Task collection · schema validation</span><small>Persistent documents and timestamps</small></div></div>
      </div>
      <div className="architecture-foot"><ShieldCheck size={17} /><span><b>Key design decision:</b> validation and error handling live on the server, not only in the browser.</span></div>
    </section>
    <section className="guide-card"><div className="section-eyebrow">REST API REFERENCE</div><h2>Endpoints to demonstrate</h2><p className="guide-intro">Open these in a REST client such as Postman, or demonstrate the same operations from the UI.</p><div className="endpoint-table"><div className="endpoint-row endpoint-head"><span>Method</span><span>Endpoint</span><span>Purpose</span></div>{endpoints.map(([method, path, purpose]) => <div className="endpoint-row" key={`${method}-${path}`}><span><i className={`method method-${method.toLowerCase()}`}>{method}</i></span><code>{path}</code><span>{purpose}</span></div>)}</div>
    </section>
    <section className="guide-card"><div className="section-eyebrow">FEATURE CHECKLIST</div><h2>What this PoC demonstrates</h2><div className="feature-grid"><div><Layers3 size={19}/><b>React UI</b><span>Reusable components, routing, state, forms and filtering.</span></div><div><Braces size={19}/><b>REST backend</b><span>Express routes, controllers, validation and error middleware.</span></div><div><Database size={19}/><b>MongoDB CRUD</b><span>Create, read, update and delete persistent tasks.</span></div><div><GitBranch size={19}/><b>Testing &amp; docs</b><span>Input-validation tests, setup guide and demo walkthrough.</span></div></div></section>
  </div>;
}
