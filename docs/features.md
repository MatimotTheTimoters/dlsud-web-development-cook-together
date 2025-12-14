# Changelog
- frontend/src/api/axiosConfig.js - Axios configuration for API calls
- frontend/src/styles/index.css - Unified CSS file (replaced separate component CSS files)
    - frontend/src/styles/components.css
    - frontend/src/styles/pages.css

---

# Features

## Feature 1: User Registration
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Register │     │ Register │     │ Insert   │
│ Form     │     │ API      │     │ User     │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Validate & Hash        │
       │                │                │
       │                │                │
       │                ▼                │
       │         Return User ID         │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Activity     User Created
```

**Files Needed:**
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/components/RegisterForm.jsx`
- `backend/api/register.php`
- `backend/db/connection.php`
- `backend/utils/validation.php`
- `database/schema.sql` (users table)

**Directory Structure:**
```
backend/
├── api/
│   └── register.php
├── db/
│   └── connection.php
├── utils/
│   └── validation.php
frontend/
├── src/
│   ├── pages/
│   │   └── RegisterPage.jsx
│   └── components/
│       └── RegisterForm.jsx
database/
└── schema.sql
```

---

## Feature 2: User Login
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Login   │     │  Login   │     │  Check   │
│  Form    │     │   API    │     │ Credentials
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Verify Password        │
       │                │                │
       │                ▼                │
       │         Generate Token         │
       │                │                │
       ▼                ▼                ▼
  Store Token    Return User Data   Update Last Login
```

**Files Needed:**
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/components/LoginForm.jsx`
- `backend/api/login.php`
- `backend/utils/auth.php`

**Directory Structure:**
```
backend/
├── api/
│   └── login.php
├── utils/
│   └── auth.php
frontend/
├── src/
│   ├── pages/
│   │   └── LoginPage.jsx
│   └── components/
│       └── LoginForm.jsx
```

---

## Feature 3: View User Profile
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Profile │     │  Profile │     │  Fetch   │
│   Page   │     │   API    │     │  User    │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │          Verify Token          │
       │                │                │
       │                ▼                │
       │         Return Profile         │
       │                │                │
       ▼                ▼                ▼
  Display Data    Log Request      Data Retrieved
```

**Files Needed:**
- `frontend/src/pages/ProfilePage.jsx`
- `backend/api/profile.php`
- `database/schema.sql` (add profile fields)

**Directory Structure:**
```
backend/
├── api/
│   └── profile.php
frontend/
├── src/
│   └── pages/
│       └── ProfilePage.jsx
database/
└── schema.sql
```

---

## Feature 4: Create Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Recipe   │     │ Recipe   │     │ Insert   │
│ Form     │     │ Create   │     │ Recipe   │
│          │     │  API     │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Validate & Save        │
       │                │                │
       │                ▼                │
       │         Return Recipe ID       │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Creation     Recipe Saved
```

**Files Needed:**
- `frontend/src/pages/CreateRecipePage.jsx`
- `frontend/src/components/RecipeForm.jsx`
- `backend/api/recipe/create.php`
- `database/schema.sql` (recipes table)

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── create.php
frontend/
├── src/
│   ├── pages/
│   │   └── CreateRecipePage.jsx
│   └── components/
│       └── RecipeForm.jsx
database/
└── schema.sql
```

---

## Feature 5: View Recipe List
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Recipe  │     │  Recipe  │     │  Fetch   │
│   List   │     │   List   │     │ Recipes  │
│  Page    │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Recipes           │
       │                │                │
       │                ▼                │
       │         Return Recipe List     │
       │                │                │
       ▼                ▼                ▼
  Display List    Log Request      Data Retrieved
```

**Files Needed:**
- `frontend/src/pages/RecipesPage.jsx`
- `frontend/src/components/RecipeCard.jsx`
- `backend/api/recipe/list.php`

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── list.php
frontend/
├── src/
│   ├── pages/
│   │   └── RecipesPage.jsx
│   └── components/
│       └── RecipeCard.jsx
```

---

## Feature 6: View Single Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Recipe   │     │ Recipe   │     │  Fetch   │
│ Detail   │     │  Get     │     │  Single  │
│ Page     │     │   API    │     │  Recipe  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Recipe by ID       │
       │                │                │
       │                ▼                │
       │         Return Full Recipe     │
       │                │                │
       ▼                ▼                ▼
  Display Recipe   Log View        Data Retrieved
```

**Files Needed:**
- `frontend/src/pages/RecipeDetailPage.jsx`
- `backend/api/recipe/get.php`
- `database/schema.sql` (add recipe details tables)

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── get.php
frontend/
├── src/
│   └── pages/
│       └── RecipeDetailPage.jsx
database/
└── schema.sql
```

---

## Feature 7: Start Cooking Session
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Cooking  │     │ Cooking  │     │ Create   │
│ Session  │     │ Session  │     │ Session  │
│ Button   │     │ Create   │     │ Record   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Create Session          │
       │                │                │
       │                ▼                │
       │         Return Session ID      │
       │                │                │
       ▼                ▼                ▼
  Redirect to     Log Session      Session Created
  Session Page    Creation
```

**Files Needed:**
- `frontend/src/pages/CookingSessionPage.jsx`
- `backend/api/session/create.php`
- `database/schema.sql` (cooking_sessions table)

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── create.php
frontend/
├── src/
│   └── pages/
│       └── CookingSessionPage.jsx
database/
└── schema.sql
```

---

## Feature 8: Join Cooking Session
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Join    │     │  Join    │     │  Add     │
│ Session  │     │ Session  │     │ Participant
│ Button   │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Add Participant        │
       │                │                │
       │                ▼                │
       │         Return Success         │
       │                │                │
       ▼                ▼                ▼
  Update UI       Log Join        Participant Added
```

**Files Needed:**
- `frontend/src/components/JoinSessionButton.jsx`
- `backend/api/session/join.php`
- `database/schema.sql` (session_participants table)

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── join.php
frontend/
├── src/
│   └── components/
│       └── JoinSessionButton.jsx
database/
└── schema.sql
```

---

## Feature 9: Complete Cooking Step
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Complete │     │ Complete │     │  Mark    │
│   Step   │     │   Step   │     │  Step    │
│  Button  │     │   API    │     │ Complete │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Record Completion      │
       │                │                │
       │                ▼                │
       │         Return Next Step       │
       │                │                │
       ▼                ▼                ▼
  Update Progress  Log Completion  Step Completed
```

**Files Needed:**
- `frontend/src/components/CompleteStepButton.jsx`
- `backend/api/session/complete-step.php`
- `database/schema.sql` (step_completions table)

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── complete-step.php
frontend/
├── src/
│   └── components/
│       └── CompleteStepButton.jsx
database/
└── schema.sql
```

---

## Feature 10: Like Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│   Like   │     │   Like   │     │  Record  │
│  Button  │     │   API    │     │  Like    │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Toggle Like Status     │
       │                │                │
       │                ▼                │
       │         Return Updated Count   │
       │                │                │
       ▼                ▼                ▼
  Update Count    Log Interaction   Like Recorded
```

**Files Needed:**
- `frontend/src/components/LikeButton.jsx`
- `backend/api/recipe/like.php`
- `database/schema.sql` (likes table)

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── like.php
frontend/
├── src/
│   └── components/
│       └── LikeButton.jsx
database/
└── schema.sql
```

---

## Feature 11: Save Recipe to Cookbook
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│   Save   │     │   Save   │     │  Add to  │
│  Button  │     │   API    │     │ Cookbook │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Save Recipe            │
       │                │                │
       │                ▼                │
       │         Return Success         │
       │                │                │
       ▼                ▼                ▼
  Show Confirmation Log Save      Recipe Saved
```

**Files Needed:**
- `frontend/src/components/SaveRecipeButton.jsx`
- `backend/api/cookbook/save.php`
- `database/schema.sql` (cookbooks table)

**Directory Structure:**
```
backend/
├── api/
│   └── cookbook/
│       └── save.php
frontend/
├── src/
│   └── components/
│       └── SaveRecipeButton.jsx
database/
└── schema.sql
```

---

## Feature 12: View Cookbook
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Cookbook │     │ Cookbook │     │  Fetch   │
│   Page   │     │   API    │     │ Saved    │
│          │     │          │     │ Recipes  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Saved Recipes      │
       │                │                │
       │                ▼                │
       │         Return Recipe List     │
       │                │                │
       ▼                ▼                ▼
  Display List    Log Request      Data Retrieved
```

**Files Needed:**
- `frontend/src/pages/CookbookPage.jsx`
- `backend/api/cookbook/list.php`

**Directory Structure:**
```
backend/
├── api/
│   └── cookbook/
│       └── list.php
frontend/
├── src/
│   └── pages/
│       └── CookbookPage.jsx
```

---

## Feature 13: Purchase Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Purchase │     │ Purchase │     │  Check   │
│  Button  │     │   API    │     │ Balance  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Process Payment        │
       │                │                │
       │                ▼                │
       │         Return Success         │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Transaction  Balance Updated
```

**Files Needed:**
- `frontend/src/components/PurchaseButton.jsx`
- `backend/api/purchase/recipe.php`
- `database/schema.sql` (user_balance and purchases tables)

**Directory Structure:**
```
backend/
├── api/
│   └── purchase/
│       └── recipe.php
frontend/
├── src/
│   └── components/
│       └── PurchaseButton.jsx
database/
└── schema.sql
```

---

## Feature 14: Shop Item Purchase
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Shop    │     │  Shop    │     │  Check   │
│ Purchase │     │ Purchase │     │ Balance  │
│          │     │   API    │     │ & Stock  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Buy Shop Item          │
       │                │                │
       │                ▼                │
       │         Return Item & Balance  │
       │                │                │
       ▼                ▼                ▼
  Update UI       Log Purchase    Inventory Updated
```

**Files Needed:**
- `frontend/src/pages/ShopPage.jsx`
- `frontend/src/components/ShopItem.jsx`
- `backend/api/shop/purchase.php`
- `database/schema.sql` (shop_items and inventory tables)

**Directory Structure:**
```
backend/
├── api/
│   └── shop/
│       └── purchase.php
frontend/
├── src/
│   ├── pages/
│   │   └── ShopPage.jsx
│   └── components/
│       └── ShopItem.jsx
database/
└── schema.sql
```

---

## Feature 15: Send Chat Message
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│   Chat   │     │   Chat   │     │  Save    │
│  Input   │     │   API    │     │ Message  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Save Message           │
       │                │                │
       │                ▼                │
       │         Return Message ID      │
       │                │                │
       ▼                ▼                ▼
  Display Message  Log Message     Message Saved
```

**Files Needed:**
- `frontend/src/components/ChatInput.jsx`
- `frontend/src/components/ChatMessage.jsx`
- `backend/api/chat/send.php`
- `database/schema.sql` (chat_messages table)

**Directory Structure:**
```
backend/
├── api/
│   └── chat/
│       └── send.php
frontend/
├── src/
│   └── components/
│       ├── ChatInput.jsx
│       └── ChatMessage.jsx
database/
└── schema.sql
```

---

## Feature 16: View Activity Feed
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Activity │     │ Activity │     │  Fetch   │
│  Feed    │     │   Feed   │     │ Activities
│  Page    │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Recent Activities  │
       │                │                │
       │                ▼                │
       │         Return Activity List   │
       │                │                │
       ▼                ▼                ▼
  Display Feed    Log Request      Data Retrieved
```

**Files Needed:**
- `frontend/src/pages/ActivityPage.jsx`
- `backend/api/activity/feed.php`
- `database/schema.sql` (activities table)

**Directory Structure:**
```
backend/
├── api/
│   └── activity/
│       └── feed.php
frontend/
├── src/
│   └── pages/
│       └── ActivityPage.jsx
database/
└── schema.sql
```

---

## Feature 17: Follow User
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Follow  │     │  Follow  │     │  Create  │
│  Button  │     │   API    │     │ Following│
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Toggle Follow Status   │
       │                │                │
       │                ▼                │
       │         Return Updated Status  │
       │                │                │
       ▼                ▼                ▼
  Update Button    Log Follow      Relationship
                   Activity         Recorded
```

**Files Needed:**
- `frontend/src/components/FollowButton.jsx`
- `backend/api/user/follow.php`
- `database/schema.sql` (follows table)

**Directory Structure:**
```
backend/
├── api/
│   └── user/
│       └── follow.php
frontend/
├── src/
│   └── components/
│       └── FollowButton.jsx
database/
└── schema.sql
```

---

## Feature 18: Level Up Notification
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Check   │     │  Check   │     │  Check   │
│  Level   │     │  Level   │     │   XP     │
│          │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Check XP & Level       │
       │                │                │
       │                ▼                │
       │         Return Level Status    │
       │                │                │
       ▼                ▼                ▼
  Show Level Up   Log Level Up    Update User Level
  Animation
```

**Files Needed:**
- `frontend/src/components/LevelUpNotification.jsx`
- `backend/api/user/check-level.php`
- `database/schema.sql` (user_stats table with level/XP fields)

**Directory Structure:**
```
backend/
├── api/
│   └── user/
│       └── check-level.php
frontend/
├── src/
│   └── components/
│       └── LevelUpNotification.jsx
database/
└── schema.sql
```

---

## Feature 19: Daily Login Bonus
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Login   │     │  Login   │     │  Check   │
│          │     │  Bonus   │     │ Last Login
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Award Daily Bonus      │
       │                │                │
       │                ▼                │
       │         Return Bonus Details   │
       │                │                │
       ▼                ▼                ▼
  Show Bonus      Log Bonus       Update Streak &
  Notification                    Award Currency
```

**Files Needed:**
- `backend/api/user/daily-bonus.php`
- Modify: `backend/api/login.php` to call bonus check

**Directory Structure:**
```
backend/
├── api/
│   └── user/
│       └── daily-bonus.php
```

---

## Feature 20: View Home Page
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Home    │     │  Home    │     │  Fetch   │
│  Page    │     │   API    │     │ Multiple │
│          │     │          │     │  Data    │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Featured Content   │
       │                │                │
       │                ▼                │
       │         Return Home Data       │
       │                │                │
       ▼                ▼                ▼
  Display Home    Log Home Visit    Data Retrieved
```

**Files Needed:**
- `frontend/src/pages/HomePage.jsx`
- `backend/api/home.php`

**Directory Structure:**
```
backend/
├── api/
│   └── home.php
frontend/
├── src/
│   └── pages/
│       └── HomePage.jsx

---

## Feature 21: Edit User Profile
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Profile  │     │ Profile  │     │  Update  │
│   Edit   │     │  Update  │     │  User    │
│   Form   │     │   API    │     │  Record  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Validate & Update      │
       │                │                │
       │                ▼                │
       │         Return Updated Data    │
       │                │                │
       ▼                ▼                ▼
  Update UI       Log Update      Profile Updated
```

**Files Needed:**
- `frontend/src/components/EditProfileForm.jsx`
- `backend/api/user/update.php`

**Directory Structure:**
```
backend/
├── api/
│   └── user/
│       └── update.php
frontend/
├── src/
│   └── components/
│       └── EditProfileForm.jsx
```

---

## Feature 22: Delete Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Delete  │     │  Delete  │     │  Remove  │
│  Recipe  │     │  Recipe  │     │  Recipe  │
│  Button  │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Verify Ownership       │
       │                │                │
       │                ▼                │
       │         Delete Recipe          │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Deletion     Recipe Deleted
  & Redirect
```

**Files Needed:**
- `frontend/src/components/DeleteRecipeButton.jsx`
- `backend/api/recipe/delete.php`

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── delete.php
frontend/
├── src/
│   └── components/
│       └── DeleteRecipeButton.jsx
```

---

## Feature 23: Search Recipes
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Search  │     │  Search  │     │  Search  │
│   Bar    │     │   API    │     │ Recipes  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Search by Query        │
       │                │                │
       │                ▼                │
       │         Return Results         │
       │                │                │
       ▼                ▼                ▼
  Display Results  Log Search      Data Retrieved
```

**Files Needed:**
- `frontend/src/components/SearchBar.jsx`
- `backend/api/recipe/search.php`

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── search.php
frontend/
├── src/
│   └── components/
│       └── SearchBar.jsx
```

---

## Feature 24: Filter Recipes
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Filter  │     │  Filter  │     │  Apply   │
│ Controls │     │   API    │     │ Filters  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Apply Filters          │
       │                │                │
       │                ▼                │
       │         Return Filtered List   │
       │                │                │
       ▼                ▼                ▼
  Update Display  Log Filter      Data Retrieved
```

**Files Needed:**
- `frontend/src/components/RecipeFilters.jsx`
- Modify: `backend/api/recipe/list.php` to handle filters

**Directory Structure:**
```
frontend/
├── src/
│   └── components/
│       └── RecipeFilters.jsx
```

---

## Feature 25: Rate Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Rating  │     │  Rating  │     │  Save    │
│  Stars   │     │   API    │     │  Rating  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Save Rating            │
       │                │                │
       │                ▼                │
       │         Return Avg Rating      │
       │                │                │
       ▼                ▼                ▼
  Update Stars    Log Rating      Rating Saved
```

**Files Needed:**
- `frontend/src/components/RatingStars.jsx`
- `backend/api/recipe/rate.php`
- `database/schema.sql` (ratings table)

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── rate.php
frontend/
├── src/
│   └── components/
│       └── RatingStars.jsx
database/
└── schema.sql
```

---

## Feature 26: Add Recipe Comment
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Comment │     │  Comment │     │  Save    │
│   Form   │     │   API    │     │ Comment  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Save Comment           │
       │                │                │
       │                ▼                │
       │         Return Comment         │
       │                │                │
       ▼                ▼                ▼
  Display Comment Log Comment      Comment Saved
```

**Files Needed:**
- `frontend/src/components/CommentForm.jsx`
- `frontend/src/components/CommentItem.jsx`
- `backend/api/recipe/comment.php`
- `database/schema.sql` (comments table)

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── comment.php
frontend/
├── src/
│   └── components/
│       ├── CommentForm.jsx
│       └── CommentItem.jsx
database/
└── schema.sql
```

---

## Feature 27: Upload Recipe Image
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│  File    │
│          │     │          │     │  System  │
│  Image   │     │  Upload  │     │          │
│  Upload  │     │   API    │     │  Save    │
│          │     │          │     │  Image   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Validate & Save        │
       │                │                │
       │                ▼                │
       │         Return Image URL       │
       │                │                │
       ▼                ▼                ▼
  Display Image   Log Upload      Image Saved
```

**Files Needed:**
- `frontend/src/components/ImageUpload.jsx`
- `backend/api/upload/image.php`
- `backend/uploads/` directory

**Directory Structure:**
```
backend/
├── api/
│   └── upload/
│       └── image.php
├── uploads/
│   └── recipes/
frontend/
├── src/
│   └── components/
│       └── ImageUpload.jsx
```

---

## Feature 28: Share Recipe
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Share   │     │  Share   │     │  Record  │
│  Button  │     │   API    │     │  Share   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Generate Share Link    │
       │                │                │
       │                ▼                │
       │         Return Share Data      │
       │                │                │
       ▼                ▼                ▼
  Show Share      Log Share       Share Count
  Options Dialog                  Incremented
```

**Files Needed:**
- `frontend/src/components/ShareButton.jsx`
- `backend/api/recipe/share.php`

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── share.php
frontend/
├── src/
│   └── components/
│       └── ShareButton.jsx
```

---

## Feature 29: View Recipe Statistics
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Stats   │     │  Stats   │     │  Fetch   │
│  Tab     │     │   API    │     │  Stats   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Recipe Stats       │
       │                │                │
       │                ▼                │
       │         Return Statistics      │
       │                │                │
       ▼                ▼                ▼
  Display Stats    Log View        Data Retrieved
  (Views, Cooks,
   Saves, etc.)
```

**Files Needed:**
- `frontend/src/components/RecipeStats.jsx`
- `backend/api/recipe/stats.php`

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── stats.php
frontend/
├── src/
│   └── components/
│       └── RecipeStats.jsx
```

---

## Feature 30: Session Timer
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Timer   │     │  Timer   │     │  Save    │
│  Widget  │     │   API    │     │  Timer   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Start/Pause Timer      │
       │                │                │
       │                ▼                │
       │         Return Timer State     │
       │                │                │
       ▼                ▼                ▼
  Update Timer    Log Timer       Timer State
  Display         Action          Saved
```

**Files Needed:**
- `frontend/src/components/SessionTimer.jsx`
- `backend/api/session/timer.php`

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── timer.php
frontend/
├── src/
│   └── components/
│       └── SessionTimer.jsx
```

---

## Feature 31: Ingredient Checklist
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Check   │     │  Check   │     │  Update  │
│  List    │     │   API    │     │  Status  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Toggle Check Status    │
       │                │                │
       │                ▼                │
       │         Return Updated List    │
       │                │                │
       ▼                ▼                ▼
  Update Check    Log Progress     Status Updated
  Marks
```

**Files Needed:**
- `frontend/src/components/IngredientChecklist.jsx`
- `backend/api/session/checklist.php`

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── checklist.php
frontend/
├── src/
│   └── components/
│       └── IngredientChecklist.jsx
```

---

## Feature 32: Session Notes
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Notes   │     │  Notes   │     │  Save    │
│  Editor  │     │   API    │     │  Notes   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Save/Update Notes      │
       │                │                │
       │                ▼                │
       │         Return Saved Notes     │
       │                │                │
       ▼                ▼                ▼
  Show Saved      Log Note Save    Notes Saved
  Confirmation
```

**Files Needed:**
- `frontend/src/components/SessionNotes.jsx`
- `backend/api/session/notes.php`

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── notes.php
frontend/
├── src/
│   └── components/
│       └── SessionNotes.jsx
```

---

## Feature 33: Cooking Session Voting
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Vote    │     │  Vote    │     │  Record  │
│  Buttons │     │   API    │     │   Vote   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Cast Vote              │
       │                │                │
       │                ▼                │
       │         Return Vote Result     │
       │                │                │
       ▼                ▼                ▼
  Update Vote     Log Vote        Vote Recorded
  Display
```

**Files Needed:**
- `frontend/src/components/VoteButtons.jsx`
- `backend/api/session/vote.php`

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── vote.php
frontend/
├── src/
│   └── components/
│       └── VoteButtons.jsx
```

---

## Feature 34: Session Completion Rewards
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Complete │     │ Complete │     │ Calculate│
│ Session  │     │ Session  │     │ Rewards  │
│ Button   │     │   API    │     │ & Update │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Award Rewards          │
       │                │                │
       │                ▼                │
       │         Return Rewards         │
       │                │                │
       ▼                ▼                ▼
  Show Rewards    Log Completion  User Stats
  Animation                       Updated
```

**Files Needed:**
- `frontend/src/components/SessionComplete.jsx`
- `backend/api/session/complete.php`

**Directory Structure:**
```
backend/
├── api/
│   └── session/
│       └── complete.php
frontend/
├── src/
│   └── components/
│       └── SessionComplete.jsx
```

---

## Feature 35: Inventory Management
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Inventory│     │ Inventory│     │  Update  │
│   Page   │     │   API    │     │ Inventory│
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Use/Equip Item         │
       │                │                │
       │                ▼                │
       │         Return Updated Inv     │
       │                │                │
       ▼                ▼                ▼
  Update Display  Log Inventory   Inventory
                   Action          Updated
```

**Files Needed:**
- `frontend/src/pages/InventoryPage.jsx`
- `backend/api/inventory/manage.php`

**Directory Structure:**
```
backend/
├── api/
│   └── inventory/
│       └── manage.php
frontend/
├── src/
│   └── pages/
│       └── InventoryPage.jsx
```

---

## Feature 36: User Notifications
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Bell    │     │  Notif   │     │  Fetch   │
│  Icon    │     │   API    │     │ Notifs   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Notifications      │
       │                │                │
       │                ▼                │
       │         Return Notif List      │
       │                │                │
       ▼                ▼                ▼
  Show Notif      Log Request      Mark as Read
  Dropdown                         if requested
```

**Files Needed:**
- `frontend/src/components/NotificationBell.jsx`
- `backend/api/notifications/list.php`

**Directory Structure:**
```
backend/
├── api/
│   └── notifications/
│       └── list.php
frontend/
├── src/
│   └── components/
│       └── NotificationBell.jsx
```

---

## Feature 37: User Settings
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Settings │     │ Settings │     │  Update  │
│   Page   │     │   API    │     │ Settings │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Update Settings        │
       │                │                │
       │                ▼                │
       │         Return Updated         │
       │                │                │
       ▼                ▼                ▼
  Show Confirmation Log Settings   Settings Saved
                   Update
```

**Files Needed:**
- `frontend/src/pages/SettingsPage.jsx`
- `backend/api/user/settings.php`

**Directory Structure:**
```
backend/
├── api/
│   └── user/
│       └── settings.php
frontend/
├── src/
│   └── pages/
│       └── SettingsPage.jsx
```

---

## Feature 38: Password Reset
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Forgot   │     │  Reset   │     │  Update  │
│ Password │     │   API    │     │ Password │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Send Reset Email       │
       │                │                │
       │                ▼                │
       │         Return Success         │
       │                │                │
       ▼                ▼                ▼
  Show Email Sent Log Reset       Token Generated
  Message          Request        & Stored
```

**Files Needed:**
- `frontend/src/pages/ForgotPasswordPage.jsx`
- `backend/api/auth/reset-password.php`

**Directory Structure:**
```
backend/
├── api/
│   └── auth/
│       └── reset-password.php
frontend/
├── src/
│   └── pages/
│       └── ForgotPasswordPage.jsx
```

---

## Feature 39: Email Verification
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Verify   │     │  Verify  │     │  Mark    │
│   Page   │     │   API    │     │ Verified │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Check Token           │
       │                │                │
       │                ▼                │
       │         Verify Account        │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Verification Account Verified
```

**Files Needed:**
- `frontend/src/pages/VerifyEmailPage.jsx`
- `backend/api/auth/verify-email.php`

**Directory Structure:**
```
backend/
├── api/
│   └── auth/
│       └── verify-email.php
frontend/
├── src/
│   └── pages/
│       └── VerifyEmailPage.jsx
```

---

## Feature 40: Recipe Export/Print
**Flow:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│  Export  │     │  Export  │     │  Fetch   │
│  Button  │     │   API    │     │ Recipe   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Format for Export      │
       │                │                │
       │                ▼                │
       │         Return Formatted Data  │
       │                │                │
       ▼                ▼                ▼
  Download/Print  Log Export      Data Retrieved
  Recipe
```

**Files Needed:**
- `frontend/src/components/ExportRecipeButton.jsx`
- `backend/api/recipe/export.php`

**Directory Structure:**
```
backend/
├── api/
│   └── recipe/
│       └── export.php
frontend/
├── src/
│   └── components/
│       └── ExportRecipeButton.jsx
```

---