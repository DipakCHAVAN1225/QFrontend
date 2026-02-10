
// frontend/src/auth/api.js
const BASE_URL = import.meta.env.VITE_API_URL || ''; // set to http://localhost:3000 in frontend .env if desired

function buildUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) throw new Error('Empty URL passed to apiFetch');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${BASE_URL.replace(/\/+$/, '')}/${trimmed.replace(/^\/+/, '')}`;
}

export async function apiFetch(url, options = {}) {
  const finalUrl = buildUrl(url);
  const defaultHeaders = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");

  const headers = { ...defaultHeaders, ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { ...options, headers };
  if (opts.body && typeof opts.body === 'object' && headers['Content-Type']?.includes('application/json')) {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(finalUrl, opts);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (data && data.message) || res.statusText || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}
