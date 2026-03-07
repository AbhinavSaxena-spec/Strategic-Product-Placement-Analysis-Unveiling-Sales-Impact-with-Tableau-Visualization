/**
 * api.js — centralised fetch layer for the Flask backend
 * Vite proxies every /api/* call → http://127.0.0.1:5000
 */

async function get(path, params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()
  const url = qs ? `/api${path}?${qs}` : `/api${path}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API ${res.status} — is Flask running on port 5000?`)
  return res.json()
}

export const api = {
  kpis:            (f = {}) => get('/kpis',            f),
  categories:      (f = {}) => get('/categories',      f),
  positions:       (f = {}) => get('/positions',       f),
  promotions:      (f = {}) => get('/promotions',      f),
  footTraffic:     (f = {}) => get('/foot-traffic',    f),
  demographics:    (f = {}) => get('/demographics',    f),
  pricing:         (f = {}) => get('/pricing',         f),
  seasonal:        (f = {}) => get('/seasonal',        f),
  recommendations: ()        => get('/recommendations'),
  exportUrl: (f = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(f).filter(([, v]) => v))
    ).toString()
    return qs ? `/api/export?${qs}` : `/api/export`
  },
}
