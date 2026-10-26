const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
  } catch {
    throw new Error('Cannot reach the API. Check that the backend is running on port 5000.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status}).`);
  return payload;
}

export const taskApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value && value !== 'All'));
    const queryString = query.toString();
    return request(`/tasks${queryString ? `?${queryString}` : ''}`);
  },
  create: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(task) }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  health: () => request('/health')
};
