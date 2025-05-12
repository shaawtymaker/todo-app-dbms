
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, AuthResponse } from '../services/authService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists
        if (authService.isAuthenticated()) {
          // Get user from localStorage first
          const storedUser = authService.getCurrentUser();
          
          if (storedUser) {
            setUser(storedUser);
            console.log("User authenticated from localStorage:", storedUser);
          } else {
            console.log("No user found in localStorage");
          }
          
          // Don't try to refresh token if we're on login/register pages
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            try {
              // Try to refresh the token to verify it's still valid
              const response = await authService.refreshToken();
              setUser(response.user);
              localStorage.setItem('user_data', JSON.stringify(response.user));
              console.log("Token refreshed successfully, user:", response.user);
            } catch (error) {
              console.error('Token invalid or expired:', error);
              // Clear invalid token
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              setUser(null);
            }
          }
        } else {
          console.log("No authentication token found");
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear any potentially corrupted state
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [location.pathname]);
  
  // Login handler
  const login = async (email: string, password: string): Promise<AuthResponse | undefined> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect to home page or intended destination
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
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
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      // Redirect to home page
      navigate('/', { replace: true });
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again",
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
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
      // Force logout even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      navigate('/login');
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
