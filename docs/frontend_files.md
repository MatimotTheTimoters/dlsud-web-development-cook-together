Here's the updated `frontend_files.md` with all your requested changes:

# Frontend Files Documentation

---

## **frontend/**

---

### **public/**

#### **public/index.html**
- **Description**: Main HTML template with gamified UI libraries and basic layout structure
- **Required Imports**: None
- **Backend Endpoint**: None
- **Layout**:

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

- **Gamified Libraries Added**:
  ```html
  <!-- Gamified UI Libraries -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```

---

#### **public/favicon.ico**
- **Description**: Site favicon for browser tabs
- **Required Imports**: None
- **Backend Endpoint**: None

---

#### **public/manifest.json**
- **Description**: Progressive Web App manifest for mobile installation
- **Required Imports**: None
- **Backend Endpoint**: None

---

### **src/**

---

### **src/components/**

---

### **src/components/auth/**

#### **src/components/auth/LoginForm.jsx**
- **Description**: User login form with gamified elements and validation
- **Required Imports**: React, useState, useNavigate from 'react-router-dom', api from '../../api/auth', { FaUser, FaLock, FaFire } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/login.php
- **Layout**:

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

- **Functions**:
  - `handleSubmit(event) -> void`: Handles login form submission
  - `validateForm() -> boolean`: Validates form inputs
  - `resetForm() -> void`: Resets form to initial state

---

#### **src/components/auth/RegisterForm.jsx**
- **Description**: User registration form with welcome bonuses and validation
- **Required Imports**: React, useState, useNavigate from 'react-router-dom', api from '../../api/auth', { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/register.php
- **Layout**:

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

- **Functions**:
  - `handleSubmit(event) -> void`: Handles registration form submission
  - `validateForm() -> boolean`: Validates form inputs
  - `checkPasswordStrength(password) -> string`: Returns password strength rating

---

#### **src/components/auth/ProtectedRoute.jsx**
- **Description**: Route wrapper that protects authenticated routes
- **Required Imports**: React, Navigate from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaShieldAlt } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/me.php (for token validation)
- **Functions**:
  - `ProtectedRoute({ children }) -> JSX`: Wraps protected routes with authentication check

---

### **src/components/common/**

#### **src/components/common/Header.jsx**
- **Description**: Main application header with navigation and user stats
- **Required Imports**: React, Link from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaHome, FaUtensils, FaUsers, FaBook, FaUser, FaCoins, FaGem } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/me.php, api/users/profile.php
- **Layout**:

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

- **Functions**:
  - `handleLogout() -> void`: Logs user out and redirects to login
  - `getGreeting() -> string`: Returns time-based greeting message

---

#### **src/components/common/Footer.jsx**
- **Description**: Application footer with links and copyright
- **Required Imports**: React, { FaHeart, FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `getCurrentYear() -> number`: Returns current year for copyright

---

#### **src/components/common/Navigation.jsx**
- **Description**: Main navigation component with links and user actions
- **Required Imports**: React, NavLink from 'react-router-dom', useAuth from '../../contexts/AuthContext', { FaBell, FaEnvelope, FaUserFriends } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/me.php
- **Functions**:
  - `isActiveLink(isActive) -> string`: Returns active link className
  - `hasPermission(requiredRole) -> boolean`: Checks if user has required permissions

---

#### **src/components/common/LoadingSpinner.jsx**
- **Description**: Animated loading spinner with cooking theme
- **Required Imports**: React, { FaUtensilSpoon, FaBlender } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Layout**:

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

- **Functions**:
  - `LoadingSpinner({ size, color }) -> JSX`: Displays loading animation
- **Loading Types Support**:
  - `type='default'`: General loading with cooking utensils
  - `type='user'`: User data loading with user/chart icons
  - `type='recipe'`: Recipe-specific loading with food icons
  - `type='cooking'`: Cooking session loading with fire/cookie icons
  - `type='recipe-list'`: Recipe list loading
  - `type='recipe-detail'`: Recipe detail loading

---

#### **src/components/common/ErrorBoundary.jsx**
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

---

### **src/components/recipes/**

#### **src/components/recipes/RecipeCard.jsx**
- **Description**: Displays recipe information in card format
- **Required Imports**: React, Link from 'react-router-dom', formatTime from '../../utils/formatters', { FaClock, FaFire, FaUser, FaHeart, FaStar, FaCoins } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/interact.php (for like/save interactions)
- **Layout**:

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

- **Functions**:
  - `getDifficultyColor(difficulty) -> string`: Returns color based on difficulty level
  - `truncateText(text, maxLength) -> string`: Truncates text to specified length

---

#### **src/components/recipes/RecipeForm.jsx**
- **Description**: Form for creating and editing recipes with ingredients and steps
- **Required Imports**: React, useState, useEffect, useNavigate from 'react-router-dom', api from '../../api/recipes', { FaPlus, FaTrash, FaImage, FaListOl, FaClock, FaBalanceScale, FaCalculator } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/create.php, api/recipes/update.php, api/upload/image.php
- **Layout**:

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

- **Functions**:
  - `handleSubmit(event) -> void`: Handles recipe form submission
  - `addIngredient() -> void`: Adds new ingredient field
  - `removeIngredient(index) -> void`: Removes ingredient field
  - `addStep() -> void`: Adds new step field
  - `removeStep(index) -> void`: Removes step field
  - `validateForm() -> boolean`: Validates all form inputs
  - `calculateNutrition() -> object`: Calculates total nutrition from ingredients

---

#### **src/components/recipes/RecipeDetail.jsx**
- **Description**: Detailed view of a single recipe with ingredients, steps, and interactions
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/recipes', { FaHeart, FaBookmark, FaShare, FaClock, FaFire, FaUtensils, FaUsers } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/show.php, api/recipes/interact.php
- **Layout**:

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

- **Functions**:
  - `loadRecipe() -> void`: Fetches recipe details from API
  - `handleInteraction(type) -> void`: Handles like/dislike/save interactions
  - `formatTimer(duration, unit) -> string`: Formats timer for display

---

#### **src/components/recipes/RecipeList.jsx**
- **Description**: Displays a list of recipes with filtering and pagination
- **Required Imports**: React, useState, useEffect, RecipeCard from './RecipeCard', api from '../../api/recipes', { FaFilter, FaSort, FaSearch } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php
- **Layout**:

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

- **Functions**:
  - `loadRecipes() -> void`: Fetches recipes from API
  - `filterRecipes(criteria) -> array`: Filters recipes based on criteria
  - `sortRecipes(sortBy) -> array`: Sorts recipes based on sort option

---

#### **src/components/recipes/IngredientList.jsx**
- **Description**: Displays recipe ingredients with checkboxes for completion tracking
- **Required Imports**: React, { FaCheckSquare, FaSquare, FaBalanceScale } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `formatAmount(amount, unit) -> string`: Formats ingredient amount and unit

---

#### **src/components/recipes/StepList.jsx**
- **Description**: Displays cooking steps with timers and completion tracking
- **Required Imports**: React, useState, { FaCheckCircle, FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/complete-step.php
- **Functions**:
  - `startTimer(duration) -> void`: Starts countdown timer for step
  - `completeStep(stepId) -> void`: Marks step as completed

---

### **src/components/cooking/**

#### **src/components/cooking/CookingSession.jsx**
- **Description**: Main cooking session interface with progress tracking and step management
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/cooking-sessions', { FaPlay, FaPause, FaStop, FaStepForward, FaUsers, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/show.php, api/cooking-sessions/update.php, api/cooking-sessions/complete-step.php, api/cooking-sessions/vote.php
- **Layout**:

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

- **Functions**:
  - `loadSession() -> void`: Loads cooking session details
  - `startSession() -> void`: Starts the cooking session
  - `pauseSession() -> void`: Pauses the cooking session
  - `completeSession() -> void`: Marks session as complete
  - `nextStep() -> void`: Advances to next step

---

#### **src/components/cooking/SessionTimer.jsx**
- **Description**: Timer component for cooking sessions with play/pause/reset controls
- **Required Imports**: React, useState, useEffect, { FaPlay, FaPause, FaRedo, FaHourglassHalf } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `formatTime(seconds) -> string`: Formats seconds to MM:SS
  - `startTimer(duration) -> void`: Starts the timer
  - `pauseTimer() -> void`: Pauses the timer
  - `resetTimer() -> void`: Resets the timer to initial duration

---

#### **src/components/cooking/ParticipantList.jsx**
- **Description**: Displays participants in a cooking session with status indicators
- **Required Imports**: React, useEffect, api from '../../api/cooking-sessions', { FaUser, FaCrown, FaEye } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/show.php, api/cooking-sessions/join.php
- **Functions**:
  - `loadParticipants() -> void`: Loads session participants
  - `updateParticipantStatus(userId, status) -> void`: Updates participant status

---

#### **src/components/cooking/StepProgress.jsx**
- **Description**: Visual progress indicator for cooking steps
- **Required Imports**: React, { FaFlagCheckered, FaRoute } from 'react-icons/fa'
- **Backend Endpoint**: None
- **Functions**:
  - `calculateProgress(current, total) -> number`: Calculates progress percentage

---

### **src/components/users/**

#### **src/components/users/UserCard.jsx**
- **Description**: Displays user information in card format for lists
- **Required Imports**: React, Link from 'react-router-dom', api from '../../api/relationships', { FaUserCircle, FaPlus, FaCheck, FaStar, FaFire } from 'react-icons/fa'
- **Backend Endpoint**: api/relationships/follow.php, api/users/profile.php
- **Layout**:

```
┌─────────────────────────────┐
│   [PROFILE PICTURE]         │
│   👨‍🍳 Chef Name             │
│   ⭐⭐⭐⭐⭐ Level 15          │
│   📊 42 Recipes | 128 Cooks│
│   [➕ Follow] [📩 Message]   │
└─────────────────────────────┘
```

- **Functions**:
  - `handleFollow() -> void`: Follows/unfollows user
  - `getLevelColor(level) -> string`: Returns color based on user level

---

#### **src/components/users/UserProfile.jsx**
- **Description**: Detailed user profile view with stats and content tabs
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/users', { FaEdit, FaCamera, FaTrophy, FaChartLine, FaAward, FaCrown } from 'react-icons/fa'
- **Backend Endpoint**: api/users/profile.php, api/users/update.php, api/users/stats.php, api/upload/image.php
- **Layout**:

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

- **Functions**:
  - `loadUserProfile() -> void`: Loads user profile data
  - `loadUserRecipes() -> void`: Loads user's recipes
  - `loadUserStats() -> void`: Loads user statistics
  - `calculateNextLevelProgress() -> object`: Calculates progress to next level

---

#### **src/components/users/StatsDisplay.jsx**
- **Description**: Displays user statistics with icons and formatted values
- **Required Imports**: React, { FaChartBar, FaFire, FaCoins, FaGem, FaStar, FaMedal } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php
- **Functions**:
  - `formatStatValue(value, type) -> string`: Formats stat values for display
  - `getStatIcon(statName) -> JSX`: Returns icon for stat type

---

#### **src/components/users/FollowButton.jsx**
- **Description**: Button component for following/unfollowing users
- **Required Imports**: React, useState, api from '../../api/relationships', { FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa'
- **Backend Endpoint**: api/relationships/follow.php, api/relationships/friends.php
- **Functions**:
  - `checkFollowingStatus() -> boolean`: Checks if current user follows target user
  - `toggleFollow() -> void`: Toggles follow/unfollow

---

### **src/components/gamification/**

#### **src/components/gamification/CurrencyDisplay.jsx**
- **Description**: Displays user's currency balances (gold and gems)
- **Required Imports**: React, { FaCoins, FaGem, FaMoneyBillWave } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php
- **Functions**:
  - `formatCurrency(amount, type) -> string`: Formats currency values with appropriate symbols

---

#### **src/components/gamification/LevelProgress.jsx**
- **Description**: Visual progress bar for user level progression
- **Required Imports**: React, { FaTrophy, FaChessQueen, FaStar, FaCrown } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php
- **Functions**:
  - `calculateProgress(currentExp, nextLevelExp) -> number`: Calculates progress percentage
  - `getLevelTitle(level) -> string`: Returns title based on level

---

#### **src/components/gamification/RewardNotification.jsx**
- **Description**: Displays reward notifications with animations
- **Required Imports**: React, useState, useEffect, { FaGift, FaCoins, FaGem, FaStar, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/users/stats.php (for reward updates)
- **Functions**:
  - `showNotification(reward) -> void`: Displays reward notification
  - `hideNotification() -> void`: Hides notification after timeout

---

#### **src/components/gamification/ShopItem.jsx**
- **Description**: Displays shop items with purchase functionality
- **Required Imports**: React, useState, api from '../../api/shop', { FaShoppingCart, FaLock, FaCheck } from 'react-icons/fa'
- **Backend Endpoint**: api/shop.js (to be implemented in backend)
- **Functions**:
  - `canAfford() -> boolean`: Checks if user can afford item
  - `purchaseItem() -> void`: Handles item purchase

---

### **src/pages/**

#### **src/pages/HomePage.jsx**
- **Description**: Main landing page with featured content and quick actions
- **Required Imports**: React, Link from 'react-router-dom', RecipeList from '../components/recipes/RecipeList', { FaFire, FaNewspaper, FaTrophy, FaUsers } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php, api/cooking-sessions/index.php
- **Layout**:

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

- **Functions**:
  - `getFeaturedRecipes() -> array`: Returns featured recipes for homepage
  - `getRecentActivities() -> array`: Returns recent user activities

---

#### **src/pages/LoginPage.jsx**
- **Description**: Login page that wraps the LoginForm component
- **Required Imports**: React, LoginForm from '../components/auth/LoginForm', { FaSignInAlt, FaFire, FaGift } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/login.php
- **Functions**:
  - `handleLoginSuccess() -> void`: Redirects after successful login

---

#### **src/pages/RegisterPage.jsx**
- **Description**: Registration page that wraps the RegisterForm component
- **Required Imports**: React, RegisterForm from '../components/auth/RegisterForm', { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/register.php
- **Functions**:
  - `handleRegisterSuccess() -> void`: Redirects after successful registration

---

#### **src/pages/RecipesPage.jsx**
- **Description**: Page for browsing and searching recipes
- **Required Imports**: React, useState, RecipeList from '../components/recipes/RecipeList', RecipeFilters from '../components/recipes/RecipeFilters', { FaFilter, FaSortAmountDown, FaSearch } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php
- **Functions**:
  - `loadAllRecipes() -> void`: Loads all recipes with pagination
  - `handleSearch(query) -> void`: Handles recipe search
  - `handleFilterChange(filters) -> void`: Updates recipe filters

---

#### **src/pages/RecipeDetailPage.jsx**
- **Description**: Page for viewing detailed recipe information
- **Required Imports**: React, RecipeDetail from '../components/recipes/RecipeDetail', CookingSession from '../components/cooking/CookingSession', { FaUtensils, FaUsers, FaHeart } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/show.php, api/recipes/interact.php, api/cooking-sessions/create.php
- **Functions**:
  - `handleStartCooking() -> void`: Starts cooking session from recipe

---

#### **src/pages/CreateRecipePage.jsx**
- **Description**: Page for creating new recipes
- **Required Imports**: React, RecipeForm from '../components/recipes/RecipeForm', { FaPlusCircle, FaLightbulb, FaAward } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/create.php, api/upload/image.php
- **Functions**:
  - `handleRecipeCreated(recipeId) -> void`: Handles successful recipe creation

---

#### **src/pages/ProfilePage.jsx**
- **Description**: User profile page with edit functionality
- **Required Imports**: React, UserProfile from '../components/users/UserProfile', UserRecipes from '../components/users/UserRecipes', { FaUserCircle, FaCog, FaChartLine } from 'react-icons/fa'
- **Backend Endpoint**: api/users/profile.php, api/users/update.php, api/users/stats.php, api/recipes/index.php, api/cookbooks/index.php
- **Functions**:
  - `loadUserData() -> void`: Loads comprehensive user data
  - `handleProfileUpdate() -> void`: Handles profile update success

---

#### **src/pages/CookingSessionPage.jsx**
- **Description**: Page for active cooking sessions
- **Required Imports**: React, CookingSession from '../components/cooking/CookingSession', SessionTimer from '../components/cooking/SessionTimer', { FaPlay, FaUsers, FaTrophy } from 'react-icons/fa'
- **Backend Endpoint**: api/cooking-sessions/show.php, api/cooking-sessions/update.php, api/cooking-sessions/complete-step.php, api/cooking-sessions/vote.php
- **Functions**:
  - `handleSessionComplete() -> void`: Handles session completion
  - `handleStepComplete() -> void`: Handles step completion with rewards

---

#### **src/pages/ShopPage.jsx**
- **Description**: Virtual shop for purchasing items with currency
- **Required Imports**: React, useState, ShopItem from '../components/gamification/ShopItem', { FaStore, FaCoins, FaGem, FaTags } from 'react-icons/fa'
- **Backend Endpoint**: api/shop.js (to be implemented), api/users/stats.php
- **Layout**:

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

- **Functions**:
  - `loadShopItems() -> void`: Loads available shop items
  - `handlePurchase(itemId) -> void`: Handles item purchase
  - `filterItems(category) -> array`: Filters shop items by category

---

#### **src/pages/DiscoverPage.jsx**
- **Description**: Discovery page for finding recipes and users
- **Required Imports**: React, useState, UserCard from '../components/users/UserCard', RecipeCard from '../components/recipes/RecipeCard', { FaCompass, FaFire, FaTrophy, FaUsers } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php, api/users/search.php, api/users/profile.php
- **Layout**:

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

- **Functions**:
  - `loadTopChefs() -> void`: Loads top-rated users
  - `loadTrendingRecipes() -> void`: Loads trending recipes
  - `loadRecentChallenges() -> void`: Loads recent challenges

---

#### **src/pages/CookbooksPage.jsx**
- **Description**: Page for managing recipe collections/cookbooks
- **Required Imports**: React, useState, api from '../api/cookbooks', { FaBook, FaPlus, FaFolderOpen } from 'react-icons/fa'
- **Backend Endpoint**: api/cookbooks/index.php, api/cookbooks/create.php, api/cookbooks/add-recipe.php, api/cookbooks/remove-recipe.php
- **Functions**:
  - `loadCookbooks() -> void`: Loads user's cookbooks
  - `createCookbook() -> void`: Creates new cookbook
  - `addRecipeToCookbook() -> void`: Adds recipe to cookbook

---

### **src/contexts/**

#### **src/contexts/AuthContext.jsx**
- **Description**: Context for managing authentication state and actions
- **Required Imports**: React, createContext, useState, useContext, useEffect, { FaUserShield } from 'react-icons/fa'
- **Backend Endpoint**: api/auth/login.php, api/auth/register.php, api/auth/logout.php, api/auth/me.php, api/auth/refresh-token.php
- **Functions**:
  - `login(email, password) -> object`: Authenticates user
  - `logout() -> void`: Logs out user and clears session
  - `isAuthenticated() -> boolean`: Checks if user is authenticated
  - `getCurrentUser() -> object`: Returns current user data
  - `refreshToken() -> boolean`: Refreshes authentication token

---

#### **src/contexts/DataContext.jsx**
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

---

#### **src/contexts/NotificationContext.jsx**
- **Description**: Context for managing application notifications
- **Required Imports**: React, createContext, useState, useContext, { FaBell, FaTimes } from 'react-icons/fa'
- **Backend Endpoint**: None (frontend-only)
- **Functions**:
  - `showNotification(message, type) -> void`: Shows notification
  - `hideNotification(id) -> void`: Hides specific notification
  - `clearNotifications() -> void`: Clears all notifications

---

### **src/hooks/**

#### **src/hooks/useAuth.js**
- **Description**: Custom hook for accessing authentication context
- **Required Imports**: useContext from 'react', AuthContext from '../contexts/AuthContext'
- **Backend Endpoint**: Through AuthContext
- **Functions**:
  - `useAuth() -> object`: Provides authentication state and methods

---

#### **src/hooks/useApi.js**
- **Description**: Custom hook for making API calls with loading and error states
- **Required Imports**: useState, useEffect, useCallback
- **Backend Endpoint**: Various (generic hook for all API calls)
- **Functions**:
  - `useApi(endpoint, method, body) -> object`: Custom hook for API calls with loading and error states
  - `fetchData() -> void`: Fetches data from API
  - `postData(data) -> void`: Posts data to API
  - `putData(data) -> void`: Updates data via API
  - `deleteData() -> void`: Deletes data via API

---

#### **src/hooks/useForm.js**
- **Description**: Custom hook for form state management
- **Required Imports**: useState, useCallback
- **Backend Endpoint**: None (frontend-only)
- **Functions**:
  - `useForm(initialValues) -> object`: Custom hook for form state management
  - `handleChange(event) -> void`: Handles form field changes
  - `handleSubmit(callback) -> void`: Handles form submission
  - `resetForm() -> void`: Resets form to initial values
  - `validateForm() -> object`: Validates form fields

---

#### **src/hooks/useLocalStorage.js**
- **Description**: Custom hook for localStorage with React state synchronization
- **Required Imports**: useState, useEffect
- **Backend Endpoint**: None (frontend-only)
- **Functions**:
  - `useLocalStorage(key, initialValue) -> array`: Custom hook for localStorage with state synchronization
  - `setValue(value) -> void`: Sets value in localStorage and state
  - `removeValue() -> void`: Removes value from localStorage and state

---

### **src/utils/**

#### **src/utils/api.js**
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

---

#### **src/utils/formatters.js**
- **Description**: Utility functions for formatting data
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `formatTime(minutes) -> string`: Formats minutes to hours:minutes
  - `formatDate(timestamp) -> string`: Formats timestamp to readable date
  - `truncateText(text, length) -> string`: Truncates text with ellipsis
  - `formatCurrency(amount) -> string`: Formats currency with commas
  - `capitalizeFirst(string) -> string`: Capitalizes first letter

---

#### **src/utils/validators.js**
- **Description**: Validation functions for form inputs
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `validateEmail(email) -> boolean`: Validates email format
  - `validatePassword(password) -> boolean`: Validates password strength
  - `validateRequired(value) -> boolean`: Checks if value is not empty
  - `validateNumber(value, min, max) -> boolean`: Validates number range
  - `validateUrl(url) -> boolean`: Validates URL format

---

#### **src/utils/constants.js**
- **Description**: Application constants and configuration values
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `API_BASE_URL() -> string`: Returns API base URL based on environment
  - `getDifficultyOptions() -> array`: Returns difficulty options for forms
  - `getCuisineOptions() -> array`: Returns cuisine options
  - `getUnitOptions() -> array`: Returns measurement unit options
  - `getLevelThresholds() -> object`: Returns level progression thresholds

---

#### **src/utils/helpers.js**
- **Description**: General helper utility functions
- **Required Imports**: None
- **Backend Endpoint**: None
- **Functions**:
  - `generateId() -> string`: Generates unique ID
  - `debounce(func, wait) -> function`: Creates debounced function
  - `throttle(func, limit) -> function`: Creates throttled function
  - `deepClone(obj) -> object`: Creates deep clone of object
  - `isEmpty(obj) -> boolean`: Checks if object is empty

---

#### **src/utils/upload.js**
- **Description**: Utility functions for handling file uploads
- **Required Imports**: None
- **Backend Endpoint**: None (Utility functions for upload handling)
- **Functions**:
  - `prepareFormData(file, fieldName, additionalData) -> FormData`: Prepares FormData for multipart file upload
  - `validateImageFile(file, options) -> object`: Validates image file with size and type constraints
  - `createImagePreview(file) -> Promise<string>`: Creates data URL for image preview

---

#### **src/utils/userCalculations.js**
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

---

### **src/api/**

#### **src/api/auth.js**
- **Description**: API functions for authentication operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/auth/login.php, api/auth/register.php, api/auth/logout.php, api/auth/me.php, api/auth/refresh-token.php
- **Functions**:
  - `login(email, password) -> promise`: Authenticates user
  - `register(userData) -> promise`: Registers new user
  - `logout() -> promise`: Logs out user
  - `getCurrentUser() -> promise`: Gets current user data
  - `refreshToken() -> promise`: Refreshes authentication token

---

#### **src/api/users.js**
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

---

#### **src/api/recipes.js**
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

---

#### **src/api/cooking-sessions.js**
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

---

#### **src/api/relationships.js**
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

---

#### **src/api/cookbooks.js**
- **Description**: API functions for cookbook operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/cookbooks/index.php, api/cookbooks/create.php, api/cookbooks/show.php, api/cookbooks/add-recipe.php, api/cookbooks/remove-recipe.php
- **Functions**:
  - `getCookbooks() -> promise`: Gets user's cookbooks
  - `createCookbook(data) -> promise`: Creates new cookbook
  - `addRecipeToCookbook(cookbookId, recipeId) -> promise`: Adds recipe to cookbook
  - `removeRecipeFromCookbook(cookbookId, recipeId) -> promise`: Removes recipe from cookbook
  - `getCookbookRecipes(cookbookId) -> promise`: Gets recipes in cookbook

---

#### **src/api/shop.js**
- **Description**: API functions for shop operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/shop.php (to be implemented in backend)
- **Functions**:
  - `getShopItems() -> promise`: Gets available shop items
  - `purchaseItem(itemId) -> promise`: Purchases shop item
  - `getUserPurchases() -> promise`: Gets user's purchased items
  - `getItemCategories() -> promise`: Gets shop item categories

---

### **src/styles/**

#### **src/styles/index.css**
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

---

#### **src/styles/components.css**
- **Description**: Component-specific styles with gamified elements
- **Required Imports**: None
- **Backend Endpoint**: None

---

#### **src/styles/layout.css**
- **Description**: Layout and grid styles
- **Required Imports**: None
- **Backend Endpoint**: None

---

#### **src/styles/utilities.css**
- **Description**: Utility classes and helper styles
- **Required Imports**: None
- **Backend Endpoint**: None

---

#### **src/styles/themes.css**
- **Description**: Theme variables and color schemes from ui_design.md
- **Required Imports**: None
- **Backend Endpoint**: None

---

### **src/assets/**

#### **src/assets/images/**
- **Description**: Image assets directory
- **Required Imports**: None
- **Backend Endpoint**: None
- **Subdirectories**:
  - `icons/` - Gamified icons (swords, shields, crowns, etc.)
  - `illustrations/` - Cooking and gamification illustrations
  - `backgrounds/` - Patterned backgrounds for cards and sections

---

#### **src/assets/fonts/**
- **Description**: Custom font files for gamified typography
- **Required Imports**: None
- **Backend Endpoint**: None

---

### **src/App.jsx**
- **Description**: Main application component with routing setup
- **Required Imports**: React, BrowserRouter, Routes, Route from 'react-router-dom', AuthContext from './contexts/AuthContext', DataContext from './contexts/DataContext', NotificationContext from './contexts/NotificationContext', all page components from './pages', Header from './components/common/Header', Footer from './components/common/Footer', { FaGamepad, FaCookieBite } from 'react-icons/fa'
- **Backend Endpoint**: Various (through page components)
- **Functions**:
  - `App() -> JSX`: Main application component with routing
  - `initializeApp() -> void`: Initializes application state
  - `handleRouteChange() -> void`: Handles route change events

---

### **src/index.js**
- **Description**: Application entry point that renders React to DOM
- **Required Imports**: React, ReactDOM from 'react-dom/client', App from './App', './styles/index.css'
- **Backend Endpoint**: None
- **Functions**:
  - `renderApp() -> void`: Renders React application to DOM

---

### **src/setupTests.js**
- **Description**: Test setup configuration for Jest and React Testing Library
- **Required Imports**: '@testing-library/jest-dom'
- **Backend Endpoint**: None

---

### **package.json**
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

---

### **.env**
- **Description**: Environment variables configuration
- **Required Imports**: None
- **Backend Endpoint**: None

---

### **.gitignore**
- **Description**: Git ignore rules for version control
- **Required Imports**: None
- **Backend Endpoint**: None