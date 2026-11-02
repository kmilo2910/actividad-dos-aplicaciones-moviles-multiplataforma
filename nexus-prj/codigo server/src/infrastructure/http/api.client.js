const apiBaseUrl = '';

async function getAuthHeaders() {
  const response = await fetch('/auth/access-token', { credentials: 'include' });
  if (!response.ok) return {};
  const { token } = await response.json();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const apiClient = {
  async get(path) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: authHeaders,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Error en la API');
    return payload.data;
  },
  async post(path, body) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Error en la API');
    return payload.data;
  },
  async patch(path, body = {}) {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Error en la API');
    return payload.data;
  },
};
