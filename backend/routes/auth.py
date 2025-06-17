from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import SignUpRequest, LoginRequest, AuthResponse, User as UserResponse
from models_sql import User, Login
from db import get_db
from kafka_service import kafka_service
from datetime import date
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", response_model=AuthResponse)
async def signup(payload: SignUpRequest, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    result = await db.execute(select(Login).where(Login.email == payload.email))
    existing_login = result.scalar_one_or_none()
    if existing_login:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create the user
    user = User(
        email=payload.email,
        age=payload.age,
        gender=payload.gender,
        signup_date=date.today(),
        preferences = "", # TODO update the real preferences
    )
    db.add(user)
    await db.flush()  # This gives us user.user_id

    # Store hashed password in login table
    login_entry = Login(
        user_id=user.user_id,
        email=payload.email,
        hashed_password=pwd_context.hash(payload.password),
    )
    db.add(login_entry)
    await db.commit()

    # Send new user event to Kafka
    kafka_service.send_new_user(
        user_id=user.user_id,
        user_name=user.email,  # Using email as username
        preferences=user.preferences,
    )

    # Convert SQLAlchemy model to Pydantic model
    user_response = UserResponse(
        user_id=user.user_id,
        email=user.email,
        age=user.age,
        gender=user.gender,
        signup_date=user.signup_date,
        preferences=user.preferences,
        views=[]
    )
    return AuthResponse(user=user_response, token="signup-token-placeholder")

@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Step 1: Find login entry by email
    result = await db.execute(select(Login).where(Login.email == payload.email))
    login_entry = result.scalar_one_or_none()

    if not login_entry:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Step 2: Check password
    if not pwd_context.verify(payload.password, login_entry.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Step 3: Retrieve user record using user_id from login
    user_result = await db.execute(select(User).where(User.user_id == login_entry.user_id))
    user = user_result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=500, detail="User record missing")

    # Step 4: Build response
    user_response = UserResponse(
        user_id=user.user_id,
        email=user.email,
        age=user.age,
        gender=user.gender,
        signup_date=user.signup_date,
        preferences=user.preferences,
        views=[]
    )

    return AuthResponse(user=user_response, token="login-token-placeholder")

