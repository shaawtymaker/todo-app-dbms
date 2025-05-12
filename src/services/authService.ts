
import { apiClient } from "./api";
import { API_ENDPOINTS } from "../config/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
      console.log("Login response:", response);
      
      // Validate the response structure
      if (!response || typeof response !== 'object') {
        console.error('Invalid response format:', response);
        throw new Error("Invalid response format from server");
      }
      
      // Check for essential properties
      if (!response.token || !response.user) {
        console.error('Missing token or user in response:', response);
        throw new Error("Invalid response data: missing token or user");
      }
      
      // Validate user object
      if (!response.user.id || !response.user.email) {
        console.error('Invalid user object in response:', response.user);
        throw new Error("Invalid user data in response");
      }
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.register, userData);
      console.log("Registration response:", response);
      
      // Validate the response structure
      if (!response || typeof response !== 'object') {
        console.error('Invalid response format:', response);
        throw new Error("Invalid response format from server");
      }
      
      // Check for essential properties
      if (!response.token || !response.user) {
        console.error('Missing token or user in response:', response);
        throw new Error("Invalid response data: missing token or user");
      }
      
      // Validate user object
      if (!response.user.id || !response.user.email) {
        console.error('Invalid user object in response:', response.user);
        throw new Error("Invalid user data in response");
      }
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  // Logout user
  async logout(): Promise<void> {
    // Call logout endpoint to invalidate token on server
    try {
      await apiClient.post<{ message: string }>(API_ENDPOINTS.auth.logout, {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Remove token from localStorage regardless of server response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },
  
  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.refresh, {});
      
      // Validate the response structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response format from server");
      }
      
      // Check for essential properties
      if (!response.token || !response.user) {
        throw new Error("Invalid response data: missing token or user");
      }
      
      // Update token in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.error("Token refresh error:", error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
  
  // Get current token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('user_data');
      return null;
    }
  }
};
