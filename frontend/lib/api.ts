const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface User {
  id: number;
  email?: string;
  phone?: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  is_active: boolean;
  is_verified: boolean;
  auth_provider: string;
  profile_picture?: string;
  weight?: number;
  height?: number;
  created_at: string;
}

export interface AuthorInfo {
  id: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  author_id: number;
  author: AuthorInfo;
  cover_image?: string;
  video_links?: string[];
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  author: AuthorInfo;
  cover_image?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

export interface BlogCreateRequest {
  title: string;
  content: string;
  description?: string;
  cover_image?: string;
  video_links?: string[];
  is_published: boolean;
}

export interface BlogUpdateRequest {
  title?: string;
  content?: string;
  description?: string;
  cover_image?: string;
  video_links?: string[];
  is_published?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  password?: string;
  full_name: string;
  auth_provider: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password?: string;
}

export const api = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      return response.json();
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
      }
      throw error;
    }
  },

  async googleAuth(token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Google authentication failed');
    }

    return response.json();
  },

  async sendOTP(phone: string): Promise<{ message: string; otp_code_dev?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send OTP');
      }

      return response.json();
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
      }
      throw error;
    }
  },

  async verifyOTP(phone: string, otp_code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp_code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'OTP verification failed');
      }

      return response.json();
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
      }
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch user');
    }

    return response.json();
  },

  async updateProfile(
    token: string,
    profileData: {
      first_name?: string;
      last_name?: string | null;
      date_of_birth?: string | null;
      gender?: string;
      weight?: number | null;
      height?: number | null;
    }
  ): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }

    return response.json();
  },

  async submitContactQuery(data: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    gender: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to submit query");
    }

    return response.json();
  },

  async getBlogs(): Promise<BlogListItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/blogs`);
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
    return response.json();
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch blog");
    }
    return response.json();
  },

  async createBlog(token: string, blogData: BlogCreateRequest): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create blog");
    }

    return response.json();
  },

  async updateBlog(
    token: string,
    blogId: number,
    blogData: BlogUpdateRequest
  ): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update blog");
    }

    return response.json();
  },

  async deleteBlog(token: string, blogId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete blog");
    }

    return response.json();
  },

  async uploadImage(file: File, title?: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) {
      formData.append("title", title);
    }

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to upload image");
    }

    return response.json();
  },
};

export interface WorkoutExercise {
  id?: number;
  body_part: string;
  exercise_name: string;
  weight?: number;
  reps?: number;
  sets?: number;
}

export interface WorkoutLog {
  id: number;
  user_id: number;
  date: string;
  created_at: string;
  updated_at: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutLogCreate {
  date: string;
  exercises: WorkoutExercise[];
}

export const workoutApi = {
  async getWorkoutLogs(token: string): Promise<WorkoutLog[]> {
    const response = await fetch(`${API_BASE_URL}/api/workout_logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch workout logs");
    }
    return response.json();
  },

  async getWorkoutLogByDate(token: string, date: string): Promise<WorkoutLog | null> {
    const response = await fetch(`${API_BASE_URL}/api/workout_logs/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch workout log");
    }
    return response.json();
  },

  async createWorkoutLog(token: string, data: WorkoutLogCreate): Promise<WorkoutLog> {
    const response = await fetch(`${API_BASE_URL}/api/workout_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to save workout log");
    }

    return response.json();
  },
};

export interface MealLog {
  id: number;
  daily_nutrition_id: number;
  meal_type: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export interface MealLogCreate {
  meal_type: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyNutrition {
  id: number;
  user_id: number;
  date: string;
  water_intake: number;
  meal_logs: MealLog[];
}

export const nutritionApi = {
  async getTodayNutrition(token: string): Promise<DailyNutrition> {
    const response = await fetch(`${API_BASE_URL}/api/nutrition/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch nutrition logs");
    }
    return response.json();
  },

  async addMealLog(token: string, data: MealLogCreate): Promise<MealLog> {
    const response = await fetch(`${API_BASE_URL}/api/nutrition/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add meal");
    }
    return response.json();
  },

  async deleteMealLog(token: string, mealId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/nutrition/meals/${mealId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete meal");
    }
  },

  async updateWaterIntake(token: string, count: number): Promise<DailyNutrition> {
    const response = await fetch(`${API_BASE_URL}/api/nutrition/water`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ water_intake: count }),
    });

    if (!response.ok) {
      throw new Error("Failed to update water intake");
    }
    return response.json();
  },
};

