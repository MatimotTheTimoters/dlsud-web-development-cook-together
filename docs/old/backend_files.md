# Backend Directory Structure

## config/

### config/environment.php
- **Description**: Configuration file for environment settings and API configuration
- **Required Imports**: None
- **Frontend Consumers**: All frontend API modules (api/auth.js, api/users.js, etc.)

**Functions**:
- `getEnvironment() -> string`: Returns current environment (dev/prod)
- `getDatabaseConfig() -> array`: Returns database connection parameters
- `getApiConfig() -> array`: Returns API configuration settings
- `setEnvironment(string $env) -> void`: Sets environment (dev/prod) - useful for testing

### config/database.php
- **Description**: Database connection and query helper functions
- **Required Imports**: environment.php
- **Frontend Consumers**: Indirectly through DatabaseHelper.php

**Functions**:
- `connect() -> PDO`: Establishes database connection
- `query(string $sql, array $params) -> PDOStatement`: Executes prepared statement
- `fetchAll(string $sql, array $params) -> array`: Fetches all results
- `fetchOne(string $sql, array $params) -> array|false`: Fetches single row
- `insert(string $table, array $data) -> string|false`: Inserts record
- `update(string $table, array $data, string $where) -> int`: Updates record
- `delete(string $table, string $where) -> int`: Deletes record
- `getConnection() -> PDO`: Returns PDO connection for direct database operations

### config/cors.php
- **Description**: CORS headers configuration for API responses
- **Required Imports**: None
- **Frontend Consumers**: All frontend components making API calls

**Functions**:
- `setCorsHeaders() -> void`: Sets CORS headers for API responses
- `handlePreflight() -> void`: Handles OPTIONS preflight requests

**CORS Configuration Details**:
- **Allowed Origins**: Localhost ports 3000, 8080 for React development
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type, X-Requested-With
- **Credentials**: Allowed (Access-Control-Allow-Credentials: true)
- **Max Age**: 86400 seconds (1 day cache for preflight)
- **Preflight Handling**: Automatic OPTIONS request handling
- **Development Support**: Wildcard origin support with specific React dev ports

## classes/

### classes/AuthHelper.php
- **Description**: Authentication helper functions for JWT tokens and password handling
- **Required Imports**: None
- **Frontend Consumers**: LoginForm.jsx, RegisterForm.jsx, ProtectedRoute.jsx, AuthContext.jsx

**Functions**:
- `generateToken(string $user_id, string $email) -> string`: Generates JWT token
- `validateToken(string $token) -> array|false`: Validates JWT token
- `hashPassword(string $password) -> string`: Hashes password
- `verifyPassword(string $password, string $hash) -> bool`: Verifies password
- `generateRefreshToken(string $user_id) -> string`: Generates refresh token for long-term sessions
- `getBearerToken() -> string|null`: Extracts Bearer token from Authorization header
- `getUserIdFromToken(string $token) -> string|null`: Convenience method to extract user ID from token
- `isTokenAboutToExpire(string $token, int $threshold) -> bool`: Checks if token is about to expire
- `refreshToken(string $old_token, array $user_data) -> array|false`: Refreshes expired token
- `validatePasswordStrength(string $password) -> array`: Validates password strength with rules
- `generateRandomToken(int $length) -> string`: Generates secure random token
- `getAuthorizationHeader() -> string|null`: Gets authorization header from request
- `setSecretKey(string $secret_key) -> void`: Sets custom JWT secret key
- `setTokenExpiry(int $seconds) -> void`: Sets token expiry time
- `getConfig() -> array`: Returns current JWT configuration
- `validate_jwt_token(string $token) -> array|false`: Validates JWT token
- `get_bearer_token() -> string|null`: Gets Bearer token from headers
- `hash_password(string $password) -> string`: Hashes password with bcrypt
- `verify_password(string $password, string $hash) -> bool`: Verifies password against hash

### classes/DatabaseHelper.php
- **Description**: Main database operations helper for all application features
- **Required Imports**: ../config/database.php
- **Frontend Consumers**: All frontend API modules and components that fetch data

**Functions**:

**User Operations**:
- `registerUser(array $user_data) -> string|false`: Creates new user, returns user ID
- `validateUserLogin(string $email, string $password) -> array|false`: Validates login credentials
- `getUserById(string $user_id) -> array|false`: Gets user by ID
- `updateUserProfile(string $user_id, array $data) -> bool`: Updates user profile
- `searchUsers(string $query, int $limit = 20, int $offset = 0) -> array`: Searches users

**User Stats Operations**:
- `getUserStats(string $user_id) -> array|false`: Gets user stats
- `updateUserStats(string $user_id, array $updates) -> bool`: Updates user stats
- `incrementUserStat(string $user_id, string $field, int $amount) -> bool`: Increments user stat

**Recipe Operations**:
- `createRecipe(array $recipe_data, array $ingredients, array $steps) -> string|false`: Creates recipe, returns recipe ID
- `getRecipe(string $recipe_id, string $user_id = null) -> array|false`: Gets full recipe with user-specific access
- `updateRecipe(string $recipe_id, array $recipe_data, array $ingredients = [], array $steps = []) -> bool`: Updates recipe
- `deleteRecipe(string $recipe_id) -> bool`: Deletes recipe and related data
- `getRecipes(array $filters = [], int $limit = 20, int $offset = 0) -> array`: Gets recipes with filters

**Recipe Access & Purchase**:
- `checkRecipeAccess(string $user_id, string $recipe_id) -> array|false`: Checks access (purchased/created/free)
- `purchaseRecipe(string $user_id, string $recipe_id, string $currency_type, int $price) -> bool`: Processes recipe purchase
- `grantRecipeAccess(string $user_id, string $recipe_id, string $access_type, array $purchase_data = null) -> bool`: Grants recipe access

**Recipe Interactions**:
- `handleRecipeInteraction(string $user_id, string $recipe_id, string $interaction_type, array $metadata = []) -> bool`: Handles like/dislike/save
- `getRecipeInteractions(string $recipe_id) -> array`: Gets recipe interaction counts

**Cooking Session Operations**:
- `createCookingSession(array $session_data) -> string|false`: Creates session, returns session ID
- `getCookingSession(string $session_id) -> array|false`: Gets session with participants
- `updateCookingSession(string $session_id, array $updates) -> bool`: Updates session
- `joinCookingSession(string $session_id, string $user_id) -> bool`: Joins session
- `completeCookingStep(string $session_id, string $step_id, string $user_id, array $completion_data) -> bool`: Completes step
- `getUserSessionHistory(string $user_id, int $limit = 20, int $offset = 0) -> array`: Gets session history

**Relationship Operations**:
- `manageRelationship(string $source_user_id, string $target_user_id, string $action, array $data = []) -> bool`: Handles follow/unfollow/friend requests
- `getRelationships(string $user_id, string $type = 'following', int $limit = 50) -> array`: Gets relationships
- `updateRelationshipStatus(string $relationship_id, string $status) -> bool`: Updates relationship status

**Cookbook Operations**:
- `createCookbook(array $cookbook_data) -> string|false`: Creates cookbook, returns ID
- `getCookbook(string $cookbook_id, bool $include_recipes = true) -> array|false`: Gets cookbook
- `updateCookbook(string $cookbook_id, array $updates) -> bool`: Updates cookbook
- `manageCookbookRecipe(string $cookbook_id, string $recipe_id, string $action, string $user_id) -> bool`: Adds/removes recipe
- `getUserCookbooks(string $user_id, bool $include_public = false) -> array`: Gets user's cookbooks

**Shop & Inventory Operations**:
- `getShopItems(array $filters = [], int $limit = 50) -> array`: Gets shop items with filters
- `purchaseShopItem(string $user_id, string $item_id, string $currency_type, int $price) -> bool`: Purchases shop item
- `addToInventory(string $user_id, string $item_id, int $quantity = 1, array $item_data = []) -> bool`: Adds to inventory
- `getUserInventory(string $user_id, string $category = null) -> array`: Gets user inventory
- `useInventoryItem(string $user_id, string $inventory_id) -> array|false`: Uses item, returns effect data

**Activity Feed Operations**:
- `logActivity(string $user_id, string $activity_type, array $activity_data) -> bool`: Logs activity
- `getActivityFeed(string $user_id = null, int $limit = 20, int $offset = 0) -> array`: Gets activity feed

**Voting & Chat Operations**:
- `handleSessionVote(string $session_id, string $user_id, string $vote_type, bool $vote_value) -> bool`: Handles session votes
- `saveChatMessage(string $session_id, string $user_id, string $message, string $message_type = 'text') -> bool`: Saves chat message
- `getSessionChat(string $session_id, int $limit = 100) -> array`: Gets session chat

### classes/ResponseFormatter.php
- **Description**: Standardizes API response formats
- **Required Imports**: None
- **Frontend Consumers**: All frontend components via api.js response handling

**Functions**:
- `success(mixed $data, string $message, int $code) -> void`: Returns success response
- `error(string $message, int $code, mixed $details) -> void`: Returns error response
- `validationError(array $errors) -> void`: Returns validation error
- `unauthorized(string $message) -> void`: Returns unauthorized error
- `notFound(string $message) -> void`: Returns not found error
- `forbidden(string $message) -> void`: Returns 403 Forbidden error
- `badRequest(string $message, mixed $details) -> void`: Returns 400 Bad Request error
- `conflict(string $message, mixed $details) -> void`: Returns 409 Conflict error
- `created(mixed $data, string $message) -> void`: Returns 201 Created success
- `accepted(mixed $data, string $message) -> void`: Returns 202 Accepted success
- `noContent() -> void`: Returns 204 No Content
- `paginated(array $data, int $total, int $page, int $limit, string $message) -> void`: Returns paginated response
- `custom(array $data, int $code) -> void`: Returns custom response structure
- `maintenance(string $message, string $estimated_time) -> void`: Returns 503 Maintenance mode
- `rateLimit(string $message, int $retry_after) -> void`: Returns 429 Rate limit exceeded
- `setCorsHeaders(array $allowed_origins, array $allowed_methods, array $allowed_headers) -> void`: Sets CORS headers
- `handlePreflight() -> void`: Handles OPTIONS preflight requests
- `expectsJson() -> bool`: Checks if client expects JSON response
- `logError(string $message, mixed $details, string $level) -> void`: Logs errors (private)
- `json_success(mixed $data, string $message, int $code) -> void`: Quick success response
- `json_error(string $message, int $code, mixed $details) -> void`: Quick error response
- `json_validation_error(array $errors, string $message) -> void`: Quick validation error
- `json_unauthorized(string $message) -> void`: Quick unauthorized error
- `json_not_found(string $message) -> void`: Quick not found error

### classes/UserCalculations.php
- **Description**: Calculates gamification values like rewards, prices, and level requirements
- **Required Imports**: None
- **Frontend Consumers**: userCalculations.js (must match), LevelProgress.jsx, CurrencyDisplay.jsx, RewardNotification.jsx

**Functions**:
- `calculateMaxRewards(array $user_data) -> array`: Calculates max rewards
- `calculateMaxPrices(array $user_data) -> array`: Calculates max prices
- `calculateAllUserLimits(array $user_data) -> array`: Calculates all limits
- `calculateLevelUpRequirements(int $current_level, int $current_exp) -> array`: Calculates level up requirements
- `calculateExpForLevel(int $level) -> int`: Calculates total EXP needed for specific level (private)
- `getLevelTitle(int $level) -> string`: Returns title based on user level
- `calculateRecipeRewards(string $difficulty, array $user_limits) -> array`: Calculates rewards for recipe completion
- `calculateStepRewards(int $step_index, int $total_steps, array $recipe_rewards) -> array`: Calculates step completion rewards
- `checkLevelUp(int $current_level, int $current_exp) -> array`: Checks if user should level up
- `calculateDailyLoginBonus(int $login_streak) -> array`: Calculates daily login bonus rewards
- `applyConsumableEffect(array $user_stats, string $consumable_type, int $effect_value) -> array`: Applies consumable effect to user stats

## utils/

### utils/uuidHelper.php
- **Description**: Generates unique identifiers for database records
- **Required Imports**: None
- **Frontend Consumers**: RecipeForm.jsx, RegisterForm.jsx, CookbooksPage.jsx, CookingSessionPage.jsx

**Functions**:
- `makeId() -> string`: Generates unique ID
- `generateUniqueId(string $table, string $field) -> string`: Generates unique ID for table

### utils/fileUpload.php
- **Description**: Handles image uploads for profile pictures, recipe images, and step images
- **Required Imports**: None
- **Frontend Consumers**: UserProfile.jsx (profile picture), RecipeForm.jsx (recipe images), upload.js utility

**Functions**:
- `uploadImage(array $file, string $type, string $user_id) -> array|false`: Uploads image file
- `validateImage(array $file) -> bool`: Validates image file
- `deleteFile(string $path) -> bool`: Deletes uploaded file

### utils/validation.php
- **Description**: Input validation and sanitization functions
- **Required Imports**: None
- **Frontend Consumers**: LoginForm.jsx, RegisterForm.jsx, RecipeForm.jsx, UserProfile.jsx, validators.js

**Functions**:
- `validateEmail(string $email) -> bool`: Validates email format
- `validatePassword(string $password) -> bool`: Validates password strength
- `sanitizeInput(mixed $input) -> mixed`: Sanitizes input data

### utils/logging.php
- **Description**: Logging system for errors, user activities, and API requests
- **Required Imports**: None
- **Frontend Consumers**: ErrorBoundary.jsx (error logging), all API modules (request logging)

**Functions**:
- `logError(string $message, array $context) -> void`: Logs error to file
- `logActivity(string $user_id, string $action, array $details) -> void`: Logs user activity
- `logApiRequest(string $method, string $endpoint, int $status) -> void`: Logs API request

## database/

### database/schema.sql
- **Description**: SQL schema for creating all database tables
- **Required Imports**: None
- **Frontend Consumers**: None (database setup only)
- **Functions**: N/A (SQL file)

### database/seeds.sql
- **Description**: Seed data for testing and development
- **Required Imports**: None
- **Frontend Consumers**: None (database setup only)
- **Functions**: N/A (SQL file)

## api/

## api/auth/

### api/auth/register.php
- **Description**: Handles user registration
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Frontend Consumers**: RegisterForm.jsx, RegisterPage.jsx, api/auth.js register()

### api/auth/login.php
- **Description**: Handles user authentication
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: LoginForm.jsx, LoginPage.jsx, api/auth.js login()

### api/auth/me.php
- **Description**: Returns current authenticated user's information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: AuthContext.jsx, Header.jsx, ProtectedRoute.jsx, api/auth.js getCurrentUser()

### api/auth/logout.php
- **Description**: Handles user logout
- **Required Imports**: ../../config/database.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: Header.jsx logout, AuthContext.jsx logout(), api/auth.js logout()

### api/auth/refresh-token.php
- **Description**: Refreshes authentication tokens
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: AuthContext.jsx refreshToken(), api/auth.js refreshToken(), useAuth hook

## api/users/

### api/users/profile.php
- **Description**: Retrieves user profile information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx, ProfilePage.jsx, Header.jsx, api/users.js getProfile()

### api/users/update.php
- **Description**: Updates user profile information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Frontend Consumers**: UserProfile.jsx edit, ProfilePage.jsx, api/users.js updateProfile()

### api/users/stats.php
- **Description**: Retrieves user statistics and gamification data
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: StatsDisplay.jsx, UserProfile.jsx, Header.jsx, LevelProgress.jsx, api/users.js getUserStats()

### api/users/search.php
- **Description**: Searches for users by name or criteria
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: DiscoverPage.jsx, UserCard.jsx lists, api/users.js searchUsers()

## api/relationships/

### api/relationships/follow.php
- **Description**: Handles user following/unfollowing
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: FollowButton.jsx, UserCard.jsx, UserProfile.jsx, api/relationships.js followUser()/unfollowUser()

### api/relationships/friends.php
- **Description**: Manages friend requests and relationships
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx friend requests, api/relationships.js friend request functions

### api/relationships/list.php
- **Description**: Lists user relationships (following, followers, friends)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx tabs, api/relationships.js getFollowing()/getFollowers()

## api/recipes/

### api/recipes/index.php
- **Description**: Lists recipes with filtering and pagination
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeList.jsx, RecipesPage.jsx, HomePage.jsx, DiscoverPage.jsx, api/recipes.js getAllRecipes()

### api/recipes/purchase.php
- **Description**: Handles recipe purchases with currency (gold or gems)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../classes/UserCalculations.php
- **Frontend Consumers**: PurchaseModal.jsx, RecipeDetail.jsx purchase button, api/purchase.js purchaseRecipe()
- **Functions**:
  - `validateRecipePurchase(user_id, recipe_id, currency_type) -> bool`: Validates recipe purchase request
  - `processRecipePurchase(user_id, recipe_id, currency_type) -> array`: Processes the recipe purchase transaction
  - `checkRecipeOwnership(user_id, recipe_id) -> bool`: Checks if user already owns recipe
  - `grantRecipeAccess(user_id, recipe_id, currency_type, price) -> bool`: Grants access to recipe after purchase

### api/recipes/access.php
- **Description**: Checks if user has access to a recipe (purchased, created, or free)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx access check, api/purchase.js checkRecipeAccess()
- **Functions**:
  - `checkRecipeAccess(user_id, recipe_id) -> array`: Checks access and returns access type
  - `getAccessibleRecipes(user_id) -> array`: Gets all recipes user can access
  - `validateRecipePurchaseRequired(recipe_id) -> bool`: Checks if recipe requires purchase

### api/recipes/create.php
- **Description**: Creates a new recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php, ../../utils/validation.php
- **Frontend Consumers**: RecipeForm.jsx, CreateRecipePage.jsx, api/recipes.js createRecipe()

### api/recipes/show.php
- **Description**: Retrieves detailed information about a specific recipe
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx, RecipeDetailPage.jsx, api/recipes.js getRecipe()

### api/recipes/update.php
- **Description**: Updates an existing recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Frontend Consumers**: RecipeForm.jsx edit mode, api/recipes.js updateRecipe()

### api/recipes/delete.php
- **Description**: Deletes a recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx delete button, api/recipes.js deleteRecipe()

### api/recipes/interact.php
- **Description**: Handles recipe interactions (likes, saves, purchases)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeCard.jsx like/save buttons, RecipeDetail.jsx interactions, api/recipes.js likeRecipe()/saveRecipe()

## api/cooking-sessions/

### api/cooking-sessions/index.php
- **Description**: Lists cooking sessions
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: HomePage.jsx session list, api/cooking-sessions.js session listing

### api/cooking-sessions/create.php
- **Description**: Creates a new cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Frontend Consumers**: RecipeDetail.jsx "Start Cooking", CookingSessionPage.jsx, api/cooking-sessions.js createSession()

### api/cooking-sessions/show.php
- **Description**: Retrieves detailed information about a specific cooking session
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx, CookingSessionPage.jsx, api/cooking-sessions.js getSession()

### api/cooking-sessions/update.php
- **Description**: Updates an existing cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx controls, api/cooking-sessions.js updateSession()

### api/cooking-sessions/join.php
- **Description**: Allows users to join a cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx join button, ParticipantList.jsx, api/cooking-sessions.js joinSession()

### api/cooking-sessions/complete-step.php
- **Description**: Marks a cooking step as completed
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx step completion, StepList.jsx, api/cooking-sessions.js completeStep()

### api/cooking-sessions/vote.php
- **Description**: Handles voting in cooking sessions (skip steps, etc.)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx vote buttons, SessionChat.jsx, api/cooking-sessions.js voteSkip()

### api/sessions/history.php
- **Description**: Retrieves user's cooking session history
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: SessionHistoryPage.jsx, UserProfile.jsx history tab, api/cooking-sessions.js session history
- **Functions**:
  - `getUserSessionHistory(user_id, limit, offset) -> array`: Gets paginated session history
  - `getSessionStatistics(user_id) -> array`: Gets cooking stats (total sessions, time, etc.)

## api/chat/

### api/chat/messages.php
- **Description**: Handles cooking session chat messages (for multiplayer)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: SessionChat.jsx send/receive, api/chat.js sendChatMessage()/getChatMessages()
- **Functions**:
  - `sendSessionMessage(session_id, user_id, message) -> bool`: Saves chat message
  - `getSessionMessages(session_id, limit) -> array`: Retrieves session chat history

## api/cookbooks/

### api/cookbooks/index.php
- **Description**: Lists user's cookbooks
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookbooksPage.jsx, UserProfile.jsx cookbooks tab, api/cookbooks.js getCookbooks()

### api/cookbooks/create.php
- **Description**: Creates a new cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Frontend Consumers**: CookbooksPage.jsx create button, api/cookbooks.js createCookbook()

### api/cookbooks/show.php
- **Description**: Retrieves detailed information about a specific cookbook
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: Cookbook detail views, api/cookbooks.js getCookbookRecipes()

### api/cookbooks/add-recipe.php
- **Description**: Adds a recipe to a cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx "Add to Cookbook", api/cookbooks.js addRecipeToCookbook()

### api/cookbooks/remove-recipe.php
- **Description**: Removes a recipe from a cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: Cookbook management, api/cookbooks.js removeRecipeFromCookbook()

## api/upload/

### api/upload/image.php
- **Description**: Handles image uploads for various types (profile, recipe, step)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../utils/fileUpload.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx profile picture, RecipeForm.jsx images, upload.js utility, api/upload image functions

## api/inventory/

### api/inventory/list.php
- **Description**: Lists user's purchased inventory items
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: InventoryList.jsx, InventoryItem.jsx, ShopPage.jsx inventory, api/inventory.js getUserInventory()
- **Functions**:
  - `getUserInventory(user_id, category) -> array`: Gets user's inventory items
  - `getEquippedItems(user_id) -> array`: Gets currently equipped items
  - `getItemDetails(item_id) -> array`: Gets detailed information about an inventory item

### api/inventory/use.php
- **Description**: Uses a consumable item from inventory
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../classes/UserCalculations.php
- **Frontend Consumers**: InventoryItem.jsx use button, api/inventory.js useConsumable()
- **Functions**:
  - `validateConsumableUse(user_id, inventory_id) -> bool`: Validates if item can be used
  - `applyConsumableEffect(user_id, inventory_id) -> array`: Applies consumable effect and updates stats
  - `consumeItem(user_id, inventory_id) -> bool`: Reduces quantity or removes item
  - `getConsumableEffects() -> array`: Returns list of possible consumable effects

## api/shop/

### api/shop/items.php
- **Description**: Lists available shop items
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../config/cors.php
- **Frontend Consumers**: ShopPage.jsx, ShopItem.jsx, DiscoverPage.jsx shop items, api/shop.js getShopItems()

**Functions**:
- `getAuthorizationToken() -> string|null`: Extracts Bearer token from Authorization header

### api/shop/purchase.php
- **Description**: Handles shop item purchases (redirects to /api/purchase/item.php)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../purchase/item.php
- **Frontend Consumers**: ShopItem.jsx purchase, PurchaseModal.jsx, api/shop.js purchaseItem()
- **Functions**:
  - `validateShopPurchase(user_id, item_id) -> bool`: Validates purchase request
  - `getAuthorizationToken() -> string|null`: Extracts Bearer token

## uploads/
- **Description**: Directory for uploaded files
- **Subdirectories**:
  - `profile-pictures/`: User profile pictures
  - `recipe-images/`: Recipe cover images
  - `step-images/`: Cooking step images

## .htaccess
- **Description**: URL rewriting for clean API endpoints
- **Content**: Rewrites all requests to index.php

## index.php
- **Description**: Main entry point that routes requests to appropriate endpoints
- **Required Imports**: config/cors.php
- **Functionality**: Routes requests to appropriate endpoints