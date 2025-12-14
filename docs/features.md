# Changelog

- Updated features.md to include all core application files and proper dependency tracking
- Added required files for each feature including:
  - `frontend/src/api/axiosConfig.js` - Axios configuration
  - `frontend/src/styles/index.css` - Unified CSS imports
  - `frontend/src/styles/components.css` - Component styles
  - `frontend/src/styles/pages.css` - Page styles
  - `frontend/src/App.js` - Main React application
  - `frontend/src/index.js` - React entry point

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

- `frontend/src/App.js` - Add route for RegisterPage
- `frontend/src/index.js` - App entry point
- `frontend/src/api/axiosConfig.js` - Axios API configuration
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/components/RegisterForm.jsx`
- `frontend/src/styles/index.css` - Import component styles
- `frontend/src/styles/components.css` - RegisterForm styles
- `frontend/src/styles/pages.css` - RegisterPage styles
- `backend/api/register.php`
- `backend/db/connection.php`
- `backend/utils/validation.php`
- `database/schema.sql` (users table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── pages/
│   │   └── RegisterPage.jsx
│   ├── components/
│   │   └── RegisterForm.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── register.php
├── db/
│   └── connection.php
├── utils/
│   └── validation.php
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

- `frontend/src/App.js` - Add route for LoginPage
- `frontend/src/api/axiosConfig.js` - Configure API calls
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/components/LoginForm.jsx`
- `frontend/src/styles/index.css` - Import CSS files
- `frontend/src/styles/components.css` - LoginForm styles
- `frontend/src/styles/pages.css` - LoginPage styles
- `backend/api/login.php`
- `backend/db/connection.php` - Database connection
- `backend/utils/validation.php` - Password validation

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── pages/
│   │   └── LoginPage.jsx
│   ├── components/
│   │   └── LoginForm.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── login.php
├── db/
│   └── connection.php
├── utils/
│   └── validation.php
database/
└── schema.sql (user_tokens table)
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

- `frontend/src/App.js` - Add protected route for ProfilePage
- `frontend/src/api/axiosConfig.js` - Configure auth headers
- `frontend/src/pages/ProfilePage.jsx`
- `frontend/src/styles/index.css` - Import CSS files
- `frontend/src/styles/pages.css` - ProfilePage styles
- `backend/api/profile.php`
- `backend/db/connection.php`
- `database/schema.sql` - Add profile fields, user_stats, user_achievements, user_tokens tables

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── ProfilePage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── profile.php
├── db/
│   └── connection.php
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

- `frontend/src/App.js` - Add route for CreateRecipePage
- `frontend/src/api/axiosConfig.js` - Recipe API calls
- `frontend/src/pages/CreateRecipePage.jsx`
- `frontend/src/components/RecipeForm.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeForm styles
- `frontend/src/styles/pages.css` - CreateRecipePage styles
- `backend/api/recipe/create.php`
- `backend/db/connection.php`
- `backend/utils/validation.php` - Recipe validation
- `database/schema.sql` (recipes, ingredients, steps tables)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── pages/
│   │   └── CreateRecipePage.jsx
│   ├── components/
│   │   └── RecipeForm.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── recipe/
│       └── create.php
├── db/
│   └── connection.php
├── utils/
│   └── validation.php
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

- `frontend/src/App.js` - Add route for RecipesPage
- `frontend/src/api/axiosConfig.js` - Recipe list API
- `frontend/src/pages/RecipesPage.jsx`
- `frontend/src/components/RecipeCard.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeCard styles
- `frontend/src/styles/pages.css` - RecipesPage styles
- `backend/api/recipe/list.php`
- `backend/db/connection.php`
- `database/schema.sql` - Ensure recipes table exists

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── pages/
│   │   └── RecipesPage.jsx
│   ├── components/
│   │   └── RecipeCard.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── recipe/
│       └── list.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/App.js` - Add route for RecipeDetailPage
- `frontend/src/api/axiosConfig.js` - Recipe detail API
- `frontend/src/pages/RecipeDetailPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - RecipeDetailPage styles
- `backend/api/recipe/get.php`
- `backend/db/connection.php`
- `database/schema.sql` (recipe details tables: ingredients, steps, etc.)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── RecipeDetailPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── recipe/
│       └── get.php
├── db/
│   └── connection.php
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

- `frontend/src/App.js` - Add route for CookingSessionPage
- `frontend/src/api/axiosConfig.js` - Session API calls
- `frontend/src/pages/CookingSessionPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - CookingSessionPage styles
- `backend/api/session/create.php`
- `backend/db/connection.php`
- `database/schema.sql` (cooking_sessions table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── CookingSessionPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── session/
│       └── create.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/JoinSessionButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - JoinSessionButton styles
- `backend/api/session/join.php`
- `backend/db/connection.php`
- `database/schema.sql` (session_participants table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── JoinSessionButton.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── join.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/CompleteStepButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - CompleteStepButton styles
- `backend/api/session/complete-step.php`
- `backend/db/connection.php`
- `database/schema.sql` (step_completions table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── CompleteStepButton.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── complete-step.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/LikeButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - LikeButton styles
- `backend/api/recipe/like.php`
- `backend/db/connection.php`
- `database/schema.sql` (likes table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── LikeButton.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── like.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Cookbook API
- `frontend/src/components/SaveRecipeButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SaveRecipeButton styles
- `backend/api/cookbook/save.php`
- `backend/db/connection.php`
- `database/schema.sql` (cookbooks table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── SaveRecipeButton.jsx
│   └── App.js
backend/
├── api/
│   └── cookbook/
│       └── save.php
├── db/
│   └── connection.php
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

- `frontend/src/App.js` - Add route for CookbookPage
- `frontend/src/api/axiosConfig.js` - Cookbook API
- `frontend/src/pages/CookbookPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - CookbookPage styles
- `backend/api/cookbook/list.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── CookbookPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── cookbook/
│       └── list.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Purchase API
- `frontend/src/components/PurchaseButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - PurchaseButton styles
- `backend/api/purchase/recipe.php`
- `backend/db/connection.php`
- `database/schema.sql` (user_balance and purchases tables)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── PurchaseButton.jsx
│   └── App.js
backend/
├── api/
│   └── purchase/
│       └── recipe.php
├── db/
│   └── connection.php
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

- `frontend/src/App.js` - Add route for ShopPage
- `frontend/src/api/axiosConfig.js` - Shop API
- `frontend/src/pages/ShopPage.jsx`
- `frontend/src/components/ShopItem.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ShopItem styles
- `frontend/src/styles/pages.css` - ShopPage styles
- `backend/api/shop/purchase.php`
- `backend/db/connection.php`
- `database/schema.sql` (shop_items and inventory tables)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── pages.css
│   ├── pages/
│   │   └── ShopPage.jsx
│   ├── components/
│   │   └── ShopItem.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── shop/
│       └── purchase.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Chat API
- `frontend/src/components/ChatInput.jsx`
- `frontend/src/components/ChatMessage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - Chat components styles
- `backend/api/chat/send.php`
- `backend/db/connection.php`
- `database/schema.sql` (chat_messages table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   ├── ChatInput.jsx
│   │   └── ChatMessage.jsx
│   └── App.js
backend/
├── api/
│   └── chat/
│       └── send.php
├── db/
│   └── connection.php
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

- `frontend/src/App.js` - Add route for ActivityPage
- `frontend/src/api/axiosConfig.js` - Activity API
- `frontend/src/pages/ActivityPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - ActivityPage styles
- `backend/api/activity/feed.php`
- `backend/db/connection.php`
- `database/schema.sql` (activities table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── ActivityPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── activity/
│       └── feed.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/components/FollowButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - FollowButton styles
- `backend/api/user/follow.php`
- `backend/db/connection.php`
- `database/schema.sql` (follows/user_relationships table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── FollowButton.jsx
│   └── App.js
backend/
├── api/
│   └── user/
│       └── follow.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/components/LevelUpNotification.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - LevelUpNotification styles
- `backend/api/user/check-level.php`
- `backend/db/connection.php`
- `database/schema.sql` (user_stats table with level/XP fields)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── LevelUpNotification.jsx
│   └── App.js
backend/
├── api/
│   └── user/
│       └── check-level.php
├── db/
│   └── connection.php
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
- `backend/db/connection.php`
- `database/schema.sql` - Add last_login and streak tracking

**Directory Structure:**

```
backend/
├── api/
│   ├── login.php
│   └── user/
│       └── daily-bonus.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/App.js` - Add home route
- `frontend/src/api/axiosConfig.js` - Home API
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - HomePage styles
- `backend/api/home.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── HomePage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── home.php
├── db/
│   └── connection.php
database/
└── schema.sql
```

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

- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/components/EditProfileForm.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - EditProfileForm styles
- `backend/api/user/update.php`
- `backend/db/connection.php`
- `backend/utils/validation.php` - Profile validation

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── EditProfileForm.jsx
│   └── App.js
backend/
├── api/
│   └── user/
│       └── update.php
├── db/
│   └── connection.php
├── utils/
│   └── validation.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/DeleteRecipeButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - DeleteRecipeButton styles
- `backend/api/recipe/delete.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── DeleteRecipeButton.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── delete.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/SearchBar.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SearchBar styles
- `backend/api/recipe/search.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── SearchBar.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── search.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/RecipeFilters.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeFilters styles
- Modify: `backend/api/recipe/list.php` to handle filters
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── RecipeFilters.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── list.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/RatingStars.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RatingStars styles
- `backend/api/recipe/rate.php`
- `backend/db/connection.php`
- `database/schema.sql` (ratings table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── RatingStars.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── rate.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/CommentForm.jsx`
- `frontend/src/components/CommentItem.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - Comment components styles
- `backend/api/recipe/comment.php`
- `backend/db/connection.php`
- `database/schema.sql` (comments table)

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   ├── CommentForm.jsx
│   │   └── CommentItem.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── comment.php
├── db/
│   └── connection.php
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

- `frontend/src/api/axiosConfig.js` - Upload API with multipart/form-data
- `frontend/src/components/ImageUpload.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ImageUpload styles
- `backend/api/upload/image.php`
- `backend/uploads/` directory
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── ImageUpload.jsx
│   └── App.js
backend/
├── api/
│   └── upload/
│       └── image.php
├── uploads/
│   └── recipes/
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/ShareButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ShareButton styles
- `backend/api/recipe/share.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── ShareButton.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── share.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/RecipeStats.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeStats styles
- `backend/api/recipe/stats.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── RecipeStats.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── stats.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/SessionTimer.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SessionTimer styles
- `backend/api/session/timer.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── SessionTimer.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── timer.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/IngredientChecklist.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - IngredientChecklist styles
- `backend/api/session/checklist.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── IngredientChecklist.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── checklist.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/SessionNotes.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SessionNotes styles
- `backend/api/session/notes.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── SessionNotes.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── notes.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/VoteButtons.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - VoteButtons styles
- `backend/api/session/vote.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── VoteButtons.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── vote.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/components/SessionComplete.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SessionComplete styles
- `backend/api/session/complete.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── SessionComplete.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── complete.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/App.js` - Add route for InventoryPage
- `frontend/src/api/axiosConfig.js` - Inventory API
- `frontend/src/pages/InventoryPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - InventoryPage styles
- `backend/api/inventory/manage.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── InventoryPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── inventory/
│       └── manage.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Notifications API
- `frontend/src/components/NotificationBell.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - NotificationBell styles
- `backend/api/notifications/list.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── NotificationBell.jsx
│   └── App.js
backend/
├── api/
│   └── notifications/
│       └── list.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/App.js` - Add route for SettingsPage
- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/pages/SettingsPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - SettingsPage styles
- `backend/api/user/settings.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── SettingsPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── user/
│       └── settings.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/App.js` - Add route for ForgotPasswordPage
- `frontend/src/api/axiosConfig.js` - Auth API
- `frontend/src/pages/ForgotPasswordPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - ForgotPasswordPage styles
- `backend/api/auth/reset-password.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── ForgotPasswordPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── auth/
│       └── reset-password.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/App.js` - Add route for VerifyEmailPage
- `frontend/src/api/axiosConfig.js` - Auth API
- `frontend/src/pages/VerifyEmailPage.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - VerifyEmailPage styles
- `backend/api/auth/verify-email.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── pages.css
│   ├── pages/
│   │   └── VerifyEmailPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── auth/
│       └── verify-email.php
├── db/
│   └── connection.php
database/
└── schema.sql
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

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/components/ExportRecipeButton.jsx`
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ExportRecipeButton styles
- `backend/api/recipe/export.php`
- `backend/db/connection.php`

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components.css
│   ├── components/
│   │   └── ExportRecipeButton.jsx
│   └── App.js
backend/
├── api/
│   └── recipe/
│       └── export.php
├── db/
│   └── connection.php
database/
└── schema.sql
```