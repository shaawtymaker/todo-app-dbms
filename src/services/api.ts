
import { API_BASE_URL } from "../config/api";

// Get token from localStorage
const getToken = (): string | null => localStorage.getItem('auth_token');

// Handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // First try to get the response body as text
    const responseText = await response.text();
    
    // Log full response for debugging
    console.log('API Error Response:', response.status, response.statusText);
    console.log('Response text:', responseText);
    
    // Try to parse JSON if possible
    let errorData;
    try {
      // Some errors might output text before JSON, try to extract JSON
      const jsonMatch = responseText.match(/{.*}/s);
      if (jsonMatch) {
        errorData = JSON.parse(jsonMatch[0]);
      } else {
        errorData = { message: responseText || `API Error: ${response.status}` };
      }
    } catch (e) {
      errorData = { message: responseText || `API Error: ${response.status}` };
    }
    
    console.log('Parsed error data:', errorData);
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  
  // First try to get the response body as text
  try {
    const responseText = await response.text();
    
    // Handle empty responses
    if (!responseText.trim()) {
      return {} as T;
    }
    
    // Try to parse the response as JSON
    try {
      // Some responses might output text before JSON, try to extract JSON
      const jsonMatch = responseText.match(/{.*}/s) || responseText.match(/\[.*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(responseText) as T;
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return responseText as unknown as T;
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

    // Log the request for debugging
    console.log(`Request: ${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: defaultHeaders,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
