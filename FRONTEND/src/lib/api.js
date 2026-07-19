const defaultBaseUrl = 'http://localhost:5000/api'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultBaseUrl).replace(/\/$/, '')

export function getAuthToken() {
  return localStorage.getItem('karwaan_token') || ''
}

function getAuthHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {})
    },
    ...options
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed')
  }

  return payload
}

export function getOrganizations() {
  return request('/organizations')
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getAdminEmployees() {
  return request('/admin/employees')
}

export function getAdminVehicles() {
  return request('/admin/vehicles')
}

export function getAdminSettings() {
  return request('/admin/settings')
}

export function updateAdminSettings(payload) {
  return request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function updateEmployeeAccess(employeeId, status) {
  return request(`/admin/employees/${employeeId}/access`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export function getMyVehicles() {
  return request('/vehicles')
}

export function updateProfile(data) {
  return request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function getSavedPlaces() {
  return request('/users/saved-places')
}

export function updateSavedPlaces(data) {
  return request('/users/saved-places', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function publishRide(payload) {
  return request('/rides/publish', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function searchRides(params) {
  const query = new URLSearchParams(params).toString()
  return request(`/rides/search?${query}`)
}

export function bookRide(payload) {
  return request('/rides/book', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function createMyVehicle(payload) {
  return request('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function getMyTrips() {
  return request('/rides/my')
}

export function updateTripStatus(rideId, status) {
  return request(`/rides/${rideId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export function getProfile() {
  return request('/users/profile')
}

export function getWalletTransactions() {
  return request('/wallet/transactions')
}

export function rechargeWallet(payload) {
  return request('/wallet/recharge', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function payRideFare(rideId, method = 'Wallet') {
  return request('/payments/ride-fare', {
    method: 'POST',
    body: JSON.stringify({ rideId, method })
  })
}

export function confirmCashPayment(rideId, passengerId) {
  return request('/payments/confirm-cash', {
    method: 'POST',
    body: JSON.stringify({ rideId, passengerId })
  })
}

export function getChatHistory(rideId) {
  return request(`/chats/${rideId}`)
}

export function createRazorpayOrder(amount) {
  return request('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export function verifyRazorpayPayment(payload) {
  return request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}