# Frontend Files and Directories

<details>
<summary>frontend/</summary>

---

<details>
<summary>public/</summary>

<details>
<summary>public/index.html</summary>

- **Description**: Main HTML template with gamified libraries
- **Required Imports**: None
- layout: 
```
┌────────────────────────────────────────────┐
│                    HEADER                  │
│  🍳 CookTogether | 🔍 Search | 👤 Profile │
├────────────────────────────────────────────┤
│                                            │
│         GAMIFIED CONTENT AREA             │
│   with progress bars, badges, rewards     │
│                                            │
├────────────────────────────────────────────┤
│                    FOOTER                  │
│  © CookTogether • Level up your cooking!  │
└────────────────────────────────────────────┘
```
- gamified libraries added:
  ```html
  <!-- Gamified UI Libraries -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```
</details>

---

<details>
<summary>public/favicon.ico</summary>

- **Description**: Site favicon
- **Required Imports**: None
</details>

---

<details>
<summary>public/manifest.json</summary>

- **Description**: PWA manifest
- **Required Imports**: None
</details>

</details>

---

<details>
<summary>src/</summary>

<details>
<summary>src/components/</summary>

<details>
<summary>src/components/auth/</summary>

<details>
<summary>src/components/auth/LoginForm.jsx</summary>

- **Required Imports**: React, useState, useNavigate from 'react-router-dom', api from '../../api/auth', { FaUser, FaLock, FaFire } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│           LOGIN FORM                │
│  ┌───────────────────────────┐      │
│  │    👤 Email Address       │      │
│  │    🔑 Password            │      │
│  │                           │      │
│  │    [🔥 Login Button]      │      │
│  │    [🎮 Login Streak: 7]   │      │
│  └───────────────────────────┘      │
│                                     │
│    🔥 Daily Login Bonus Available!  │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- handleSubmit(event) -> void: Handles login form submission
- validateForm() -> boolean: Validates form inputs
- resetForm() -> void: Resets form to initial state
</details>
</details>

---

<details>
<summary>src/components/auth/RegisterForm.jsx</summary>

- **Required Imports**: React, useState, useNavigate from 'react-router-dom', api from '../../api/auth', { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│         REGISTER FORM               │
│  ┌───────────────────────────┐      │
│  │    👤 Full Name           │      │
│  │    📧 Email               │      │
│  │    🔑 Password            │      │
│  │    👥 Age & Gender        │      │
│  │                           │      │
│  │   [👑 Register & Get 100 Gold]  │
│  │   [🎯 Complete Profile +50 EXP] │
│  └───────────────────────────┘      │
│                                     │
│    🏆 Welcome Bonus: 100 Gold + Chef Hat │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- handleSubmit(event) -> void: Handles registration form submission
- validateForm() -> boolean: Validates form inputs
- checkPasswordStrength(password) -> string: Returns password strength rating
</details>
</details>

---

<details>
<summary>src/components/auth/ProtectedRoute.jsx</summary>

- **Required Imports**: React, Navigate from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaShieldAlt } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- ProtectedRoute({ children }) -> JSX: Wraps protected routes with authentication check
</details>
</details>

</details>

---

<details>
<summary>src/components/common/</summary>

<details>
<summary>src/components/common/Header.jsx</summary>

- **Required Imports**: React, Link from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaHome, FaUtensils, FaUsers, FaBook, FaUser, FaCoins, FaGem } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────────────────────┐
│ 🍳 CookTogether  │ 🔍 Search Recipes   │ 👤 Level 15│
│                  │                     │ 💰 1,250G  │
│                  │                     │ 💎 45 Gems │
├─────────────────────────────────────────────────────┤
│ [🏠] [📖] [👥] [📚] [👤] [⚔️] [🏆] [⚙️]           │
│ Home  Recipes Sessions Cookbooks Profile Shop Settings│
└─────────────────────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- handleLogout() -> void: Logs user out and redirects to login
- getGreeting() -> string: Returns time-based greeting message
</details>
</details>

---

<details>
<summary>src/components/common/Footer.jsx</summary>

- **Required Imports**: React, { FaHeart, FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- getCurrentYear() -> number: Returns current year for copyright
</details>
</details>

---

<details>
<summary>src/components/common/Navigation.jsx</summary>

- **Required Imports**: React, NavLink from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaBell, FaEnvelope, FaUserFriends } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- isActiveLink(isActive) -> string: Returns active link className
- hasPermission(requiredRole) -> boolean: Checks if user has required permissions
</details>
</details>

---

<details>
<summary>src/components/common/LoadingSpinner.jsx</summary>

- **Required Imports**: React, { FaUtensilSpoon, FaBlender } from 'react-icons/fa'
<details>
<summary>layout:</summary>
```
┌─────────────────────────┐
│                         │
│        🍳               │
│    Cooking up data...   │
│      ⚙️ ⚙️ ⚙️           │
│                         │
│   +10 EXP for patience  │
└─────────────────────────┘
```
</details>
<details>
<summary>Functions</summary>

- LoadingSpinner({ size, color }) -> JSX: Displays loading animation
</details>
</details>

---

<details>
<summary>src/components/common/ErrorBoundary.jsx</summary>

- **Required Imports**: React, Component, { FaExclamationTriangle } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- getDerivedStateFromError(error) -> object: Updates state so next render shows fallback UI
- componentDidCatch(error, errorInfo) -> void: Logs error to error reporting service
</details>
</details>

</details>

---

<details>
<summary>src/components/recipes/</summary>

<details>
<summary>src/components/recipes/RecipeCard.jsx</summary>

- **Required Imports**: React, Link from 'react-router-dom', formatTime from '../../utils/formatters', { FaClock, FaFire, FaUser, FaHeart, FaStar, FaCoins } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────┐
│   [RECIPE IMAGE 4:3]        │
│   ⭐⭐⭐⭐⭐ (4.5)            │
│   🍳 Spaghetti Carbonara    │
│   ⏱️ 30min  🔥 Medium      │
│   👤 Chef Mario             │
│   🏷️ Italian, Pasta        │
│   💰 25 Gold  💎 2 Gems    │
│   [🍴 Cook] [❤️ Like]      │
└─────────────────────────────┘
```
<details>
<summary>Functions</summary>

- getDifficultyColor(difficulty) -> string: Returns color based on difficulty level
- truncateText(text, maxLength) -> string: Truncates text to specified length
</details>
</details>

---

<details>
<summary>src/components/recipes/RecipeForm.jsx</summary>

- **Required Imports**: React, useState, useEffect, useNavigate from 'react-router-dom', api from '../../api/recipes', { FaPlus, FaTrash, FaImage, FaListOl, FaClock, FaBalanceScale, FaCalculator } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│        CREATE RECIPE                │
├─────────────────────────────────────┤
│  Recipe Title: [_______________]    │
│  Description:  [_______________]    │
│  Cover Image:  [📁 Upload]          │
│  Difficulty:   [🔥 Easy/Medium/Hard]│
├─────────────────────────────────────┤
│  INGREDIENTS SECTION                │
│  ┌─────────────────────────────┐    │
│  │ [+] Add Ingredient          │    │
│  │ 1. Pasta - 400g            │    │
│  │ 2. Eggs - 3 large          │    │
│  │ [Calculate Nutrition: 650cal]│    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  STEPS SECTION                      │
│  ┌─────────────────────────────┐    │
│  │ [+] Add Step                │    │
│  │ 1. Boil water (5min ⏱️)     │    │
│  │ 2. Cook pasta (10min ⏱️)    │    │
│  │ [Total: 8 steps, 45min]     │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  REWARDS: [50 EXP] [25 Gold] [2 Gems]│
│  [🎮 Create Recipe & Earn EXP]      │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

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
<summary>src/components/recipes/RecipeDetail.jsx</summary>

- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/recipes', { FaHeart, FaBookmark, FaShare, FaClock, FaFire, FaUtensils, FaUsers } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│ [← Back] RECIPE TITLE  [❤️] [🔖]   │
├─────────────────────────────────────┤
│         [HERO IMAGE]                │
├─────────────────────────────────────┤
│ 👤 Chef  ⭐ 4.5  ⏱️ 30min  🔥 Medium│
│ 💰 Price: 25 Gold | 💎 2 Gems      │
├─────────────────────────────────────┤
│ TABS: 📋 Ingredients | 📝 Steps     │
│       💬 Comments   | 🏆 Rewards    │
├─────────────────────────────────────┤
│ INGREDIENTS LIST (with checkboxes)  │
│ STEPS WITH TIMERS & COMPLETE BUTTONS│
├─────────────────────────────────────┤
│ [🎮 Start Cooking Session]          │
│ [👥 Cook with Friends]              │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- loadRecipe() -> void: Fetches recipe details from API
- handleInteraction(type) -> void: Handles like/dislike/save interactions
- formatTimer(duration, unit) -> string: Formats timer for display
</details>
</details>

---

<details>
<summary>src/components/recipes/RecipeList.jsx</summary>

- **Required Imports**: React, useState, useEffect, RecipeCard from './RecipeCard', api from '../../api/recipes', { FaFilter, FaSort, FaSearch } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│ RECIPE DISCOVERY                    │
├─────────────────────────────────────┤
│ [🔍 Search] [🔽 Filter] [🔼 Sort]   │
├─────────────────────────────────────┤
│ GRID:                               │
│ ┌───┐ ┌───┐ ┌───┐                  │
│ │ 🍳│ │ 🥗│ │ 🍰│                  │
│ │   │ │   │ │   │                  │
│ └───┘ └───┘ └───┘                  │
│ ┌───┐ ┌───┐ ┌───┐                  │
│ │ 🌮│ │ 🍣│ │ 🍕│                  │
│ │   │ │   │ │   │                  │
│ └───┘ └───┘ └───┘                  │
├─────────────────────────────────────┤
│ Pagination: [1] [2] [3] ... [Next]  │
│ Showing 1-20 of 250 recipes         │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- loadRecipes() -> void: Fetches recipes from API
- filterRecipes(criteria) -> array: Filters recipes based on criteria
- sortRecipes(sortBy) -> array: Sorts recipes based on sort option
</details>
</details>

---

<details>
<summary>src/components/recipes/IngredientList.jsx</summary>

- **Required Imports**: React, { FaCheckSquare, FaSquare, FaBalanceScale } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- formatAmount(amount, unit) -> string: Formats ingredient amount and unit
</details>
</details>

---

<details>
<summary>src/components/recipes/StepList.jsx</summary>

- **Required Imports**: React, useState, { FaCheckCircle, FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- startTimer(duration) -> void: Starts countdown timer for step
- completeStep(stepId) -> void: Marks step as completed
</details>
</details>

</details>

---

<details>
<summary>src/components/cooking/</summary>

<details>
<summary>src/components/cooking/CookingSession.jsx</summary>

- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/cooking-sessions', { FaPlay, FaPause, FaStop, FaStepForward, FaUsers, FaTrophy } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│ [← Back] RECIPE   ⏱️ 12:45  [🎮]   │
├─────────────────────────────────────┤
│ Progress: ──────────●──── 70%      │
├─────────────┬───────────────────────┤
│             │                       │
│ INGREDIENTS │   STEP 5/8            │
│ • ✓ Pasta   │   "Add sauce and..."  │
│ • ✓ Eggs    │   [⏱️ 5:00 Timer]     │
│ • Cheese    │   [✅ Complete Step]   │
│             │   [⏭️ Skip]           │
│             ├───────────────────────┤
│ PARTICIPANTS│   REWARDS:            │
│ 👤👤👤      │   +15 EXP | +8 Gold   │
└─────────────┴───────────────────────┘
```
<details>
<summary>Functions</summary>

- loadSession() -> void: Loads cooking session details
- startSession() -> void: Starts the cooking session
- pauseSession() -> void: Pauses the cooking session
- completeSession() -> void: Marks session as complete
- nextStep() -> void: Advances to next step
</details>
</details>

---

<details>
<summary>src/components/cooking/SessionTimer.jsx</summary>

- **Required Imports**: React, useState, useEffect, { FaPlay, FaPause, FaRedo, FaHourglassHalf } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- formatTime(seconds) -> string: Formats seconds to MM:SS
- startTimer(duration) -> void: Starts the timer
- pauseTimer() -> void: Pauses the timer
- resetTimer() -> void: Resets the timer to initial duration
</details>
</details>

---

<details>
<summary>src/components/cooking/ParticipantList.jsx</summary>

- **Required Imports**: React, useEffect, api from '../../api/cooking-sessions', { FaUser, FaCrown, FaEye } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- loadParticipants() -> void: Loads session participants
- updateParticipantStatus(userId, status) -> void: Updates participant status
</details>
</details>

---

<details>
<summary>src/components/cooking/StepProgress.jsx</summary>

- **Required Imports**: React, { FaFlagCheckered, FaRoute } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- calculateProgress(current, total) -> number: Calculates progress percentage
</details>
</details>

</details>

---

<details>
<summary>src/components/users/</summary>

<details>
<summary>src/components/users/UserCard.jsx</summary>

- **Required Imports**: React, Link from 'react-router-dom', api from '../../api/relationships', { FaUserCircle, FaPlus, FaCheck, FaStar, FaFire } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────┐
│   [PROFILE PICTURE]         │
│   👨‍🍳 Chef Name             │
│   ⭐⭐⭐⭐⭐ Level 15          │
│   📊 42 Recipes | 128 Cooks│
│   [➕ Follow] [📩 Message]   │
└─────────────────────────────┘
```
<details>
<summary>Functions</summary>

- handleFollow() -> void: Follows/unfollows user
- getLevelColor(level) -> string: Returns color based on user level
</details>
</details>

---

<details>
<summary>src/components/users/UserProfile.jsx</summary>

- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/users', { FaEdit, FaCamera, FaTrophy, FaChartLine, FaAward, FaCrown } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│ [✏️ Edit] [➕ Follow] [📩 Message]  │
├─────────────────────────────────────┤
│        [PROFILE PICTURE LARGE]      │
│        👨‍🍳 John Doe | Level 15 Chef│
│        🔥 7-Day Login Streak        │
│        🏆 12 Achievements Unlocked  │
├─────────────────────────────────────┤
│  TABS: 📖 Recipes | 📚 Cookbooks    │
│        👥 Following | 🏅 Achievements│
├─────────────────────────────────────┤
│  CONTENT AREA (Grid/List of items)  │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- loadUserProfile() -> void: Loads user profile data
- loadUserRecipes() -> void: Loads user's recipes
- loadUserStats() -> void: Loads user statistics
- calculateNextLevelProgress() -> object: Calculates progress to next level
</details>
</details>

---

<details>
<summary>src/components/users/StatsDisplay.jsx</summary>

- **Required Imports**: React, { FaChartBar, FaFire, FaCoins, FaGem, FaStar, FaMedal } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- formatStatValue(value, type) -> string: Formats stat values for display
- getStatIcon(statName) -> JSX: Returns icon for stat type
</details>
</details>

---

<details>
<summary>src/components/users/FollowButton.jsx</summary>

- **Required Imports**: React, useState, api from '../../api/relationships', { FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- checkFollowingStatus() -> boolean: Checks if current user follows target user
- toggleFollow() -> void: Toggles follow/unfollow
</details>
</details>

</details>

---

<details>
<summary>src/components/gamification/</summary>

<details>
<summary>src/components/gamification/CurrencyDisplay.jsx</summary>

- **Required Imports**: React, { FaCoins, FaGem, FaMoneyBillWave } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- formatCurrency(amount, type) -> string: Formats currency values with appropriate symbols
</details>
</details>

---

<details>
<summary>src/components/gamification/LevelProgress.jsx</summary>

- **Required Imports**: React, { FaTrophy, FaChessQueen, FaStar, FaCrown } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- calculateProgress(currentExp, nextLevelExp) -> number: Calculates progress percentage
- getLevelTitle(level) -> string: Returns title based on level
</details>
</details>

---

<details>
<summary>src/components/gamification/RewardNotification.jsx</summary>

- **Required Imports**: React, useState, useEffect, { FaGift, FaCoins, FaGem, FaStar, FaTrophy } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- showNotification(reward) -> void: Displays reward notification
- hideNotification() -> void: Hides notification after timeout
</details>
</details>

---

<details>
<summary>src/components/gamification/ShopItem.jsx</summary>

- **Required Imports**: React, useState, api from '../../api/shop', { FaShoppingCart, FaLock, FaCheck } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- canAfford() -> boolean: Checks if user can afford item
- purchaseItem() -> void: Handles item purchase
</details>
</details>

</details>

</details>

---

<details>
<summary>src/pages/</summary>

<details>
<summary>src/pages/HomePage.jsx</summary>

- **Required Imports**: React, Link from 'react-router-dom', RecipeList from '../components/recipes/RecipeList', { FaFire, FaNewspaper, FaTrophy, FaUsers } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│          HERO SECTION               │
│   🍳 CookTogether                   │
│   Level up your cooking skills!     │
│   [🎮 Start Cooking] [📖 Browse]    │
├─────────────────────────────────────┤
│  FEATURED SECTIONS                  │
│  ┌──────────┬──────────┬──────────┐│
│  │ 🔥Trending│ 🏆Challenges│ 👥Community││
│  │ Recipes  │ Daily/Weekly│ Top Chefs││
│  └──────────┴──────────┴──────────┘│
├─────────────────────────────────────┤
│  QUICK ACTIONS                      │
│  [🍳 Create Recipe] [👥 Find Friends]│
│  [🏆 View Challenges] [🏪 Visit Shop]│
├─────────────────────────────────────┤
│  RECENT ACTIVITY FEED               │
│  • Chef Mario cooked Carbonara +50XP│
│  • Sarah reached Level 20! 🎉       │
│  • New recipe: Vegan Lasagna        │
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- getFeaturedRecipes() -> array: Returns featured recipes for homepage
- getRecentActivities() -> array: Returns recent user activities
</details>
</details>

---

<details>
<summary>src/pages/LoginPage.jsx</summary>

- **Required Imports**: React, LoginForm from '../components/auth/LoginForm', { FaSignInAlt, FaFire, FaGift } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- handleLoginSuccess() -> void: Redirects after successful login
</details>
</details>

---

<details>
<summary>src/pages/RegisterPage.jsx</summary>

- **Required Imports**: React, RegisterForm from '../components/auth/RegisterForm', { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- handleRegisterSuccess() -> void: Redirects after successful registration
</details>
</details>

---

<details>
<summary>src/pages/RecipesPage.jsx</summary>

- **Required Imports**: React, useState, RecipeList from '../components/recipes/RecipeList', RecipeFilters from '../components/recipes/RecipeFilters', { FaFilter, FaSortAmountDown, FaSearch } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- loadAllRecipes() -> void: Loads all recipes with pagination
- handleSearch(query) -> void: Handles recipe search
- handleFilterChange(filters) -> void: Updates recipe filters
</details>
</details>

---

<details>
<summary>src/pages/RecipeDetailPage.jsx</summary>

- **Required Imports**: React, RecipeDetail from '../components/recipes/RecipeDetail', CookingSession from '../components/cooking/CookingSession', { FaUtensils, FaUsers, FaHeart } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- handleStartCooking() -> void: Starts cooking session from recipe
</details>
</details>

---

<details>
<summary>src/pages/CreateRecipePage.jsx</summary>

- **Required Imports**: React, RecipeForm from '../components/recipes/RecipeForm', { FaPlusCircle, FaLightbulb, FaAward } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- handleRecipeCreated(recipeId) -> void: Handles successful recipe creation
</details>
</details>

---

<details>
<summary>src/pages/ProfilePage.jsx</summary>

- **Required Imports**: React, UserProfile from '../components/users/UserProfile', UserRecipes from '../components/users/UserRecipes', { FaUserCircle, FaCog, FaChartLine } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- loadUserData() -> void: Loads comprehensive user data
- handleProfileUpdate() -> void: Handles profile update success
</details>
</details>

---

<details>
<summary>src/pages/CookingSessionPage.jsx</summary>

- **Required Imports**: React, CookingSession from '../components/cooking/CookingSession', SessionTimer from '../components/cooking/SessionTimer', { FaPlay, FaUsers, FaTrophy } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- handleSessionComplete() -> void: Handles session completion
- handleStepComplete() -> void: Handles step completion with rewards
</details>
</details>

---

<details>
<summary>src/pages/ShopPage.jsx</summary>

- **Required Imports**: React, useState, ShopItem from '../components/gamification/ShopItem', { FaStore, FaCoins, FaGem, FaTags } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│          COOKTOGETHER SHOP          │
│   💰 Your Balance: 1,250G | 💎 45   │
├─────────────────────────────────────┤
│  CATEGORIES: [🎨 Cosmetics] [🔧 Tools]│
│              [📚 Recipes] [🎁 Boosts]│
├─────────────────────────────────────┤
│  SHOP ITEMS GRID (3x3)              │
│  ┌───┐ ┌───┐ ┌───┐                 │
│  │ 👑│ │ 🎩│ │ 🔪│                 │
│  │ 500G││ 750G││ 1,200G│           │
│  └───┘ └───┘ └───┘                 │
│  ┌───┐ ┌───┐ ┌───┐                 │
│  │ 🍳│ │ 📖│ │ ⚡│                 │
│  │ 300G││ 200G││ 150G│             │
│  └───┘ └───┘ └───┘                 │
├─────────────────────────────────────┤
│  SPECIAL OFFERS:                    │
│  🔥 Daily Deal: Golden Spoon 50% off│
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- loadShopItems() -> void: Loads available shop items
- handlePurchase(itemId) -> void: Handles item purchase
- filterItems(category) -> array: Filters shop items by category
</details>
</details>

---

<details>
<summary>src/pages/DiscoverPage.jsx</summary>

- **Required Imports**: React, useState, UserCard from '../components/users/UserCard', RecipeCard from '../components/recipes/RecipeCard', { FaCompass, FaFire, FaTrophy, FaUsers } from 'react-icons/fa'
- layout:
```
┌─────────────────────────────────────┐
│           DISCOVER                  │
│  🔥 Trending | 👑 Top Chefs | 🏆 New│
├─────────────────────────────────────┤
│  TOP CHEFS THIS WEEK               │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │ 👨│ │ 👩│ │ 🧑│ │ 👨│ │ 👩│    │
│  │Level││Level││Level││Level││Level││
│  │ 25 ││ 22 ││ 20 ││ 18 ││ 17 │    │
│  └───┘ └───┘ └───┘ └───┘ └───┘    │
├─────────────────────────────────────┤
│  TRENDING RECIPES                  │
│  [🍕] [🥗] [🍣] [🌮] [🍰]          │
│  +125   +98   +76   +64   +52      │
├─────────────────────────────────────┤
│  COMMUNITY CHALLENGES              │
│  ⚔️ Vegan Week: 342 participants    │
│  🏆 Master Chef: Top 10% get rewards│
└─────────────────────────────────────┘
```
<details>
<summary>Functions</summary>

- loadTopChefs() -> void: Loads top-rated users
- loadTrendingRecipes() -> void: Loads trending recipes
- loadRecentChallenges() -> void: Loads recent challenges
</details>
</details>

---

<details>
<summary>src/pages/CookbooksPage.jsx</summary>

- **Required Imports**: React, useState, api from '../api/cookbooks', { FaBook, FaPlus, FaFolderOpen } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- loadCookbooks() -> void: Loads user's cookbooks
- createCookbook() -> void: Creates new cookbook
- addRecipeToCookbook() -> void: Adds recipe to cookbook
</details>
</details>

</details>

---

<details>
<summary>src/contexts/</summary>

<details>
<summary>src/contexts/AuthContext.jsx</summary>

- **Required Imports**: React, createContext, useState, useContext, useEffect, { FaUserShield } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- login(email, password) -> object: Authenticates user
- logout() -> void: Logs out user and clears session
- isAuthenticated() -> boolean: Checks if user is authenticated
- getCurrentUser() -> object: Returns current user data
- refreshToken() -> boolean: Refreshes authentication token
</details>
</details>

---

<details>
<summary>src/contexts/DataContext.jsx</summary>

- **Required Imports**: React, createContext, useState, useContext, { FaDatabase, FaSync } from 'react-icons/fa'
<details>
<summary>Functions</summary>

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
<summary>src/contexts/NotificationContext.jsx</summary>

- **Required Imports**: React, createContext, useState, useContext, { FaBell, FaTimes } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- showNotification(message, type) -> void: Shows notification
- hideNotification(id) -> void: Hides specific notification
- clearNotifications() -> void: Clears all notifications
</details>
</details>

</details>

---

<details>
<summary>src/hooks/</summary>

<details>
<summary>src/hooks/useAuth.js</summary>

- **Required Imports**: useContext from 'react', AuthContext from '../contexts/AuthContext'
<details>
<summary>Functions</summary>

- useAuth() -> object: Provides authentication state and methods
</details>
</details>

---

<details>
<summary>src/hooks/useApi.js</summary>

- **Required Imports**: useState, useEffect, useCallback
<details>
<summary>Functions</summary>

- useApi(endpoint, method, body) -> object: Custom hook for API calls with loading and error states
- fetchData() -> void: Fetches data from API
- postData(data) -> void: Posts data to API
- putData(data) -> void: Updates data via API
- deleteData() -> void: Deletes data via API
</details>
</details>

---

<details>
<summary>src/hooks/useForm.js</summary>

- **Required Imports**: useState, useCallback
<details>
<summary>Functions</summary>

- useForm(initialValues) -> object: Custom hook for form state management
- handleChange(event) -> void: Handles form field changes
- handleSubmit(callback) -> void: Handles form submission
- resetForm() -> void: Resets form to initial values
- validateForm() -> object: Validates form fields
</details>
</details>

---

<details>
<summary>src/hooks/useLocalStorage.js</summary>

- **Required Imports**: useState, useEffect
<details>
<summary>Functions</summary>

- useLocalStorage(key, initialValue) -> array: Custom hook for localStorage with state synchronization
- setValue(value) -> void: Sets value in localStorage and state
- removeValue() -> void: Removes value from localStorage and state
</details>
</details>

</details>

---

<details>
<summary>src/utils/</summary>

<details>
<summary>src/utils/api.js</summary>

- **Required Imports**: None
<details>
<summary>Functions</summary>

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
<summary>src/utils/formatters.js</summary>

- **Required Imports**: None
<details>
<summary>Functions</summary>

- formatTime(minutes) -> string: Formats minutes to hours:minutes
- formatDate(timestamp) -> string: Formats timestamp to readable date
- truncateText(text, length) -> string: Truncates text with ellipsis
- formatCurrency(amount) -> string: Formats currency with commas
- capitalizeFirst(string) -> string: Capitalizes first letter
</details>
</details>

---

<details>
<summary>src/utils/validators.js</summary>

- **Required Imports**: None
<details>
<summary>Functions</summary>

- validateEmail(email) -> boolean: Validates email format
- validatePassword(password) -> boolean: Validates password strength
- validateRequired(value) -> boolean: Checks if value is not empty
- validateNumber(value, min, max) -> boolean: Validates number range
- validateUrl(url) -> boolean: Validates URL format
</details>
</details>

---

<details>
<summary>src/utils/constants.js</summary>

- **Required Imports**: None
<details>
<summary>Functions</summary>

- API_BASE_URL() -> string: Returns API base URL based on environment
- getDifficultyOptions() -> array: Returns difficulty options for forms
- getCuisineOptions() -> array: Returns cuisine options
- getUnitOptions() -> array: Returns measurement unit options
- getLevelThresholds() -> object: Returns level progression thresholds
</details>
</details>

---

<details>
<summary>src/utils/helpers.js</summary>

- **Required Imports**: None
<details>
<summary>Functions</summary>

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
<summary>src/api/</summary>

<details>
<summary>src/api/auth.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

- login(email, password) -> promise: Authenticates user
- register(userData) -> promise: Registers new user
- logout() -> promise: Logs out user
- getCurrentUser() -> promise: Gets current user data
- refreshToken() -> promise: Refreshes authentication token
</details>
</details>

---

<details>
<summary>src/api/users.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

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
<summary>src/api/recipes.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

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
<summary>src/api/cooking-sessions.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

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
<summary>src/api/relationships.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

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
<summary>src/api/cookbooks.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

- getCookbooks() -> promise: Gets user's cookbooks
- createCookbook(data) -> promise: Creates new cookbook
- addRecipeToCookbook(cookbookId, recipeId) -> promise: Adds recipe to cookbook
- removeRecipeFromCookbook(cookbookId, recipeId) -> promise: Removes recipe from cookbook
- getCookbookRecipes(cookbookId) -> promise: Gets recipes in cookbook
</details>
</details>

---

<details>
<summary>src/api/shop.js</summary>

- **Required Imports**: api from '../utils/api'
<details>
<summary>Functions</summary>

- getShopItems() -> promise: Gets available shop items
- purchaseItem(itemId) -> promise: Purchases shop item
- getUserPurchases() -> promise: Gets user's purchased items
- getItemCategories() -> promise: Gets shop item categories
</details>
</details>

</details>

---

<details>
<summary>src/styles/</summary>

<details>
<summary>src/styles/index.css</summary>

- **Required Imports**: './themes.css', './components.css', './layout.css', './utilities.css'
- **Description**: Main stylesheet with global styles and gamified theme imports
- gamified libraries imported:
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
</details>

---

<details>
<summary>src/styles/components.css</summary>

- **Required Imports**: None
- **Description**: Component-specific styles with gamified elements
</details>

---

<details>
<summary>src/styles/layout.css</summary>

- **Required Imports**: None
- **Description**: Layout and grid styles
</details>

---

<details>
<summary>src/styles/utilities.css</summary>

- **Required Imports**: None
- **Description**: Utility classes and helper styles
</details>

---

<details>
<summary>src/styles/themes.css</summary>

- **Required Imports**: None
- **Description**: Theme variables and color schemes from frontend_design.md
</details>

</details>

---

<details>
<summary>src/assets/</summary>

<details>
<summary>src/assets/images/</summary>

- icons/ - Gamified icons (swords, shields, crowns, etc.)
- illustrations/ - Cooking and gamification illustrations
- backgrounds/ - Patterned backgrounds for cards and sections
</details>

---

<details>
<summary>src/assets/fonts/</summary>

- Custom font files for gamified typography
</details>

</details>

---

<details>
<summary>src/App.jsx</summary>

- **Required Imports**: React, BrowserRouter, Routes, Route from 'react-router-dom', AuthContext from './contexts/AuthContext', DataContext from './contexts/DataContext', NotificationContext from './contexts/NotificationContext', all page components from './pages', Header from './components/common/Header', Footer from './components/common/Footer', { FaGamepad, FaCookieBite } from 'react-icons/fa'
<details>
<summary>Functions</summary>

- App() -> JSX: Main application component with routing
- initializeApp() -> void: Initializes application state
- handleRouteChange() -> void: Handles route change events
</details>
</details>

---

<details>
<summary>src/index.js</summary>

- **Required Imports**: React, ReactDOM from 'react-dom/client', App from './App', './styles/index.css'
<details>
<summary>Functions</summary>

- renderApp() -> void: Renders React application to DOM
</details>
</details>

---

<details>
<summary>src/setupTests.js</summary>

- **Required Imports**: '@testing-library/jest-dom'
- **Description**: Test setup configuration
</details>

</details>

---

<details>
<summary>package.json</summary>

- **Required Imports**: None
- **Description**: Project dependencies and scripts
- gamified dependencies added:
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
</details>

---

<details>
<summary>.env</summary>

- **Required Imports**: None
- **Description**: Environment variables
</details>

---

<details>
<summary>.gitignore</summary>

- **Required Imports**: None
- **Description**: Git ignore rules
</details>

</details>