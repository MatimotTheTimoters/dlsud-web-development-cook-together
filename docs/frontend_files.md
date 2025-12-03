# Frontend Directory Structure

<details>
<summary>frontend/</summary>

---

<details>
<summary>public/</summary>

<details>
<summary>index.html</summary>

- description: Main HTML template
- requiredImports: None
</details>

---

<details>
<summary>favicon.ico</summary>

- description: Site favicon
- requiredImports: None
</details>

---

<details>
<summary>manifest.json</summary>

- description: PWA manifest
- requiredImports: None
</details>

</details>

---

<details>
<summary>src/</summary>

<details>
<summary>components/</summary>

<details>
<summary>components/auth/</summary>

<details>
<summary>components/auth/LoginForm.jsx</summary>

- requiredImports: React, useState, useNavigate from react-router-dom, api from ../api/auth
<details>
<summary>functions</summary>

- handleSubmit(event) -> void: Handles login form submission
- validateForm() -> boolean: Validates form inputs
- resetForm() -> void: Resets form to initial state
</details>
</details>

---

<details>
<summary>components/auth/RegisterForm.jsx</summary>

- requiredImports: React, useState, useNavigate from react-router-dom, api from ../api/auth
<details>
<summary>functions</summary>

- handleSubmit(event) -> void: Handles registration form submission
- validateForm() -> boolean: Validates form inputs
- checkPasswordStrength(password) -> string: Returns password strength rating
</details>
</details>

---

<details>
<summary>components/auth/ProtectedRoute.jsx</summary>

- requiredImports: React, Navigate from react-router-dom, useAuth from ../contexts/AuthContext
<details>
<summary>functions</summary>

- ProtectedRoute({ children }) -> JSX: Wraps protected routes with authentication check
</details>
</details>

</details>

---

<details>
<summary>components/common/</summary>

<details>
<summary>components/common/Header.jsx</summary>

- requiredImports: React, Link from react-router-dom, useAuth from ../contexts/AuthContext
<details>
<summary>functions</summary>

- handleLogout() -> void: Logs user out and redirects to login
- getGreeting() -> string: Returns time-based greeting message
</details>
</details>

---

<details>
<summary>components/common/Footer.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- getCurrentYear() -> number: Returns current year for copyright
</details>
</details>

---

<details>
<summary>components/common/Navigation.jsx</summary>

- requiredImports: React, NavLink from react-router-dom, useAuth from ../contexts/AuthContext
<details>
<summary>functions</summary>

- isActiveLink(isActive) -> string: Returns active link className
- hasPermission(requiredRole) -> boolean: Checks if user has required permissions
</details>
</details>

---

<details>
<summary>components/common/LoadingSpinner.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- LoadingSpinner({ size, color }) -> JSX: Displays loading animation
</details>
</details>

---

<details>
<summary>components/common/ErrorBoundary.jsx</summary>

- requiredImports: React, Component
<details>
<summary>functions</summary>

- getDerivedStateFromError(error) -> object: Updates state so next render shows fallback UI
- componentDidCatch(error, errorInfo) -> void: Logs error to error reporting service
</details>
</details>

</details>

---

<details>
<summary>components/recipes/</summary>

<details>
<summary>components/recipes/RecipeCard.jsx</summary>

- requiredImports: React, Link from react-router-dom, formatTime from ../../utils/formatters
<details>
<summary>functions</summary>

- getDifficultyColor(difficulty) -> string: Returns color based on difficulty level
- truncateText(text, maxLength) -> string: Truncates text to specified length
</details>
</details>

---

<details>
<summary>components/recipes/RecipeForm.jsx</summary>

- requiredImports: React, useState, useEffect, useNavigate from react-router-dom, api from ../api/recipes
<details>
<summary>functions</summary>

- handleSubmit(event) -> void: Handles recipe form submission
- addIngredient() -> void: Adds new ingredient field
- removeIngredient(index) -> void: Removes ingredient field
- addStep() -> void: Adds new step field
- removeStep(index) -> void: Removes step field
- validateForm() -> boolean: Validates all form inputs
- calculateNutrition() -> object: Calculates total nutrition from ingredients
</details>
</details>

---

<details>
<summary>components/recipes/RecipeDetail.jsx</summary>

- requiredImports: React, useState, useEffect, useParams from react-router-dom, api from ../api/recipes
<details>
<summary>functions</summary>

- loadRecipe() -> void: Fetches recipe details from API
- handleInteraction(type) -> void: Handles like/dislike/save interactions
- formatTimer(duration, unit) -> string: Formats timer for display
</details>
</details>

---

<details>
<summary>components/recipes/RecipeList.jsx</summary>

- requiredImports: React, useState, useEffect, RecipeCard from ./RecipeCard, api from ../api/recipes
<details>
<summary>functions</summary>

- loadRecipes() -> void: Fetches recipes from API
- filterRecipes(criteria) -> array: Filters recipes based on criteria
- sortRecipes(sortBy) -> array: Sorts recipes based on sort option
</details>
</details>

---

<details>
<summary>components/recipes/IngredientList.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- formatAmount(amount, unit) -> string: Formats ingredient amount and unit
</details>
</details>

---

<details>
<summary>components/recipes/StepList.jsx</summary>

- requiredImports: React, useState
<details>
<summary>functions</summary>

- startTimer(duration) -> void: Starts countdown timer for step
- completeStep(stepId) -> void: Marks step as completed
</details>
</details>

</details>

---

<details>
<summary>components/cooking/</summary>

<details>
<summary>components/cooking/CookingSession.jsx</summary>

- requiredImports: React, useState, useEffect, useParams from react-router-dom, api from ../api/cooking-sessions
<details>
<summary>functions</summary>

- loadSession() -> void: Loads cooking session details
- startSession() -> void: Starts the cooking session
- pauseSession() -> void: Pauses the cooking session
- completeSession() -> void: Marks session as complete
- nextStep() -> void: Advances to next step
</details>
</details>

---

<details>
<summary>components/cooking/SessionTimer.jsx</summary>

- requiredImports: React, useState, useEffect
<details>
<summary>functions</summary>

- formatTime(seconds) -> string: Formats seconds to MM:SS
- startTimer(duration) -> void: Starts the timer
- pauseTimer() -> void: Pauses the timer
- resetTimer() -> void: Resets the timer to initial duration
</details>
</details>

---

<details>
<summary>components/cooking/ParticipantList.jsx</summary>

- requiredImports: React, useEffect, api from ../api/cooking-sessions
<details>
<summary>functions</summary>

- loadParticipants() -> void: Loads session participants
- updateParticipantStatus(userId, status) -> void: Updates participant status
</details>
</details>

---

<details>
<summary>components/cooking/StepProgress.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- calculateProgress(current, total) -> number: Calculates progress percentage
</details>
</details>

</details>

---

<details>
<summary>components/users/</summary>

<details>
<summary>components/users/UserCard.jsx</summary>

- requiredImports: React, Link from react-router-dom, api from ../api/relationships
<details>
<summary>functions</summary>

- handleFollow() -> void: Follows/unfollows user
- getLevelColor(level) -> string: Returns color based on user level
</details>
</details>

---

<details>
<summary>components/users/UserProfile.jsx</summary>

- requiredImports: React, useState, useEffect, useParams from react-router-dom, api from ../api/users
<details>
<summary>functions</summary>

- loadUserProfile() -> void: Loads user profile data
- loadUserRecipes() -> void: Loads user's recipes
- loadUserStats() -> void: Loads user statistics
- calculateNextLevelProgress() -> object: Calculates progress to next level
</details>
</details>

---

<details>
<summary>components/users/StatsDisplay.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- formatStatValue(value, type) -> string: Formats stat values for display
- getStatIcon(statName) -> JSX: Returns icon for stat type
</details>
</details>

---

<details>
<summary>components/users/FollowButton.jsx</summary>

- requiredImports: React, useState, api from ../api/relationships
<details>
<summary>functions</summary>

- checkFollowingStatus() -> boolean: Checks if current user follows target user
- toggleFollow() -> void: Toggles follow/unfollow
</details>
</details>

</details>

---

<details>
<summary>components/gamification/</summary>

<details>
<summary>components/gamification/CurrencyDisplay.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- formatCurrency(amount, type) -> string: Formats currency values with appropriate symbols
</details>
</details>

---

<details>
<summary>components/gamification/LevelProgress.jsx</summary>

- requiredImports: React
<details>
<summary>functions</summary>

- calculateProgress(currentExp, nextLevelExp) -> number: Calculates progress percentage
- getLevelTitle(level) -> string: Returns title based on level
</details>
</details>

---

<details>
<summary>components/gamification/RewardNotification.jsx</summary>

- requiredImports: React, useState, useEffect
<details>
<summary>functions</summary>

- showNotification(reward) -> void: Displays reward notification
- hideNotification() -> void: Hides notification after timeout
</details>
</details>

---

<details>
<summary>components/gamification/ShopItem.jsx</summary>

- requiredImports: React, useState, api from ../api/shop
<details>
<summary>functions</summary>

- canAfford() -> boolean: Checks if user can afford item
- purchaseItem() -> void: Handles item purchase
</details>
</details>

</details>

</details>

---

<details>
<summary>pages/</summary>

<details>
<summary>pages/HomePage.jsx</summary>

- requiredImports: React, Link from react-router-dom, RecipeList from ../components/recipes/RecipeList
<details>
<summary>functions</summary>

- getFeaturedRecipes() -> array: Returns featured recipes for homepage
- getRecentActivities() -> array: Returns recent user activities
</details>
</details>

---

<details>
<summary>pages/LoginPage.jsx</summary>

- requiredImports: React, LoginForm from ../components/auth/LoginForm
<details>
<summary>functions</summary>

- handleLoginSuccess() -> void: Redirects after successful login
</details>
</details>

---

<details>
<summary>pages/RegisterPage.jsx</summary>

- requiredImports: React, RegisterForm from ../components/auth/RegisterForm
<details>
<summary>functions</summary>

- handleRegisterSuccess() -> void: Redirects after successful registration
</details>
</details>

---

<details>
<summary>pages/RecipesPage.jsx</summary>

- requiredImports: React, useState, RecipeList from ../components/recipes/RecipeList, RecipeFilters from ../components/recipes/RecipeFilters
<details>
<summary>functions</summary>

- loadAllRecipes() -> void: Loads all recipes with pagination
- handleSearch(query) -> void: Handles recipe search
- handleFilterChange(filters) -> void: Updates recipe filters
</details>
</details>

---

<details>
<summary>pages/RecipeDetailPage.jsx</summary>

- requiredImports: React, RecipeDetail from ../components/recipes/RecipeDetail, CookingSession from ../components/cooking/CookingSession
<details>
<summary>functions</summary>

- handleStartCooking() -> void: Starts cooking session from recipe
</details>
</details>

---

<details>
<summary>pages/CreateRecipePage.jsx</summary>

- requiredImports: React, RecipeForm from ../components/recipes/RecipeForm
<details>
<summary>functions</summary>

- handleRecipeCreated(recipeId) -> void: Handles successful recipe creation
</details>
</details>

---

<details>
<summary>pages/ProfilePage.jsx</summary>

- requiredImports: React, UserProfile from ../components/users/UserProfile, UserRecipes from ../components/users/UserRecipes
<details>
<summary>functions</summary>

- loadUserData() -> void: Loads comprehensive user data
- handleProfileUpdate() -> void: Handles profile update success
</details>
</details>

---

<details>
<summary>pages/CookingSessionPage.jsx</summary>

- requiredImports: React, CookingSession from ../components/cooking/CookingSession, SessionTimer from ../components/cooking/SessionTimer
<details>
<summary>functions</summary>

- handleSessionComplete() -> void: Handles session completion
- handleStepComplete() -> void: Handles step completion with rewards
</details>
</details>

---

<details>
<summary>pages/ShopPage.jsx</summary>

- requiredImports: React, useState, ShopItem from ../components/gamification/ShopItem
<details>
<summary>functions</summary>

- loadShopItems() -> void: Loads available shop items
- handlePurchase(itemId) -> void: Handles item purchase
- filterItems(category) -> array: Filters shop items by category
</details>
</details>

---

<details>
<summary>pages/DiscoverPage.jsx</summary>

- requiredImports: React, useState, UserCard from ../components/users/UserCard, RecipeCard from ../components/recipes/RecipeCard
<details>
<summary>functions</summary>

- loadTopChefs() -> void: Loads top-rated users
- loadTrendingRecipes() -> void: Loads trending recipes
- loadRecentChallenges() -> void: Loads recent challenges
</details>
</details>

---

<details>
<summary>pages/CookbooksPage.jsx</summary>

- requiredImports: React, useState, api from ../api/cookbooks
<details>
<summary>functions</summary>

- loadCookbooks() -> void: Loads user's cookbooks
- createCookbook() -> void: Creates new cookbook
- addRecipeToCookbook() -> void: Adds recipe to cookbook
</details>
</details>

</details>

---

<details>
<summary>contexts/</summary>

<details>
<summary>contexts/AuthContext.jsx</summary>

- requiredImports: React, createContext, useState, useContext, useEffect
<details>
<summary>functions</summary>

- login(email, password) -> object: Authenticates user
- logout() -> void: Logs out user and clears session
- isAuthenticated() -> boolean: Checks if user is authenticated
- getCurrentUser() -> object: Returns current user data
- refreshToken() -> boolean: Refreshes authentication token
</details>
</details>

---

<details>
<summary>contexts/DataContext.jsx</summary>

- requiredImports: React, createContext, useState, useContext
<details>
<summary>functions</summary>

- updateUserData(data) -> void: Updates user data in context
- updateRecipes(data) -> void: Updates recipes in context
- updateRelationships(data) -> void: Updates relationships in context
- clearData() -> void: Clears all context data
- getCachedData(key) -> mixed: Retrieves cached data
- setCachedData(key, data) -> void: Sets data in cache
</details>
</details>

---

<details>
<summary>contexts/NotificationContext.jsx</summary>

- requiredImports: React, createContext, useState, useContext
<details>
<summary>functions</summary>

- showNotification(message, type) -> void: Shows notification
- hideNotification(id) -> void: Hides specific notification
- clearNotifications() -> void: Clears all notifications
</details>
</details>

</details>

---

<details>
<summary>hooks/</summary>

<details>
<summary>hooks/useAuth.js</summary>

- requiredImports: useContext from react, AuthContext from ../contexts/AuthContext
<details>
<summary>functions</summary>

- useAuth() -> object: Provides authentication state and methods
</details>
</details>

---

<details>
<summary>hooks/useApi.js</summary>

- requiredImports: useState, useEffect, useCallback
<details>
<summary>functions</summary>

- useApi(endpoint, method, body) -> object: Custom hook for API calls with loading and error states
- fetchData() -> void: Fetches data from API
- postData(data) -> void: Posts data to API
- putData(data) -> void: Updates data via API
- deleteData() -> void: Deletes data via API
</details>
</details>

---

<details>
<summary>hooks/useForm.js</summary>

- requiredImports: useState, useCallback
<details>
<summary>functions</summary>

- useForm(initialValues) -> object: Custom hook for form state management
- handleChange(event) -> void: Handles form field changes
- handleSubmit(callback) -> void: Handles form submission
- resetForm() -> void: Resets form to initial values
- validateForm() -> object: Validates form fields
</details>
</details>

---

<details>
<summary>hooks/useLocalStorage.js</summary>

- requiredImports: useState, useEffect
<details>
<summary>functions</summary>

- useLocalStorage(key, initialValue) -> array: Custom hook for localStorage with state synchronization
- setValue(value) -> void: Sets value in localStorage and state
- removeValue() -> void: Removes value from localStorage and state
</details>
</details>

</details>

---

<details>
<summary>utils/</summary>

<details>
<summary>utils/api.js</summary>

- requiredImports: None
<details>
<summary>functions</summary>

- get(endpoint) -> promise: GET request helper
- post(endpoint, data) -> promise: POST request helper
- put(endpoint, data) -> promise: PUT request helper
- delete(endpoint) -> promise: DELETE request helper
- setAuthToken(token) -> void: Sets authentication token for requests
- handleResponse(response) -> object: Handles API response
- handleError(error) -> object: Handles API errors
</details>
</details>

---

<details>
<summary>utils/formatters.js</summary>

- requiredImports: None
<details>
<summary>functions</summary>

- formatTime(minutes) -> string: Formats minutes to hours:minutes
- formatDate(timestamp) -> string: Formats timestamp to readable date
- truncateText(text, length) -> string: Truncates text with ellipsis
- formatCurrency(amount) -> string: Formats currency with commas
- capitalizeFirst(string) -> string: Capitalizes first letter
</details>
</details>

---

<details>
<summary>utils/validators.js</summary>

- requiredImports: None
<details>
<summary>functions</summary>

- validateEmail(email) -> boolean: Validates email format
- validatePassword(password) -> boolean: Validates password strength
- validateRequired(value) -> boolean: Checks if value is not empty
- validateNumber(value, min, max) -> boolean: Validates number range
- validateUrl(url) -> boolean: Validates URL format
</details>
</details>

---

<details>
<summary>utils/constants.js</summary>

- requiredImports: None
<details>
<summary>functions</summary>

- API_BASE_URL() -> string: Returns API base URL based on environment
- getDifficultyOptions() -> array: Returns difficulty options for forms
- getCuisineOptions() -> array: Returns cuisine options
- getUnitOptions() -> array: Returns measurement unit options
- getLevelThresholds() -> object: Returns level progression thresholds
</details>
</details>

---

<details>
<summary>utils/helpers.js</summary>

- requiredImports: None
<details>
<summary>functions</summary>

- generateId() -> string: Generates unique ID
- debounce(func, wait) -> function: Creates debounced function
- throttle(func, limit) -> function: Creates throttled function
- deepClone(obj) -> object: Creates deep clone of object
- isEmpty(obj) -> boolean: Checks if object is empty
</details>
</details>

</details>

---

<details>
<summary>api/</summary>

<details>
<summary>api/auth.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- login(email, password) -> promise: Authenticates user
- register(userData) -> promise: Registers new user
- logout() -> promise: Logs out user
- getCurrentUser() -> promise: Gets current user data
- refreshToken() -> promise: Refreshes authentication token
</details>
</details>

---

<details>
<summary>api/users.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- getProfile(userId) -> promise: Gets user profile
- updateProfile(userId, data) -> promise: Updates user profile
- getUserStats(userId) -> promise: Gets user statistics
- searchUsers(query) -> promise: Searches for users
- getFollowers(userId) -> promise: Gets user's followers
- getFollowing(userId) -> promise: Gets users followed by user
</details>
</details>

---

<details>
<summary>api/recipes.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- getAllRecipes(params) -> promise: Gets all recipes with filters
- getRecipe(recipeId) -> promise: Gets single recipe with details
- createRecipe(recipeData) -> promise: Creates new recipe
- updateRecipe(recipeId, data) -> promise: Updates recipe
- deleteRecipe(recipeId) -> promise: Deletes recipe
- likeRecipe(recipeId) -> promise: Likes recipe
- saveRecipe(recipeId) -> promise: Saves recipe to cookbook
- getRecipeInteractions(recipeId) -> promise: Gets recipe interactions
</details>
</details>

---

<details>
<summary>api/cooking-sessions.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- createSession(sessionData) -> promise: Creates cooking session
- getSession(sessionId) -> promise: Gets session details
- joinSession(sessionId) -> promise: Joins cooking session
- leaveSession(sessionId) -> promise: Leaves cooking session
- completeStep(sessionId, stepId) -> promise: Completes cooking step
- updateSession(sessionId, data) -> promise: Updates session
- voteSkip(sessionId, voteType) -> promise: Votes to skip step/timer
</details>
</details>

---

<details>
<summary>api/relationships.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- followUser(targetUserId) -> promise: Follows another user
- unfollowUser(targetUserId) -> promise: Unfollows user
- getFriendRequests() -> promise: Gets pending friend requests
- acceptFriendRequest(requestId) -> promise: Accepts friend request
- rejectFriendRequest(requestId) -> promise: Rejects friend request
- removeFriend(friendId) -> promise: Removes friend
</details>
</details>

---

<details>
<summary>api/cookbooks.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- getCookbooks() -> promise: Gets user's cookbooks
- createCookbook(data) -> promise: Creates new cookbook
- addRecipeToCookbook(cookbookId, recipeId) -> promise: Adds recipe to cookbook
- removeRecipeFromCookbook(cookbookId, recipeId) -> promise: Removes recipe from cookbook
- getCookbookRecipes(cookbookId) -> promise: Gets recipes in cookbook
</details>
</details>

---

<details>
<summary>api/shop.js</summary>

- requiredImports: api from ../utils/api
<details>
<summary>functions</summary>

- getShopItems() -> promise: Gets available shop items
- purchaseItem(itemId) -> promise: Purchases shop item
- getUserPurchases() -> promise: Gets user's purchased items
- getItemCategories() -> promise: Gets shop item categories
</details>
</details>

</details>

---

<details>
<summary>styles/</summary>

<details>
<summary>styles/index.css</summary>

- requiredImports: None
- description: Main stylesheet with global styles
</details>

---

<details>
<summary>styles/components.css</summary>

- requiredImports: None
- description: Component-specific styles
</details>

---

<details>
<summary>styles/layout.css</summary>

- requiredImports: None
- description: Layout and grid styles
</details>

---

<details>
<summary>styles/utilities.css</summary>

- requiredImports: None
- description: Utility classes and helper styles
</details>

---

<details>
<summary>styles/themes.css</summary>

- requiredImports: None
- description: Theme variables and color schemes
</details>

</details>

---

<details>
<summary>assets/</summary>

<details>
<summary>assets/images/</summary>

- icons/
- illustrations/
- backgrounds/
</details>

---

<details>
<summary>assets/fonts/</summary>

- Custom font files
</details>

</details>

---

<details>
<summary>App.jsx</summary>

- requiredImports: React, BrowserRouter, Routes, Route from react-router-dom, AuthContext from ./contexts/AuthContext, DataContext from ./contexts/DataContext, NotificationContext from ./contexts/NotificationContext, all page components from ./pages, Header from ./components/common/Header, Footer from ./components/common/Footer
<details>
<summary>functions</summary>

- App() -> JSX: Main application component with routing
- initializeApp() -> void: Initializes application state
- handleRouteChange() -> void: Handles route change events
</details>
</details>

---

<details>
<summary>index.js</summary>

- requiredImports: React, ReactDOM from react-dom/client, App from ./App, ./styles/index.css
<details>
<summary>functions</summary>

- renderApp() -> void: Renders React application to DOM
</details>
</details>

---

<details>
<summary>setupTests.js</summary>

- requiredImports: @testing-library/jest-dom
- description: Test setup configuration
</details>

</details>

---

<details>
<summary>package.json</summary>

- requiredImports: None
- description: Project dependencies and scripts
</details>

---

<details>
<summary>.env</summary>

- requiredImports: None
- description: Environment variables
</details>

---

<details>
<summary>.gitignore</summary>

- requiredImports: None
- description: Git ignore rules
</details>

</details>