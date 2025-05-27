
import { API_BASE_URL } from "../config/api";

// Get token from localStorage
const getToken = (): string | null => localStorage.getItem('auth_token');

// Handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  console.log('API Response Status:', response.status);
  console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    let responseText;
    try {
      responseText = await response.text();
      console.log('Error response body:', responseText);
    } catch (e) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    // Check if we're getting HTML instead of JSON (backend not reachable)
    if (responseText.includes('<!DOCTYPE html>')) {
      throw new Error('Backend API not reachable. Please check your backend server is running.');
    }
    
    // Try to parse JSON error
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (e) {
      errorData = { message: responseText || `API Error: ${response.status}` };
    }
    
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  
  // Handle empty responses safely
  try {
    const responseText = await response.text();
    console.log('Success response body:', responseText);
    
    // Handle empty responses
    if (!responseText || !responseText.trim()) {
      return {} as T;
    }
    
    // Check if we're getting HTML instead of JSON (backend not reachable)
    if (responseText.includes('<!DOCTYPE html>')) {
      throw new Error('Backend API not reachable. Please check your backend server is running.');
    }
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(responseText) as T;
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Error reading response body:', error);
    throw error;
  }
};

// The main request function with proper typing
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = getToken();
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`Making ${options.method || 'GET'} request to: ${fullUrl}`);
    console.log('Request headers:', defaultHeaders);
    console.log('Request body:', options.body);

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
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
