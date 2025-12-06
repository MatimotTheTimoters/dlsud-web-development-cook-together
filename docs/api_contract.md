Looking at the provided files, I can see that `api_contract.md` needs to be updated to be consistent with the current project structure and implementation. Let me rewrite it based on the information from the other files.

# API Contract Documentation

<details>
<summary>Overview</summary>

This document outlines the API contract between the frontend React application and backend PHP API for the CookTogether project. The API follows RESTful conventions with JSON responses and JWT authentication.

---

**Base URL:** `http://localhost/backend/api/` (Development with XAMPP)
**Authentication:** Bearer Token (JWT)
**Response Format:** JSON
**Error Handling:** Standard HTTP status codes with consistent error response structure

---

**Common Response Structure:**
```json
{
  "success": boolean,
  "message": string,
  "data": object|array|null,
  "timestamp": string
}
```

**Error Response Structure:**
```json
{
  "success": false,
  "message": string,
  "errors": array|null,
  "timestamp": string
}
```

**Validation Error Structure:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  },
  "timestamp": "2024-01-16T14:30:00Z"
}
```

</details>

---

<details>
<summary>Authentication API</summary>

---

<details>
<summary>POST /api/auth/register</summary>

**Description:** Register a new user account with initial stats and gamification rewards

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "age": 25,
  "gender": "male"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "full_name": "John Doe",
      "age": 25,
      "gender": "male",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here",
    "expires_in": 3600,
    "initial_rewards": {
      "gold_count": 100,
      "gem_count": 0,
      "login_streak": 1
    }
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email already registered"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

</details>

---

<details>
<summary>POST /api/auth/login</summary>

**Description:** Authenticate user and return JWT token with gamification data

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "full_name": "John Doe",
      "profile_picture": null,
      "age": 25,
      "gender": "male",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "stats": {
      "level": 1,
      "current_exp": 0,
      "gold_count": 100,
      "gem_count": 0,
      "login_streak": 2
    },
    "token": "jwt_token_here",
    "expires_in": 3600,
    "daily_bonus": {
      "exp_bonus": 10,
      "gold_bonus": 5,
      "gem_bonus": 0,
      "streak": 2
    }
  }
}
```

**Response (Error - 401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": null
}
```

</details>

---

<details>
<summary>GET /api/auth/me</summary>

**Description:** Get current authenticated user information with gamification stats

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "full_name": "John Doe",
      "age": 25,
      "gender": "male",
      "profile_picture": "uploads/profile-pictures/user_123.jpg",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T09:15:00Z"
    },
    "stats": {
      "level": 5,
      "current_exp": 450,
      "current_level_ceiling": 500,
      "gold_count": 1250,
      "gem_count": 45,
      "login_streak": 7,
      "recipes_created": 12,
      "recipes_cooked": 28,
      "challenges_completed": 5,
      "recipes_sold": 3
    },
    "limits": {
      "max_exp_reward": 150,
      "max_gold_reward": 75,
      "max_gem_reward": 8,
      "max_gold_price": 200,
      "max_gem_price": 20
    },
    "level_progress": {
      "current_level": 5,
      "current_exp": 450,
      "exp_needed_for_next": 50,
      "progress_percentage": 90.0,
      "level_title": "Sous Chef",
      "next_level_title": "Head Chef"
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/auth/logout</summary>

**Description:** Invalidate current authentication token (client-side clear)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

</details>

---

<details>
<summary>POST /api/auth/refresh-token</summary>

**Description:** Refresh expired JWT token

**Headers:**
```
Authorization: Bearer {expired_token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "expires_in": 3600
  }
}
```

</details>

</details>

---

<details>
<summary>Users API</summary>

---

<details>
<summary>GET /api/users/profile</summary>

**Description:** Get user profile information with relationship status

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (optional): Get specific user profile, defaults to current user

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user_123",
      "full_name": "John Doe",
      "profile_picture": "uploads/profile-pictures/user_123.jpg",
      "age": 25,
      "gender": "male",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "stats": {
      "level": 5,
      "current_exp": 450,
      "current_level_ceiling": 500,
      "gold_count": 1250,
      "gem_count": 45,
      "login_streak": 7,
      "recipes_created": 12,
      "recipes_cooked": 28,
      "challenges_completed": 5
    },
    "level_progress": {
      "current_level": 5,
      "current_exp": 450,
      "exp_needed_for_next": 50,
      "progress_percentage": 90.0,
      "level_title": "Sous Chef",
      "next_level_title": "Head Chef"
    },
    "is_following": true,
    "is_friend": false
  }
}
```

</details>

---

<details>
<summary>PUT /api/users/update</summary>

**Description:** Update user profile information

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "John Updated",
  "age": 26,
  "gender": "male",
  "profile_picture": "uploads/profile-pictures/new_avatar.jpg"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_123",
      "full_name": "John Updated",
      "profile_picture": "uploads/profile-pictures/new_avatar.jpg",
      "age": 26,
      "gender": "male",
      "updated_at": "2024-01-16T14:20:00Z"
    }
  }
}
```

**Note:** File upload for profile pictures will be handled separately in Feature 8 via `/api/upload/image`

</details>

---

<details>
<summary>GET /api/users/stats</summary>

**Description:** Get detailed user statistics and gamification data

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (optional): Get specific user stats, defaults to current user

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "level": 5,
    "current_exp": 450,
    "current_level_ceiling": 500,
    "gold_count": 1250,
    "gem_count": 45,
    "login_streak": 7,
    "recipes_created": 12,
    "recipes_cooked": 28,
    "challenges_completed": 5,
    "recipes_sold": 3,
    "max_exp_reward": 150,
    "max_gold_reward": 75,
    "max_gem_reward": 8,
    "max_gold_price": 200,
    "max_gem_price": 20,
    "last_limit_update": "2024-01-16T10:00:00Z",
    "level_progress": {
      "current_level": 5,
      "current_exp": 450,
      "exp_needed_for_next": 50,
      "progress_percentage": 90.0,
      "level_title": "Sous Chef",
      "next_level_title": "Head Chef",
      "can_level_up": false
    },
    "daily_bonus": {
      "exp_bonus": 10,
      "gold_bonus": 5,
      "gem_bonus": 1,
      "streak": 7,
      "next_milestone": 7
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/users/search</summary>

**Description:** Search for users by name or email with pagination

**Headers:** (Optional, but recommended for following status)
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `q` (required): Search query
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "full_name": "John Doe",
        "profile_picture": "uploads/profile-pictures/user_123.jpg",
        "level": 5,
        "recipes_created": 12,
        "recipes_cooked": 28,
        "is_following": true
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_results": 52,
      "has_more": true,
      "limit": 20
    }
  }
}
```

</details>

</details>

---

<details>
<summary>Relationships API</summary>

---

<details>
<summary>POST /api/relationships/follow</summary>

**Description:** Follow or unfollow a user

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "target_user_id": "user_456",
  "action": "follow"  // or "unfollow"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Successfully followed user",
  "data": {
    "relationship_id": "rel_789",
    "status": "following",
    "user": {
      "id": "user_456",
      "full_name": "Jane Smith",
      "profile_picture": "uploads/profile-pictures/user_456.jpg"
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/relationships/friends</summary>

**Description:** Send, accept, reject, or remove friend requests

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "target_user_id": "user_456",
  "action": "send_request"  // or "accept", "reject", "remove"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Friend request sent",
  "data": {
    "relationship_id": "rel_789",
    "status": "pending",
    "user": {
      "id": "user_456",
      "full_name": "Jane Smith",
      "profile_picture": "uploads/profile-pictures/user_456.jpg"
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/relationships/list</summary>

**Description:** Get list of followers, following, or friends with gamification data

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `type` (required): "followers", "following", or "friends"
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50): Results per page

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "relationships": [
      {
        "user": {
          "id": "user_456",
          "full_name": "Jane Smith",
          "profile_picture": "uploads/profile-pictures/user_456.jpg",
          "level": 8,
          "recipes_created": 24,
          "recipes_cooked": 56
        },
        "relationship_type": "following",
        "status": "accepted",
        "created_at": "2024-01-10T15:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_results": 75,
      "has_more": true,
      "limit": 50
    }
  }
}
```

</details>

</details>

---

<details>
<summary>Recipes API</summary>

---

<details>
<summary>GET /api/recipes</summary>

**Description:** Get list of recipes with filtering, sorting, and pagination

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page
- `difficulty` (optional): "easy", "medium", "hard"
- `origin` (optional): Cuisine type
- `user_id` (optional): Filter by specific user
- `sort_by` (optional): "newest", "popular", "cooked", "trending"
- `search` (optional): Search in title and description
- `tags` (optional): Comma-separated tags

**Headers:** (Optional for user interaction data)
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "recipe_123",
        "title": "Spaghetti Carbonara",
        "description": "Classic Italian pasta dish",
        "cover_image": "uploads/recipe-images/carbonara.jpg",
        "difficulty": "medium",
        "preparation_time": 15,
        "cooking_time": 20,
        "serving_size": 4,
        "origin": "Italian",
        "user": {
          "id": "user_123",
          "full_name": "John Doe",
          "profile_picture": "uploads/profile-pictures/user_123.jpg",
          "level": 5
        },
        "metadata": {
          "tags": ["pasta", "italian", "dinner"],
          "exp_reward": 50,
          "gold_reward": 25,
          "gem_reward": 2,
          "gold_price": 0,
          "gem_price": 0,
          "like_count": 45,
          "cook_count": 28,
          "total_calories": 650.5
        },
        "user_interaction": {
          "liked": true,
          "saved": false,
          "purchased": false,
          "cooked": true
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_results": 195,
      "has_more": true,
      "limit": 20
    },
    "filters": {
      "difficulty": ["easy", "medium", "hard"],
      "origins": ["Italian", "Mexican", "Chinese", "Indian"],
      "sort_options": ["newest", "popular", "cooked", "trending"]
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/recipes/{id}</summary>

**Description:** Get detailed recipe information including ingredients, steps, and gamification data

**Headers:** (Optional for user interaction data)
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "recipe_123",
      "title": "Spaghetti Carbonara",
      "description": "Classic Italian pasta dish with eggs, cheese, and pancetta...",
      "cover_image": "uploads/recipe-images/carbonara.jpg",
      "difficulty": "medium",
      "preparation_time": 15,
      "cooking_time": 20,
      "serving_size": 4,
      "origin": "Italian",
      "is_paid": false,
      "is_public": true,
      "user": {
        "id": "user_123",
        "full_name": "John Doe",
        "profile_picture": "uploads/profile-pictures/user_123.jpg",
        "level": 5
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "metadata": {
      "tags": ["pasta", "italian", "dinner", "quick"],
      "exp_reward": 50,
      "gold_reward": 25,
      "gem_reward": 2,
      "gold_price": 0,
      "gem_price": 0,
      "purchase_count": 0,
      "like_count": 45,
      "dislike_count": 2,
      "cook_count": 28,
      "total_calories": 650.5,
      "total_protein": 32.2,
      "total_carbs": 85.1,
      "total_fat": 25.8
    },
    "ingredients": [
      {
        "id": "ing_456",
        "name": "Spaghetti",
        "amount": 400,
        "unit": "grams",
        "notes": "Use fresh pasta if possible",
        "order_index": 1,
        "calories_per_unit": 131,
        "protein_per_unit": 5.3,
        "carbs_per_unit": 25.5,
        "fat_per_unit": 0.9
      }
    ],
    "steps": [
      {
        "id": "step_789",
        "description": "Bring a large pot of salted water to boil. Add spaghetti and cook according to package instructions...",
        "image": "uploads/step-images/step1.jpg",
        "read_timer_duration": 15,
        "timer_duration": 600,
        "timer_unit": "seconds",
        "exp_reward": 5,
        "gold_reward": 3,
        "gem_reward": 0,
        "order_index": 1
      }
    ],
    "user_interaction": {
      "liked": true,
      "saved": false,
      "purchased": false,
      "cooked": true,
      "in_cookbook": false
    },
    "cooking_tips": [
      "Use freshly grated Parmesan for best flavor",
      "Reserve some pasta water to adjust sauce consistency"
    ],
    "rewards_summary": {
      "total_exp": 50,
      "total_gold": 25,
      "total_gems": 2,
      "step_rewards": "8 steps with individual rewards"
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/recipes</summary>

**Description:** Create a new recipe with gamification rewards

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` (required): Recipe title
- `description` (optional): Recipe description
- `cover_image` (optional, file): Recipe cover image
- `origin` (optional): Cuisine origin
- `preparation_time` (optional): Prep time in minutes
- `cooking_time` (optional): Cooking time in minutes
- `serving_size` (optional): Number of servings
- `difficulty` (optional, default: "medium"): "easy", "medium", "hard"
- `is_paid` (optional, default: false): Whether recipe requires purchase
- `is_public` (optional, default: true): Public visibility
- `tags` (optional): Comma-separated tags
- `exp_reward` (optional): Base EXP reward
- `gold_reward` (optional): Base Gold reward
- `gem_reward` (optional): Base Gem reward
- `gold_price` (optional): Gold price if paid
- `gem_price` (optional): Gem price if paid
- `ingredients` (required, JSON string): Array of ingredients
- `steps` (required, JSON string): Array of steps

**Ingredients JSON Format:**
```json
[
  {
    "name": "Spaghetti",
    "amount": 400,
    "unit": "grams",
    "notes": "Use fresh pasta",
    "calories_per_unit": 131,
    "protein_per_unit": 5.3,
    "carbs_per_unit": 25.5,
    "fat_per_unit": 0.9
  }
]
```

**Steps JSON Format:**
```json
[
  {
    "description": "Bring water to boil...",
    "read_timer_duration": 15,
    "timer_duration": 600,
    "timer_unit": "seconds",
    "exp_reward": 5,
    "gold_reward": 3,
    "gem_reward": 0
  }
]
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "recipe_id": "recipe_123",
    "rewards": {
      "creator_exp": 25,
      "creator_gold": 15,
      "creator_gems": 1,
      "message": "Recipe creation reward earned!"
    },
    "recipe": {
      "title": "Spaghetti Carbonara",
      "difficulty": "medium",
      "total_steps": 8,
      "total_ingredients": 6
    }
  }
}
```

</details>

---

<details>
<summary>PUT /api/recipes/{id}</summary>

**Description:** Update an existing recipe

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:** Same as POST /api/recipes, but all fields are optional

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Recipe updated successfully",
  "data": {
    "recipe_id": "recipe_123",
    "updated_fields": ["title", "description", "difficulty"]
  }
}
```

</details>

---

<details>
<summary>DELETE /api/recipes/{id}</summary>

**Description:** Delete a recipe

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Recipe deleted successfully"
}
```

</details>

---

<details>
<summary>POST /api/recipes/{id}/interact</summary>

**Description:** Interact with a recipe (like, dislike, save, purchase) with gamification

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "interaction_type": "like",  // "like", "dislike", "save", "purchase"
  "metadata": {
    "purchase_price_gold": 50,
    "purchase_price_gems": 5
  }
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Recipe liked successfully",
  "data": {
    "new_like_count": 46,
    "new_dislike_count": 2,
    "user_interaction": {
      "liked": true,
      "disliked": false,
      "saved": false,
      "purchased": false
    },
    "rewards": {
      "interaction_exp": 5,
      "message": "+5 EXP for engaging with community"
    }
  }
}
```

</details>

</details>

---

<details>
<summary>Cooking Sessions API</summary>

---

<details>
<summary>GET /api/cooking-sessions</summary>

**Description:** Get list of active cooking sessions with gamification data

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): "planned", "preparing", "cooking", "paused", "completed"
- `mode` (optional): "solo" or "multiplayer"
- `visibility` (optional): "public", "friends_only", "private"
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page
- `user_id` (optional): Filter by user participation

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_123",
        "recipe": {
          "id": "recipe_456",
          "title": "Spaghetti Carbonara",
          "cover_image": "uploads/recipe-images/carbonara.jpg",
          "difficulty": "medium",
          "preparation_time": 15,
          "cooking_time": 20
        },
        "host": {
          "id": "user_123",
          "full_name": "John Doe",
          "profile_picture": "uploads/profile-pictures/user_123.jpg",
          "level": 5
        },
        "mode": "multiplayer",
        "visibility": "public",
        "status": "cooking",
        "participant_count": 3,
        "current_step": 2,
        "total_steps": 8,
        "progress_percentage": 25,
        "started_at": "2024-01-16T14:30:00Z",
        "estimated_completion": "2024-01-16T15:00:00Z",
        "total_rewards": {
          "exp": 50,
          "gold": 25,
          "gems": 2
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_results": 52,
      "has_more": true,
      "limit": 20
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions</summary>

**Description:** Create a new cooking session with gamification setup

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "recipe_id": "recipe_456",
  "mode": "solo",  // or "multiplayer"
  "visibility": "private",  // "private", "friends_only", "public"
  "notes": "Let's cook together! First time trying this recipe.",
  "estimated_duration": 45
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Cooking session created",
  "data": {
    "session_id": "session_123",
    "join_code": "ABC123",  // for multiplayer sessions
    "rewards_preview": {
      "total_exp": 50,
      "total_gold": 25,
      "total_gems": 2,
      "step_count": 8
    },
    "session": {
      "recipe_title": "Spaghetti Carbonara",
      "difficulty": "medium",
      "mode": "multiplayer",
      "visibility": "public"
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/cooking-sessions/{id}</summary>

**Description:** Get detailed cooking session information with real-time gamification data

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session_123",
      "recipe": {
        "id": "recipe_456",
        "title": "Spaghetti Carbonara",
        "description": "Classic Italian pasta dish",
        "cover_image": "uploads/recipe-images/carbonara.jpg",
        "difficulty": "medium"
      },
      "host": {
        "id": "user_123",
        "full_name": "John Doe",
        "profile_picture": "uploads/profile-pictures/user_123.jpg",
        "level": 5
      },
      "mode": "multiplayer",
      "visibility": "public",
      "status": "cooking",
      "notes": "Let's cook together!",
      "started_at": "2024-01-16T14:30:00Z",
      "created_at": "2024-01-16T14:25:00Z"
    },
    "details": {
      "current_step_index": 2,
      "total_steps": 8,
      "completed_steps": 1,
      "total_duration": 1200,
      "active_timer_step_id": "step_789",
      "timer_ends_at": "2024-01-16T14:35:00Z",
      "exp_earned": 15,
      "gold_earned": 8,
      "gems_earned": 1,
      "cook_duration": 20,
      "progress_percentage": 12.5
    },
    "participants": [
      {
        "user": {
          "id": "user_123",
          "full_name": "John Doe",
          "profile_picture": "uploads/profile-pictures/user_123.jpg",
          "level": 5
        },
        "role": "host",
        "status": "active",
        "joined_at": "2024-01-16T14:25:00Z",
        "rewards_earned": {
          "exp": 15,
          "gold": 8,
          "gems": 1
        }
      }
    ],
    "current_step": {
      "id": "step_789",
      "description": "Bring water to boil...",
      "image": "uploads/step-images/step1.jpg",
      "read_timer_duration": 15,
      "timer_duration": 600,
      "timer_unit": "seconds",
      "exp_reward": 5,
      "gold_reward": 3,
      "gem_reward": 0,
      "order_index": 2
    },
    "next_step_preview": {
      "order_index": 3,
      "description_preview": "Cook pasta until al dente..."
    },
    "rewards_summary": {
      "remaining_exp": 35,
      "remaining_gold": 17,
      "remaining_gems": 1,
      "completion_bonus": {
        "exp": 10,
        "gold": 5,
        "gems": 1
      }
    }
  }
}
```

</details>

---

<details>
<summary>PUT /api/cooking-sessions/{id}</summary>

**Description:** Update cooking session status and details

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "paused",  // "planned", "preparing", "cooking", "paused", "completed", "cancelled"
  "notes": "Taking a short break, be back in 5 minutes",
  "current_step_index": 3
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Session updated successfully",
  "data": {
    "session_id": "session_123",
    "status": "paused",
    "updated_at": "2024-01-16T14:35:00Z"
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions/{id}/join</summary>

**Description:** Join a cooking session with gamification welcome

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body (for private sessions):**
```json
{
  "join_code": "ABC123"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Joined session successfully",
  "data": {
    "participant_id": "part_456",
    "role": "participant",
    "welcome_rewards": {
      "exp": 5,
      "gold": 3,
      "message": "Welcome to the cooking session!"
    },
    "session": {
      "recipe_title": "Spaghetti Carbonara",
      "host_name": "John Doe",
      "participant_count": 4,
      "current_step": 2
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions/{id}/complete-step</summary>

**Description:** Mark a step as completed with gamification rewards

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "step_id": "step_789",
  "duration_seconds": 45,
  "was_skipped": false,
  "notes": "Step completed successfully, pasta cooked perfectly",
  "quality_rating": 4.5  // 1-5 scale
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Step completed",
  "data": {
    "rewards": {
      "exp": 5,
      "gold": 3,
      "gems": 0,
      "quality_bonus": {
        "exp": 1,
        "gold": 1,
        "message": "Excellent execution!"
      }
    },
    "total_rewards": {
      "exp": 20,
      "gold": 11,
      "gems": 1
    },
    "next_step": {
      "id": "step_790",
      "order_index": 3,
      "description_preview": "Drain pasta and reserve 1 cup of pasta water..."
    },
    "progress": {
      "completed_steps": 2,
      "total_steps": 8,
      "percentage": 25.0
    },
    "achievements": {
      "unlocked": ["Perfect Pasta Cook", "Quick Step Completion"],
      "progress": {
        "Master Chef": "3/10 steps completed"
      }
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions/{id}/vote</summary>

**Description:** Vote in a cooking session with gamification participation rewards

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "vote_type": "skip_read_timer",  // "skip_read_timer", "skip_step", "pause_session", "end_session"
  "vote_value": true,
  "reason": "Everyone is ready to proceed"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Vote recorded",
  "data": {
    "total_votes": 3,
    "required_votes": 2,
    "action_executed": true,
    "participation_reward": {
      "exp": 2,
      "message": "+2 EXP for participating in session decisions"
    },
    "vote_summary": {
      "yes": 3,
      "no": 0,
      "pending": 1
    }
  }
}
```

</details>

</details>

---

<details>
<summary>Cookbooks API</summary>

---

<details>
<summary>GET /api/cookbooks</summary>

**Description:** Get user's cookbooks with gamification stats

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (optional): Get specific user's cookbooks
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page
- `is_public` (optional): Filter by public/private status

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "cookbooks": [
      {
        "id": "cookbook_123",
        "name": "Italian Recipes",
        "description": "My favorite Italian dishes collected over time",
        "cover_image": "uploads/cookbook-covers/italian.jpg",
        "is_public": true,
        "recipe_count": 12,
        "follower_count": 45,
        "total_cooks": 128,
        "average_rating": 4.5,
        "created_at": "2024-01-10T10:30:00Z",
        "updated_at": "2024-01-15T14:20:00Z",
        "user": {
          "id": "user_123",
          "full_name": "John Doe",
          "profile_picture": "uploads/profile-pictures/user_123.jpg"
        },
        "stats": {
          "total_exp_value": 600,
          "total_gold_value": 300,
          "total_gem_value": 24,
          "difficulty_distribution": {
            "easy": 3,
            "medium": 7,
            "hard": 2
          }
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_results": 25,
      "has_more": true,
      "limit": 20
    },
    "summary": {
      "total_cookbooks": 25,
      "total_recipes": 312,
      "public_cookbooks": 18
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cookbooks</summary>

**Description:** Create a new cookbook with gamification rewards

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Italian Recipes",
  "description": "My favorite Italian dishes",
  "is_public": true,
  "cover_image": "uploads/cookbook-covers/italian.jpg"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Cookbook created successfully",
  "data": {
    "cookbook_id": "cookbook_123",
    "rewards": {
      "exp": 25,
      "gold": 15,
      "message": "Cookbook creation reward earned!"
    },
    "cookbook": {
      "name": "Italian Recipes",
      "is_public": true,
      "recipe_count": 0
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/cookbooks/{id}</summary>

**Description:** Get cookbook details with recipes and gamification data

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional, default: 1): Page number for recipes
- `limit` (optional, default: 20): Recipes per page

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "cookbook": {
      "id": "cookbook_123",
      "name": "Italian Recipes",
      "description": "My favorite Italian dishes",
      "cover_image": "uploads/cookbook-covers/italian.jpg",
      "is_public": true,
      "user": {
        "id": "user_123",
        "full_name": "John Doe",
        "profile_picture": "uploads/profile-pictures/user_123.jpg",
        "level": 5
      },
      "stats": {
        "recipe_count": 12,
        "follower_count": 45,
        "total_cooks": 128,
        "average_rating": 4.5,
        "total_exp_value": 600,
        "total_gold_value": 300,
        "total_gem_value": 24
      },
      "created_at": "2024-01-10T10:30:00Z",
      "updated_at": "2024-01-15T14:20:00Z"
    },
    "recipes": [
      {
        "id": "recipe_456",
        "title": "Spaghetti Carbonara",
        "description": "Classic Italian pasta dish",
        "cover_image": "uploads/recipe-images/carbonara.jpg",
        "difficulty": "medium",
        "preparation_time": 15,
        "cooking_time": 20,
        "user": {
          "id": "user_123",
          "full_name": "John Doe"
        },
        "metadata": {
          "exp_reward": 50,
          "gold_reward": 25,
          "gem_reward": 2,
          "like_count": 45,
          "cook_count": 28
        },
        "added_at": "2024-01-12T15:30:00Z",
        "notes": "My favorite way to make this - use guanciale instead of pancetta!"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_results": 12,
      "has_more": false,
      "limit": 20
    },
    "is_following": true,
    "can_edit": true
  }
}
```

</details>

---

<details>
<summary>POST /api/cookbooks/{id}/add-recipe</summary>

**Description:** Add recipe to cookbook with gamification rewards

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "recipe_id": "recipe_456",
  "notes": "My favorite way to make this",
  "personal_rating": 5,
  "tags": ["favorite", "dinner"]
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Recipe added to cookbook",
  "data": {
    "entry_id": "cookbook_entry_789",
    "rewards": {
      "exp": 5,
      "gold": 3,
      "message": "Recipe collection reward!"
    },
    "cookbook": {
      "new_recipe_count": 13,
      "total_exp_value": 650
    }
  }
}
```

</details>

---

<details>
<summary>DELETE /api/cookbooks/{id}/remove-recipe</summary>

**Description:** Remove recipe from cookbook

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `recipe_id` (required): Recipe to remove

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Recipe removed from cookbook"
}
```

</details>

</details>

---

<details>
<summary>Upload API</summary>

---

<details>
<summary>POST /api/upload/image</summary>

**Description:** Upload image file for profile, recipe, or step with validation

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file` (required): Image file (jpg, jpeg, png, gif, webp)
- `type` (required): "profile_picture", "recipe_cover", "step_image", "cookbook_cover"
- `user_id` (required for profile pictures): User ID
- `recipe_id` (optional for recipe/step images): Recipe ID
- `max_width` (optional): Maximum width in pixels
- `max_height` (optional): Maximum height in pixels

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "uploads/profile-pictures/user_123_1705402800.jpg",
    "file_name": "user_123_1705402800.jpg",
    "file_size": 102456,
    "mime_type": "image/jpeg",
    "dimensions": {
      "width": 800,
      "height": 600
    },
    "optimized_url": "uploads/profile-pictures/user_123_1705402800_optimized.jpg",
    "thumbnail_url": "uploads/profile-pictures/user_123_1705402800_thumb.jpg"
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "File validation failed",
  "errors": {
    "file": ["File must be an image (jpg, jpeg, png, gif, webp)", "File size must be less than 5MB"]
  }
}
```

</details>

</details>

---

<details>
<summary>Gamification & Shop API (To be implemented in Feature 7)</summary>

---

<details>
<summary>GET /api/shop/items</summary>

**Description:** Get available shop items with categories and user balances

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `category` (optional): Filter by category
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item_123",
        "name": "Golden Cooking Spoon",
        "description": "A shiny golden spoon that increases recipe EXP by 10%",
        "image": "uploads/shop-items/golden_spoon.jpg",
        "category": "tools",
        "price_gold": 500,
        "price_gems": 25,
        "rarity": "epic",
        "effect": "+10% EXP gain for 24 hours",
        "owned": false,
        "purchase_count": 128
      }
    ],
    "user_balance": {
      "gold": 1250,
      "gems": 45,
      "level": 5
    },
    "categories": ["cosmetics", "tools", "recipes", "boosts", "ingredients"],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_results": 52,
      "has_more": true,
      "limit": 20
    },
    "daily_deal": {
      "item_id": "item_456",
      "name": "Chef's Hat",
      "original_price_gold": 300,
      "discount_price_gold": 150,
      "discount_percentage": 50,
      "time_remaining": 86300
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/shop/purchase</summary>

**Description:** Purchase shop item with gamification rewards

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "item_id": "item_123",
  "currency": "gold",  // "gold" or "gems"
  "quantity": 1
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Purchase successful!",
  "data": {
    "purchase_id": "purchase_789",
    "item": {
      "name": "Golden Cooking Spoon",
      "effect": "+10% EXP gain for 24 hours"
    },
    "new_balance": {
      "gold": 750,
      "gems": 45
    },
    "rewards": {
      "purchase_exp": 10,
      "achievement": "First Purchase",
      "message": "Enjoy your new item!"
    },
    "activation": {
      "expires_at": "2024-01-17T14:30:00Z",
      "active": true
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/shop/purchases</summary>

**Description:** Get user's purchase history

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `active_only` (optional): Show only active items

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "purchases": [
      {
        "id": "purchase_789",
        "item": {
          "id": "item_123",
          "name": "Golden Cooking Spoon",
          "image": "uploads/shop-items/golden_spoon.jpg",
          "category": "tools"
        },
        "price_gold": 500,
        "price_gems": 0,
        "purchased_at": "2024-01-16T14:30:00Z",
        "status": "active",
        "expires_at": "2024-01-17T14:30:00Z",
        "time_remaining": 86300
      }
    ],
    "active_items": [
      {
        "item_id": "item_123",
        "name": "Golden Cooking Spoon",
        "effect": "+10% EXP gain",
        "time_remaining": 86300
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_results": 25,
      "has_more": true,
      "limit": 20
    },
    "stats": {
      "total_spent_gold": 1250,
      "total_spent_gems": 45,
      "total_items": 8,
      "active_items": 3
    }
  }
}
```

</details>

</details>

---

<details>
<summary>Error Handling</summary>

**HTTP Status Codes:**
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `204 No Content`: Successful request with no response body
- `400 Bad Request`: Invalid request parameters or malformed request
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions for the resource
- `404 Not Found`: Resource not found
- `405 Method Not Allowed`: HTTP method not supported for endpoint
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation errors in request data
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Server maintenance or overload

**Common Error Responses:**

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required", "The email must be a valid email address"],
    "password": ["The password must be at least 8 characters", "The password must contain a number"]
  },
  "timestamp": "2024-01-16T14:30:00Z"
}
```

**Authentication Error:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "errors": null,
  "timestamp": "2024-01-16T14:30:00Z"
}
```

**Permission Error:**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "errors": null,
  "timestamp": "2024-01-16T14:30:00Z"
}
```

**Rate Limit Error:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "errors": null,
  "retry_after": 60,
  "timestamp": "2024-01-16T14:30:00Z"
}
```

**Maintenance Error:**
```json
{
  "success": false,
  "message": "Service temporarily unavailable for maintenance",
  "errors": null,
  "estimated_restore": "2024-01-16T15:00:00Z",
  "timestamp": "2024-01-16T14:30:00Z"
}
```

</details>

---

<details>
<summary>WebSocket Events (Real-time Features - Future Implementation)</summary>

**Connection URL:** `ws://localhost:8080` (Development)
**Authentication:** Send JWT token in connection header

**Events:**
- `session_updated`: Cooking session updated (status, progress, participants)
- `participant_joined`: New participant joined session with welcome message
- `participant_left`: Participant left session
- `step_completed`: Step completed by participant with rewards
- `vote_update`: Vote status updated
- `timer_update`: Timer countdown update
- `chat_message`: New chat message in session
- `reward_notification`: Real-time reward notification
- `achievement_unlocked`: Achievement unlocked notification
- `friend_online`: Friend came online
- `cooking_invite`: Received cooking session invitation

**Example Event Structure:**
```json
{
  "event": "participant_joined",
  "data": {
    "session_id": "session_123",
    "participant": {
      "id": "user_456",
      "full_name": "Jane Smith",
      "profile_picture": "uploads/profile-pictures/user_456.jpg",
      "level": 8
    },
    "welcome_message": "Jane has joined the cooking session!",
    "participant_count": 4,
    "timestamp": "2024-01-16T14:32:00Z"
  }
}
```

**Reward Notification Example:**
```json
{
  "event": "reward_notification",
  "data": {
    "type": "step_completion",
    "rewards": {
      "exp": 5,
      "gold": 3,
      "gems": 0
    },
    "message": "Step completed! +5 EXP, +3 Gold",
    "animation": "confetti",
    "timestamp": "2024-01-16T14:32:00Z"
  }
}
```

**Achievement Example:**
```json
{
  "event": "achievement_unlocked",
  "data": {
    "achievement_id": "ach_123",
    "name": "Master Chef",
    "description": "Complete 100 recipes",
    "icon": "🏆",
    "rewards": {
      "exp": 100,
      "gold": 50,
      "gems": 5
    },
    "rarity": "legendary",
    "timestamp": "2024-01-16T14:32:00Z"
  }
}
```

</details>