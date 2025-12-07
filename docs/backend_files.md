# Backend Directory Structure

<details>
<summary>backend/</summary>

---

<details>
<summary>config/</summary>

---

<details>
<summary>config/environment.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- getEnvironment() -> string: Returns current environment (dev/prod)
- getDatabaseConfig() -> array: Returns database connection parameters
- getApiConfig() -> array: Returns API configuration settings
</details>
</details>

---

<details>
<summary>config/database.php</summary>

- **Required Imports**: environment.php

<details>
<summary>Functions</summary>

- connect() -> PDO: Establishes database connection
- query(string $sql, array $params) -> PDOStatement: Executes prepared statement
- fetchAll(string $sql, array $params) -> array: Fetches all results
- fetchOne(string $sql, array $params) -> array|false: Fetches single row
- insert(string $table, array $data) -> string|false: Inserts record
- update(string $table, array $data, string $where) -> int: Updates record
- delete(string $table, string $where) -> int: Deletes record
</details>
</details>

---

<details>
<summary>config/cors.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- setCorsHeaders() -> void: Sets CORS headers for API responses
- handlePreflight() -> void: Handles OPTIONS preflight requests
</details>
</details>

</details>

---

<details>
<summary>classes/</summary>

---

<details>
<summary>classes/AuthHelper.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- generateToken(string $user_id, string $email) -> string: Generates JWT token
- validateToken(string $token) -> array|false: Validates JWT token
- hashPassword(string $password) -> string: Hashes password
- verifyPassword(string $password, string $hash) -> bool: Verifies password
</details>
</details>

---

<details>
<summary>classes/DatabaseHelper.php</summary>

- **Required Imports**: ../config/database.php

<details>
<summary>Functions</summary>

<details>
<summary>User Operations</summary>

- registerUser(array $user_data) -> bool: Creates new user
- validateUserLogin(string $email, string $password) -> array|false: Validates login credentials
- getUserById(string $user_id) -> array|false: Gets user by ID
- updateUserProfile(string $user_id, array $data) -> bool: Updates user profile
- getUserStats(string $user_id) -> array|false: Gets user stats
- updateUserStats(string $user_id, array $updates) -> bool: Updates user stats
- incrementUserStat(string $user_id, string $field, int $amount) -> bool: Increments user stat
- searchUsers(string $query, array $filters) -> array: Searches users with pagination (mentioned as needed for api/users/search.php)
- createRecipe(array $recipe_data, array $ingredients, array $steps) -> string|false: Creates recipe with ingredients and steps
- getRecipe(string $recipe_id) -> array|false: Gets full recipe with details
- updateRecipe(string $recipe_id, array $recipe_data, array $ingredients, array $steps) -> bool: Updates recipe
- deleteRecipe(string $recipe_id) -> bool: Deletes recipe and related data
- createCookingSession(array $session_data) -> string|false: Creates cooking session
- getCookingSession(string $session_id) -> array|false: Gets cooking session with details
- updateCookingSession(string $session_id, array $updates) -> bool: Updates cooking session
- joinCookingSession(string $session_id, string $user_id) -> bool: Joins user to cooking session
- followUser(string $source_user_id, string $target_user_id, string $relationship_type) -> bool: Follows/unfollows user
- unfollowUser(string $source_user_id, string $target_user_id) -> bool: Removes relationship
- getFriendRequests(string $user_id) -> array: Gets pending friend requests
- acceptFriendRequest(string $relationship_id) -> bool: Accepts friend request
- rejectFriendRequest(string $relationship_id) -> bool: Rejects friend request
- removeFriend(string $relationship_id) -> bool: Removes friend relationship
- getRelationships(string $user_id, string $type = 'following') -> array: Gets user relationships
- getCookbooks(string $user_id, bool $include_public = false) -> array: Gets user's cookbooks
- createCookbook(array $cookbook_data) -> string|false: Creates new cookbook
- getCookbook(string $cookbook_id) -> array|false: Gets cookbook with recipes
- updateCookbook(string $cookbook_id, array $updates) -> bool: Updates cookbook
- deleteCookbook(string $cookbook_id) -> bool: Deletes cookbook
- addRecipeToCookbook(string $cookbook_id, string $recipe_id, string $user_id) -> bool: Adds recipe to cookbook
- removeRecipeFromCookbook(string $cookbook_id, string $recipe_id) -> bool: Removes recipe from cookbook
- getCookbookRecipes(string $cookbook_id) -> array: Gets recipes in cookbook
- getShopItems(array $filters = []) -> array: Gets available shop items
- purchaseItem(string $user_id, string $item_id) -> array|false: Purchases shop item
- getUserPurchases(string $user_id) -> array: Gets user's purchased items
- getItemCategories() -> array: Gets shop item categories
</details>

---

<details>
<summary>User Stats Operations</summary>

- getUserStats(string $user_id) -> array|false: Gets user stats
- updateUserStats(string $user_id, array $updates) -> bool: Updates user stats
- incrementUserStat(string $user_id, string $field, int $amount) -> bool: Increments user stat
</details>

---

<details>
<summary>Recipe Operations</summary>

- createRecipe(array $recipe_data, array $ingredients, array $steps) -> string|false: Creates recipe with ingredients and steps
- getRecipe(string $recipe_id) -> array|false: Gets full recipe with details
- updateRecipe(string $recipe_id, array $recipe_data, array $ingredients, array $steps) -> bool: Updates recipe
- deleteRecipe(string $recipe_id) -> bool: Deletes recipe and related data
</details>

---

<details>
<summary>Cooking Session Operations</summary>

- createCookingSession(array $session_data) -> string|false: Creates cooking session
- getCookingSession(string $session_id) -> array|false: Gets cooking session with details
- updateCookingSession(string $session_id, array $updates) -> bool: Updates cooking session
- joinCookingSession(string $session_id, string $user_id) -> bool: Joins user to cooking session
</details>
</details>
</details>

---

<details>
<summary>classes/ResponseFormatter.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- success(mixed $data, string $message, int $code) -> void: Returns success response
- error(string $message, int $code, mixed $details) -> void: Returns error response
- validationError(array $errors) -> void: Returns validation error
- unauthorized(string $message) -> void: Returns unauthorized error
- notFound(string $message) -> void: Returns not found error
</details>
</details>

---

<details>
<summary>classes/UserCalculations.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- calculateMaxRewards(array $user_data) -> array: Calculates max rewards
- calculateMaxPrices(array $user_data) -> array: Calculates max prices
- calculateAllUserLimits(array $user_data) -> array: Calculates all limits
- calculateLevelUpRequirements(int $current_level, int $current_exp) -> array: Calculates level up requirements
</details>
</details>

</details>

---

<details>
<summary>utils/</summary>

---

<details>
<summary>utils/uuidHelper.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- makeId() -> string: Generates unique ID
- generateUniqueId(string $table, string $field) -> string: Generates unique ID for table
</details>
</details>

---

<details>
<summary>utils/fileUpload.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- uploadImage(array $file, string $type, string $user_id) -> array|false: Uploads image file
- validateImage(array $file) -> bool: Validates image file
- deleteFile(string $path) -> bool: Deletes uploaded file
</details>
</details>

---

<details>
<summary>utils/validation.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- validateEmail(string $email) -> bool: Validates email format
- validatePassword(string $password) -> bool: Validates password strength
- sanitizeInput(mixed $input) -> mixed: Sanitizes input data
</details>
</details>

---

<details>
<summary>utils/logging.php</summary>

- **Required Imports**: None

<details>
<summary>Functions</summary>

- logError(string $message, array $context) -> void: Logs error to file
- logActivity(string $user_id, string $action, array $details) -> void: Logs user activity
- logApiRequest(string $method, string $**Endpoint**, int $status) -> void: Logs API request
</details>
</details>

</details>

---

<details>
<summary>database/</summary>

---

<details>
<summary>database/schema.sql</summary>

- **Required Imports**: None
- Functions: N/A (SQL file)
</details>

---

<details>
<summary>database/seeds.sql</summary>

- **Required Imports**: None
- Functions: N/A (SQL file)
</details>

</details>

---

<details>
<summary>api/</summary>

---

<details>
<summary>api/auth/</summary>

---

<details>
<summary>api/auth/register.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Endpoint**: POST /api/auth/register
</details>

---

<details>
<summary>api/auth/login.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/auth/login
</details>

---

<details>
<summary>api/auth/me.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/auth/me
</details>

---

<details>
<summary>api/auth/logout.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/auth/logout
</details>

---

<details>
<summary>api/auth/refresh-token.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/auth/refresh-token
</details>

</details>

---

<details>
<summary>api/users/</summary>

---

<details>
<summary>api/users/profile.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/users/profile
</details>

---

<details>
<summary>api/users/update.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Endpoint**: PUT /api/users/update
</details>

---

<details>
<summary>api/users/stats.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/users/stats
</details>

---

<details>
<summary>api/users/search.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/users/search
</details>

</details>

---

<details>
<summary>api/relationships/</summary>

---

<details>
<summary>api/relationships/follow.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/relationships/follow
</details>

---

<details>
<summary>api/relationships/friends.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/relationships/friends
</details>

---

<details>
<summary>api/relationships/list.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/relationships/list
</details>

</details>

---

<details>
<summary>api/recipes/</summary>

---

<details>
<summary>api/recipes/index.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/recipes
</details>

---

<details>
<summary>api/recipes/create.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php, ../../utils/validation.php
- **Endpoint**: POST /api/recipes
</details>

---

<details>
<summary>api/recipes/show.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/recipes/{id}
</details>

---

<details>
<summary>api/recipes/update.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Endpoint**: PUT /api/recipes/{id}
</details>

---

<details>
<summary>api/recipes/delete.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: DELETE /api/recipes/{id}
</details>

---

<details>
<summary>api/recipes/interact.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/recipes/{id}/interact
</details>

</details>

---

<details>
<summary>api/cooking-sessions/</summary>

---

<details>
<summary>api/cooking-sessions/index.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/cooking-sessions
</details>

---

<details>
<summary>api/cooking-sessions/create.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Endpoint**: POST /api/cooking-sessions
</details>

---

<details>
<summary>api/cooking-sessions/show.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/cooking-sessions/{id}
</details>

---

<details>
<summary>api/cooking-sessions/update.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: PUT /api/cooking-sessions/{id}
</details>

---

<details>
<summary>api/cooking-sessions/join.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/cooking-sessions/{id}/join
</details>

---

<details>
<summary>api/cooking-sessions/complete-step.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/cooking-sessions/{id}/complete-step
</details>

---

<details>
<summary>api/cooking-sessions/vote.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/cooking-sessions/{id}/vote
</details>

</details>

---

<details>
<summary>api/cookbooks/</summary>

---

<details>
<summary>api/cookbooks/index.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/cookbooks
</details>

---

<details>
<summary>api/cookbooks/create.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Endpoint**: POST /api/cookbooks
</details>

---

<details>
<summary>api/cookbooks/show.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: GET /api/cookbooks/{id}
</details>

---

<details>
<summary>api/cookbooks/add-recipe.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/cookbooks/{id}/add-recipe
</details>

---

<details>
<summary>api/cookbooks/remove-recipe.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Endpoint**: DELETE /api/cookbooks/{id}/remove-recipe
</details>

</details>

---

<details>
<summary>api/upload/</summary>

---

<details>
<summary>api/upload/image.php</summary>

- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../utils/fileUpload.php, ../../classes/ResponseFormatter.php
- **Endpoint**: POST /api/upload/image
</details>

</details>

</details>

---

<details>
<summary>uploads/</summary>

- profile-pictures/
- recipe-images/
- step-images/
</details>

---

<details>
<summary>.htaccess</summary>

- description: URL rewriting for clean API **Endpoint**s
- content: Rewrites all requests to index.php
</details>

---

<details>
<summary>index.php</summary>

- **Required Imports**: config/cors.php
- functionality: Routes requests to appropriate **Endpoint**s
</details>

</details>