import apiClient from './client'

export async function register({ name, email, password }) {
  const response = await apiClient.post('/register', { name, email, password })
  return response.data
}

export async function login({ email, password }) {
  const response = await apiClient.post('/login', { email, password })
  return response.data
}

export async function getProfile() {
  const response = await apiClient.get('/profile')
  return response.data
}
