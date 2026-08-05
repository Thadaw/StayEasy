import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the stored JWT to every outgoing request so the backend can identify the user.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Force a login redirect on 401 responses. We don't use silent token refresh
// because the backend doesn't issue refresh tokens — a 401 means the session
// is truly expired and the user must re-authenticate.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
