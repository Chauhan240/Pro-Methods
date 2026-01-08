# Pro Methods Backend API

FastAPI backend with authentication support for Pro Methods fitness platform.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `SECRET_KEY`: Generate a secure random key
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `TWILIO_ACCOUNT_SID`: Your Twilio account SID (for SMS OTP)
- `TWILIO_AUTH_TOKEN`: Your Twilio auth token
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number

### 3. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Email/Password Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "auth_provider": "email"
}
```

#### Email/Password Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Google OAuth
```
POST /api/auth/google
Content-Type: application/json

{
  "token": "google-id-token"
}
```

#### Send OTP to Phone
```
POST /api/auth/phone/send-otp
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

#### Verify OTP
```
POST /api/auth/phone/verify-otp
Content-Type: application/json

{
  "phone": "+1234567890",
  "otp_code": "123456"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

## Database

The application uses SQLite with the following models:

### User Model
- `id`: Primary key
- `email`: Unique email address (optional)
- `phone`: Unique phone number (optional)
- `hashed_password`: Bcrypt hashed password
- `full_name`: User's full name
- `is_active`: Account active status
- `is_verified`: Email/phone verification status
- `auth_provider`: Authentication method (email, google, phone)
- `google_id`: Google OAuth ID (optional)
- `profile_picture`: Profile image URL
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### OTPVerification Model
- `id`: Primary key
- `phone`: Phone number
- `otp_code`: Hashed OTP code
- `is_verified`: Verification status
- `created_at`: Creation timestamp
- `expires_at`: Expiration timestamp

## Development Notes

- OTP codes are printed to console in development mode
- For production, configure Twilio to send actual SMS messages
- Update CORS origins in `main.py` to match your frontend URL
- Change the `SECRET_KEY` in production to a secure random value
