from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date
from contextlib import asynccontextmanager
import os
import uuid
import shutil
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
from twilio.http.http_client import TwilioHttpClient
import re
import json
from typing import Optional, List

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield


app = FastAPI(title="Pro Methods API",lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount blogposts directory for static file serving
# Ensure directory exists
BLOG_POSTS_DIR = "blogposts"
if not os.path.exists(BLOG_POSTS_DIR):
    os.makedirs(BLOG_POSTS_DIR)

app.mount("/blogposts", StaticFiles(directory=BLOG_POSTS_DIR), name="blogposts")

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), title: str = None):
    try:
        # Create a unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_id = uuid.uuid4().hex[:8]
        
        # Clean the title for filename if provided, else use original filename base
        if title:
            clean_title = re.sub(r'[^\w\s-]', '', title.lower())
            clean_title = re.sub(r'[-\s]+', '-', clean_title).strip('-')
            filename = f"{unique_id}_{clean_title}{file_extension}"
        else:
            filename = f"{unique_id}_{file.filename}"
            
        file_path = os.path.join(BLOG_POSTS_DIR, filename)
        
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the full URL
        # For local dev, we assume localhost:8000
        # In production this would be an env var
        base_url = os.getenv("API_URL", "http://localhost:8000")
        file_url = f"{base_url}/blogposts/{filename}"
        
        return {"url": file_url}
        
    except Exception as e:
        print(f"❌ File upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID")  # New!
USE_TWILIO = TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID

# Initialize Twilio client if credentials are available
twilio_client = None
if USE_TWILIO:
    try:
        http_client = TwilioHttpClient()
        http_client.session.timeout = 15  # 15 seconds timeout
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, http_client=http_client)
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

    if profile_update.weight is not None:
        current_user.weight = profile_update.weight

    if profile_update.height is not None:
        current_user.height = profile_update.height

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

# Helper function for slug generation
def generate_slug(title: str, db: Session) -> str:
    """Generate a unique slug from title"""
    base_slug = re.sub(r'[^\w\s-]', '', title.lower())
    base_slug = re.sub(r'[-\s]+', '-', base_slug).strip('-')

    # Fallback if title has no slugifiable characters
    if not base_slug:
        base_slug = f"post-{uuid.uuid4().hex[:8]}"

    # Ensure uniqueness
    slug = base_slug
    counter = 1
    while db.query(models.Blog).filter(models.Blog.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug

# Blog Endpoints
@app.get("/api/blogs", response_model=list[schemas.BlogListItem])
def get_blogs(
    skip: int = 0,
    limit: int = 100,
    published_only: bool = True,
    current_user: Optional[models.User] = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get all blogs. Returns only published blogs unless user is authenticated."""
    query = db.query(models.Blog)

    # If not authenticated, show only published blogs
    if published_only and not current_user:
        query = query.filter(models.Blog.is_published == True)

    blogs = query.order_by(models.Blog.created_at.desc()).offset(skip).limit(limit).all()

    # Convert to response format with author info
    result = []
    for blog in blogs:
        author = db.query(models.User).filter(models.User.id == blog.author_id).first()
        blog_dict = {
            "id": blog.id,
            "title": blog.title,
            "slug": blog.slug,
            "description": blog.description,
            "cover_image": blog.cover_image,
            "is_published": blog.is_published,
            "published_at": blog.published_at,
            "created_at": blog.created_at,
            "author": {
                "id": author.id,
                "full_name": author.full_name,
                "first_name": author.first_name,
                "last_name": author.last_name,
                "profile_picture": author.profile_picture
            }
        }
        result.append(blog_dict)

    return result

@app.get("/api/blogs/{slug}", response_model=schemas.BlogResponse)
def get_blog(slug: str, db: Session = Depends(get_db)):
    """Get a single blog by slug"""
    blog = db.query(models.Blog).filter(models.Blog.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Get author info
    author = db.query(models.User).filter(models.User.id == blog.author_id).first()

    # Parse video_links from JSON string to list
    video_links = None
    if blog.video_links:
        try:
            video_links = json.loads(blog.video_links)
        except:
            video_links = []

    # Build response
    response = {
        "id": blog.id,
        "title": blog.title,
        "slug": blog.slug,
        "content": blog.content,
        "description": blog.description,
        "author_id": blog.author_id,
        "cover_image": blog.cover_image,
        "video_links": video_links,
        "is_published": blog.is_published,
        "published_at": blog.published_at,
        "created_at": blog.created_at,
        "updated_at": blog.updated_at,
        "author": {
            "id": author.id,
            "full_name": author.full_name,
            "first_name": author.first_name,
            "last_name": author.last_name,
            "profile_picture": author.profile_picture
        }
    }

    return response

@app.post("/api/blogs", response_model=schemas.BlogResponse)
def create_blog(
    blog: schemas.BlogCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new blog post (authenticated users only)"""
    # Generate unique slug from title
    slug = generate_slug(blog.title, db)

    # Convert video_links list to JSON string
    video_links_json = None
    if blog.video_links:
        video_links_json = json.dumps(blog.video_links)

    # Create blog
    db_blog = models.Blog(
        title=blog.title,
        slug=slug,
        content=blog.content,
        description=blog.description,
        author_id=current_user.id,
        cover_image=blog.cover_image,
        video_links=video_links_json,
        is_published=blog.is_published,
        published_at=datetime.utcnow() if blog.is_published else None
    )

    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)

    # Build response with author info
    video_links = json.loads(db_blog.video_links) if db_blog.video_links else None

    response = {
        "id": db_blog.id,
        "title": db_blog.title,
        "slug": db_blog.slug,
        "content": db_blog.content,
        "description": db_blog.description,
        "author_id": db_blog.author_id,
        "cover_image": db_blog.cover_image,
        "video_links": video_links,
        "is_published": db_blog.is_published,
        "published_at": db_blog.published_at,
        "created_at": db_blog.created_at,
        "updated_at": db_blog.updated_at,
        "author": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "profile_picture": current_user.profile_picture
        }
    }

    return response

@app.put("/api/blogs/{blog_id}", response_model=schemas.BlogResponse)
def update_blog(
    blog_id: int,
    blog_update: schemas.BlogUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a blog post (author only)"""
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()

    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Check if user is the author
    if db_blog.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this blog")

    # Update fields
    if blog_update.title is not None:
        db_blog.title = blog_update.title
        # Regenerate slug if title changed
        db_blog.slug = generate_slug(blog_update.title, db)

    if blog_update.content is not None:
        db_blog.content = blog_update.content

    if blog_update.description is not None:
        db_blog.description = blog_update.description

    if blog_update.cover_image is not None:
        db_blog.cover_image = blog_update.cover_image

    if blog_update.video_links is not None:
        db_blog.video_links = json.dumps(blog_update.video_links)

    if blog_update.is_published is not None:
        # If publishing for the first time
        if blog_update.is_published and not db_blog.is_published:
            db_blog.published_at = datetime.utcnow()
        db_blog.is_published = blog_update.is_published

    db.commit()
    db.refresh(db_blog)

    # Build response
    video_links = json.loads(db_blog.video_links) if db_blog.video_links else None

    response = {
        "id": db_blog.id,
        "title": db_blog.title,
        "slug": db_blog.slug,
        "content": db_blog.content,
        "description": db_blog.description,
        "author_id": db_blog.author_id,
        "cover_image": db_blog.cover_image,
        "video_links": video_links,
        "is_published": db_blog.is_published,
        "published_at": db_blog.published_at,
        "created_at": db_blog.created_at,
        "updated_at": db_blog.updated_at,
        "author": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "profile_picture": current_user.profile_picture
        }
    }

    return response

@app.delete("/api/blogs/{blog_id}")
def delete_blog(
    blog_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a blog post (author only)"""
    db_blog = db.query(models.Blog).filter(models.Blog.id == blog_id).first()

    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Check if user is the author
    if db_blog.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this blog")

    db.delete(db_blog)
    db.commit()

    return {"message": "Blog deleted successfully"}


# Workout Log Endpoints

@app.get("/api/workout_logs", response_model=List[schemas.WorkoutLogResponse])
def get_workout_logs(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get workout logs for the current user, optionally filtered by date range"""
    query = db.query(models.WorkoutLog).filter(models.WorkoutLog.user_id == current_user.id)
    
    if start_date:
        query = query.filter(models.WorkoutLog.date >= start_date)
    if end_date:
        query = query.filter(models.WorkoutLog.date <= end_date)
        
    return query.order_by(models.WorkoutLog.date.desc()).all()

@app.get("/api/workout_logs/{log_date}", response_model=schemas.WorkoutLogResponse)
def get_workout_log_by_date(
    log_date: date,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific workout log by date"""
    log = db.query(models.WorkoutLog).filter(
        models.WorkoutLog.user_id == current_user.id,
        models.WorkoutLog.date == log_date
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Workout log not found for this date")
        
    return log

@app.post("/api/workout_logs", response_model=schemas.WorkoutLogResponse)
def create_or_update_workout_log(
    workout_log: schemas.WorkoutLogCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update a workout log for a specific date"""
    # Check if log exists for this date
    existing_log = db.query(models.WorkoutLog).filter(
        models.WorkoutLog.user_id == current_user.id,
        models.WorkoutLog.date == workout_log.date
    ).first()
    
    if existing_log:
        # Update existing log: delete old exercises and add new ones (simple replacement strategy)
        # Or we could just append? The prompt implies "fill the information and save", usually implies simple state sync.
        # Let's go with replacement of exercises for simplicity in this iteration.
        
        # Delete existing exercises
        db.query(models.WorkoutExercise).filter(
            models.WorkoutExercise.workout_log_id == existing_log.id
        ).delete()
        
        # Add new exercises
        for exercise in workout_log.exercises:
            new_exercise = models.WorkoutExercise(
                workout_log_id=existing_log.id,
                body_part=exercise.body_part,
                exercise_name=exercise.exercise_name,
                weight=exercise.weight,
                reps=exercise.reps,
                sets=exercise.sets
            )
            db.add(new_exercise)
            
        existing_log.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_log)
        return existing_log
        
    else:
        # Create new log
        new_log = models.WorkoutLog(
            user_id=current_user.id,
            date=workout_log.date
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        
        # Add exercises
        for exercise in workout_log.exercises:
            new_exercise = models.WorkoutExercise(
                workout_log_id=new_log.id,
                body_part=exercise.body_part,
                exercise_name=exercise.exercise_name,
                weight=exercise.weight,
                reps=exercise.reps,
                sets=exercise.sets
            )
            db.add(new_exercise)
            
        db.commit()
        db.refresh(new_log)
        return new_log

@app.delete("/api/workout_logs/{log_id}")
def delete_workout_log(
    log_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a workout log"""
    log = db.query(models.WorkoutLog).filter(
        models.WorkoutLog.id == log_id,
        models.WorkoutLog.user_id == current_user.id
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Workout log not found")
        
    db.delete(log)
    db.commit()
    
    return {"message": "Workout log deleted successfully"}


# Nutrition Endpoints

@app.get("/api/nutrition/today", response_model=schemas.DailyNutritionResponse)
def get_todays_nutrition(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get nutrition log for today"""
    today = datetime.now().date()
    
    daily_nutrition = db.query(models.DailyNutrition).filter(
        models.DailyNutrition.user_id == current_user.id,
        models.DailyNutrition.date == today
    ).first()
    
    if not daily_nutrition:
        # Create empty log if not exists
        daily_nutrition = models.DailyNutrition(
            user_id=current_user.id,
            date=today,
            water_intake=0
        )
        db.add(daily_nutrition)
        db.commit()
        db.refresh(daily_nutrition)
        
    return daily_nutrition

@app.post("/api/nutrition/meals", response_model=schemas.MealLogResponse)
def add_meal_log(
    meal: schemas.MealLogCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a food item to today's log"""
    today = datetime.now().date()
    
    # Get or create daily log
    daily_nutrition = db.query(models.DailyNutrition).filter(
        models.DailyNutrition.user_id == current_user.id,
        models.DailyNutrition.date == today
    ).first()
    
    if not daily_nutrition:
        daily_nutrition = models.DailyNutrition(
            user_id=current_user.id,
            date=today,
            water_intake=0
        )
        db.add(daily_nutrition)
        db.commit()
        db.refresh(daily_nutrition)
    
    # Add meal log
    new_meal = models.MealLog(
        daily_nutrition_id=daily_nutrition.id,
        meal_type=meal.meal_type,
        food_name=meal.food_name,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat
    )
    
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    
    # Update Daily Totals
    daily_nutrition.total_calories += meal.calories
    daily_nutrition.total_protein += meal.protein
    daily_nutrition.total_carbs += meal.carbs
    daily_nutrition.total_fat += meal.fat
    
    db.commit()
    
    return new_meal

@app.delete("/api/nutrition/meals/{meal_id}")
def delete_meal_log(
    meal_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a food item from the log"""
    meal = db.query(models.MealLog).join(models.DailyNutrition).filter(
        models.MealLog.id == meal_id,
        models.DailyNutrition.user_id == current_user.id
    ).first()
    
    if not meal:
        raise HTTPException(status_code=404, detail="Meal log not found")
        
    # Get daily log to update totals
    daily_nutrition = db.query(models.DailyNutrition).filter(
        models.DailyNutrition.id == meal.daily_nutrition_id
    ).first()
    
    if daily_nutrition:
        daily_nutrition.total_calories = max(0, daily_nutrition.total_calories - meal.calories)
        daily_nutrition.total_protein = max(0, daily_nutrition.total_protein - meal.protein)
        daily_nutrition.total_carbs = max(0, daily_nutrition.total_carbs - meal.carbs)
        daily_nutrition.total_fat = max(0, daily_nutrition.total_fat - meal.fat)

    db.delete(meal)
    db.commit()
    
    return {"message": "Meal deleted successfully"}

@app.put("/api/nutrition/water", response_model=schemas.DailyNutritionResponse)
def update_water_intake(
    water_update: schemas.DailyNutritionUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update water intake for today"""
    today = datetime.now().date()
    
    daily_nutrition = db.query(models.DailyNutrition).filter(
        models.DailyNutrition.user_id == current_user.id,
        models.DailyNutrition.date == today
    ).first()
    
    if not daily_nutrition:
        daily_nutrition = models.DailyNutrition(
            user_id=current_user.id,
            date=today,
            water_intake=0
        )
        db.add(daily_nutrition)
    
    if water_update.water_intake is not None:
        daily_nutrition.water_intake = water_update.water_intake
        
    db.commit()
    db.refresh(daily_nutrition)
    
    return daily_nutrition

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)