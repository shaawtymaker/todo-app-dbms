
import { API_BASE_URL } from "../config/api";

// Get token from localStorage
const getToken = (): string | null => localStorage.getItem('auth_token');

// Handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

// The main request function with proper typing
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return handleResponse<T>(response);
}

// Define type for the API client
export interface ApiClient {
  request<T>(endpoint: string, options?: RequestInit): Promise<T>;
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: any): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

// API client with proper typed functions
export const apiClient: ApiClient = {
  request,

  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data: any): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, {
      method: 'DELETE',
    });
  },
};
