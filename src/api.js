// ── Grow by XCADO Frontend — src/api.js ──────────────────────────────────────────────
// Drop-in client used by all components.
//   import api from './api'
//   const farmers = await api.farmers()
//
// Behavior:
//   • If VITE_USE_MOCK_API === "true"  → returns canned data with ~250ms latency.
//   • Otherwise                        → calls VITE_API_BASE_URL via axios.
// This lets the Vercel preview render the full UI with realistic data while the
// PHP backend is being prepared for cPanel.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios'
import * as mock from './mockData.js'

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? 'true') === 'true'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// ── Real client (only used when USE_MOCK = false) ────────────────────────────
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(config => {
  const token = localStorage.getItem('grow_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  res => res.data,
  err => {
    const status = err.response?.status
    const message = err.response?.data?.data?.message ?? err.message
    if (status === 401) {
      localStorage.removeItem('grow_token')
      // window.location.href = '/login'  // wire up when login route exists
    }
    return Promise.reject(new Error(message))
  }
)

// ── Mock helpers ─────────────────────────────────────────────────────────────
const wait = (ms = 250) => new Promise(r => setTimeout(r, ms))
const ok = async (data) => { await wait(); return { status: 'ok', data } }

// ── Endpoint map ─────────────────────────────────────────────────────────────
const realApi = {
  // Auth
  login:   (phone, password) => client.post('/auth/login', { phone, password }),
  logout:  ()                => client.post('/auth/logout'),
  me:      ()                => client.get('/auth/me'),

  // Counties
  counties:      ()    => client.get('/counties'),
  county:        (id)  => client.get(`/counties/${id}`),
  countyFarmers: (id)  => client.get(`/counties/${id}/farmers`),

  // Farmers
  farmers:      (params)   => client.get('/farmers', { params }),
  farmer:       (id)       => client.get(`/farmers/${id}`),
  farmerCrops:  (id)       => client.get(`/farmers/${id}/crops`),
  createFarmer: (data)     => client.post('/farmers', data),
  updateFarmer: (id, data) => client.patch(`/farmers/${id}`, data),

  // Listings
  listings:      (params) => client.get('/listings', { params }),
  listing:       (id)     => client.get(`/listings/${id}`),
  createListing: (data)   => client.post('/listings', data),

  // Orders
  orders:      (params)   => client.get('/orders', { params }),
  order:       (id)       => client.get(`/orders/${id}`),
  createOrder: (data)     => client.post('/orders', data),
  updateOrder: (id, data) => client.patch(`/orders/${id}`, data),

  // Shipments
  shipments:      (params)   => client.get('/shipments', { params }),
  shipment:       (id)       => client.get(`/shipments/${id}`),
  createShipment: (data)     => client.post('/shipments', data),
  addEvent:       (id, data) => client.post(`/shipments/${id}/events`, data),
  updateShipment: (id, data) => client.patch(`/shipments/${id}`, data),

  // Traceability
  trace:       (qrId) => client.get(`/trace/${qrId}`),
  createTrace: (data) => client.post('/trace', data),

  // Utility
  health: () => client.get('/health'),
}

const mockApi = {
  login:   async (phone) => ok({ token: 'mock_token_' + Date.now(), user: mock.currentUser(phone) }),
  logout:  async ()      => ok({ message: 'Signed out' }),
  me:      async ()      => ok(mock.currentUser()),

  counties:      async ()     => ok(mock.counties),
  county:        async (id)   => ok(mock.counties.find(c => String(c.id) === String(id)) || mock.counties[0]),
  countyFarmers: async (id)   => ok(mock.farmers.filter(f => String(f.county_id) === String(id))),

  farmers:      async () => ok(mock.farmers),
  farmer:       async (id) => ok(mock.farmers.find(f => String(f.id) === String(id)) || mock.farmers[0]),
  farmerCrops:  async (id) => ok(mock.crops.filter(c => String(c.farmer_id) === String(id))),
  createFarmer: async (data) => ok({ id: Date.now(), ...data }),
  updateFarmer: async (id, data) => ok({ id, ...data }),

  listings:      async () => ok(mock.listings),
  listing:       async (id) => ok(mock.listings.find(l => String(l.id) === String(id)) || mock.listings[0]),
  createListing: async (data) => ok({ id: Date.now(), ...data }),

  orders:      async () => ok(mock.orders),
  order:       async (id) => ok(mock.orders.find(o => String(o.id) === String(id)) || mock.orders[0]),
  createOrder: async (data) => ok({ id: Date.now(), status: 'pending', ...data }),
  updateOrder: async (id, data) => ok({ id, ...data }),

  shipments:      async () => ok(mock.shipments),
  shipment:       async (id) => ok(mock.shipments.find(s => String(s.id) === String(id)) || mock.shipments[0]),
  createShipment: async (data) => ok({ id: Date.now(), status: 'created', ...data }),
  addEvent:       async (id, data) => ok({ id: Date.now(), shipment_id: id, ...data }),
  updateShipment: async (id, data) => ok({ id, ...data }),

  trace:       async (qrId) => ok(mock.traceForQr(qrId)),
  createTrace: async (data) => ok({ id: Date.now(), qr_id: 'TR-' + Date.now(), ...data }),

  health: async () => ok({ status: 'ok', mode: 'mock', time: new Date().toISOString() }),
}

const api = USE_MOCK ? mockApi : realApi

if (typeof window !== 'undefined') {
  // Make the active mode visible in the console for QA
  // eslint-disable-next-line no-console
  console.log(`[Grow] API mode: ${USE_MOCK ? 'MOCK' : 'LIVE → ' + BASE_URL}`)
}

export default api

// ── Auth helpers used by components ──────────────────────────────────────────
export const saveToken  = token => localStorage.setItem('grow_token', token)
export const clearToken = ()    => localStorage.removeItem('grow_token')
export const getToken   = ()    => localStorage.getItem('grow_token')
export const isLoggedIn = ()    => Boolean(getToken())
