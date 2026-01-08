from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import models
import schemas
from database import get_db, init_db
from auth import (
    create_access_token,
    get_current_user,
    verify_password,
    verify_password,
    get_password_hash,
    verify_google_token
)
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from twilio.rest import Client
import re

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield


app = FastAPI(title="Pro Methods API",lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID")  # New!
USE_TWILIO = TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID

# Initialize Twilio client if credentials are available
twilio_client = None
if USE_TWILIO:
    try:
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        print(f"✅ Twilio Verify initialized successfully")
        print(f"📱 Verify Service SID: {TWILIO_VERIFY_SERVICE_SID}")
    except Exception as e:
        print(f"❌ Failed to initialize Twilio: {e}")
        print("⚠️  Running in development mode")
        USE_TWILIO = False
else:
    print("⚠️  Twilio Verify credentials not found. Running in development mode.")

def validate_phone_number(phone: str) -> str:
    """
    Validate and format phone number to E.164 format.
    E.164 format: +[country code][number] (e.g., +12345678901)
    """
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    if not cleaned.startswith('+'):
        if len(cleaned) >= 10:
            cleaned = '+' + cleaned
        else:
            raise ValueError("Phone number is too short")
    
    if not re.match(r'^\+[1-9]\d{1,14}$', cleaned):
        raise ValueError("Invalid phone number format. Use E.164 format: +[country code][number]")
    
    return cleaned

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield

@app.get("/")
def read_root():
    return {"message": "Pro Methods API"}

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        auth_provider=user.auth_provider,
        is_verified=True # Auto verify for now for simplicity
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.id})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }

@app.post("/api/auth/phone/send-otp")
def send_otp(phone_request: schemas.PhoneAuthRequest, db: Session = Depends(get_db)):
    # Validate and format phone number
    try:
        validated_phone = validate_phone_number(phone_request.phone)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid phone number: {str(e)}. Please use E.164 format (e.g., +12345678901)"
        )
    
    # Send OTP via Twilio Verify API
    if USE_TWILIO and twilio_client:
        try:
            verification = twilio_client.verify.v2.services(
                TWILIO_VERIFY_SERVICE_SID
            ).verifications.create(
                to=validated_phone,
                channel='sms'  # or 'call' for voice, 'email' for email
            )
            
            print(f"✅ OTP sent successfully to {validated_phone}")
            print(f"📱 Verification SID: {verification.sid}")
            print(f"📊 Status: {verification.status}")
            
            return {
                "message": "OTP sent successfully",
                "phone": validated_phone,
                "status": verification.status
            }
            
        except Exception as e:
            print(f"❌ Failed to send OTP via Twilio Verify: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to send OTP: {str(e)}"
            )
    else:
        # Development mode fallback
        print(f"📋 Development Mode - Would send OTP to: {validated_phone}")
        raise HTTPException(
            status_code=503,
            detail="Twilio Verify service not configured. Please set TWILIO_VERIFY_SERVICE_SID in .env"
        )

@app.post("/api/auth/phone/verify-otp", response_model=schemas.Token)
def verify_otp(
    otp_request: schemas.OTPVerifyRequest,
    db: Session = Depends(get_db)
):
    # Validate phone format
    try:
        validated_phone = validate_phone_number(otp_request.phone)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid phone number: {str(e)}"
        )
    
    # Verify OTP via Twilio Verify API
    if USE_TWILIO and twilio_client:
        try:
            verification_check = twilio_client.verify.v2.services(
                TWILIO_VERIFY_SERVICE_SID
            ).verification_checks.create(
                to=validated_phone,
                code=otp_request.otp_code
            )
            
            print(f"📱 Verification status: {verification_check.status}")
            
            if verification_check.status != "approved":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired OTP code"
                )
            
            print(f"✅ OTP verified successfully for {validated_phone}")
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Failed to verify OTP: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"OTP verification failed: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=503,
            detail="Twilio Verify service not configured"
        )
    
    # Find or create user
    db_user = db.query(models.User).filter(
        models.User.phone == validated_phone
    ).first()

    if not db_user:
        db_user = models.User(
            phone=validated_phone,
            full_name="User",
            auth_provider="phone",
            is_verified=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    else:
        db_user.is_verified = True
        db.commit()

    access_token = create_access_token(data={"sub": db_user.id})

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": db_user
    }

@app.post("/api/auth/google", response_model=schemas.Token)
def google_auth(request: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    id_info = verify_google_token(request.token)
    if not id_info:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    email = id_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google token missing email")

    # Find or create user
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Create new user
        user = models.User(
            email=email,
            full_name=id_info.get("name", "User"),
            first_name=id_info.get("given_name"),
            last_name=id_info.get("family_name"),
            profile_picture=id_info.get("picture"),
            auth_provider="google",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif user.auth_provider != "google" and not user.google_id:
        # Link existing account if email matches? 
        # For now, just allow it or update auth_provider if strictly google?
        # Let's just update the profile picture if missing and allow login
        if not user.profile_picture and id_info.get("picture"):
            user.profile_picture = id_info.get("picture")
        db.commit()

    access_token = create_access_token(data={"sub": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/api/auth/profile", response_model=schemas.UserResponse)
def update_profile(
    profile_update: schemas.UserProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    # Update fields if provided
    if profile_update.first_name is not None:
        current_user.first_name = profile_update.first_name

    if profile_update.last_name is not None:
        current_user.last_name = profile_update.last_name

    if profile_update.date_of_birth is not None:
        current_user.date_of_birth = profile_update.date_of_birth

    if profile_update.gender is not None:
        current_user.gender = profile_update.gender

    # Update full_name if first_name or last_name changed
    if current_user.first_name or current_user.last_name:
        name_parts = []
        if current_user.first_name:
            name_parts.append(current_user.first_name)
        if current_user.last_name:
            name_parts.append(current_user.last_name)
        current_user.full_name = " ".join(name_parts)

    db.commit()
    db.refresh(current_user)

    return current_user

@app.post("/api/contact", response_model=schemas.ContactQueryResponse)
def create_contact_query(query: schemas.ContactQueryCreate, db: Session = Depends(get_db)):
    db_query = models.ContactQuery(
        first_name=query.first_name,
        last_name=query.last_name,
        phone=query.phone,
        email=query.email,
        gender=query.gender
    )
    db.add(db_query)
    db.commit()
    db.refresh(db_query)
    return db_query

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)