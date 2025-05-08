
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, AuthResponse } from '../services/authService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse | undefined>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<AuthResponse | undefined>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists
        if (authService.isAuthenticated()) {
          try {
            // Try to refresh the token to get user data
            const response = await authService.refreshToken();
            setUser(response.user);
            localStorage.setItem('user_data', JSON.stringify(response.user));
          } catch (error) {
            console.error('Token invalid or expired:', error);
            // Clear invalid token
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login handler
  const login = async (email: string, password: string): Promise<AuthResponse | undefined> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register handler
  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AuthResponse | undefined> => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setUser(response.user);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again",
        variant: "destructive",
      });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
