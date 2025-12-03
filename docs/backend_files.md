# Backend Directory Structure

<details>
<summary>backend/</summary>

---

<details>
<summary>config/</summary>

---

<details>
<summary>config/environment.php</summary>

- requiredImports: None

<details>
<summary>functions</summary>

- getEnvironment() -> string: Returns current environment (dev/prod)
- getDatabaseConfig() -> array: Returns database connection parameters
- getApiConfig() -> array: Returns API configuration settings
</details>
</details>

---

<details>
<summary>config/database.php</summary>

- requiredImports: environment.php

<details>
<summary>functions</summary>

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

- requiredImports: None

<details>
<summary>functions</summary>

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

- requiredImports: None

<details>
<summary>functions</summary>

- generateToken(string $user_id, string $email) -> string: Generates JWT token
- validateToken(string $token) -> array|false: Validates JWT token
- hashPassword(string $password) -> string: Hashes password
- verifyPassword(string $password, string $hash) -> bool: Verifies password
</details>
</details>

---

<details>
<summary>classes/DatabaseHelper.php</summary>

- requiredImports: ../config/database.php

<details>
<summary>functions</summary>

<details>
<summary>User Operations</summary>

- registerUser(array $user_data) -> bool: Creates new user
- validateUserLogin(string $email, string $password) -> array|false: Validates login credentials
- getUserById(string $user_id) -> array|false: Gets user by ID
- updateUserProfile(string $user_id, array $data) -> bool: Updates user profile
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

- requiredImports: None

<details>
<summary>functions</summary>

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

- requiredImports: None

<details>
<summary>functions</summary>

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

- requiredImports: None

<details>
<summary>functions</summary>

- makeId() -> string: Generates unique ID
- generateUniqueId(string $table, string $field) -> string: Generates unique ID for table
</details>
</details>

---

<details>
<summary>utils/fileUpload.php</summary>

- requiredImports: None

<details>
<summary>functions</summary>

- uploadImage(array $file, string $type, string $user_id) -> array|false: Uploads image file
- validateImage(array $file) -> bool: Validates image file
- deleteFile(string $path) -> bool: Deletes uploaded file
</details>
</details>

---

<details>
<summary>utils/validation.php</summary>

- requiredImports: None

<details>
<summary>functions</summary>

- validateEmail(string $email) -> bool: Validates email format
- validatePassword(string $password) -> bool: Validates password strength
- sanitizeInput(mixed $input) -> mixed: Sanitizes input data
</details>
</details>

---

<details>
<summary>utils/logging.php</summary>

- requiredImports: None

<details>
<summary>functions</summary>

- logError(string $message, array $context) -> void: Logs error to file
- logActivity(string $user_id, string $action, array $details) -> void: Logs user activity
- logApiRequest(string $method, string $endpoint, int $status) -> void: Logs API request
</details>
</details>

</details>

---

<details>
<summary>database/</summary>

---

<details>
<summary>database/schema.sql</summary>

- requiredImports: None
- functions: N/A (SQL file)
</details>

---

<details>
<summary>database/seeds.sql</summary>

- requiredImports: None
- functions: N/A (SQL file)
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

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- endpoint: POST /api/auth/register
</details>

---

<details>
<summary>api/auth/login.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/auth/login
</details>

---

<details>
<summary>api/auth/me.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/auth/me
</details>

---

<details>
<summary>api/auth/logout.php</summary>

- requiredImports: ../../config/database.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/auth/logout
</details>

---

<details>
<summary>api/auth/refresh-token.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/auth/refresh-token
</details>

</details>

---

<details>
<summary>api/users/</summary>

---

<details>
<summary>api/users/profile.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/users/profile
</details>

---

<details>
<summary>api/users/update.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- endpoint: PUT /api/users/update
</details>

---

<details>
<summary>api/users/stats.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/users/stats
</details>

---

<details>
<summary>api/users/search.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/users/search
</details>

</details>

---

<details>
<summary>api/relationships/</summary>

---

<details>
<summary>api/relationships/follow.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/relationships/follow
</details>

---

<details>
<summary>api/relationships/friends.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/relationships/friends
</details>

---

<details>
<summary>api/relationships/list.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/relationships/list
</details>

</details>

---

<details>
<summary>api/recipes/</summary>

---

<details>
<summary>api/recipes/index.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/recipes
</details>

---

<details>
<summary>api/recipes/create.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php, ../../utils/validation.php
- endpoint: POST /api/recipes
</details>

---

<details>
<summary>api/recipes/show.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/recipes/{id}
</details>

---

<details>
<summary>api/recipes/update.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- endpoint: PUT /api/recipes/{id}
</details>

---

<details>
<summary>api/recipes/delete.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: DELETE /api/recipes/{id}
</details>

---

<details>
<summary>api/recipes/interact.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/recipes/{id}/interact
</details>

</details>

---

<details>
<summary>api/cooking-sessions/</summary>

---

<details>
<summary>api/cooking-sessions/index.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/cooking-sessions
</details>

---

<details>
<summary>api/cooking-sessions/create.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- endpoint: POST /api/cooking-sessions
</details>

---

<details>
<summary>api/cooking-sessions/show.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/cooking-sessions/{id}
</details>

---

<details>
<summary>api/cooking-sessions/update.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: PUT /api/cooking-sessions/{id}
</details>

---

<details>
<summary>api/cooking-sessions/join.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/cooking-sessions/{id}/join
</details>

---

<details>
<summary>api/cooking-sessions/complete-step.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/cooking-sessions/{id}/complete-step
</details>

---

<details>
<summary>api/cooking-sessions/vote.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/cooking-sessions/{id}/vote
</details>

</details>

---

<details>
<summary>api/cookbooks/</summary>

---

<details>
<summary>api/cookbooks/index.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/cookbooks
</details>

---

<details>
<summary>api/cookbooks/create.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- endpoint: POST /api/cookbooks
</details>

---

<details>
<summary>api/cookbooks/show.php</summary>

- requiredImports: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: GET /api/cookbooks/{id}
</details>

---

<details>
<summary>api/cookbooks/add-recipe.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/cookbooks/{id}/add-recipe
</details>

---

<details>
<summary>api/cookbooks/remove-recipe.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- endpoint: DELETE /api/cookbooks/{id}/remove-recipe
</details>

</details>

---

<details>
<summary>api/upload/</summary>

---

<details>
<summary>api/upload/image.php</summary>

- requiredImports: ../../config/database.php, ../../classes/AuthHelper.php, ../../utils/fileUpload.php, ../../classes/ResponseFormatter.php
- endpoint: POST /api/upload/image
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

- description: URL rewriting for clean API endpoints
- content: Rewrites all requests to index.php
</details>

---

<details>
<summary>index.php</summary>

- requiredImports: config/cors.php
- functionality: Routes requests to appropriate endpoints
</details>

</details>