import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Attach the JWT to every request automatically, if we have one
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
