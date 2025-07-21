import type { User, LoginRequest, SignUpRequest, AuthResponse, AuthError } from '../types';
import AuthLogger from '../utils/logging/authLogger';

const API_BASE = '/api';
const TOKEN_KEY = 'auth_token';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API call helper with auth header
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
};

// Auth service functions
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const authResponse: AuthResponse = await response.json();
    setToken(authResponse.token);
    return authResponse;
  },

  // Sign up user
  signup: async (userData: SignUpRequest): Promise<AuthResponse> => {
    const response = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const authResponse: AuthResponse = await response.json();
    setToken(authResponse.token);
    return authResponse;
  },

  // Get current user (we'll need to add this endpoint to backend)
  getCurrentUser: async (): Promise<User> => {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }

    // For now, we'll decode the token to get user info
    // In a real app, you'd want a dedicated /auth/me endpoint
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        removeToken();
        throw new Error('Token expired');
      }

      // Since we don't have a /me endpoint, we'll need to store user data
      // when logging in/signing up and retrieve it from localStorage
      const userData = localStorage.getItem('user_data');
      if (!userData) {
        throw new Error('User data not found');
      }

      return JSON.parse(userData) as User;
    } catch (error) {
      removeToken();
      throw new Error('Invalid token');
    }
  },

  // Logout user
  logout: (): void => {
    removeToken();
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

// Store user data in localStorage
export const storeUserData = (user: User): void => {
  localStorage.setItem('user_data', JSON.stringify(user));
};
