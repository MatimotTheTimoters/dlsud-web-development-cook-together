# Backend Directory Structure

---

## **config/**

---

### **config/environment.php**

- **Description**: Configuration file for environment settings and API configuration
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `getEnvironment() -> string`: Returns current environment (dev/prod)
- `getDatabaseConfig() -> array`: Returns database connection parameters
- `getApiConfig() -> array`: Returns API configuration settings

---

### **config/database.php**

- **Description**: Database connection and query helper functions
- **Required Imports**: environment.php
- **Backend Endpoint**: None

**Functions**:
- `connect() -> PDO`: Establishes database connection
- `query(string $sql, array $params) -> PDOStatement`: Executes prepared statement
- `fetchAll(string $sql, array $params) -> array`: Fetches all results
- `fetchOne(string $sql, array $params) -> array|false`: Fetches single row
- `insert(string $table, array $data) -> string|false`: Inserts record
- `update(string $table, array $data, string $where) -> int`: Updates record
- `delete(string $table, string $where) -> int`: Deletes record

---

### **config/cors.php**

- **Description**: CORS headers configuration for API responses
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `setCorsHeaders() -> void`: Sets CORS headers for API responses
- `handlePreflight() -> void`: Handles OPTIONS preflight requests

---

## **classes/**

---

### **classes/AuthHelper.php**

- **Description**: Authentication helper functions for JWT tokens and password handling
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `generateToken(string $user_id, string $email) -> string`: Generates JWT token
- `validateToken(string $token) -> array|false`: Validates JWT token
- `hashPassword(string $password) -> string`: Hashes password
- `verifyPassword(string $password, string $hash) -> bool`: Verifies password

---

### **classes/DatabaseHelper.php**

- **Description**: Main database operations helper for all application features
- **Required Imports**: ../config/database.php
- **Backend Endpoint**: Various (through API endpoints)

**Functions**:

**User Operations**:
- `registerUser(array $user_data) -> bool`: Creates new user
- `validateUserLogin(string $email, string $password) -> array|false`: Validates login credentials
- `getUserById(string $user_id) -> array|false`: Gets user by ID
- `updateUserProfile(string $user_id, array $data) -> bool`: Updates user profile

**User Stats Operations**:
- `getUserStats(string $user_id) -> array|false`: Gets user stats
- `updateUserStats(string $user_id, array $updates) -> bool`: Updates user stats
- `incrementUserStat(string $user_id, string $field, int $amount) -> bool`: Increments user stat
- `searchUsers(string $query, array $filters) -> array`: Searches users with pagination

**Recipe Operations**:
- `createRecipe(array $recipe_data, array $ingredients, array $steps) -> string|false`: Creates recipe with ingredients and steps
- `getRecipe(string $recipe_id) -> array|false`: Gets full recipe with details
- `updateRecipe(string $recipe_id, array $recipe_data, array $ingredients, array $steps) -> bool`: Updates recipe
- `deleteRecipe(string $recipe_id) -> bool`: Deletes recipe and related data

**Cooking Session Operations**:
- `createCookingSession(array $session_data) -> string|false`: Creates cooking session
- `getCookingSession(string $session_id) -> array|false`: Gets cooking session with details
- `updateCookingSession(string $session_id, array $updates) -> bool`: Updates cooking session
- `joinCookingSession(string $session_id, string $user_id) -> bool`: Joins user to cooking session

**Relationship Operations**:
- `followUser(string $source_user_id, string $target_user_id, string $relationship_type) -> bool`: Follows/unfollows user
- `unfollowUser(string $source_user_id, string $target_user_id) -> bool`: Removes relationship
- `getFriendRequests(string $user_id) -> array`: Gets pending friend requests
- `acceptFriendRequest(string $relationship_id) -> bool`: Accepts friend request
- `rejectFriendRequest(string $relationship_id) -> bool`: Rejects friend request
- `removeFriend(string $relationship_id) -> bool`: Removes friend relationship
- `getRelationships(string $user_id, string $type = 'following') -> array`: Gets user relationships

**Cookbook Operations**:
- `getCookbooks(string $user_id, bool $include_public = false) -> array`: Gets user's cookbooks
- `createCookbook(array $cookbook_data) -> string|false`: Creates new cookbook
- `getCookbook(string $cookbook_id) -> array|false`: Gets cookbook with recipes
- `updateCookbook(string $cookbook_id, array $updates) -> bool`: Updates cookbook
- `deleteCookbook(string $cookbook_id) -> bool`: Deletes cookbook
- `addRecipeToCookbook(string $cookbook_id, string $recipe_id, string $user_id) -> bool`: Adds recipe to cookbook
- `removeRecipeFromCookbook(string $cookbook_id, string $recipe_id) -> bool`: Removes recipe from cookbook
- `getCookbookRecipes(string $cookbook_id) -> array`: Gets recipes in cookbook

**Shop Operations**:
- `getShopItems(array $filters = []) -> array`: Gets available shop items
- `purchaseItem(string $user_id, string $item_id) -> array|false`: Purchases shop item
- `getUserPurchases(string $user_id) -> array`: Gets user's purchased items
- `getItemCategories() -> array`: Gets shop item categories

---

### **classes/ResponseFormatter.php**

- **Description**: Standardizes API response formats
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `success(mixed $data, string $message, int $code) -> void`: Returns success response
- `error(string $message, int $code, mixed $details) -> void`: Returns error response
- `validationError(array $errors) -> void`: Returns validation error
- `unauthorized(string $message) -> void`: Returns unauthorized error
- `notFound(string $message) -> void`: Returns not found error

---

### **classes/UserCalculations.php**

- **Description**: Calculates gamification values like rewards, prices, and level requirements
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `calculateMaxRewards(array $user_data) -> array`: Calculates max rewards
- `calculateMaxPrices(array $user_data) -> array`: Calculates max prices
- `calculateAllUserLimits(array $user_data) -> array`: Calculates all limits
- `calculateLevelUpRequirements(int $current_level, int $current_exp) -> array`: Calculates level up requirements

---

## **utils/**

---

### **utils/uuidHelper.php**

- **Description**: Generates unique identifiers for database records
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `makeId() -> string`: Generates unique ID
- `generateUniqueId(string $table, string $field) -> string`: Generates unique ID for table

---

### **utils/fileUpload.php**

- **Description**: Handles image uploads for profile pictures, recipe images, and step images
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `uploadImage(array $file, string $type, string $user_id) -> array|false`: Uploads image file
- `validateImage(array $file) -> bool`: Validates image file
- `deleteFile(string $path) -> bool`: Deletes uploaded file

---

### **utils/validation.php**

- **Description**: Input validation and sanitization functions
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `validateEmail(string $email) -> bool`: Validates email format
- `validatePassword(string $password) -> bool`: Validates password strength
- `sanitizeInput(mixed $input) -> mixed`: Sanitizes input data

---

### **utils/logging.php**

- **Description**: Logging system for errors, user activities, and API requests
- **Required Imports**: None
- **Backend Endpoint**: None

**Functions**:
- `logError(string $message, array $context) -> void`: Logs error to file
- `logActivity(string $user_id, string $action, array $details) -> void`: Logs user activity
- `logApiRequest(string $method, string $endpoint, int $status) -> void`: Logs API request

---

## **database/**

---

### **database/schema.sql**

- **Description**: SQL schema for creating all database tables
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**: N/A (SQL file)

---

### **database/seeds.sql**

- **Description**: Seed data for testing and development
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**: N/A (SQL file)

---

## **api/**

---

## **api/auth/**

---

### **api/auth/register.php**

- **Description**: Handles user registration
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Backend Endpoint**: POST /api/auth/register

---

### **api/auth/login.php**

- **Description**: Handles user authentication
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/auth/login

---

### **api/auth/me.php**

- **Description**: Returns current authenticated user's information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/auth/me

---

### **api/auth/logout.php**

- **Description**: Handles user logout
- **Required Imports**: ../../config/database.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/auth/logout

---

### **api/auth/refresh-token.php**

- **Description**: Refreshes authentication tokens
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/auth/refresh-token

---

## **api/users/**

---

### **api/users/profile.php**

- **Description**: Retrieves user profile information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/users/profile

---

### **api/users/update.php**

- **Description**: Updates user profile information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Backend Endpoint**: PUT /api/users/update

---

### **api/users/stats.php**

- **Description**: Retrieves user statistics and gamification data
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/users/stats

---

### **api/users/search.php**

- **Description**: Searches for users by name or criteria
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/users/search

---

## **api/relationships/**

---

### **api/relationships/follow.php**

- **Description**: Handles user following/unfollowing
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/relationships/follow

---

### **api/relationships/friends.php**

- **Description**: Manages friend requests and relationships
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/relationships/friends

---

### **api/relationships/list.php**

- **Description**: Lists user relationships (following, followers, friends)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/relationships/list

---

## **api/recipes/**

---

### **api/recipes/index.php**

- **Description**: Lists recipes with filtering and pagination
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/recipes

---

### **api/recipes/create.php**

- **Description**: Creates a new recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php, ../../utils/validation.php
- **Backend Endpoint**: POST /api/recipes/create

---

### **api/recipes/show.php**

- **Description**: Retrieves detailed information about a specific recipe
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/recipes/show.php?id={id}

---

### **api/recipes/update.php**

- **Description**: Updates an existing recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Backend Endpoint**: PUT /api/recipes/{id}

---

### **api/recipes/delete.php**

- **Description**: Deletes a recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: DELETE /api/recipes/{id}

---

### **api/recipes/interact.php**

- **Description**: Handles recipe interactions (likes, saves, purchases)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/recipes/{id}/interact

---

## **api/cooking-sessions/**

---

### **api/cooking-sessions/index.php**

- **Description**: Lists cooking sessions
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/cooking-sessions

---

### **api/cooking-sessions/create.php**

- **Description**: Creates a new cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Backend Endpoint**: POST /api/cooking-sessions

---

### **api/cooking-sessions/show.php**

- **Description**: Retrieves detailed information about a specific cooking session
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/cooking-sessions/{id}

---

### **api/cooking-sessions/update.php**

- **Description**: Updates an existing cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: PUT /api/cooking-sessions/{id}

---

### **api/cooking-sessions/join.php**

- **Description**: Allows users to join a cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/cooking-sessions/{id}/join

---

### **api/cooking-sessions/complete-step.php**

- **Description**: Marks a cooking step as completed
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/cooking-sessions/{id}/complete-step

---

### **api/cooking-sessions/vote.php**

- **Description**: Handles voting in cooking sessions (skip steps, etc.)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/cooking-sessions/{id}/vote

---

## **api/cookbooks/**

---

### **api/cookbooks/index.php**

- **Description**: Lists user's cookbooks
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/cookbooks

---

### **api/cookbooks/create.php**

- **Description**: Creates a new cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Backend Endpoint**: POST /api/cookbooks

---

### **api/cookbooks/show.php**

- **Description**: Retrieves detailed information about a specific cookbook
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: GET /api/cookbooks/{id}

---

### **api/cookbooks/add-recipe.php**

- **Description**: Adds a recipe to a cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/cookbooks/{id}/add-recipe

---

### **api/cookbooks/remove-recipe.php**

- **Description**: Removes a recipe from a cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: DELETE /api/cookbooks/{id}/remove-recipe

---

## **api/upload/**

---

### **api/upload/image.php**

- **Description**: Handles image uploads for various types (profile, recipe, step)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../utils/fileUpload.php, ../../classes/ResponseFormatter.php
- **Backend Endpoint**: POST /api/upload/image

---

## **api/shop/**

---

### **api/shop/items.php**

- **Description**: Lists available shop items
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../config/cors.php
- **Backend Endpoint**: GET /api/shop/items

**Functions**:
- `getAuthorizationToken() -> string|null`: Extracts Bearer token from Authorization header

---

### **api/shop/purchase.php**

- **Description**: Handles shop item purchases
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../config/cors.php
- **Backend Endpoint**: POST /api/shop/purchase

**Functions**:
- `getAuthorizationToken() -> string|null`: Extracts Bearer token from Authorization header

---

## **uploads/**

- **Description**: Directory for uploaded files
- **Subdirectories**:
  - `profile-pictures/`: User profile pictures
  - `recipe-images/`: Recipe cover images
  - `step-images/`: Cooking step images

---

## **.htaccess**

- **Description**: URL rewriting for clean API endpoints
- **Content**: Rewrites all requests to index.php

---

## **index.php**

- **Description**: Main entry point that routes requests to appropriate endpoints
- **Required Imports**: config/cors.php
- **Functionality**: Routes requests to appropriate endpoints

---