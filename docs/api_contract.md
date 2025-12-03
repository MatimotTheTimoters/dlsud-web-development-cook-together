# API Contract Documentation

<details>
<summary>Overview</summary>

This document outlines the API contract between the frontend React application and backend PHP API for the CookTogether project. The API follows RESTful conventions with JSON responses and JWT authentication.

---

**Base URL:** `http://localhost/api/` (Development)
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
  "errors": array,
  "timestamp": string
}
```

</details>

---

<details>
<summary>Authentication API</summary>

---

<details>
<summary>POST /api/auth/register</summary>

**Description:** Register a new user account

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
      "full_name": "John Doe"
    },
    "token": "jwt_token_here",
    "expires_in": 3600
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email already registered"]
  }
}
```

</details>

---

<details>
<summary>POST /api/auth/login</summary>

**Description:** Authenticate user and return JWT token

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
      "profile_picture": null
    },
    "token": "jwt_token_here",
    "expires_in": 3600
  }
}
```

**Response (Error - 401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

</details>

---

<details>
<summary>GET /api/auth/me</summary>

**Description:** Get current authenticated user information

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
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "stats": {
      "level": 1,
      "current_exp": 0,
      "gold_count": 0,
      "gem_count": 0,
      "login_streak": 1
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/auth/logout</summary>

**Description:** Invalidate current authentication token

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

**Description:** Get user profile information

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
      "created_at": "2024-01-15T10:30:00Z"
    },
    "stats": {
      "level": 5,
      "current_exp": 450,
      "gold_count": 1250,
      "gem_count": 45,
      "recipes_created": 12,
      "recipes_cooked": 28,
      "challenges_completed": 5
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
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `full_name` (optional)
- `age` (optional)
- `gender` (optional)
- `profile_picture` (optional, file)

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_123",
      "full_name": "John Updated",
      "profile_picture": "uploads/profile-pictures/new_pic.jpg",
      "updated_at": "2024-01-16T14:20:00Z"
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/users/stats</summary>

**Description:** Get detailed user statistics

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
    "last_limit_update": "2024-01-16T10:00:00Z"
  }
}
```

</details>

---

<details>
<summary>GET /api/users/search</summary>

**Description:** Search for users by name or email

**Headers:**
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
        "is_following": true
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_results": 52,
      "has_more": true
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
    "status": "following"
  }
}
```

</details>

---

<details>
<summary>POST /api/relationships/friends</summary>

**Description:** Send, accept, or reject friend request

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
    "status": "pending"
  }
}
```

</details>

---

<details>
<summary>GET /api/relationships/list</summary>

**Description:** Get list of followers, following, or friends

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
          "level": 8
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
      "has_more": true
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

**Description:** Get list of recipes with filtering and pagination

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page
- `difficulty` (optional): "easy", "medium", "hard"
- `origin` (optional): Cuisine type
- `user_id` (optional): Filter by specific user
- `sort_by` (optional): "newest", "popular", "cooked"
- `search` (optional): Search in title and description

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
          "profile_picture": "uploads/profile-pictures/user_123.jpg"
        },
        "metadata": {
          "like_count": 45,
          "cook_count": 28,
          "exp_reward": 50,
          "gold_reward": 25,
          "gem_reward": 2
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_results": 195,
      "has_more": true
    }
  }
}
```

</details>

---

<details>
<summary>GET /api/recipes/{id}</summary>

**Description:** Get detailed recipe information including ingredients and steps

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "recipe_123",
      "title": "Spaghetti Carbonara",
      "description": "Classic Italian pasta dish...",
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
        "profile_picture": "uploads/profile-pictures/user_123.jpg"
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    "metadata": {
      "tags": ["pasta", "italian", "dinner"],
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
        "description": "Bring a large pot of salted water to boil...",
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
      "cooked": true
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/recipes</summary>

**Description:** Create a new recipe

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` (required)
- `description` (optional)
- `cover_image` (optional, file)
- `origin` (optional)
- `preparation_time` (optional)
- `cooking_time` (optional)
- `serving_size` (optional)
- `difficulty` (optional, default: "medium")
- `is_paid` (optional, default: false)
- `is_public` (optional, default: true)
- `tags` (optional, comma-separated)
- `exp_reward` (optional)
- `gold_reward` (optional)
- `gem_reward` (optional)
- `gold_price` (optional)
- `gem_price` (optional)
- `ingredients` (required, JSON array)
- `steps` (required, JSON array)

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
    "gold_reward": 3
  }
]
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "recipe_id": "recipe_123"
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
  "message": "Recipe updated successfully"
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

**Description:** Interact with a recipe (like, dislike, save, purchase)

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
    "user_interaction": {
      "liked": true,
      "disliked": false
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

**Description:** Get list of active cooking sessions

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status
- `mode` (optional): "solo" or "multiplayer"
- `visibility` (optional): "public", "friends_only", "private"
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page

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
          "cover_image": "uploads/recipe-images/carbonara.jpg"
        },
        "host": {
          "id": "user_123",
          "full_name": "John Doe",
          "profile_picture": "uploads/profile-pictures/user_123.jpg"
        },
        "mode": "multiplayer",
        "visibility": "public",
        "status": "cooking",
        "participant_count": 3,
        "current_step": 2,
        "total_steps": 8,
        "started_at": "2024-01-16T14:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_results": 52,
      "has_more": true
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions</summary>

**Description:** Create a new cooking session

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
  "notes": "Let's cook together!"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Cooking session created",
  "data": {
    "session_id": "session_123",
    "join_code": "ABC123"  // for multiplayer sessions
  }
}
```

</details>

---

<details>
<summary>GET /api/cooking-sessions/{id}</summary>

**Description:** Get detailed cooking session information

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
        "cover_image": "uploads/recipe-images/carbonara.jpg"
      },
      "host": {
        "id": "user_123",
        "full_name": "John Doe",
        "profile_picture": "uploads/profile-pictures/user_123.jpg"
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
      "cook_duration": 20
    },
    "participants": [
      {
        "user": {
          "id": "user_123",
          "full_name": "John Doe",
          "profile_picture": "uploads/profile-pictures/user_123.jpg"
        },
        "role": "host",
        "status": "active",
        "joined_at": "2024-01-16T14:25:00Z"
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
    }
  }
}
```

</details>

---

<details>
<summary>PUT /api/cooking-sessions/{id}</summary>

**Description:** Update cooking session

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "paused",  // "planned", "preparing", "cooking", "paused", "completed", "cancelled"
  "notes": "Taking a short break"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Session updated successfully"
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions/{id}/join</summary>

**Description:** Join a cooking session

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
    "role": "participant"
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions/{id}/complete-step</summary>

**Description:** Mark a step as completed in cooking session

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
  "notes": "Step completed successfully"
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
      "gems": 0
    },
    "total_rewards": {
      "exp": 20,
      "gold": 11,
      "gems": 1
    },
    "next_step": {
      "id": "step_790",
      "order_index": 3
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cooking-sessions/{id}/vote</summary>

**Description:** Vote in a cooking session (skip timer, skip step)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "vote_type": "skip_read_timer",  // "skip_read_timer", "skip_step", "other"
  "vote_value": true
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
    "action_executed": true
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

**Description:** Get user's cookbooks

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (optional): Get specific user's cookbooks
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Results per page

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "cookbooks": [
      {
        "id": "cookbook_123",
        "name": "Italian Recipes",
        "description": "My favorite Italian dishes",
        "is_public": true,
        "recipe_count": 12,
        "created_at": "2024-01-10T10:30:00Z",
        "updated_at": "2024-01-15T14:20:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_results": 25,
      "has_more": true
    }
  }
}
```

</details>

---

<details>
<summary>POST /api/cookbooks</summary>

**Description:** Create a new cookbook

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Italian Recipes",
  "description": "My favorite Italian dishes",
  "is_public": true
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Cookbook created successfully",
  "data": {
    "cookbook_id": "cookbook_123"
  }
}
```

</details>

---

<details>
<summary>GET /api/cookbooks/{id}</summary>

**Description:** Get cookbook details with recipes

**Headers:**
```
Authorization: Bearer {token}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "cookbook": {
      "id": "cookbook_123",
      "name": "Italian Recipes",
      "description": "My favorite Italian dishes",
      "is_public": true,
      "user": {
        "id": "user_123",
        "full_name": "John Doe",
        "profile_picture": "uploads/profile-pictures/user_123.jpg"
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
        "added_at": "2024-01-12T15:30:00Z",
        "notes": "My favorite way to make this"
      }
    ],
    "recipe_count": 12
  }
}
```

</details>

---

<details>
<summary>POST /api/cookbooks/{id}/add-recipe</summary>

**Description:** Add recipe to cookbook

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "recipe_id": "recipe_456",
  "notes": "My favorite way to make this"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Recipe added to cookbook"
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

**Description:** Upload image file

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file` (required): Image file
- `type` (required): "profile_picture", "recipe_cover", "step_image"
- `user_id` (required for profile pictures)

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "uploads/profile-pictures/user_123.jpg",
    "file_name": "user_123.jpg",
    "file_size": 102456,
    "mime_type": "image/jpeg"
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
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

**Validation Error Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required", "The email must be a valid email address"],
    "password": ["The password must be at least 8 characters"]
  },
  "timestamp": "2024-01-16T14:30:00Z"
}
```

**Authentication Error Example:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "timestamp": "2024-01-16T14:30:00Z"
}
```

**Permission Error Example:**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "timestamp": "2024-01-16T14:30:00Z"
}
```

</details>

---

<details>
<summary>WebSocket Events (Real-time Features)</summary>

**Connection URL:** `ws://localhost:8080` (Development)

**Authentication:** Send JWT token in initial connection

**Events:**
- `session_updated`: Cooking session updated
- `participant_joined`: New participant joined session
- `participant_left`: Participant left session
- `step_completed`: Step completed by participant
- `vote_update`: Vote status updated
- `timer_update`: Timer countdown update
- `chat_message`: New chat message

**Example Event:**
```json
{
  "event": "participant_joined",
  "data": {
    "session_id": "session_123",
    "participant": {
      "id": "user_456",
      "full_name": "Jane Smith",
      "profile_picture": "uploads/profile-pictures/user_456.jpg"
    },
    "timestamp": "2024-01-16T14:32:00Z"
  }
}
```

</details>