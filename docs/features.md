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
       │         Validate Input         │
       │                │                │
       │                │                │
       │                ▼                │
       │         Return User ID         │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Activity     User Created
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for RegisterPage
- `frontend/src/index.js` - App entry point
- `frontend/src/api/axiosConfig.js` - Axios API configuration
- `frontend/src/styles/index.css` - Import component styles
- `frontend/src/styles/components.css` - RegisterForm styles
- `frontend/src/styles/pages.css` - RegisterPage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Users table structure

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/RegisterPage.jsx` - Registration page component
- `frontend/src/components/RegisterForm.jsx` - Registration form component
- `backend/api/register.php` - User registration API endpoint
- `backend/utils/validation.php` - Input validation utilities

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
       │      Verify Credentials        │
       │                │                │
       │                ▼                │
       │         Return User Data       │
       │                │                │
       ▼                ▼                ▼
  Store User ID   Return Success   Update Last Login
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for LoginPage
- `frontend/src/api/axiosConfig.js` - Configure API calls
- `frontend/src/styles/index.css` - Import CSS files
- `frontend/src/styles/components.css` - LoginForm styles
- `frontend/src/styles/pages.css` - LoginPage styles
- `backend/db/connection.php` - Database connection
- `backend/utils/validation.php` - Input validation
- `database/schema.sql` - Users table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/LoginPage.jsx` - Login page component
- `frontend/src/components/LoginForm.jsx` - Login form component
- `backend/api/login.php` - User login API endpoint

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
└── schema.sql
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
       │     Check User Session        │
       │                │                │
       │                ▼                │
       │         Return Profile         │
       │                │                │
       ▼                ▼                ▼
  Display Data    Log Request      Data Retrieved
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for ProfilePage
- `frontend/src/api/axiosConfig.js` - Configure user API calls
- `frontend/src/styles/index.css` - Import CSS files
- `frontend/src/styles/pages.css` - ProfilePage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Add profile fields and user_stats table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/ProfilePage.jsx` - User profile page component
- `backend/api/profile.php` - User profile API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for CreateRecipePage
- `frontend/src/api/axiosConfig.js` - Recipe API calls
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeForm styles
- `frontend/src/styles/pages.css` - CreateRecipePage styles
- `backend/db/connection.php` - Database connection
- `backend/utils/validation.php` - Recipe validation
- `database/schema.sql` - Recipes, ingredients, steps tables

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/CreateRecipePage.jsx` - Recipe creation page
- `frontend/src/components/RecipeForm.jsx` - Recipe form component
- `backend/api/recipe/create.php` - Recipe creation API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for RecipesPage
- `frontend/src/api/axiosConfig.js` - Recipe list API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeCard styles
- `frontend/src/styles/pages.css` - RecipesPage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Ensure recipes table exists

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/RecipesPage.jsx` - Recipe list page
- `frontend/src/components/RecipeCard.jsx` - Recipe card component
- `backend/api/recipe/list.php` - Recipe list API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for RecipeDetailPage
- `frontend/src/api/axiosConfig.js` - Recipe detail API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - RecipeDetailPage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Recipe details tables

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/RecipeDetailPage.jsx` - Recipe detail page
- `backend/api/recipe/get.php` - Single recipe API endpoint

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

Perfect! Here's Feature 7 expanded with the subtasks you requested, using the existing .md syntax:

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for CookingSessionPage
- `frontend/src/api/axiosConfig.js` - Session API calls
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - CookingSessionPage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Cooking_sessions table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/CookingSessionPage.jsx` - Cooking session page
- `backend/api/session/create.php` - Session creation API endpoint

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

## Feature 7.1: Session Type Selection Modal

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │     │          │     │          │
│          │     │          │     │          │
│  Recipe  │     │   Show   │     │   User   │
│  Detail  │────▶│ Session  │────▶│ Selects  │
│   Page   │     │  Type    │     │   Type   │
│          │     │  Modal   │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │                ▼                │
       │         Based on Selection     │
       │                │                │
       │                ▼                │
       │     Create Solo or Multiplayer │
       │                │                │
       ▼                ▼                ▼
  Create Solo      Create Multi      Redirect to
  Session          Session &         Appropriate
                   Show Session      Page
                   Code for
                   Sharing
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/pages/RecipeDetailPage.jsx` - Add modal trigger
- `frontend/src/styles/components.css` - Modal styles
- `database/schema.sql` - Add session_type field

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/SessionTypeModal.jsx` - Session type selection modal
- `backend/api/session/create.php` - Update to handle session_type parameter

**Directory Structure:**

```
frontend/
├── src/
│   ├── styles/
│   │   └── components.css
│   ├── components/
│   │   └── SessionTypeModal.jsx
│   └── pages/
│       └── RecipeDetailPage.jsx
backend/
├── api/
│   └── session/
│       └── create.php
database/
└── schema.sql
```

---

## Feature 7.2: Solo Cooking Session

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│   Solo   │     │  Create  │     │ Create   │
│ Session  │     │  Solo    │     │  Solo    │
│  Choice  │     │ Session  │     │ Session  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │    Create Solo Session         │
       │    (type: solo, private)       │
       │                │                │
       │                ▼                │
       │         Return Session ID      │
       │                │                │
       ▼                ▼                ▼
  Redirect to     Log Solo        Session Created
  Solo Cooking    Session         with Solo Flag
  Session Page    Creation
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `backend/api/session/create.php` - Handle solo session creation
- `database/schema.sql` - Add session_type and visibility fields

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/SoloCookingPage.jsx` - Solo cooking session page
- Modify: `frontend/src/pages/CookingSessionPage.jsx` - Rename to MultiplayerCookingPage.jsx

**Directory Structure:**

```
frontend/
├── src/
│   ├── pages/
│   │   ├── SoloCookingPage.jsx
│   │   └── MultiplayerCookingPage.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── create.php
database/
└── schema.sql
```

---

## Feature 7.3: Multiplayer Session Creation

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Multi-   │     │  Create  │     │ Create   │
│ player   │     │  Multi   │     │  Multi   │
│ Session  │     │ Session  │     │ Session  │
│ Choice   │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │  Create Multi Session          │
       │  (type: multiplayer, public)   │
       │                │                │
       │                ▼                │
       │   Return Session ID + Code     │
       │                │                │
       ▼                ▼                ▼
  Show Session     Log Multi      Session Created
  Code & Share     Session        with Multi Flag
  Options          Creation       & Join Code
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `backend/api/session/create.php` - Handle multiplayer session creation
- `database/schema.sql` - Add join_code field

**Files Created:**
*Create these new files for this feature:*

- `backend/api/session/generate-code.php` - Generate unique session code
- `frontend/src/components/SessionShareModal.jsx` - Share session code modal

**Directory Structure:**

```
frontend/
├── src/
│   ├── components/
│   │   └── SessionShareModal.jsx
│   └── pages/
│       └── MultiplayerCookingPage.jsx
backend/
├── api/
│   └── session/
│       ├── create.php
│       └── generate-code.php
database/
└── schema.sql
```

---

## Feature 7.4: Session Code Generation

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │     │ Backend  │     │ Database │
│          │     │          │     │          │
│ Request  │────▶│Generate  │────▶│ Check    │
│ Session  │     │  Unique  │     │ Code     │
│  Code    │     │   Code   │     │ Uniqueness
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │                ▼                │
       │         Generate 6-char Code   │
       │                │                │
       │                ▼                │
       │       Verify Not in Use        │
       │                │                │
       ▼                ▼                ▼
  Receive Unique  Log Code        Store Code
  Session Code    Generation      with Session
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `backend/api/session/create.php` - Call code generator
- `database/schema.sql` - Ensure join_code is unique

**Files Created:**
*Create these new files for this feature:*

- `backend/api/session/generate-code.php` - Code generation endpoint
- `backend/utils/code-generator.php` - Reusable code generator

**Directory Structure:**

```
backend/
├── api/
│   └── session/
│       ├── create.php
│       └── generate-code.php
├── utils/
│   └── code-generator.php
├── db/
│   └── connection.php
database/
└── schema.sql
```

---

## Feature 7.5: Session Invitation Sharing

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │     │          │     │          │
│          │     │          │     │          │
│  Share   │────▶│ Display  │────▶│  User    │
│ Session  │     │  Share   │     │ Copies   │
│  Button  │     │ Options  │     │ Code or  │
│          │     │          │     │  Link    │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │                ▼                │
       │    Show: Code, Link, QR Code   │
       │                │                │
       │                ▼                │
       │         User Selects Method    │
       │                │                │
       ▼                ▼                ▼
  Copy to         Log Share      Invitation
  Clipboard       Action         Sent/Shared
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/components/SessionShareModal.jsx` - Add share functionality
- `frontend/src/styles/components.css` - Share modal styles

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/ShareOptions.jsx` - Share options component
- `frontend/src/utils/copyToClipboard.js` - Clipboard utility

**Directory Structure:**

```
frontend/
├── src/
│   ├── components/
│   │   ├── SessionShareModal.jsx
│   │   └── ShareOptions.jsx
│   ├── utils/
│   │   └── copyToClipboard.js
│   └── styles/
│       └── components.css
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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - JoinSessionButton styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Session_participants table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/JoinSessionButton.jsx` - Join session button component
- `backend/api/session/join.php` - Join session API endpoint

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

## Feature 8.1: Sessions List Page

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Sessions │     │ Sessions │     │  Fetch   │
│   List   │     │   List   │     │  Active  │
│   Page   │     │   API    │     │ Sessions │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │         Get Active Sessions    │
       │                │                │
       │                ▼                │
       │         Return Session List    │
       │                │                │
       ▼                ▼                ▼
  Display List    Log Request      Data Retrieved
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for SessionsPage
- `frontend/src/api/axiosConfig.js` - Sessions API calls
- `frontend/src/styles/pages.css` - SessionsPage styles

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/SessionsPage.jsx` - Sessions list page
- `backend/api/session/list.php` - Active sessions API endpoint

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   └── pages.css
│   ├── pages/
│   │   └── SessionsPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── session/
│       └── list.php
├── db/
│   └── connection.php
database/
└── schema.sql
```

---

## Feature 8.2: Session Detail Page

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Session  │     │ Session  │     │  Fetch   │
│  Detail  │     │  Detail  │     │ Session  │
│   Page   │     │   API    │     │ & Players│
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │    Get Session + Participants  │
       │                │                │
       │                ▼                │
       │         Return Full Data       │
       │                │                │
       ▼                ▼                ▼
  Display Details Log View        Data Retrieved
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for SessionDetailPage
- `frontend/src/api/axiosConfig.js` - Session detail API
- `frontend/src/styles/pages.css` - SessionDetailPage styles
- `database/schema.sql` - Add status field to participants

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/SessionDetailPage.jsx` - Session detail page
- `backend/api/session/detail.php` - Session detail API endpoint

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   └── pages.css
│   ├── pages/
│   │   └── SessionDetailPage.jsx
│   ├── App.js
│   └── index.js
backend/
├── api/
│   └── session/
│       └── detail.php
├── db/
│   └── connection.php
database/
└── schema.sql
```

---

## Feature 8.3: Player Ready Status

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│ Ready/Not│     │  Ready   │     │ Update   │
│  Button  │     │   API    │     │ Status   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │    Toggle Ready Status         │
       │                │                │
       │                ▼                │
       │    Return Updated Status       │
       │                │                │
       ▼                ▼                ▼
  Update Button    Log Status      Status Updated
                   Change
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/components.css` - ReadyButton styles
- `database/schema.sql` - Add ready_status field

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/ReadyButton.jsx` - Ready button component
- `backend/api/session/ready.php` - Ready status API endpoint

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   └── components.css
│   ├── components/
│   │   └── ReadyButton.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── ready.php
├── db/
│   └── connection.php
database/
└── schema.sql
```

---

## Feature 8.4: Host Kick Player

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│   Kick   │     │   Kick   │     │ Remove   │
│  Button  │     │   API    │     │ Player   │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │    Verify Host Permission      │
       │                │                │
       │                ▼                │
       │         Remove Participant     │
       │                │                │
       ▼                ▼                ▼
  Remove Player    Log Kick       Player Removed
  from UI
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/components.css` - KickButton styles
- `database/schema.sql` - Ensure session ownership

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/KickButton.jsx` - Kick button component
- `backend/api/session/kick.php` - Kick player API endpoint

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   └── components.css
│   ├── components/
│   │   └── KickButton.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── kick.php
├── db/
│   └── connection.php
database/
└── schema.sql
```

---

## Feature 8.5: Host Start Session

**Flow:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Database │
│          │     │          │     │          │
│   Start  │     │  Start   │     │ Update   │
│ Session  │     │ Session  │     │ Session  │
│  Button  │     │   API    │     │  Status  │
└──────────┘     └──────────┘     └──────────┘
       │                │                │
       │                │                │
       │    Verify Host & Readiness     │
       │                │                │
       │                ▼                │
       │    Mark Session as Started     │
       │                │                │
       ▼                ▼                ▼
  Redirect to     Log Start       Status Updated
  Cooking Page                    & Timer Started
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/components.css` - StartSessionButton styles
- `database/schema.sql` - Add session_status field

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/StartSessionButton.jsx` - Start session button
- `backend/api/session/start.php` - Start session API endpoint

**Directory Structure:**

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── styles/
│   │   └── components.css
│   ├── components/
│   │   └── StartSessionButton.jsx
│   └── App.js
backend/
├── api/
│   └── session/
│       └── start.php
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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - CompleteStepButton styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Step_completions table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/CompleteStepButton.jsx` - Complete step button component
- `backend/api/session/complete-step.php` - Complete step API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - LikeButton styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Likes table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/LikeButton.jsx` - Like button component
- `backend/api/recipe/like.php` - Recipe like API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Cookbook API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SaveRecipeButton styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Cookbooks table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/SaveRecipeButton.jsx` - Save recipe button component
- `backend/api/cookbook/save.php` - Cookbook save API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for CookbookPage
- `frontend/src/api/axiosConfig.js` - Cookbook API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - CookbookPage styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/CookbookPage.jsx` - Cookbook page component
- `backend/api/cookbook/list.php` - Cookbook list API endpoint

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
       │         Process Purchase       │
       │                │                │
       │                ▼                │
       │         Return Success         │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Transaction  Balance Updated
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Purchase API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - PurchaseButton styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - User_balance and purchases tables

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/PurchaseButton.jsx` - Purchase button component
- `backend/api/purchase/recipe.php` - Recipe purchase API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for ShopPage
- `frontend/src/api/axiosConfig.js` - Shop API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ShopItem styles
- `frontend/src/styles/pages.css` - ShopPage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Shop_items and inventory tables

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/ShopPage.jsx` - Shop page component
- `frontend/src/components/ShopItem.jsx` - Shop item component
- `backend/api/shop/purchase.php` - Shop purchase API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Chat API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - Chat components styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Chat_messages table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/ChatInput.jsx` - Chat input component
- `frontend/src/components/ChatMessage.jsx` - Chat message component
- `backend/api/chat/send.php` - Chat send API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for ActivityPage
- `frontend/src/api/axiosConfig.js` - Activity API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - ActivityPage styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Activities table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/ActivityPage.jsx` - Activity feed page
- `backend/api/activity/feed.php` - Activity feed API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - FollowButton styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Follows/user_relationships table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/FollowButton.jsx` - Follow button component
- `backend/api/user/follow.php` - Follow user API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - LevelUpNotification styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - User_stats table with level/XP fields

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/LevelUpNotification.jsx` - Level up notification component
- `backend/api/user/check-level.php` - Level check API endpoint

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
*What existing files should be referenced or modified?*

- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Add last_login and streak tracking

**Files Created:**
*Create these new files for this feature:*

- `backend/api/user/daily-bonus.php` - Daily bonus API endpoint
- Modify: `backend/api/login.php` to call bonus check

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add home route
- `frontend/src/api/axiosConfig.js` - Home API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - HomePage styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/HomePage.jsx` - Home page component
- `backend/api/home.php` - Home API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - EditProfileForm styles
- `backend/db/connection.php` - Database connection
- `backend/utils/validation.php` - Profile validation

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/EditProfileForm.jsx` - Edit profile form component
- `backend/api/user/update.php` - User update API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - DeleteRecipeButton styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/DeleteRecipeButton.jsx` - Delete recipe button component
- `backend/api/recipe/delete.php` - Recipe delete API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SearchBar styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/SearchBar.jsx` - Search bar component
- `backend/api/recipe/search.php` - Recipe search API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeFilters styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/RecipeFilters.jsx` - Recipe filters component
- Modify: `backend/api/recipe/list.php` to handle filters

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RatingStars styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Ratings table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/RatingStars.jsx` - Rating stars component
- `backend/api/recipe/rate.php` - Recipe rating API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - Comment components styles
- `backend/db/connection.php` - Database connection
- `database/schema.sql` - Comments table

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/CommentForm.jsx` - Comment form component
- `frontend/src/components/CommentItem.jsx` - Comment item component
- `backend/api/recipe/comment.php` - Recipe comment API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Upload API with multipart/form-data
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ImageUpload styles
- `backend/db/connection.php` - Database connection
- `backend/uploads/` directory - Image storage

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/ImageUpload.jsx` - Image upload component
- `backend/api/upload/image.php` - Image upload API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ShareButton styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/ShareButton.jsx` - Share button component
- `backend/api/recipe/share.php` - Recipe share API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - RecipeStats styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/RecipeStats.jsx` - Recipe statistics component
- `backend/api/recipe/stats.php` - Recipe statistics API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SessionTimer styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/SessionTimer.jsx` - Session timer component
- `backend/api/session/timer.php` - Session timer API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - IngredientChecklist styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/IngredientChecklist.jsx` - Ingredient checklist component
- `backend/api/session/checklist.php` - Checklist API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SessionNotes styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/SessionNotes.jsx` - Session notes component
- `backend/api/session/notes.php` - Session notes API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - VoteButtons styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/VoteButtons.jsx` - Vote buttons component
- `backend/api/session/vote.php` - Session vote API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Session API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - SessionComplete styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/SessionComplete.jsx` - Session complete component
- `backend/api/session/complete.php` - Session complete API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for InventoryPage
- `frontend/src/api/axiosConfig.js` - Inventory API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - InventoryPage styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/InventoryPage.jsx` - Inventory page component
- `backend/api/inventory/manage.php` - Inventory management API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Notifications API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - NotificationBell styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/NotificationBell.jsx` - Notification bell component
- `backend/api/notifications/list.php` - Notifications list API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for SettingsPage
- `frontend/src/api/axiosConfig.js` - User API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - SettingsPage styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/SettingsPage.jsx` - Settings page component
- `backend/api/user/settings.php` - User settings API endpoint

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
       │    Generate Reset Link        │
       │                │                │
       │                ▼                │
       │         Return Success         │
       │                │                │
       ▼                ▼                ▼
  Show Email Sent Log Reset       Reset Link
  Message          Request        Generated
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for ForgotPasswordPage
- `frontend/src/api/axiosConfig.js` - Auth API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - ForgotPasswordPage styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/ForgotPasswordPage.jsx` - Forgot password page
- `backend/api/auth/reset-password.php` - Password reset API endpoint

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
       │    Check Verification Code    │
       │                │                │
       │                ▼                │
       │         Verify Account        │
       │                │                │
       ▼                ▼                ▼
  Show Success    Log Verification Account Verified
```

**Files Needed:**
*What existing files should be referenced or modified?*

- `frontend/src/App.js` - Add route for VerifyEmailPage
- `frontend/src/api/axiosConfig.js` - Auth API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/pages.css` - VerifyEmailPage styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/pages/VerifyEmailPage.jsx` - Email verification page
- `backend/api/auth/verify-email.php` - Email verification API endpoint

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
*What existing files should be referenced or modified?*

- `frontend/src/api/axiosConfig.js` - Recipe API
- `frontend/src/styles/index.css` - Import CSS
- `frontend/src/styles/components.css` - ExportRecipeButton styles
- `backend/db/connection.php` - Database connection

**Files Created:**
*Create these new files for this feature:*

- `frontend/src/components/ExportRecipeButton.jsx` - Export recipe button component
- `backend/api/recipe/export.php` - Recipe export API endpoint

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

---