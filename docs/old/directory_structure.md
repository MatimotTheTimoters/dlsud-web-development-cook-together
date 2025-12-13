<details> 
<summary>Frontend</summary>
frontend/
├── .env
├── .gitignore
├── package.json
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src/
    ├── App.jsx
    ├── index.js
    ├── setupTests.js
    ├── api/
    │   ├── activity.js
    │   ├── auth.js
    │   ├── chat.js
    │   ├── cookbooks.js
    │   ├── cooking-sessions.js
    │   ├── inventory.js
    │   ├── purchase.js
    │   ├── recipes.js
    │   ├── relationships.js
    │   ├── shop.js
    │   └── users.js
    ├── assets/
    │   ├── fonts/
    │   └── images/
    │       ├── backgrounds/
    │       ├── icons/
    │       └── illustrations/
    ├── components/
    │   ├── auth/
    │   │   ├── LoginForm.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── RegisterForm.jsx
    │   ├── common/
    │   │   ├── ErrorBoundary.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── Navigation.jsx
    │   ├── cooking/
    │   │   ├── CookingSession.jsx
    │   │   ├── ParticipantList.jsx
    │   │   ├── SessionTimer.jsx
    │   │   ├── SessionChat.jsx
    │   │   └── StepProgress.jsx
    │   ├── gamification/
    │   │   ├── CurrencyDisplay.jsx
    │   │   ├── LevelProgress.jsx
    │   │   ├── RewardNotification.jsx
    │   │   └── ShopItem.jsx
    │   ├── inventory/
    │   │   ├── InventoryItem.jsx
    │   │   └── InventoryList.jsx
    │   ├── purchase/
    │   │   └── PurchaseModal.jsx
    │   ├── recipes/
    │   │   ├── IngredientList.jsx
    │   │   ├── RecipeCard.jsx
    │   │   ├── RecipeDetail.jsx
    │   │   ├── RecipeForm.jsx
    │   │   ├── RecipeList.jsx
    │   │   └── StepList.jsx
    │   └── users/
    │       ├── FollowButton.jsx
    │       ├── StatsDisplay.jsx
    │       ├── UserCard.jsx
    │       └── UserProfile.jsx
    ├── contexts/
    │   ├── AuthContext.jsx
    │   ├── DataContext.jsx
    │   └── NotificationContext.jsx
    ├── hooks/
    │   ├── useApi.js
    │   ├── useAuth.js
    │   ├── useForm.js
    │   └── useLocalStorage.js
    ├── pages/
    │   ├── CookbooksPage.jsx
    │   ├── CookingSessionPage.jsx
    │   ├── CreateRecipePage.jsx
    │   ├── DiscoverPage.jsx
    │   ├── HomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── ProfilePage.jsx
    │   ├── RecipeDetailPage.jsx
    │   ├── RecipesPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── SessionHistoryPage.jsx
    │   └── ShopPage.jsx
    ├── styles/
    │   ├── components.css
    │   ├── index.css
    │   ├── layout.css
    │   ├── themes.css
    │   └── utilities.css
    └── utils/
        ├── api.js
        ├── constants.js
        ├── formatters.js
        ├── helpers.js
        ├── upload.js
        ├── userCalculations.js
        └── validators.js
</details>

<details>
<summary>Backend</summary>
backend/
├── .htaccess
├── index.php
├── api/
│   ├── activity/
│   │   └── feed.php
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   ├── me.php
│   │   ├── refresh-token.php
│   │   └── register.php
│   ├── chat/
│   │   └── messages.php
│   ├── cookbooks/
│   │   ├── add-recipe.php
│   │   ├── create.php
│   │   ├── index.php
│   │   ├── remove-recipe.php
│   │   └── show.php
│   ├── cooking-sessions/
│   │   ├── complete-step.php
│   │   ├── create.php
│   │   ├── index.php
│   │   ├── join.php
│   │   ├── show.php
│   │   ├── update.php
│   │   └── vote.php
│   ├── inventory/
│   │   ├── equip.php
│   │   ├── list.php
│   │   └── use.php
│   ├── recipes/
│   │   ├── access.php
│   │   ├── create.php
│   │   ├── delete.php
│   │   ├── index.php
│   │   ├── interact.php
│   │   ├── purchase.php
│   │   ├── show.php
│   │   └── update.php
│   ├── relationships/
│   │   ├── follow.php
│   │   ├── friends.php
│   │   └── list.php
│   ├── sessions/
│   │   └── history.php
│   ├── shop/
│   │   ├── items.php
│   │   └── purchase.php
│   ├── upload/
│   │   └── image.php
│   └── users/
│       ├── profile.php
│       ├── search.php
│       ├── stats.php
│       └── update.php
├── classes/
│   ├── AuthHelper.php
│   ├── DatabaseHelper.php
│   ├── ResponseFormatter.php
│   └── UserCalculations.php
├── config/
│   ├── cors.php
│   ├── database.php
│   └── environment.php
├── database/
│   ├── schema.sql
│   └── seeds.sql
├── uploads/
│   ├── profile-pictures/
│   ├── recipe-images/
│   └── step-images/
└── utils/
    ├── fileUpload.php
    ├── logging.php
    ├── uuidHelper.php
    └── validation.php
</details>