export interface ProductData {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export interface CartItem {
  userId: string;
  productId: string;
}

export interface User {
  user_id: string;
  email: string;
  age: number;
  gender: string;
  signup_date: string; // Changed from date to string to match backend
  preferences: string;
  views?: string[]; // Added optional views array
}

// Auth-related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  age: number;
  gender: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  detail: string;
}
