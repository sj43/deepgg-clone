import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiResponse, ApiError } from '../types/api'

// Get API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status
    }

    if (error.response) {
      // Server responded with error
      const data = error.response.data as { error?: { message?: string }; message?: string }
      apiError.message = data?.error?.message || data?.message || 'Server error'
      apiError.code = error.code
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'No response from server. Please check your connection.'
    } else {
      // Error setting up request
      apiError.message = error.message
    }

    return Promise.reject(apiError)
  }
)

export { apiClient }

// Generic API request wrapper
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data
    })
    return response.data
  } catch (error) {
    throw error as ApiError
  }
}
