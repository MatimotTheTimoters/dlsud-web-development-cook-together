# Frontend Files Documentation

## frontend/

### .env
- **Description**: Environment variables configuration
- **Required Imports**: None
- **Backend Endpoint**: None

### .gitignore
- **Description**: Git ignore rules for version control
- **Required Imports**: None
- **Backend Endpoint**: None

### package.json
- **Description**: Project dependencies and scripts configuration
- **Required Imports**: None
- **Backend Endpoint**: None
- **Gamified Dependencies Added**:
  ```json
  "dependencies": {
    "react-icons": "^4.11.0",
    "animate.css": "^4.1.1",
    "classnames": "^2.3.2",
    "react-spring": "^9.7.1",
    "framer-motion": "^10.12.16",
    "react-confetti": "^6.1.0",
    "react-progressbar.js": "^1.0.1"
  }
  ```

## public/

### public/index.html
- **Description**: Main HTML template with gamified UI libraries and basic layout structure
- **Required Imports**: None
- **Backend Endpoint**: None
- **Gamified Libraries Added**:
  ```html
  <!-- Gamified UI Libraries -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```

### public/favicon.ico
- **Description**: Site favicon for browser tabs
- **Required Imports**: None
- **Backend Endpoint**: None

### public/manifest.json
- **Description**: Progressive Web App manifest for mobile installation
- **Required Imports**: None
- **Backend Endpoint**: None

## src/

### src/App.jsx
- **Description**: Main application component with routing setup
- **Required Imports**: React, BrowserRouter, Routes, Route from 'react-router-dom', AuthContext from './contexts/AuthContext', DataContext from './contexts/DataContext', NotificationContext from './contexts/NotificationContext', all page components from './pages', Header from './components/common/Header', Footer from './components/common/Footer', { FaGamepad, FaCookieBite } from 'react-icons/fa'
- **Backend Endpoint**: Various (through page components)
- **Functions**:
  - `App() -> JSX`: Main application component with routing
  - `initializeApp() -> void`: Initializes application state
  - `handleRouteChange() -> void`: Handles route change events

### src/index.js
- **Description**: Application entry point that renders React to DOM
- **Required Imports**: React, ReactDOM from 'react-dom/client', App from './App', './styles/index.css'
- **Backend Endpoint**: None
- **Functions**:
  - `renderApp() -> void`: Renders React application to DOM

### src/setupTests.js
- **Description**: Test setup configuration for Jest and React Testing Library
- **Required Imports**: '@testing-library/jest-dom'
- **Backend Endpoint**: None

## src/components/

## src/components/auth/

### src/components/auth/LoginForm.jsx
- **Description**: User login form with gamified elements and validation
- **Required Imports**: React, useState, useNavigate from 'react-router-dom', api from '../../api/auth', { FaUser, FaLock, FaFire } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/login.php
- **Functions**:
  - `handleSubmit(event) -> void`: Handles login form submission
  - `validateForm() -> boolean`: Validates form inputs
  - `resetForm() -> void`: Resets form to initial state

### src/components/auth/RegisterForm.jsx
- **Description**: User registration form with welcome bonuses and validation
- **Required Imports**: React, useState, useNavigate from 'react-router-dom', api from '../../api/auth', { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/register.php
- **Functions**:
  - `handleSubmit(event) -> void`: Handles registration form submission
  - `validateForm() -> boolean`: Validates form inputs
  - `checkPasswordStrength(password) -> string`: Returns password strength rating

### src/components/auth/ProtectedRoute.jsx
- **Description**: Route wrapper that protects authenticated routes
- **Required Imports**: React, Navigate from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaShieldAlt } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/me.php (for token validation)
- **Functions**:
  - `ProtectedRoute({ children }) -> JSX`: Wraps protected routes with authentication check

## src/components/common/

### src/components/common/Header.jsx
- **Description**: Main application header with navigation and user stats
- **Required Imports**: React, Link from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaHome, FaUtensils, FaUsers, FaBook, FaUser, FaCoins, FaGem } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/me.php, api/users/profile.php
- **Functions**:
  - `handleLogout() -> void`: Logs user out and redirects to login
  - `getGreeting() -> string`: Returns time-based greeting message

### src/components/common/Footer.jsx
- **Description**: Application footer with links and copyright
- **Required Imports**: React, { FaHeart, FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `getCurrentYear() -> number`: Returns current year for copyright

### src/components/common/Navigation.jsx
- **Description**: Main navigation component with links and user actions
- **Required Imports**: React, NavLink from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaBell, FaEnvelope, FaUserFriends } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/me.php
- **Functions**:
  - `isActiveLink(isActive) -> string`: Returns active link className
  - `hasPermission(requiredRole) -> boolean`: Checks if user has required permissions

### src/components/common/LoadingSpinner.jsx
- **Description**: Animated loading spinner with cooking theme
- **Required Imports**: React, { FaUtensilSpoon, FaBlender } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `LoadingSpinner({ size, color }) -> JSX`: Displays loading animation
- **Loading Types Support**:
  - `type='default'`: General loading with cooking utensils
  - `type='user'`: User data loading with user/chart icons
  - `type='recipe'`: Recipe-specific loading with food icons
  - `type='cooking'`: Cooking session loading with fire/cookie icons
  - `type='recipe-list'`: Recipe list loading
  - `type='recipe-detail'`: Recipe detail loading

### src/components/common/ErrorBoundary.jsx
- **Description**: Catches JavaScript errors and displays fallback UI
- **Required Imports**: React, Component, { FaExclamationTriangle } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `getDerivedStateFromError(error) -> object`: Updates state so next render shows fallback UI
  - `componentDidCatch(error, errorInfo) -> void`: Logs error to error reporting service
- **Error Type Detection**:
  - `general`: General application errors
  - `recipe`: Recipe-specific errors (missing ingredients, invalid data)
  - `cooking`: Cooking session errors (timer, step completion)
  - `auth`: Authentication errors (token expired, unauthorized)
  - `network`: Network-related errors (API calls, connectivity)

## src/components/recipes/

### src/components/recipes/RecipeCard.jsx
- **Description**: Displays recipe information in card format
- **Required Imports**: React, Link from 'react-router-dom', formatTime from '../../utils/formatters', { FaClock, FaFire, FaUser, FaHeart, FaStar, FaCoins } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/interact.php (for like/save interactions)
- **Functions**:
  - `getDifficultyColor(difficulty) -> string`: Returns color based on difficulty level
  - `truncateText(text, maxLength) -> string`: Truncates text to specified length

### src/components/recipes/RecipeForm.jsx
- **Description**: Form for creating and editing recipes with ingredients and steps
- **Required Imports**: React, useState, useEffect, useNavigate from 'react-router-dom', api from '../../api/recipes', { FaPlus, FaTrash, FaImage, FaListOl, FaClock, FaBalanceScale, FaCalculator } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/create.php, api/recipes/update.php, api/upload/image.php
- **Functions**:
  - `handleSubmit(event) -> void`: Handles recipe form submission
  - `addIngredient() -> void`: Adds new ingredient field
  - `removeIngredient(index) -> void`: Removes ingredient field
  - `addStep() -> void`: Adds new step field
  - `removeStep(index) -> void`: Removes step field
  - `validateForm() -> boolean`: Validates all form inputs
  - `calculateNutrition() -> object`: Calculates total nutrition from ingredients

### src/components/recipes/RecipeDetail.jsx
- **Description**: Detailed view of a single recipe with ingredients, steps, and interactions
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/recipes', { FaHeart, FaBookmark, FaShare, FaClock, FaFire, FaUtensils, FaUsers } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/show.php, api/recipes/interact.php
- **Functions**:
  - `loadRecipe() -> void`: Fetches recipe details from API
  - `handleInteraction(type) -> void`: Handles like/dislike/save interactions
  - `formatTimer(duration, unit) -> string`: Formats timer for display

### src/components/recipes/RecipeList.jsx
- **Description**: Displays a list of recipes with filtering and pagination
- **Required Imports**: React, useState, useEffect, RecipeCard from './RecipeCard', api from '../../api/recipes', { FaFilter, FaSort, FaSearch } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php
- **Functions**:
  - `loadRecipes() -> void`: Fetches recipes from API
  - `filterRecipes(criteria) -> array`: Filters recipes based on criteria
  - `sortRecipes(sortBy) -> array`: Sorts recipes based on sort option

### src/components/recipes/IngredientList.jsx
- **Description**: Displays recipe ingredients with checkboxes for completion tracking
- **Required Imports**: React, { FaCheckSquare, FaSquare, FaBalanceScale } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `formatAmount(amount, unit) -> string`: Formats ingredient amount and unit

### src/components/recipes/StepList.jsx
- **Description**: Displays cooking steps with timers and completion tracking
- **Required Imports**: React, useState, { FaCheckCircle, FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/complete-step.php
- **Functions**:
  - `startTimer(duration) -> void`: Starts countdown timer for step
  - `completeStep(stepId) -> void`: Marks step as completed

## src/components/cooking/

### src/components/cooking/CookingSession.jsx
- **Description**: Main cooking session interface with progress tracking and step management
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/cooking-sessions', { FaPlay, FaPause, FaStop, FaStepForward, FaUsers, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/show.php, api/cooking-sessions/update.php, api/cooking-sessions/complete-step.php, api/cooking-sessions/vote.php
- **Functions**:
  - `loadSession() -> void`: Loads cooking session details
  - `startSession() -> void`: Starts the cooking session
  - `pauseSession() -> void`: Pauses the cooking session
  - `completeSession() -> void`: Marks session as complete
  - `nextStep() -> void`: Advances to next step

### src/components/cooking/SessionTimer.jsx
- **Description**: Timer component for cooking sessions with play/pause/reset controls
- **Required Imports**: React, useState, useEffect, { FaPlay, FaPause, FaRedo, FaHourglassHalf } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `formatTime(seconds) -> string`: Formats seconds to MM:SS
  - `startTimer(duration) -> void`: Starts the timer
  - `pauseTimer() -> void`: Pauses the timer
  - `resetTimer() -> void`: Resets the timer to initial duration

### src/components/cooking/ParticipantList.jsx
- **Description**: Displays participants in a cooking session with status indicators
- **Required Imports**: React, useEffect, api from '../../api/cooking-sessions', { FaUser, FaCrown, FaEye } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/show.php, api/cooking-sessions/join.php
- **Functions**:
  - `loadParticipants() -> void`: Loads session participants
  - `updateParticipantStatus(userId, status) -> void`: Updates participant status

### src/components/cooking/StepProgress.jsx
- **Description**: Visual progress indicator for cooking steps
- **Required Imports**: React, { FaFlagCheckered, FaRoute } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `calculateProgress(current, total) -> number`: Calculates progress percentage

### src/components/cooking/SessionChat.jsx
- **Description**: Real-time chat for multiplayer cooking sessions
- **Required Imports**: React, useState, useEffect, useRef, { FaPaperPlane, FaUser } from 'react-icons/fa'
- **Backend Endpoint**: api/chat/messages.php
- **Functions**:
  - `sendMessage(message) -> void`: Sends chat message
  - `receiveMessages() -> void`: Polls for new messages
  - `formatMessageTime(timestamp) -> string`: Formats message timestamp

## src/components/users/

### src/components/users/UserCard.jsx
- **Description**: Displays user information in card format for lists
- **Required Imports**: React, Link from 'react-router-dom', api from '../../api/relationships', { FaUserCircle, FaPlus, FaCheck, FaStar, FaFire } from 'react-icons/fa'
- **Backend Endpoint**: api/relationships/follow.php, api/users/profile.php
- **Functions**:
  - `handleFollow() -> void`: Follows/unfollows user
  - `getLevelColor(level) -> string`: Returns color based on user level

### src/components/users/UserProfile.jsx
- **Description**: Detailed user profile view with stats and content tabs
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/users', { FaEdit, FaCamera, FaChartLine, FaCrown, FaBook, FaUsers } from 'react-icons/fa'
- **Backend Endpoint**: api/users/profile.php, api/users/update.php, api/users/stats.php, api/upload/image.php
- **Functions**:
  - `loadUserProfile() -> void`: Loads user profile data
  - `loadUserRecipes() -> void`: Loads user's recipes
  - `loadUserStats() -> void`: Loads user statistics
  - `calculateNextLevelProgress() -> object`: Calculates progress to next level
  - `loadSessionHistory() -> void`: Loads user's cooking session history

### src/components/users/StatsDisplay.jsx
- **Description**: Displays user statistics with icons and formatted values
- **Required Imports**: React, { FaChartBar, FaFire, FaCoins, FaGem, FaStar, FaUtensils, FaClock } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php
- **Functions**:
  - `formatStatValue(value, type) -> string`: Formats stat values for display
  - `getStatIcon(statName) -> JSX`: Returns icon for stat type
- **Stats Displayed**:
  - Level & EXP Progress
  - Currency (Gold/Gems)
  - Recipes Created/Cooked
  - Cooking Time Total
  - Login Streak
  - Followers/Following Count
  - Session History Stats

### src/components/users/FollowButton.jsx
- **Description**: Button component for following/unfollowing users
- **Required Imports**: React, useState, api from '../../api/relationships', { FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa'
- **Backend Endpoint**: api/relationships/follow.php, api/relationships/friends.php
- **Functions**:
  - `checkFollowingStatus() -> boolean`: Checks if current user follows target user
  - `toggleFollow() -> void`: Toggles follow/unfollow

## src/components/gamification/

### src/components/gamification/CurrencyDisplay.jsx
- **Description**: Displays user's currency balances (gold and gems)
- **Required Imports**: React, { FaCoins, FaGem, FaMoneyBillWave } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php
- **Functions**:
  - `formatCurrency(amount, type) -> string`: Formats currency values with appropriate symbols

### src/components/gamification/LevelProgress.jsx
- **Description**: Visual progress bar for user level progression
- **Required Imports**: React, { FaTrophy, FaChessQueen, FaStar, FaCrown } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php
- **Functions**:
  - `calculateProgress(currentExp, nextLevelExp) -> number`: Calculates progress percentage
  - `getLevelTitle(level) -> string`: Returns title based on level

### src/components/gamification/RewardNotification.jsx
- **Description**: Displays reward notifications with animations
- **Required Imports**: React, useState, useEffect, { FaGift, FaCoins, FaGem, FaStar, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php (for reward updates)
- **Functions**:
  - `showNotification(reward) -> void`: Displays reward notification
  - `hideNotification() -> void`: Hides notification after timeout

### src/components/gamification/ShopItem.jsx
- **Description**: Displays shop items with purchase functionality
- **Required Imports**: React, useState, api from '../../api/shop', { FaShoppingCart, FaLock, FaCheck } from 'react-icons/fa'
- **Backend Endpoint**: api/shop.js (to be implemented in backend)
- **Functions**:
  - `canAfford() -> boolean`: Checks if user can afford item
  - `purchaseItem() -> void`: Handles item purchase

## src/components/inventory/

### src/components/inventory/InventoryItem.jsx
- **Description**: Displays inventory item with use functionality for consumables
- **Required Imports**: React, useState, api from '../../api/inventory', { FaCheck, FaTimes, FaBox, FaFire } from 'react-icons/fa'
- **Backend Endpoint**: api/inventory/use.php
- **Functions**:
  - `useItem() -> void`: Uses consumable item
  - `getEffectDescription() -> string`: Returns effect description
  - `getTimeRemaining() -> string`: Calculates time until expiration

### src/components/inventory/InventoryList.jsx
- **Description**: Displays user's inventory with filtering
- **Required Imports**: React, useState, InventoryItem from './InventoryItem', { FaFilter, FaSort } from 'react-icons/fa'
- **Backend Endpoint**: api/inventory/list.php
- **Functions**:
  - `loadInventory() -> void`: Loads user inventory
  - `filterByType(type) -> array`: Filters items by type (consumable, etc.)
  - `sortItems(sortBy) -> array`: Sorts inventory items

## src/components/purchase/

### src/components/purchase/PurchaseModal.jsx
- **Description**: Modal for purchasing recipes or shop items
- **Required Imports**: React, useState, api from '../../api/purchase', { FaCoins, FaGem, FaLock, FaCheck } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/purchase.php, api/shop/purchase.php
- **Functions**:
  - `checkAffordability() -> boolean`: Checks if user can afford
  - `processPurchase(currencyType) -> void`: Handles purchase transaction
  - `showSuccessMessage() -> void`: Shows purchase confirmation

## src/pages/

### src/pages/HomePage.jsx
- **Description**: Main landing page with featured content and quick actions
- **Required Imports**: React, Link from 'react-router-dom', RecipeList from '../components/recipes/RecipeList', { FaFire, FaNewspaper, FaUsers, FaStore } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php, api/cooking-sessions/index.php
- **Functions**:
  - `getFeaturedRecipes() -> array`: Returns featured recipes for homepage
  - `getRecentActivities() -> array`: Returns recent user activities

### src/pages/LoginPage.jsx
- **Description**: Login page that wraps the LoginForm component
- **Required Imports**: React, LoginForm from '../components/auth/LoginForm', { FaSignInAlt, FaFire, FaGift } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/login.php
- **Functions**:
  - `handleLoginSuccess() -> void`: Redirects after successful login

### src/pages/RegisterPage.jsx
- **Description**: Registration page that wraps the RegisterForm component
- **Required Imports**: React, RegisterForm from '../components/auth/RegisterForm', { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/register.php
- **Functions**:
  - `handleRegisterSuccess() -> void`: Redirects after successful registration

### src/pages/RecipesPage.jsx
- **Description**: Page for browsing and searching recipes
- **Required Imports**: React, useState, RecipeList from '../components/recipes/RecipeList', RecipeFilters from '../components/recipes/RecipeFilters', { FaFilter, FaSortAmountDown, FaSearch } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php
- **Functions**:
  - `loadAllRecipes() -> void`: Loads all recipes with pagination
  - `handleSearch(query) -> void`: Handles recipe search
  - `handleFilterChange(filters) -> void`: Updates recipe filters

### src/pages/RecipeDetailPage.jsx
- **Description**: Page for viewing detailed recipe information
- **Required Imports**: React, RecipeDetail from '../components/recipes/RecipeDetail', CookingSession from '../components/cooking/CookingSession', { FaUtensils, FaUsers, FaHeart } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/show.php, api/recipes/interact.php, api/cooking-sessions/create.php
- **Functions**:
  - `handleStartCooking() -> void`: Starts cooking session from recipe

### src/pages/CreateRecipePage.jsx
- **Description**: Page for creating new recipes
- **Required Imports**: React, RecipeForm from '../components/recipes/RecipeForm', { FaPlusCircle, FaLightbulb, FaAward } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/create.php, api/upload/image.php
- **Functions**:
  - `handleRecipeCreated(recipeId) -> void`: Handles successful recipe creation

### src/pages/ProfilePage.jsx
- **Description**: User profile page with edit functionality
- **Required Imports**: React, UserProfile from '../components/users/UserProfile', UserRecipes from '../components/users/UserRecipes', { FaUserCircle, FaCog, FaChartLine } from 'react-icons/fa'
- **Backend Endpoint**: api/users/profile.php, api/users/update.php, api/users/stats.php, api/recipes/index.php, api/cookbooks/index.php
- **Functions**:
  - `loadUserData() -> void`: Loads comprehensive user data
  - `handleProfileUpdate() -> void`: Handles profile update success

### src/pages/CookingSessionPage.jsx
- **Description**: Page for active cooking sessions
- **Required Imports**: React, CookingSession from '../components/cooking/CookingSession', SessionTimer from '../components/cooking/SessionTimer', { FaPlay, FaUsers, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/show.php, api/cooking-sessions/update.php, api/cooking-sessions/complete-step.php, api/cooking-sessions/vote.php
- **Functions**:
  - `handleSessionComplete() -> void`: Handles session completion
  - `handleStepComplete() -> void`: Handles step completion with rewards

### src/pages/ShopPage.jsx
- **Description**: Virtual shop for purchasing items with currency
- **Required Imports**: React, useState, ShopItem from '../components/gamification/ShopItem', { FaStore, FaCoins, FaGem, FaTags } from 'react-icons/fa'
- **Backend Endpoint**: api/shop.js (to be implemented), api/users/stats.php
- **Functions**:
  - `loadShopItems() -> void`: Loads available shop items
  - `handlePurchase(itemId) -> void`: Handles item purchase
  - `filterItems(category) -> array`: Filters shop items by category

### src/pages/DiscoverPage.jsx
- **Description**: Discovery page for finding recipes and users
- **Required Imports**: React, useState, UserCard from '../components/users/UserCard', RecipeCard from '../components/recipes/RecipeCard', { FaCompass, FaFire, FaUsers, FaStar } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php, api/users/search.php, api/users/profile.php
- **Functions**:
  - `loadTopChefs() -> void`: Loads top-rated users
  - `loadTrendingRecipes() -> void`: Loads trending recipes
  - `loadRecentChallenges() -> void`: Loads recent challenges

### src/pages/CookbooksPage.jsx
- **Description**: Page for managing recipe collections/cookbooks
- **Required Imports**: React, useState, api from '../api/cookbooks', { FaBook, FaPlus, FaFolderOpen } from 'react-icons/fa'
- **Backend Endpoint**: api/cookbooks/index.php, api/cookbooks/create.php, api/cookbooks/add-recipe.php, api/cookbooks/remove-recipe.php
- **Functions**:
  - `loadCookbooks() -> void`: Loads user's cookbooks
  - `createCookbook() -> void`: Creates new cookbook
  - `addRecipeToCookbook() -> void`: Adds recipe to cookbook

### src/pages/SessionHistoryPage.jsx
- **Description**: Displays user's past cooking sessions with statistics
- **Required Imports**: React, useState, useEffect, api from '../api/cooking-sessions', { FaHistory, FaChartBar, FaClock, FaCalendar } from 'react-icons/fa'
- **Backend Endpoint**: api/sessions/history.php
- **Functions**:
  - `loadSessionHistory() -> void`: Loads user's cooking history
  - `filterSessions(filterType) -> array`: Filters sessions by criteria
  - `calculateStatistics() -> object`: Calculates cooking stats

## src/contexts/

### src/contexts/AuthContext.jsx
- **Description**: Context for managing authentication state and actions
- **Required Imports**: React, createContext, useState, useContext, useEffect, { FaUserShield } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/login.php, api/auth/register.php, api/auth/logout.php, api/auth/me.php, api/auth/refresh-token.php
- **Functions**:
  - `login(email, password) -> object`: Authenticates user
  - `logout() -> void`: Logs out user and clears session
  - `isAuthenticated() -> boolean`: Checks if user is authenticated
  - `getCurrentUser() -> object`: Returns current user data
  - `refreshToken() -> boolean`: Refreshes authentication token

### src/contexts/DataContext.jsx
- **Description**: Context for managing application data state and caching
- **Required Imports**: React, createContext, useState, useContext
- **Backend Endpoint**: None (frontend-only state management)
- **Functions**:
  - `useData() -> object`: Custom hook to access DataContext from any component
  - `DataProvider({ children }) -> JSX`: Wraps application to provide context to all components
  - `updateUserData(data) -> void`: Updates user data in context (alias: `updateUsers`)
  - `updateRecipes(data) -> void`: Updates recipes in context
  - `updateRelationships(data) -> void`: Updates relationships in context
  - `clearData() -> void`: Clears all context data
  - `getCachedData(key) -> mixed`: Retrieves cached data with timestamp validation
  - `setCachedData(key, data) -> void`: Sets data in cache with current timestamp
- **Convenience Properties**:
  - `currentUserData`: Alias for userData (commonly accessed property)
  - `userRewardLimits`: Pre-calculated reward limits derived from user stats

### src/contexts/NotificationContext.jsx
- **Description**: Context for managing application notifications
- **Required Imports**: React, createContext, useState, useContext, { FaBell, FaTimes } from 'react-icons/fa'
- **Backend Endpoint**: None (frontend-only)
- **Functions**:
  - `showNotification(message, type) -> void`: Shows notification
  - `hideNotification(id) -> void`: Hides specific notification
  - `clearNotifications() -> void`: Clears all notifications

## src/hooks/

### src/hooks/useAuth.js
- **Description**: Custom hook for accessing authentication context
- **Required Imports**: useContext from 'react', AuthContext from '../contexts/AuthContext'
- **Backend Endpoint**: Through AuthContext
- **Functions**:
  - `useAuth() -> object`: Provides authentication state and methods

### src/hooks/useApi.js
- **Description**: Custom hook for making API calls with loading and error states
- **Required Imports**: useState, useEffect, useCallback
- **Backend Endpoint**: Various (generic hook for all API calls)
- **Functions**:
  - `useApi(endpoint, method, body) -> object`: Custom hook for API calls with loading and error states
  - `fetchData() -> void`: Fetches data from API
  - `postData(data) -> void`: Posts data to API
  - `putData(data) -> void`: Updates data via API
  - `deleteData() -> void`: Deletes data via API

### src/hooks/useForm.js
- **Description**: Custom hook for form state management
- **Required Imports**: useState, useCallback
- **Backend Endpoint**: None (frontend-only)
- **Functions**:
  - `useForm(initialValues) -> object`: Custom hook for form state management
  - `handleChange(event) -> void`: Handles form field changes
  - `handleSubmit(callback) -> void`: Handles form submission
  - `resetForm() -> void`: Resets form to initial values
  - `validateForm() -> object`: Validates form fields

### src/hooks/useLocalStorage.js
- **Description**: Custom hook for localStorage with React state synchronization
- **Required Imports**: useState, useEffect
- **Backend Endpoint**: None (frontend-only)
- **Functions**:
  - `useLocalStorage(key, initialValue) -> array`: Custom hook for localStorage with state synchronization
  - `setValue(value) -> void`: Sets value in localStorage and state
  - `removeValue() -> void`: Removes value from localStorage and state

## src/utils/

### src/utils/api.js
- **Description**: API utility functions for making HTTP requests
- **Required Imports**: None
- **Backend Endpoint**: All backend API endpoints
- **Functions**:
  - `get(endpoint) -> promise`: GET request helper
  - `post(endpoint, data) -> promise`: POST request helper
  - `put(endpoint, data) -> promise`: PUT request helper
  - `delete(endpoint) -> promise`: DELETE request helper
  - `setAuthToken(token) -> void`: Sets authentication token for requests
  - `handleResponse(response) -> object`: Handles API response
  - `handleError(error) -> object`: Handles API errors

### src/utils/formatters.js
- **Description**: Utility functions for formatting data
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `formatTime(minutes) -> string`: Formats minutes to hours:minutes
  - `formatDate(timestamp) -> string`: Formats timestamp to readable date
  - `truncateText(text, length) -> string`: Truncates text with ellipsis
  - `formatCurrency(amount) -> string`: Formats currency with commas
  - `capitalizeFirst(string) -> string`: Capitalizes first letter

### src/utils/validators.js
- **Description**: Validation functions for form inputs
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `validateEmail(email) -> boolean`: Validates email format
  - `validatePassword(password) -> boolean`: Validates password strength
  - `validateRequired(value) -> boolean`: Checks if value is not empty
  - `validateNumber(value, min, max) -> boolean`: Validates number range
  - `validateUrl(url) -> boolean`: Validates URL format

### src/utils/constants.js
- **Description**: Application constants and configuration values
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `API_BASE_URL() -> string`: Returns API base URL based on environment
  - `getDifficultyOptions() -> array`: Returns difficulty options for forms
  - `getCuisineOptions() -> array`: Returns cuisine options
  - `getUnitOptions() -> array`: Returns measurement unit options
  - `getLevelThresholds() -> object`: Returns level progression thresholds
  - `getShopCategories() -> array`: Returns shop item categories
  - `getSessionStatusLabels() -> object`: Returns cooking session status labels

### src/utils/helpers.js
- **Description**: General helper utility functions
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `generateId() -> string`: Generates unique ID
  - `debounce(func, wait) -> function`: Creates debounced function
  - `throttle(func, limit) -> function`: Creates throttled function
  - `deepClone(obj) -> object`: Creates deep clone of object
  - `isEmpty(obj) -> boolean`: Checks if object is empty

### src/utils/upload.js
- **Description**: Utility functions for handling file uploads
- **Required Imports**: None
- **Backend Endpoint**: None (Utility functions for upload handling)
- **Functions**:
  - `prepareFormData(file, fieldName, additionalData) -> FormData`: Prepares FormData for multipart file upload
  - `validateImageFile(file, options) -> object`: Validates image file with size and type constraints
  - `createImagePreview(file) -> Promise<string>`: Creates data URL for image preview

### src/utils/userCalculations.js
- **Description**: Gamification calculation functions (must match backend/classes/UserCalculations.php)
- **Required Imports**: None
- **Backend Endpoint**: None (Must match backend/classes/UserCalculations.php)
- **Functions**:
  - `calculateMaxRewards(userData) -> object`: Calculates maximum EXP/Gold/Gem rewards
  - `calculateMaxPrices(userData) -> object`: Calculates maximum Gold/Gem prices for recipes
  - `calculateAllUserLimits(userData) -> object`: Combines all user limits
  - `calculateLevelUpRequirements(current_level, current_exp) -> object`: Calculates level progress
  - `calculateRecipeRewards(difficulty, user_limits) -> object`: Calculates recipe rewards
  - `calculateStepRewards(step_index, total_steps, recipe_rewards) -> object`: Calculates step rewards
  - `checkLevelUp(current_level, current_exp) -> object`: Checks if user should level up
  - `calculateDailyLoginBonus(login_streak) -> object`: Calculates daily login bonus
  - `calculateItemAffordability(userStats, item) -> object`: Checks if user can afford shop item
  - `calculateSessionRewards(session_data) -> object`: Calculates rewards for completed session

## src/api/

### src/api/auth.js
- **Description**: API functions for authentication operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/auth/login.php, api/auth/register.php, api/auth/logout.php, api/auth/me.php, api/auth/refresh-token.php
- **Functions**:
  - `login(email, password) -> promise`: Authenticates user
  - `register(userData) -> promise`: Registers new user
  - `logout() -> promise`: Logs out user
  - `getCurrentUser() -> promise`: Gets current user data
  - `refreshToken() -> promise`: Refreshes authentication token

### src/api/inventory.js
- **Description**: API functions for inventory operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/inventory/list.php, api/inventory/use.php
- **Functions**:
  - `getUserInventory() -> promise`: Gets user's inventory items
  - `useConsumable(inventoryId) -> promise`: Uses a consumable item
  - `getItemCategories() -> promise`: Gets inventory item categories

### src/api/users.js
- **Description**: API functions for user operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/users/profile.php, api/users/update.php, api/users/stats.php, api/users/search.php
- **Functions**:
  - `getProfile(userId) -> promise`: Gets user profile
  - `updateProfile(userId, data) -> promise`: Updates user profile
  - `getUserStats(userId) -> promise`: Gets user statistics
  - `searchUsers(query) -> promise`: Searches for users
  - `getFollowers(userId) -> promise`: Gets user's followers
  - `getFollowing(userId) -> promise`: Gets users followed by user

### src/api/recipes.js
- **Description**: API functions for recipe operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/recipes/index.php, api/recipes/show.php, api/recipes/create.php, api/recipes/update.php, api/recipes/delete.php, api/recipes/interact.php
- **Functions**:
  - `getAllRecipes(params) -> promise`: Gets all recipes with filters
  - `getRecipe(recipeId) -> promise`: Gets single recipe with details
  - `createRecipe(recipeData) -> promise`: Creates new recipe
  - `updateRecipe(recipeId, data) -> promise`: Updates recipe
  - `deleteRecipe(recipeId) -> promise`: Deletes recipe
  - `likeRecipe(recipeId) -> promise`: Likes recipe
  - `saveRecipe(recipeId) -> promise`: Saves recipe to cookbook
  - `getRecipeInteractions(recipeId) -> promise`: Gets recipe interactions

### src/api/cooking-sessions.js
- **Description**: API functions for cooking session operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/cooking-sessions/index.php, api/cooking-sessions/create.php, api/cooking-sessions/show.php, api/cooking-sessions/update.php, api/cooking-sessions/join.php, api/cooking-sessions/complete-step.php, api/cooking-sessions/vote.php
- **Functions**:
  - `createSession(sessionData) -> promise`: Creates cooking session
  - `getSession(sessionId) -> promise`: Gets session details
  - `joinSession(sessionId) -> promise`: Joins cooking session
  - `leaveSession(sessionId) -> promise`: Leaves cooking session
  - `completeStep(sessionId, stepId) -> promise`: Completes cooking step
  - `updateSession(sessionId, data) -> promise`: Updates session
  - `voteSkip(sessionId, voteType) -> promise`: Votes to skip step/timer

### src/api/relationships.js
- **Description**: API functions for user relationship operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/relationships/follow.php, api/relationships/friends.php, api/relationships/list.php
- **Functions**:
  - `followUser(targetUserId) -> promise`: Follows another user
  - `unfollowUser(targetUserId) -> promise`: Unfollows user
  - `getFriendRequests() -> promise`: Gets pending friend requests
  - `acceptFriendRequest(requestId) -> promise`: Accepts friend request
  - `rejectFriendRequest(requestId) -> promise`: Rejects friend request
  - `removeFriend(friendId) -> promise`: Removes friend

### src/api/cookbooks.js
- **Description**: API functions for cookbook operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/cookbooks/index.php, api/cookbooks/create.php, api/cookbooks/show.php, api/cookbooks/add-recipe.php, api/cookbooks/remove-recipe.php
- **Functions**:
  - `getCookbooks() -> promise`: Gets user's cookbooks
  - `createCookbook(data) -> promise`: Creates new cookbook
  - `addRecipeToCookbook(cookbookId, recipeId) -> promise`: Adds recipe to cookbook
  - `removeRecipeFromCookbook(cookbookId, recipeId) -> promise`: Removes recipe from cookbook
  - `getCookbookRecipes(cookbookId) -> promise`: Gets recipes in cookbook

### src/api/shop.js
- **Description**: API functions for shop operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/shop.php (to be implemented in backend)
- **Functions**:
  - `getShopItems() -> promise`: Gets available shop items
  - `purchaseItem(itemId) -> promise`: Purchases shop item
  - `getUserPurchases() -> promise`: Gets user's purchased items
  - `getItemCategories() -> promise`: Gets shop item categories

### src/api/purchase.js
- **Description**: API functions for purchase operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/purchase/recipe.php, api/purchase/item.php
- **Functions**:
  - `purchaseRecipe(recipeId, currencyType) -> promise`: Purchases a recipe
  - `purchaseItem(itemId, currencyType) -> promise`: Purchases a shop item
  - `getPurchaseHistory() -> promise`: Gets user's purchase history
  - `checkRecipeAccess(recipeId) -> promise`: Checks if user has access to recipe

### src/api/chat.js
- **Description**: API functions for chat operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/chat/messages.php
- **Functions**:
  - `sendChatMessage(sessionId, message) -> promise`: Sends chat message
  - `getChatMessages(sessionId, limit) -> promise`: Gets chat history
  - `markMessagesAsRead(sessionId) -> promise`: Marks messages as read

## src/styles/

### src/styles/index.css
- **Description**: Main stylesheet with global styles and gamified theme imports
- **Required Imports**: './themes.css', './components.css', './layout.css', './utilities.css'
- **Backend Endpoint**: None
- **Gamified Libraries Imported**:
  ```css
  /* Gamified CSS Libraries */
  @import 'animate.css/animate.min.css';
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap');
  
  /* Game-like UI enhancements */
  .game-button {
    background: linear-gradient(145deg, #ff6b6b, #ff8a8a);
    border: 3px solid #ffc107;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  }
  
  .level-badge {
    background: linear-gradient(45deg, #4CAF50, #FFC107, #FF6B6B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  ```

### src/styles/components.css
- **Description**: Component-specific styles with gamified elements
- **Required Imports**: None
- **Backend Endpoint**: None

### src/styles/layout.css
- **Description**: Layout and grid styles
- **Required Imports**: None
- **Backend Endpoint**: None

### src/styles/utilities.css
- **Description**: Utility classes and helper styles
- **Required Imports**: None
- **Backend Endpoint**: None

### src/styles/themes.css
- **Description**: Theme variables and color schemes from ui_design.md
- **Required Imports**: None
- **Backend Endpoint**: None

## src/assets/

### src/assets/fonts/
- **Description**: Custom font files for gamified typography
- **Required Imports**: None
- **Backend Endpoint**: None

### src/assets/images/
- **Description**: Image assets directory
- **Required Imports**: None
- **Backend Endpoint**: None
- **Subdirectories**:
  - `backgrounds/` - Patterned backgrounds for cards and sections
  - `icons/` - Gamified icons (swords, shields, crowns, etc.)
  - `illustrations/` - Cooking and gamification illustrations