
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
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    return response;
  },
  
  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.register, userData);
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    return response;
  },
  
  // Logout user
  async logout(): Promise<void> {
    // Call logout endpoint to invalidate token on server
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout, {});
    } finally {
      // Remove token from localStorage regardless of server response
      localStorage.removeItem('auth_token');
    }
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
  
  // Get current token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};
