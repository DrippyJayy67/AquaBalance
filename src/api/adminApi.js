// Lightweight admin API client with localStorage fallback
const BASE = process.env.REACT_APP_API_BASE || ''; // set this in your env for real backend

function safeJson(res) {
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

async function fetchOrFallback(key, endpoint) {
  try {
    if (BASE) {
      const res = await fetch(`${BASE}${endpoint}`);
      return safeJson(res);
    }
  } catch (e) {
    // continue to fallback
  }
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

async function saveOrFallback(key, endpoint, data, method = 'POST') {
  try {
    if (BASE) {
      const res = await fetch(`${BASE}${endpoint}`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      return safeJson(res);
    }
  } catch (e) {
    // fallback to localStorage
  }

  const raw = localStorage.getItem(key);
  const arr = raw ? JSON.parse(raw) : [];
  if (method === 'POST') {
    const created = { id: Date.now(), ...data };
    arr.unshift(created);
    localStorage.setItem(key, JSON.stringify(arr));
    return created;
  }

  if (method === 'PUT') {
    const updated = arr.map(x => x.id === data.id ? { ...x, ...data } : x);
    localStorage.setItem(key, JSON.stringify(updated));
    return data;
  }

  if (method === 'DELETE') {
    const filtered = arr.filter(x => x.id !== data.id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return { success: true };
  }
  return null;
}

export async function fetchAnnouncements() {
  const a = await fetchOrFallback('mock_announcements', '/api/admin/announcements');
  return a || [];
}

export async function createAnnouncement(payload) {
  return saveOrFallback('mock_announcements', '/api/admin/announcements', payload, 'POST');
}

export async function updateAnnouncement(payload) {
  return saveOrFallback('mock_announcements', `/api/admin/announcements/${payload.id}`, payload, 'PUT');
}

export async function deleteAnnouncement(id) {
  return saveOrFallback('mock_announcements', `/api/admin/announcements/${id}`, { id }, 'DELETE');
}

export async function fetchBusinesses() {
  const b = await fetchOrFallback('mock_businesses', '/api/admin/businesses');
  if (b) return b;
  // seed with default from localStorage or empty
  const raw = localStorage.getItem('mock_businesses');
  if (raw) return JSON.parse(raw);
  return null;
}

export async function saveBusiness(biz) {
  return saveOrFallback('mock_businesses', `/api/admin/businesses/${biz.id}`, biz, 'PUT');
}

export async function bulkUpdateBusinesses(payload) {
  // payload: { ids: [...], changes: {...} }
  try {
    if (BASE) {
      const res = await fetch(`${BASE}/api/admin/businesses/bulk`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      return safeJson(res);
    }
  } catch (e) {}

  const raw = localStorage.getItem('mock_businesses');
  const arr = raw ? JSON.parse(raw) : [];
  const updated = arr.map(b => payload.ids.includes(b.id) ? { ...b, ...payload.changes } : b);
  localStorage.setItem('mock_businesses', JSON.stringify(updated));
  return { success: true };
}

const api = {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  fetchBusinesses,
  saveBusiness,
  bulkUpdateBusinesses
};

export default api;
