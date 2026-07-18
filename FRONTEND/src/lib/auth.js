export function getStoredSession() {
  const token = localStorage.getItem('karwaan_token')
  const rawUser = localStorage.getItem('karwaan_user')

  if (!token || !rawUser) {
    return { token: '', user: null }
  }

  try {
    return { token, user: JSON.parse(rawUser) }
  } catch {
    return { token: '', user: null }
  }
}

export function clearStoredSession() {
  localStorage.removeItem('karwaan_token')
  localStorage.removeItem('karwaan_user')
}