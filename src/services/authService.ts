
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
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
};
