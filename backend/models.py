from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class Product(BaseModel):
    item_id: int
    name: str
    category: str
    subcategory: str
    price: float
    avg_rating: float
    num_ratings: int
    popular: float
    new_arrival: float
    on_sale: float
    arrival_date: date
    description: str

class User(BaseModel):
    user_id: int
    email: str
    age: int
    gender: str
    signup_date: date
    preferences: str
    views: Optional[List[Product]] = None

class Feedback(BaseModel):
    userId: int
    productId: int
    rating: float
    comment: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    email: str
    password: str
    age: int
    gender: str

class AuthResponse(BaseModel):
    user: User
    token: str

class CartItem(BaseModel):
    user_id: int
    product_id: int
    quantity: int

class CheckoutRequest(BaseModel):
    user_id: int
    items: List[CartItem]
    shipping_address: str
    payment_method: str

class Order(BaseModel):
    order_id: int
    user_id: int
    items: List[CartItem]
    total_amount: float
    order_date: datetime
    status: str

class WishlistItem(BaseModel):
    user_id: int
    product_id: int

