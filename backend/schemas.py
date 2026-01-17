from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: str

class UserCreate(UserBase):
    password: Optional[str] = None
    auth_provider: str = "email"

class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: Optional[str]
    phone: Optional[str]
    full_name: str
    first_name: Optional[str]
    last_name: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[str]
    is_active: bool
    is_verified: bool
    auth_provider: str
    profile_picture: Optional[str]
    weight: Optional[float]
    height: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class GoogleAuthRequest(BaseModel):
    token: str

class PhoneAuthRequest(BaseModel):
    phone: str

class OTPVerifyRequest(BaseModel):
    phone: str
    otp_code: str

class ContactQueryCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: Optional[EmailStr] = None
    gender: str

class ContactQueryResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone: str
    email: Optional[str]
    gender: str
    created_at: datetime

    class Config:
        from_attributes = True

class BlogCreate(BaseModel):
    title: str
    content: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    video_links: Optional[List[str]] = None
    is_published: bool = False

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    video_links: Optional[List[str]] = None
    is_published: Optional[bool] = None

class AuthorInfo(BaseModel):
    id: int
    full_name: str
    first_name: Optional[str]
    last_name: Optional[str]
    profile_picture: Optional[str]

    class Config:
        from_attributes = True

class BlogResponse(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    description: Optional[str]
    author_id: int
    author: AuthorInfo
    cover_image: Optional[str]
    video_links: Optional[List[str]]
    is_published: bool
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BlogListItem(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str]
    author: AuthorInfo
    cover_image: Optional[str]
    is_published: bool
    published_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# Workout Schemas

class WorkoutExerciseBase(BaseModel):
    body_part: str
    exercise_name: str
    weight: Optional[float] = None
    reps: Optional[int] = None
    sets: Optional[int] = 1
    duration_minutes: Optional[int] = None

class WorkoutExerciseCreate(WorkoutExerciseBase):
    pass

class WorkoutExerciseResponse(WorkoutExerciseBase):
    id: int
    workout_log_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WorkoutLogBase(BaseModel):
    date: date

class WorkoutLogCreate(WorkoutLogBase):
    exercises: List[WorkoutExerciseCreate]

class WorkoutLogUpdate(BaseModel):
    exercises: List[WorkoutExerciseCreate]

class WorkoutLogResponse(WorkoutLogBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    exercises: List[WorkoutExerciseResponse]

    class Config:
        from_attributes = True

# Nutrition Schemas

class MealLogBase(BaseModel):
    meal_type: str
    food_name: str
    calories: int
    protein: float
    carbs: float
    fat: float

class MealLogCreate(MealLogBase):
    pass

class MealLogResponse(MealLogBase):
    id: int
    daily_nutrition_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DailyNutritionBase(BaseModel):
    date: date

class DailyNutritionCreate(DailyNutritionBase):
    pass

class DailyNutritionUpdate(BaseModel):
    water_intake: Optional[int] = None

class DailyNutritionResponse(DailyNutritionBase):
    id: int
    user_id: int
    water_intake: int
    total_calories: int
    total_protein: float
    total_carbs: float
    total_fat: float
    created_at: datetime
    updated_at: datetime
    meal_logs: List[MealLogResponse]

    class Config:
        from_attributes = True
