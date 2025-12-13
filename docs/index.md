# 🎮 Features

## 👤 User Account Features

### 1. User Registration
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ RegisterForm│────▶│register.php │────▶│ users table │
│ .jsx        │     │             │     │             │
│             │     │ AuthHelper  │     │ User_Stats  │
│ submit form │     │ .php        │     │ table       │
│ with user   │     │             │     │             │
│ data        │     │ validate &  │     │ Insert new  │
│             │     │ hash pass   │     │ user record │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              generate JWT              │
       │              token & return            │
       │                    │                    │
       │                    │                    │
       │                    ▼                    │
       │              Response with             │
       │              user data & token         │
       │                    │                    │
       ▼                    ▼                    ▼
  Store token       Log activity        User created
  in localStorage   in logging.php      with default
                      │                  stats
                      ▼
                Return success
```

**Files & Functions:**
- **Frontend:** `RegisterForm.jsx` → `handleSubmit()` → `api/auth.js` → `register()`
- **Backend:** `api/auth/register.php` → `AuthHelper.php` → `hashPassword()`, `generateToken()`
- **Database:** `users` table (insert), `user_stats` table (insert default stats)

### 2. User Login
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ LoginForm   │────▶│ login.php   │────▶│ users table │
│ .jsx        │     │             │     │             │
│             │     │ AuthHelper  │     │ user_stats  │
│ submit      │     │ .php        │     │ table       │
│ credentials │     │             │     │             │
│             │     │ verify pass │     │ Select user │
│             │     │ & generate  │     │ & stats     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              validate &                │
       │              create token              │
       │                    │                    │
       │                    │                    │
       │                    ▼                    │
       │              Update login              │
       │              streak in stats           │
       │                    │                    │
       │                    ▼                    ▼
       │              Response with             │
       │              user data, stats & token │
       │                    │                    │
       ▼                    ▼                    ▼
  Store token       Log activity        Update login
  in AuthContext    in logging.php      streak count
```

**Files & Functions:**
- **Frontend:** `LoginForm.jsx` → `handleSubmit()` → `api/auth.js` → `login()`
- **Backend:** `api/auth/login.php` → `AuthHelper.php` → `verifyPassword()`, `generateToken()`
- **Database:** `users` table (select), `user_stats` table (update login_streak)

### 3. Edit User Profile
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ UserProfile │────▶│ update.php  │────▶│ users table │
│ .jsx        │     │             │     │             │
│             │     │ validation  │     │             │
│ Submit      │     │ .php        │     │ Validate &  │
│ profile     │     │             │     │ update user │
│ updates     │     │ AuthHelper  │     │ record      │
│             │     │ .php        │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate token            │
       │              & permissions             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    │
       │              Process image             │
       │              upload if present         │
       │                    │                    │
       │                    ▼                    ▼
       │              Update user              │
       │              record in DB             │
       │                    │                    │
       │                    ▼                    │
       │              Return updated           │
       │              user profile             │
       │                    │                    │
       ▼                    ▼                    ▼
  Update UI with      Log activity        Profile updated
  new profile data    in logging.php      successfully
```

**Files & Functions:**
- **Frontend:** `UserProfile.jsx` → `handleProfileUpdate()` → `api/users.js` → `updateProfile()`
- **Backend:** `api/users/update.php` → `validation.php` → `validateEmail()`, `fileUpload.php` → `uploadImage()`
- **Database:** `users` table (update)

## 🧑‍🍳 Recipe Features

### 4. Create Recipe
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ RecipeForm  │────▶│ create.php  │────▶│ recipes     │
│ .jsx        │     │             │     │ table       │
│             │     │ Database-   │     │             │
│ Submit      │     │ Helper.php  │     │ recipe_     │
│ recipe data │     │             │     │ ingredients │
│ with        │     │ uuidHelper  │     │ table       │
│ ingredients │     │ .php        │     │             │
│ & steps     │     │             │     │ recipe_steps│
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate input            │
       │              & user auth               │
       │                    │                    │
       │                    │                    │
       │                    ▼                    │
       │              Generate recipe           │
       │              ID & calculate            │
       │              rewards                   │
       │                    │                    │
       │                    ▼                    ▼
       │              Insert recipe             │
       │              master record             │
       │                    │                    │
       │                    ▼                    ▼
       │              Insert ingredients        │
       │              & steps records           │
       │                    │                    │
       │                    ▼                    ▼
       │              Update recipe             │
       │              metadata & user           │
       │              stats                     │
       │                    │                    │
       ▼                    ▼                    ▼
  Show success       Return recipe      Recipe created
  message &          ID & rewards       with all related
  redirect to                           data
  recipe page
```

**Files & Functions:**
- **Frontend:** `RecipeForm.jsx` → `handleSubmit()` → `api/recipes.js` → `createRecipe()`
- **Backend:** `api/recipes/create.php` → `DatabaseHelper.php` → `createRecipe()`, `UserCalculations.php` → `calculateRecipeRewards()`
- **Database:** `recipes`, `recipe_ingredients`, `recipe_steps`, `recipe_metadata` tables (insert)

### 5. View Recipe Details
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ RecipeDetail│────▶│ show.php    │────▶│ recipes     │
│ .jsx        │     │             │     │ table       │
│             │     │ Database-   │     │             │
│ Request     │     │ Helper.php  │     │ recipe_     │
│ recipe by   │     │             │     │ ingredients │
│ ID          │     │             │     │ table       │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check user                │
       │              access to recipe          │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Retrieve recipe           │
       │              with all related          │
       │              data (JOIN queries)       │
       │                    │                    │
       │                    ▼                    │
       │              Format response           │
       │              with complete             │
       │              recipe structure          │
       │                    │                    │
       ▼                    ▼                    ▼
  Display recipe      Return recipe      Data retrieved
  with all details    data in JSON       from multiple
  & interactions      format             tables
```

**Files & Functions:**
- **Frontend:** `RecipeDetail.jsx` → `loadRecipe()` → `api/recipes.js` → `getRecipe()`
- **Backend:** `api/recipes/show.php` → `DatabaseHelper.php` → `getRecipe()`
- **Database:** `recipes`, `recipe_ingredients`, `recipe_steps`, `recipe_metadata` tables (select with joins)

### 6. Purchase Recipe
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Purchase-   │────▶│ purchase.php│────▶│ user_stats  │
│ Modal.jsx   │     │             │     │ table       │
│             │     │ UserCalcul- │     │             │
│ User selects│     │ ations.php  │     │ user_recipe_│
│ currency &  │     │             │     │ access table│
│ confirms    │     │ Database-   │     │             │
│ purchase    │     │ Helper.php  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate user             │
       │              can afford recipe         │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Deduct currency           │
       │              from user stats           │
       │                    │                    │
       │                    ▼                    ▼
       │              Grant recipe              │
       │              access to user           │
       │                    │                    │
       │                    ▼                    ▼
       │              Update recipe             │
       │              purchase count            │
       │                    │                    │
       │                    ▼                    │
       │              Return success            │
       │              with updated              │
       │              balances                  │
       │                    │                    │
       ▼                    ▼                    ▼
  Show purchase       Log transaction    Currency deducted
  success &           & update activity  & access granted
  update UI           feed
```

**Files & Functions:**
- **Frontend:** `PurchaseModal.jsx` → `processPurchase()` → `api/purchase.js` → `purchaseRecipe()`
- **Backend:** `api/recipes/purchase.php` → `DatabaseHelper.php` → `purchaseRecipe()`, `UserCalculations.php` → `calculateMaxPrices()`
- **Database:** `user_stats` (update gold/gem count), `user_recipe_access` (insert), `recipe_metadata` (update purchase_count)

### 7. Recipe Interactions (Like/Save)
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ RecipeCard  │────▶│ interact.php│────▶│ recipe_     │
│ .jsx        │     │             │     │ interactions│
│             │     │ Database-   │     │ table       │
│ User clicks │     │ Helper.php  │     │             │
│ like/save   │     │             │     │ recipe_     │
│ button      │     │             │     │ metadata    │
│             │     │             │     │ table       │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check if user             │
       │              already interacted        │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Insert/update            │
       │              interaction record       │
       │                    │                    │
       │                    ▼                    ▼
       │              Update recipe            │
       │              like/save counts         │
       │                    │                    │
       │                    ▼                    │
       │              Return updated           │
       │              interaction counts       │
       │                    │                    │
       ▼                    ▼                    ▼
  Update button       Log interaction    Interaction
  state & counts      in activity feed   recorded &
                      │                  counts updated
                      ▼
                Return success
```

**Files & Functions:**
- **Frontend:** `RecipeCard.jsx` → `handleInteraction()` → `api/recipes.js` → `likeRecipe()`/`saveRecipe()`
- **Backend:** `api/recipes/interact.php` → `DatabaseHelper.php` → `handleRecipeInteraction()`
- **Database:** `recipe_interactions` (insert/update), `recipe_metadata` (update like_count/save_count)

## 🍳 Cooking Session Features

### 8. Create Cooking Session
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ RecipeDetail│────▶│ create.php  │────▶│ cooking_    │
│ .jsx        │     │             │     │ sessions    │
│             │     │ Database-   │     │ table       │
│ Click "Start│     │ Helper.php  │     │             │
│ Cooking"    │     │             │     │ cooking_    │
│ button      │     │ uuidHelper  │     │ session_    │
│             │     │ .php        │     │ details     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check user access         │
       │              to recipe                 │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Create session            │
       │              record with host          │
       │                    │                    │
       │                    ▼                    ▼
       │              Add host as               │
       │              participant               │
       │                    │                    │
       │                    ▼                    ▼
       │              Create session            │
       │              details record            │
       │                    │                    │
       │                    ▼                    │
       │              Return session            │
       │              ID & data                 │
       │                    │                    │
       ▼                    ▼                    ▼
  Redirect to        Log session        Session created
  session page       creation           with all initial
                      │                  data
                      ▼
                Return success
```

**Files & Functions:**
- **Frontend:** `RecipeDetail.jsx` → `handleStartCooking()` → `api/cooking-sessions.js` → `createSession()`
- **Backend:** `api/cooking-sessions/create.php` → `DatabaseHelper.php` → `createCookingSession()`
- **Database:** `cooking_sessions`, `cooking_session_details`, `cooking_session_participants` tables (insert)

### 9. Join Cooking Session
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Cooking-    │────▶│ join.php    │────▶│ cooking_    │
│ Session.jsx │     │             │     │ session_    │
│             │     │ Database-   │     │ participants│
│ Click "Join │     │ Helper.php  │     │ table       │
│ Session"    │     │             │     │             │
│ button      │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check session             │
       │              visibility & status       │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Check if user             │
       │              already joined            │
       │                    │                    │
       │                    ▼                    ▼
       │              Add participant           │
       │              record                    │
       │                    │                    │
       │                    ▼                    │
       │              Return updated            │
       │              participant list          │
       │                    │                    │
       │                    ▼                    │
       │              Send system               │
       │              chat message              │
       │                    │                    │
       ▼                    ▼                    ▼
  Update UI with      Log join activity  Participant added
  participant list    & notify host      to session
```

**Files & Functions:**
- **Frontend:** `CookingSession.jsx` → `handleJoin()` → `api/cooking-sessions.js` → `joinSession()`
- **Backend:** `api/cooking-sessions/join.php` → `DatabaseHelper.php` → `joinCookingSession()`
- **Database:** `cooking_session_participants` (insert), `session_chat_messages` (insert system message)

### 10. Complete Cooking Step
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Cooking-    │────▶│ complete-   │────▶│ cooking_    │
│ Session.jsx │     │ step.php    │     │ step_       │
│             │     │             │     │ completions │
│ Click       │     │ Database-   │     │ table       │
│ "Complete   │     │ Helper.php  │     │             │
│ Step"       │     │             │     │ cooking_    │
│             │     │ UserCalcul- │     │ session_    │
│             │     │ ations.php  │     │ details     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate user             │
       │              is in session             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Record step               │
       │              completion                │
       │                    │                    │
       │                    ▼                    ▼
       │              Calculate &               │
       │              award step rewards        │
       │                    │                    │
       │                    ▼                    ▼
       │              Update session            │
       │              progress                  │
       │                    │                    │
       │                    ▼                    │
       │              Check if all              │
       │              steps completed           │
       │                    │                    │
       │                    ▼                    ▼
       │              Complete session          │
       │              if finished               │
       │                    │                    │
       ▼                    ▼                    ▼
  Update progress      Return rewards   Step completion
  bar & show rewards   & next step      recorded & stats
  notification                          updated
```

**Files & Functions:**
- **Frontend:** `CookingSession.jsx` → `handleStepComplete()` → `api/cooking-sessions.js` → `completeStep()`
- **Backend:** `api/cooking-sessions/complete-step.php` → `DatabaseHelper.php` → `completeCookingStep()`, `UserCalculations.php` → `calculateStepRewards()`
- **Database:** `cooking_step_completions` (insert), `cooking_session_details` (update), `user_stats` (update exp/gold/gems)

## 🏪 Shop & Inventory Features

### 11. Purchase Shop Item
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ ShopItem.jsx│────▶│ purchase.php│────▶│ user_stats  │
│             │     │             │     │ table       │
│ Click       │     │ Database-   │     │             │
│ "Purchase"  │     │ Helper.php  │     │ user_       │
│ button      │     │             │     │ purchases   │
│             │     │             │     │ table       │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate user             │
       │              can afford item           │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Deduct currency           │
       │              from user stats           │
       │                    │                    │
       │                    ▼                    ▼
       │              Record purchase           │
       │              transaction               │
       │                    │                    │
       │                    ▼                    ▼
       │              Add item to user          │
       │              inventory                 │
       │                    │                    │
       │                    ▼                    │
       │              Update shop item          │
       │              purchase count            │
       │                    │                    │
       │                    ▼                    │
       │              Return success            │
       │              & updated balance         │
       │                    │                    │
       ▼                    ▼                    ▼
  Show purchase       Log transaction    Currency deducted
  success &           & send reward      & item added to
  update balance      notification       inventory
```

**Files & Functions:**
- **Frontend:** `ShopItem.jsx` → `purchaseItem()` → `api/shop.js` → `purchaseItem()`
- **Backend:** `api/shop/purchase.php` → `DatabaseHelper.php` → `purchaseShopItem()`
- **Database:** `user_stats` (update currency), `user_purchases` (insert), `user_inventory` (insert), `shop_items` (update purchase_count)

### 12. Use Inventory Item
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Inventory-  │────▶│ use.php     │────▶│ user_inventory│
│ Item.jsx    │     │             │     │ table       │
│             │     │ Database-   │     │             │
│ Click "Use  │     │ Helper.php  │     │ user_stats  │
│ Item"       │     │             │     │ table       │
│ button      │     │ UserCalcul- │     │             │
│             │     │ ations.php  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check item                │
       │              quantity & type           │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Apply item effect         │
       │              to user stats             │
       │                    │                    │
       │                    ▼                    ▼
       │              Reduce item               │
       │              quantity or remove        │
       │                    │                    │
       │                    ▼                    │
       │              Return updated            │
       │              stats & inventory         │
       │                    │                    │
       │                    ▼                    │
       │              Log consumable            │
       │              use in activity           │
       │                    │                    │
       ▼                    ▼                    ▼
  Show effect        Return success     Stats updated &
  notification &                        inventory reduced
  update UI
```

**Files & Functions:**
- **Frontend:** `InventoryItem.jsx` → `useItem()` → `api/inventory.js` → `useConsumable()`
- **Backend:** `api/inventory/use.php` → `DatabaseHelper.php` → `useInventoryItem()`, `UserCalculations.php` → `applyConsumableEffect()`
- **Database:** `user_inventory` (update quantity/delete), `user_stats` (update stats)

## 👥 Social Features

### 13. Follow User
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ FollowButton│────▶│ follow.php  │────▶│ user_       │
│ .jsx        │     │             │     │ relationships│
│             │     │ Database-   │     │ table       │
│ Click       │     │ Helper.php  │     │             │
│ "Follow"    │     │             │     │             │
│ button      │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check if already          │
       │              following/blocked         │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Create relationship       │
       │              record                    │
       │                    │                    │
       │                    ▼                    │
       │              Return updated            │
       │              relationship status       │
       │                    │                    │
       │                    ▼                    │
       │              Send notification         │
       │              to target user            │
       │                    │                    │
       │                    ▼                    │
       │              Log follow action         │
       │              in activity feed          │
       │                    │                    │
       ▼                    ▼                    ▼
  Update button      Return success     Relationship
  to "Following"                         created
```

**Files & Functions:**
- **Frontend:** `FollowButton.jsx` → `toggleFollow()` → `api/relationships.js` → `followUser()`/`unfollowUser()`
- **Backend:** `api/relationships/follow.php` → `DatabaseHelper.php` → `manageRelationship()`
- **Database:** `user_relationships` (insert/update/delete)

### 14. Send Friend Request
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ UserProfile │────▶│ friends.php │────▶│ user_       │
│ .jsx        │     │             │     │ relationships│
│             │     │ Database-   │     │ table       │
│ Click "Add  │     │ Helper.php  │     │             │
│ Friend"     │     │             │     │             │
│             │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check existing            │
       │              relationships             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Create friend             │
       │              request record            │
       │                    │                    │
       │                    ▼                    │
       │              Return request            │
       │              status                    │
       │                    │                    │
       │                    ▼                    │
       │              Send notification         │
       │              to target user            │
       │                    │                    │
       ▼                    ▼                    ▼
  Show "Request      Return success     Friend request
  Sent" status                           created with
                                         "pending" status
```

**Files & Functions:**
- **Frontend:** `UserProfile.jsx` → `sendFriendRequest()` → `api/relationships.js` → friend request functions
- **Backend:** `api/relationships/friends.php` → `DatabaseHelper.php` → `manageRelationship()`
- **Database:** `user_relationships` (insert with status='pending')

## 📖 Cookbook Features

### 15. Create Cookbook
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Cookbooks-  │────▶│ create.php  │────▶│ cookbooks   │
│ Page.jsx    │     │             │     │ table       │
│             │     │ Database-   │     │             │
│ Submit      │     │ Helper.php  │     │             │
│ cookbook    │     │             │     │             │
│ form        │     │ uuidHelper  │     │             │
│             │     │ .php        │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate input            │
       │              & permissions             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Create cookbook           │
       │              record                    │
       │                    │                    │
       │                    ▼                    │
       │              Return cookbook           │
       │              ID & data                 │
       │                    │                    │
       ▼                    ▼                    ▼
  Add to cookbook    Return success     Cookbook created
  list & show                           with owner info
  success message
```

**Files & Functions:**
- **Frontend:** `CookbooksPage.jsx` → `createCookbook()` → `api/cookbooks.js` → `createCookbook()`
- **Backend:** `api/cookbooks/create.php` → `DatabaseHelper.php` → `createCookbook()`
- **Database:** `cookbooks` table (insert)

### 16. Add Recipe to Cookbook
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ RecipeDetail│────▶│ add-recipe  │────▶│ cookbook_   │
│ .jsx        │     │ .php        │     │ recipes     │
│             │     │             │     │ table       │
│ Click "Add  │     │ Database-   │     │             │
│ to Cookbook"│     │ Helper.php  │     │             │
│             │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Check user owns           │
       │              cookbook & has            │
       │              recipe access             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Check if recipe           │
       │              already in cookbook       │
       │                    │                    │
       │                    ▼                    ▼
       │              Add recipe to             │
       │              cookbook                  │
       │                    │                    │
       │                    ▼                    │
       │              Return success            │
       │              & updated cookbook        │
       │                    │                    │
       ▼                    ▼                    ▼
  Show success       Log activity        Recipe added to
  message            in feed             cookbook
```

**Files & Functions:**
- **Frontend:** `RecipeDetail.jsx` → `addToCookbook()` → `api/cookbooks.js` → `addRecipeToCookbook()`
- **Backend:** `api/cookbooks/add-recipe.php` → `DatabaseHelper.php` → `manageCookbookRecipe()`
- **Database:** `cookbook_recipes` table (insert)

## 💬 Chat Features

### 17. Send Session Chat Message
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ SessionChat │────▶│ messages.php│────▶│ session_    │
│ .jsx        │     │             │     │ chat_messages│
│             │     │ Database-   │     │ table       │
│ User types  │     │ Helper.php  │     │             │
│ & sends     │     │             │     │             │
│ message     │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Validate user             │
       │              is in session             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Save message              │
       │              to database               │
       │                    │                    │
       │                    ▼                    │
       │              Return message            │
       │              with ID & timestamp       │
       │                    │                    │
       │                    ▼                    │
       │              Broadcast to              │
       │              other participants        │
       │                    │                    │
       ▼                    ▼                    ▼
  Add message to      Return success     Message saved
  chat display                            with sender info
```

**Files & Functions:**
- **Frontend:** `SessionChat.jsx` → `sendMessage()` → `api/chat.js` → `sendChatMessage()`
- **Backend:** `api/chat/messages.php` → `DatabaseHelper.php` → `saveChatMessage()`
- **Database:** `session_chat_messages` table (insert)

## 🎮 Gamification Features

### 18. Level Up
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Level-      │────▶│ (automatic) │────▶│ user_stats  │
│ Progress.jsx│     │ on various  │     │ table       │
│             │     │ actions     │     │             │
│ Shows level │     │ UserCalcul- │     │             │
│ progress    │     │ ations.php  │     │             │
│             │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              After any EXP              │
       │              earning action:            │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Check if EXP               │
       │              reaches next level         │
       │                    │                    │
       │                    ▼                    ▼
       │              Increment level            │
       │              & reset EXP                │
       │                    │                    │
       │                    ▼                    │
       │              Calculate new              │
       │              level requirements         │
       │                    │                    │
       │                    ▼                    ▼
       │              Award level-up             │
       │              rewards                    │
       │                    │                    │
       │                    ▼                    │
       │              Send level-up              │
       │              notification               │
       │                    │                    │
       ▼                    ▼                    ▼
  Show level-up      Return level-up    Level incremented
  animation &        data & rewards     & EXP reset
  rewards
```

**Files & Functions:**
- **Frontend:** `LevelProgress.jsx` → `calculateProgress()` → `utils/userCalculations.js` → `checkLevelUp()`
- **Backend:** `UserCalculations.php` → `checkLevelUp()` (called after any EXP update)
- **Database:** `user_stats` table (update level, current_exp, current_level_ceiling)

### 19. Daily Login Bonus
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ LoginForm   │────▶│ login.php   │────▶│ user_stats  │
│ .jsx        │     │             │     │ table       │
│             │     │ UserCalcul- │     │             │
│ User logs   │     │ ations.php  │     │             │
│ in          │     │             │     │             │
│             │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              After successful           │
       │              login:                     │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Check last login          │
       │              date                      │
       │                    │                    │
       │                    ▼                    ▼
       │              Calculate login           │
       │              streak                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Award daily               │
       │              login bonus               │
       │                    │                    │
       │                    ▼                    ▼
       │              Update login              │
       │              streak & rewards          │
       │                    │                    │
       │                    ▼                    │
       │              Return bonus              │
       │              notification              │
       │                    │                    │
       ▼                    ▼                    ▼
  Show daily         Return bonus       Streak & rewards
  bonus              details            updated
  notification
```

**Files & Functions:**
- **Frontend:** `LoginForm.jsx` → shows bonus notification from response
- **Backend:** `api/auth/login.php` → `UserCalculations.php` → `calculateDailyLoginBonus()`
- **Database:** `user_stats` table (update login_streak, gold_count, gem_count, current_exp)

## 📰 Activity Feed

### 20. View Activity Feed
**Flow Chart:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │     │   BACKEND   │     │  DATABASE   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ HomePage    │────▶│ feed.php    │────▶│ logging     │
│ .jsx        │     │             │     │ system &    │
│             │     │ Database-   │     │ various     │
│ Load home   │     │ Helper.php  │     │ activity    │
│ page        │     │             │     │ tables      │
│             │     │             │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       │              Get user's                 │
       │              following list             │
       │                    │                    │
       │                    │                    │
       │                    ▼                    ▼
       │              Query recent               │
       │              activities from            │
       │              multiple sources           │
       │                    │                    │
       │                    ▼                    ▼
       │              Format activities          │
       │              with user info             │
       │                    │                    │
       │                    ▼                    │
       │              Return paginated          │
       │              activity feed             │
       │                    │                    │
       ▼                    ▼                    ▼
  Display activity    Return activity    Activities
  feed with icons     feed JSON          aggregated from
  & timestamps                          multiple tables
```

**Files & Functions:**
- **Frontend:** `HomePage.jsx` → `getRecentActivities()` → `api/activity.js` → activity functions
- **Backend:** `api/activity/feed.php` → `DatabaseHelper.php` → `getActivityFeed()`
- **Database:** Multiple tables aggregated (recipe_interactions, cooking_sessions, user_relationships, etc.)

---

# 🏛️ Directory Structure

## ✨ Frontend
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

## ⚙️ Backend
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

---



# 📊 Database Schema

## Users Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | User's unique identifier |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Account creation date |
| **updated_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last update timestamp |
| **profile_picture** | `VARCHAR(500)` | `NULL` | URL to profile picture |
| **full_name** | `VARCHAR(255)` | `NOT NULL` | User's full name |
| **email** | `VARCHAR(255)` | `NOT NULL, UNIQUE` | User's email address |
| **password_hash** | `VARCHAR(255)` | `NOT NULL` | Securely hashed password |
| **age** | `INT` | `NULL` | User's age |
| **gender** | `ENUM('male','female','non-binary','other')` | `NULL` | User's gender |

## User_Stats Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Stats entry ID |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE` | Reference to user |
| **login_streak** | `INT` | `DEFAULT 0` | Consecutive login days |
| **level** | `INT` | `DEFAULT 1` | User's current level |
| **current_exp** | `INT` | `DEFAULT 0` | Current experience points |
| **current_level_ceiling** | `INT` | `DEFAULT 100` | EXP needed for next level |
| **gold_count** | `INT` | `DEFAULT 0` | Current gold balance |
| **gem_count** | `INT` | `DEFAULT 0` | Current gems balance |
| **recipes_created** | `INT` | `DEFAULT 0` | Total recipes created |
| **recipes_cooked** | `INT` | `DEFAULT 0` | Total recipes cooked |
| **challenges_completed** | `INT` | `DEFAULT 0` | Completed challenges |
| **recipes_sold** | `INT` | `DEFAULT 0` | Recipes sold to other users |
| **total_cooking_time** | `INT` | `DEFAULT 0` | Total minutes spent cooking |
| **max_exp_reward** | `INT` | `DEFAULT 100` | Maximum EXP reward per recipe |
| **max_gold_reward** | `INT` | `DEFAULT 50` | Maximum Gold reward per recipe |
| **max_gem_reward** | `INT` | `DEFAULT 5` | Maximum Gem reward per recipe |
| **max_gold_price** | `INT` | `DEFAULT 100` | Maximum Gold price for recipes |
| **max_gem_price** | `INT` | `DEFAULT 10` | Maximum Gem price for recipes |
| **last_limit_update** | `DATETIME` | `NULL` | When limits were last calculated |
| **UNIQUE KEY** | `(user_id)` | `UNIQUE` | One stats entry per user |

## User_Relationships Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Relationship entry ID |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | When relationship was created |
| **source_user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who initiated relationship |
| **target_user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User receiving relationship |
| **relationship_type** | `ENUM('following','friend','blocked')` | `NOT NULL` | Type of relationship |
| **status** | `ENUM('pending','accepted','rejected','cancelled')` | `DEFAULT 'pending'` | Status of relationship |
| **message** | `TEXT` | `NULL` | Optional message |
| **responded_at** | `DATETIME` | `NULL` | When request was responded to |
| **UNIQUE KEY** | `(source_user_id, target_user_id, relationship_type)` | `UNIQUE` | Prevent duplicate relationship types |

## Recipes Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Recipe's unique identifier |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Recipe creation date |
| **updated_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last update timestamp |
| **cover_image** | `VARCHAR(500)` | `NULL` | URL to recipe cover image |
| **title** | `VARCHAR(255)` | `NOT NULL` | Recipe title |
| **description** | `TEXT` | `NULL` | Recipe description |
| **origin** | `VARCHAR(100)` | `NULL` | Recipe origin/cuisine |
| **preparation_time** | `INT` | `NULL` | Preparation time in minutes |
| **cooking_time** | `INT` | `NULL` | Cooking time in minutes |
| **serving_size** | `INT` | `NULL` | Number of servings |
| **difficulty** | `ENUM('easy','medium','hard')` | `DEFAULT 'medium'` | Recipe difficulty |
| **is_paid** | `BOOLEAN` | `DEFAULT FALSE` | Whether recipe requires purchase |
| **is_public** | `BOOLEAN` | `DEFAULT TRUE` | Public visibility |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who created the recipe |

## Recipe_Metadata Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Metadata entry ID |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id) ON DELETE CASCADE` | Reference to recipe |
| **tags** | `TEXT` | `NULL` | Comma-separated tags |
| **exp_reward** | `INT` | `DEFAULT 0` | EXP reward for cooking |
| **gold_reward** | `INT` | `DEFAULT 0` | Gold reward for cooking |
| **gem_reward** | `INT` | `DEFAULT 0` | Gem reward for cooking |
| **gold_price** | `INT` | `DEFAULT 0` | Gold price to purchase |
| **gem_price** | `INT` | `DEFAULT 0` | Gem price to purchase |
| **purchase_count** | `INT` | `DEFAULT 0` | Number of times purchased |
| **like_count** | `INT` | `DEFAULT 0` | Number of likes |
| **dislike_count** | `INT` | `DEFAULT 0` | Number of dislikes |
| **cook_count** | `INT` | `DEFAULT 0` | Number of times cooked |
| **total_calories** | `DECIMAL(10,2)` | `DEFAULT 0` | Total calories in recipe |
| **total_protein** | `DECIMAL(10,2)` | `DEFAULT 0` | Total protein in recipe |
| **total_carbs** | `DECIMAL(10,2)` | `DEFAULT 0` | Total carbohydrates in recipe |
| **total_fat** | `DECIMAL(10,2)` | `DEFAULT 0` | Total fat in recipe |
| **UNIQUE KEY** | `(recipe_id)` | `UNIQUE` | One metadata entry per recipe |

## Recipe_Ingredients Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Ingredient entry ID |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id) ON DELETE CASCADE` | Reference to recipe |
| **name** | `VARCHAR(255)` | `NOT NULL` | Ingredient name |
| **amount** | `DECIMAL(8,2)` | `NULL` | Amount needed (numeric) |
| **unit** | `VARCHAR(50)` | `NULL` | Measurement unit |
| **notes** | `VARCHAR(255)` | `NULL` | Additional notes |
| **order_index** | `INT` | `NOT NULL` | Display order |
| **calories_per_unit** | `DECIMAL(10,2)` | `DEFAULT 0` | Calories per unit |
| **protein_per_unit** | `DECIMAL(10,2)` | `DEFAULT 0` | Protein per unit |
| **carbs_per_unit** | `DECIMAL(10,2)` | `DEFAULT 0` | Carbohydrates per unit |
| **fat_per_unit** | `DECIMAL(10,2)` | `DEFAULT 0` | Fat per unit |

## Recipe_Steps Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Step entry ID |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id) ON DELETE CASCADE` | Reference to recipe |
| **description** | `TEXT` | `NOT NULL` | Step instructions |
| **image** | `VARCHAR(500)` | `NULL` | Step image URL |
| **read_timer_duration** | `INT` | `DEFAULT 10` | Time to read description (seconds) |
| **timer_duration** | `INT` | `NULL` | Timer duration |
| **timer_unit** | `ENUM('seconds','minutes','hours')` | `DEFAULT 'seconds'` | Timer unit |
| **exp_reward** | `INT` | `DEFAULT 0` | EXP reward for completing step |
| **gold_reward** | `INT` | `DEFAULT 0` | Gold reward for completing step |
| **gem_reward** | `INT` | `DEFAULT 0` | Gem reward for completing step |
| **order_index** | `INT` | `NOT NULL` | Step sequence order |

## Recipe_Interactions Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Interaction entry ID |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Interaction timestamp |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who interacted |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id)` | Recipe interacted with |
| **interaction_type** | `ENUM('like','dislike','save')` | `NOT NULL` | Type of interaction |
| **metadata** | `JSON` | `NULL` | Additional interaction data |
| **UNIQUE KEY** | `(user_id, recipe_id, interaction_type)` | `UNIQUE` | Prevent duplicate interactions |

## User_Recipe_Purchases Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Access entry ID |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE` | User who has access |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id) ON DELETE CASCADE` | Accessible recipe |
| **purchased_at** | `DATETIME` | `NULL` | When recipe was purchased |
| **currency_used** | `ENUM('gold','gem')` | `NULL` | Currency used for purchase |
| **price_paid** | `INT` | `NULL` | Amount paid |
| **expires_at** | `DATETIME` | `NULL` | When access expires (NULL for permanent) |
| **UNIQUE KEY** | `(user_id, recipe_id)` | `UNIQUE` | Prevent duplicate access |

## Cooking_Sessions Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Session ID |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Session start time |
| **updated_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last update timestamp |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id)` | Reference to recipe |
| **host_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | Session host |
| **mode** | `ENUM('solo','multiplayer')` | `DEFAULT 'solo'` | Cooking session mode |
| **visibility** | `ENUM('private','friends_only','public')` | `DEFAULT 'private'` | Session visibility |
| **status** | `ENUM('planned','preparing','cooking','paused','completed','cancelled','abandoned')` | `DEFAULT 'planned'` | Session status |
| **started_at** | `DATETIME` | `NULL` | When cooking actually started |
| **paused_at** | `DATETIME` | `NULL` | When session was paused |
| **completed_at** | `DATETIME` | `NULL` | When session was completed |
| **notes** | `TEXT` | `NULL` | Session notes |

## Cooking_Session_Details Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Detail entry ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to cooking session |
| **current_step_index** | `INT` | `DEFAULT 0` | Current step being performed |
| **total_steps** | `INT` | `NOT NULL` | Total steps in recipe |
| **completed_steps** | `INT` | `DEFAULT 0` | Number of completed steps |
| **total_duration** | `INT` | `NULL` | Total session duration in seconds |
| **active_timer_step_id** | `VARCHAR(255)` | `NULL` | Current step with active timer |
| **timer_ends_at** | `DATETIME` | `NULL` | When current timer ends |
| **exp_earned** | `INT` | `DEFAULT 0` | EXP earned so far |
| **gold_earned** | `INT` | `DEFAULT 0` | Gold earned so far |
| **gems_earned** | `INT` | `DEFAULT 0` | Gems earned so far |
| **cook_duration** | `INT` | `NULL` | Cooking time in minutes |
| **UNIQUE KEY** | `(cooking_session_id)` | `UNIQUE` | One detail entry per session |

## Cooking_Session_Participants Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Participant entry ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to cooking session |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | Participant user |
| **role** | `ENUM('host','participant','spectator')` | `DEFAULT 'participant'` | User role in session |
| **status** | `ENUM('joined','ready','active','left')` | `DEFAULT 'joined'` | Participant status |
| **joined_at** | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | When user joined |
| **left_at** | `DATETIME` | `NULL` | When user left |
| **UNIQUE KEY** | `(cooking_session_id, user_id)` | `UNIQUE` | Prevent duplicate joins |

## Cooking_Step_Completions Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Completion ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to cooking session |
| **recipe_step_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipe_steps(id)` | Reference to recipe step |
| **step_index** | `INT` | `NOT NULL` | Step index in sequence |
| **completed_at** | `DATETIME` | `NULL` | When step was completed |
| **duration_seconds** | `INT` | `NULL` | Time taken for this step |
| **was_skipped** | `BOOLEAN` | `DEFAULT FALSE` | Whether step was skipped |
| **notes** | `TEXT` | `NULL` | Step-specific notes |
| **exp_earned** | `INT` | `DEFAULT 0` | EXP earned from this step |
| **gold_earned** | `INT` | `DEFAULT 0` | Gold earned from this step |
| **gems_earned** | `INT` | `DEFAULT 0` | Gems earned from this step |

## Cooking_Session_Votes Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Vote ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to cooking session |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who voted |
| **vote_type** | `ENUM('skip_read_timer','skip_step','other')` | `NOT NULL` | Type of vote |
| **vote_value** | `BOOLEAN` | `NOT NULL` | Vote value (true/false) |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Vote timestamp |
| **UNIQUE KEY** | `(cooking_session_id, user_id, vote_type)` | `UNIQUE` | One vote per user per type per session |

## Session_Chat_Messages Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Message ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to session |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | Message sender |
| **message** | `TEXT` | `NOT NULL` | Chat message content |
| **message_type** | `ENUM('text','system','vote')` | `DEFAULT 'text'` | Type of message |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Message timestamp |
| **is_read** | `BOOLEAN` | `DEFAULT FALSE` | Whether message was read |

## Cookbooks Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Cookbook ID |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| **updated_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last update timestamp |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | Cookbook owner |
| **name** | `VARCHAR(255)` | `NOT NULL` | Cookbook name |
| **description** | `TEXT` | `NULL` | Cookbook description |
| **is_public** | `BOOLEAN` | `DEFAULT FALSE` | Whether cookbook is public |

## Cookbook_Recipes Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Entry ID |
| **cookbook_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cookbooks(id) ON DELETE CASCADE` | Reference to cookbook |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id)` | Recipe in cookbook |
| **added_by** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who added the recipe |
| **notes** | `TEXT` | `NULL` | Personal notes about recipe |
| **added_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Addition timestamp |
| **UNIQUE KEY** | `(cookbook_id, recipe_id)` | `UNIQUE` | Prevent duplicate additions |

## Shop_Items Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Item unique identifier |
| **name** | `VARCHAR(255)` | `NOT NULL` | Item name |
| **description** | `TEXT` | `NULL` | Item description |
| **item_type** | `ENUM('boost','currency','consumable')` | `NOT NULL` | Type of shop item |
| **category** | `VARCHAR(100)` | `NOT NULL` | Item category (e.g., 'avatar', 'tool', 'recipe', 'boost') |
| **gold_price** | `INT` | `DEFAULT 0` | Price in gold coins |
| **gem_price** | `INT` | `DEFAULT 0` | Price in gems |
| **effect_value** | `INT` | `DEFAULT 0` | Effect value (e.g., EXP boost percentage) |
| **duration_days** | `INT` | `NULL` | Effect duration in days (NULL for permanent) |
| **image_url** | `VARCHAR(500)` | `NULL` | Item image URL |
| **is_available** | `BOOLEAN` | `DEFAULT TRUE` | Whether item is available for purchase |
| **purchase_count** | `INT` | `DEFAULT 0` | Number of times purchased |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| **updated_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last update timestamp |

## User_Shop_Purchases Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Purchase unique identifier |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE` | User who made purchase |
| **item_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES shop_items(id) ON DELETE CASCADE` | Purchased item |
| **currency_type** | `ENUM('gold','gem')` | `NOT NULL` | Currency used for purchase |
| **price** | `INT` | `NOT NULL` | Price paid |
| **purchased_at** | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Purchase timestamp |
| **expires_at** | `DATETIME` | `NULL` | When item expires (NULL for permanent) |
| **is_active** | `BOOLEAN` | `DEFAULT TRUE` | Whether purchase is currently active |
| **UNIQUE KEY** | `(user_id, item_id, is_active)` | `UNIQUE` | Prevent duplicate active purchases of same item |

## User_Inventory Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Inventory entry ID |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE` | Inventory owner |
| **item_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES shop_items(id)` | Purchased item |
| **quantity** | `INT` | `DEFAULT 1` | Number of items owned |
| **purchased_at** | `DATETIME` | `DEFAULT CURRENT_TIMESTAMP` | Purchase timestamp |
| **is_equipped** | `BOOLEAN` | `DEFAULT FALSE` | Whether item is currently equipped |
| **expires_at** | `DATETIME` | `NULL` | When item expires |
| **UNIQUE KEY** | `(user_id, item_id)` | `UNIQUE` | Prevent duplicate inventory entries |

---

# ⚙️ Backend Files

## config/

### config/environment.php
- **Description**: Configuration file for environment settings and API configuration
- **Required Imports**: None
- **Frontend Consumers**: All frontend API modules (api/auth.js, api/users.js, etc.)

**Functions**:
- `getEnvironment() -> string`: Returns current environment (dev/prod)
- `getDatabaseConfig() -> array`: Returns database connection parameters
- `getApiConfig() -> array`: Returns API configuration settings
- `setEnvironment(string $env) -> void`: Sets environment (dev/prod) - useful for testing

### config/database.php
- **Description**: Database connection and query helper functions
- **Required Imports**: environment.php
- **Frontend Consumers**: Indirectly through DatabaseHelper.php

**Functions**:
- `connect() -> PDO`: Establishes database connection
- `query(string $sql, array $params) -> PDOStatement`: Executes prepared statement
- `fetchAll(string $sql, array $params) -> array`: Fetches all results
- `fetchOne(string $sql, array $params) -> array|false`: Fetches single row
- `insert(string $table, array $data) -> string|false`: Inserts record
- `update(string $table, array $data, string $where) -> int`: Updates record
- `delete(string $table, string $where) -> int`: Deletes record
- `getConnection() -> PDO`: Returns PDO connection for direct database operations

### config/cors.php
- **Description**: CORS headers configuration for API responses
- **Required Imports**: None
- **Frontend Consumers**: All frontend components making API calls

**Functions**:
- `setCorsHeaders() -> void`: Sets CORS headers for API responses
- `handlePreflight() -> void`: Handles OPTIONS preflight requests

**CORS Configuration Details**:
- **Allowed Origins**: Localhost ports 3000, 8080 for React development
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type, X-Requested-With
- **Credentials**: Allowed (Access-Control-Allow-Credentials: true)
- **Max Age**: 86400 seconds (1 day cache for preflight)
- **Preflight Handling**: Automatic OPTIONS request handling
- **Development Support**: Wildcard origin support with specific React dev ports

## classes/

### classes/AuthHelper.php
- **Description**: Authentication helper functions for JWT tokens and password handling
- **Required Imports**: None
- **Frontend Consumers**: LoginForm.jsx, RegisterForm.jsx, ProtectedRoute.jsx, AuthContext.jsx

**Functions**:
- `generateToken(string $user_id, string $email) -> string`: Generates JWT token
- `validateToken(string $token) -> array|false`: Validates JWT token
- `hashPassword(string $password) -> string`: Hashes password
- `verifyPassword(string $password, string $hash) -> bool`: Verifies password
- `generateRefreshToken(string $user_id) -> string`: Generates refresh token for long-term sessions
- `getBearerToken() -> string|null`: Extracts Bearer token from Authorization header
- `getUserIdFromToken(string $token) -> string|null`: Convenience method to extract user ID from token
- `isTokenAboutToExpire(string $token, int $threshold) -> bool`: Checks if token is about to expire
- `refreshToken(string $old_token, array $user_data) -> array|false`: Refreshes expired token
- `validatePasswordStrength(string $password) -> array`: Validates password strength with rules
- `generateRandomToken(int $length) -> string`: Generates secure random token
- `getAuthorizationHeader() -> string|null`: Gets authorization header from request
- `setSecretKey(string $secret_key) -> void`: Sets custom JWT secret key
- `setTokenExpiry(int $seconds) -> void`: Sets token expiry time
- `getConfig() -> array`: Returns current JWT configuration
- `validate_jwt_token(string $token) -> array|false`: Validates JWT token
- `get_bearer_token() -> string|null`: Gets Bearer token from headers
- `hash_password(string $password) -> string`: Hashes password with bcrypt
- `verify_password(string $password, string $hash) -> bool`: Verifies password against hash

### classes/DatabaseHelper.php
- **Description**: Main database operations helper for all application features
- **Required Imports**: ../config/database.php
- **Frontend Consumers**: All frontend API modules and components that fetch data

**Functions**:

**User Operations**:
- `registerUser(array $user_data) -> string|false`: Creates new user, returns user ID
- `validateUserLogin(string $email, string $password) -> array|false`: Validates login credentials
- `getUserById(string $user_id) -> array|false`: Gets user by ID
- `updateUserProfile(string $user_id, array $data) -> bool`: Updates user profile
- `searchUsers(string $query, int $limit = 20, int $offset = 0) -> array`: Searches users

**User Stats Operations**:
- `getUserStats(string $user_id) -> array|false`: Gets user stats
- `updateUserStats(string $user_id, array $updates) -> bool`: Updates user stats
- `incrementUserStat(string $user_id, string $field, int $amount) -> bool`: Increments user stat

**Recipe Operations**:
- `createRecipe(array $recipe_data, array $ingredients, array $steps) -> string|false`: Creates recipe, returns recipe ID
- `getRecipe(string $recipe_id, string $user_id = null) -> array|false`: Gets full recipe with user-specific access
- `updateRecipe(string $recipe_id, array $recipe_data, array $ingredients = [], array $steps = []) -> bool`: Updates recipe
- `deleteRecipe(string $recipe_id) -> bool`: Deletes recipe and related data
- `getRecipes(array $filters = [], int $limit = 20, int $offset = 0) -> array`: Gets recipes with filters

**Recipe Access & Purchase**:
- `checkRecipeAccess(string $user_id, string $recipe_id) -> array|false`: Checks access (purchased/created/free)
- `purchaseRecipe(string $user_id, string $recipe_id, string $currency_type, int $price) -> bool`: Processes recipe purchase
- `grantRecipeAccess(string $user_id, string $recipe_id, string $access_type, array $purchase_data = null) -> bool`: Grants recipe access

**Recipe Interactions**:
- `handleRecipeInteraction(string $user_id, string $recipe_id, string $interaction_type, array $metadata = []) -> bool`: Handles like/dislike/save
- `getRecipeInteractions(string $recipe_id) -> array`: Gets recipe interaction counts

**Cooking Session Operations**:
- `createCookingSession(array $session_data) -> string|false`: Creates session, returns session ID
- `getCookingSession(string $session_id) -> array|false`: Gets session with participants
- `updateCookingSession(string $session_id, array $updates) -> bool`: Updates session
- `joinCookingSession(string $session_id, string $user_id) -> bool`: Joins session
- `completeCookingStep(string $session_id, string $step_id, string $user_id, array $completion_data) -> bool`: Completes step
- `getUserSessionHistory(string $user_id, int $limit = 20, int $offset = 0) -> array`: Gets session history

**Relationship Operations**:
- `manageRelationship(string $source_user_id, string $target_user_id, string $action, array $data = []) -> bool`: Handles follow/unfollow/friend requests
- `getRelationships(string $user_id, string $type = 'following', int $limit = 50) -> array`: Gets relationships
- `updateRelationshipStatus(string $relationship_id, string $status) -> bool`: Updates relationship status

**Cookbook Operations**:
- `createCookbook(array $cookbook_data) -> string|false`: Creates cookbook, returns ID
- `getCookbook(string $cookbook_id, bool $include_recipes = true) -> array|false`: Gets cookbook
- `updateCookbook(string $cookbook_id, array $updates) -> bool`: Updates cookbook
- `manageCookbookRecipe(string $cookbook_id, string $recipe_id, string $action, string $user_id) -> bool`: Adds/removes recipe
- `getUserCookbooks(string $user_id, bool $include_public = false) -> array`: Gets user's cookbooks

**Shop & Inventory Operations**:
- `getShopItems(array $filters = [], int $limit = 50) -> array`: Gets shop items with filters
- `purchaseShopItem(string $user_id, string $item_id, string $currency_type, int $price) -> bool`: Purchases shop item
- `addToInventory(string $user_id, string $item_id, int $quantity = 1, array $item_data = []) -> bool`: Adds to inventory
- `getUserInventory(string $user_id, string $category = null) -> array`: Gets user inventory
- `useInventoryItem(string $user_id, string $inventory_id) -> array|false`: Uses item, returns effect data

**Activity Feed Operations**:
- `logActivity(string $user_id, string $activity_type, array $activity_data) -> bool`: Logs activity
- `getActivityFeed(string $user_id = null, int $limit = 20, int $offset = 0) -> array`: Gets activity feed

**Voting & Chat Operations**:
- `handleSessionVote(string $session_id, string $user_id, string $vote_type, bool $vote_value) -> bool`: Handles session votes
- `saveChatMessage(string $session_id, string $user_id, string $message, string $message_type = 'text') -> bool`: Saves chat message
- `getSessionChat(string $session_id, int $limit = 100) -> array`: Gets session chat

### classes/ResponseFormatter.php
- **Description**: Standardizes API response formats
- **Required Imports**: None
- **Frontend Consumers**: All frontend components via api.js response handling

**Functions**:
- `success(mixed $data, string $message, int $code) -> void`: Returns success response
- `error(string $message, int $code, mixed $details) -> void`: Returns error response
- `validationError(array $errors) -> void`: Returns validation error
- `unauthorized(string $message) -> void`: Returns unauthorized error
- `notFound(string $message) -> void`: Returns not found error
- `forbidden(string $message) -> void`: Returns 403 Forbidden error
- `badRequest(string $message, mixed $details) -> void`: Returns 400 Bad Request error
- `conflict(string $message, mixed $details) -> void`: Returns 409 Conflict error
- `created(mixed $data, string $message) -> void`: Returns 201 Created success
- `accepted(mixed $data, string $message) -> void`: Returns 202 Accepted success
- `noContent() -> void`: Returns 204 No Content
- `paginated(array $data, int $total, int $page, int $limit, string $message) -> void`: Returns paginated response
- `custom(array $data, int $code) -> void`: Returns custom response structure
- `maintenance(string $message, string $estimated_time) -> void`: Returns 503 Maintenance mode
- `rateLimit(string $message, int $retry_after) -> void`: Returns 429 Rate limit exceeded
- `setCorsHeaders(array $allowed_origins, array $allowed_methods, array $allowed_headers) -> void`: Sets CORS headers
- `handlePreflight() -> void`: Handles OPTIONS preflight requests
- `expectsJson() -> bool`: Checks if client expects JSON response
- `logError(string $message, mixed $details, string $level) -> void`: Logs errors (private)
- `json_success(mixed $data, string $message, int $code) -> void`: Quick success response
- `json_error(string $message, int $code, mixed $details) -> void`: Quick error response
- `json_validation_error(array $errors, string $message) -> void`: Quick validation error
- `json_unauthorized(string $message) -> void`: Quick unauthorized error
- `json_not_found(string $message) -> void`: Quick not found error

### classes/UserCalculations.php
- **Description**: Calculates gamification values like rewards, prices, and level requirements
- **Required Imports**: None
- **Frontend Consumers**: userCalculations.js (must match), LevelProgress.jsx, CurrencyDisplay.jsx, RewardNotification.jsx

**Functions**:
- `calculateMaxRewards(array $user_data) -> array`: Calculates max rewards
- `calculateMaxPrices(array $user_data) -> array`: Calculates max prices
- `calculateAllUserLimits(array $user_data) -> array`: Calculates all limits
- `calculateLevelUpRequirements(int $current_level, int $current_exp) -> array`: Calculates level up requirements
- `calculateExpForLevel(int $level) -> int`: Calculates total EXP needed for specific level (private)
- `getLevelTitle(int $level) -> string`: Returns title based on user level
- `calculateRecipeRewards(string $difficulty, array $user_limits) -> array`: Calculates rewards for recipe completion
- `calculateStepRewards(int $step_index, int $total_steps, array $recipe_rewards) -> array`: Calculates step completion rewards
- `checkLevelUp(int $current_level, int $current_exp) -> array`: Checks if user should level up
- `calculateDailyLoginBonus(int $login_streak) -> array`: Calculates daily login bonus rewards
- `applyConsumableEffect(array $user_stats, string $consumable_type, int $effect_value) -> array`: Applies consumable effect to user stats

## utils/

### utils/uuidHelper.php
- **Description**: Generates unique identifiers for database records
- **Required Imports**: None
- **Frontend Consumers**: RecipeForm.jsx, RegisterForm.jsx, CookbooksPage.jsx, CookingSessionPage.jsx

**Functions**:
- `makeId() -> string`: Generates unique ID
- `generateUniqueId(string $table, string $field) -> string`: Generates unique ID for table

### utils/fileUpload.php
- **Description**: Handles image uploads for profile pictures, recipe images, and step images
- **Required Imports**: None
- **Frontend Consumers**: UserProfile.jsx (profile picture), RecipeForm.jsx (recipe images), upload.js utility

**Functions**:
- `uploadImage(array $file, string $type, string $user_id) -> array|false`: Uploads image file
- `validateImage(array $file) -> bool`: Validates image file
- `deleteFile(string $path) -> bool`: Deletes uploaded file

### utils/validation.php
- **Description**: Input validation and sanitization functions
- **Required Imports**: None
- **Frontend Consumers**: LoginForm.jsx, RegisterForm.jsx, RecipeForm.jsx, UserProfile.jsx, validators.js

**Functions**:
- `validateEmail(string $email) -> bool`: Validates email format
- `validatePassword(string $password) -> bool`: Validates password strength
- `sanitizeInput(mixed $input) -> mixed`: Sanitizes input data

### utils/logging.php
- **Description**: Logging system for errors, user activities, and API requests
- **Required Imports**: None
- **Frontend Consumers**: ErrorBoundary.jsx (error logging), all API modules (request logging)

**Functions**:
- `logError(string $message, array $context) -> void`: Logs error to file
- `logActivity(string $user_id, string $action, array $details) -> void`: Logs user activity
- `logApiRequest(string $method, string $endpoint, int $status) -> void`: Logs API request

## database/

### database/schema.sql
- **Description**: SQL schema for creating all database tables
- **Required Imports**: None
- **Frontend Consumers**: None (database setup only)
- **Functions**: N/A (SQL file)

### database/seeds.sql
- **Description**: Seed data for testing and development
- **Required Imports**: None
- **Frontend Consumers**: None (database setup only)
- **Functions**: N/A (SQL file)

## api/

## api/auth/

### api/auth/register.php
- **Description**: Handles user registration
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Frontend Consumers**: RegisterForm.jsx, RegisterPage.jsx, api/auth.js register()

### api/auth/login.php
- **Description**: Handles user authentication
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: LoginForm.jsx, LoginPage.jsx, api/auth.js login()

### api/auth/me.php
- **Description**: Returns current authenticated user's information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: AuthContext.jsx, Header.jsx, ProtectedRoute.jsx, api/auth.js getCurrentUser()

### api/auth/logout.php
- **Description**: Handles user logout
- **Required Imports**: ../../config/database.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: Header.jsx logout, AuthContext.jsx logout(), api/auth.js logout()

### api/auth/refresh-token.php
- **Description**: Refreshes authentication tokens
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: AuthContext.jsx refreshToken(), api/auth.js refreshToken(), useAuth hook

## api/users/

### api/users/profile.php
- **Description**: Retrieves user profile information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx, ProfilePage.jsx, Header.jsx, api/users.js getProfile()

### api/users/update.php
- **Description**: Updates user profile information
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Frontend Consumers**: UserProfile.jsx edit, ProfilePage.jsx, api/users.js updateProfile()

### api/users/stats.php
- **Description**: Retrieves user statistics and gamification data
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: StatsDisplay.jsx, UserProfile.jsx, Header.jsx, LevelProgress.jsx, api/users.js getUserStats()

### api/users/search.php
- **Description**: Searches for users by name or criteria
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: DiscoverPage.jsx, UserCard.jsx lists, api/users.js searchUsers()

## api/relationships/

### api/relationships/follow.php
- **Description**: Handles user following/unfollowing
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: FollowButton.jsx, UserCard.jsx, UserProfile.jsx, api/relationships.js followUser()/unfollowUser()

### api/relationships/friends.php
- **Description**: Manages friend requests and relationships
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx friend requests, api/relationships.js friend request functions

### api/relationships/list.php
- **Description**: Lists user relationships (following, followers, friends)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx tabs, api/relationships.js getFollowing()/getFollowers()

## api/recipes/

### api/recipes/index.php
- **Description**: Lists recipes with filtering and pagination
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeList.jsx, RecipesPage.jsx, HomePage.jsx, DiscoverPage.jsx, api/recipes.js getAllRecipes()

### api/recipes/purchase.php
- **Description**: Handles recipe purchases with currency (gold or gems)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../classes/UserCalculations.php
- **Frontend Consumers**: PurchaseModal.jsx, RecipeDetail.jsx purchase button, api/purchase.js purchaseRecipe()
- **Functions**:
  - `validateRecipePurchase(user_id, recipe_id, currency_type) -> bool`: Validates recipe purchase request
  - `processRecipePurchase(user_id, recipe_id, currency_type) -> array`: Processes the recipe purchase transaction
  - `checkRecipeOwnership(user_id, recipe_id) -> bool`: Checks if user already owns recipe
  - `grantRecipeAccess(user_id, recipe_id, currency_type, price) -> bool`: Grants access to recipe after purchase

### api/recipes/access.php
- **Description**: Checks if user has access to a recipe (purchased, created, or free)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx access check, api/purchase.js checkRecipeAccess()
- **Functions**:
  - `checkRecipeAccess(user_id, recipe_id) -> array`: Checks access and returns access type
  - `getAccessibleRecipes(user_id) -> array`: Gets all recipes user can access
  - `validateRecipePurchaseRequired(recipe_id) -> bool`: Checks if recipe requires purchase

### api/recipes/create.php
- **Description**: Creates a new recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php, ../../utils/validation.php
- **Frontend Consumers**: RecipeForm.jsx, CreateRecipePage.jsx, api/recipes.js createRecipe()

### api/recipes/show.php
- **Description**: Retrieves detailed information about a specific recipe
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx, RecipeDetailPage.jsx, api/recipes.js getRecipe()

### api/recipes/update.php
- **Description**: Updates an existing recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/validation.php
- **Frontend Consumers**: RecipeForm.jsx edit mode, api/recipes.js updateRecipe()

### api/recipes/delete.php
- **Description**: Deletes a recipe
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx delete button, api/recipes.js deleteRecipe()

### api/recipes/interact.php
- **Description**: Handles recipe interactions (likes, saves, purchases)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeCard.jsx like/save buttons, RecipeDetail.jsx interactions, api/recipes.js likeRecipe()/saveRecipe()

## api/cooking-sessions/

### api/cooking-sessions/index.php
- **Description**: Lists cooking sessions
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: HomePage.jsx session list, api/cooking-sessions.js session listing

### api/cooking-sessions/create.php
- **Description**: Creates a new cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Frontend Consumers**: RecipeDetail.jsx "Start Cooking", CookingSessionPage.jsx, api/cooking-sessions.js createSession()

### api/cooking-sessions/show.php
- **Description**: Retrieves detailed information about a specific cooking session
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx, CookingSessionPage.jsx, api/cooking-sessions.js getSession()

### api/cooking-sessions/update.php
- **Description**: Updates an existing cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx controls, api/cooking-sessions.js updateSession()

### api/cooking-sessions/join.php
- **Description**: Allows users to join a cooking session
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx join button, ParticipantList.jsx, api/cooking-sessions.js joinSession()

### api/cooking-sessions/complete-step.php
- **Description**: Marks a cooking step as completed
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx step completion, StepList.jsx, api/cooking-sessions.js completeStep()

### api/cooking-sessions/vote.php
- **Description**: Handles voting in cooking sessions (skip steps, etc.)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookingSession.jsx vote buttons, SessionChat.jsx, api/cooking-sessions.js voteSkip()

### api/sessions/history.php
- **Description**: Retrieves user's cooking session history
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: SessionHistoryPage.jsx, UserProfile.jsx history tab, api/cooking-sessions.js session history
- **Functions**:
  - `getUserSessionHistory(user_id, limit, offset) -> array`: Gets paginated session history
  - `getSessionStatistics(user_id) -> array`: Gets cooking stats (total sessions, time, etc.)

## api/chat/

### api/chat/messages.php
- **Description**: Handles cooking session chat messages (for multiplayer)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: SessionChat.jsx send/receive, api/chat.js sendChatMessage()/getChatMessages()
- **Functions**:
  - `sendSessionMessage(session_id, user_id, message) -> bool`: Saves chat message
  - `getSessionMessages(session_id, limit) -> array`: Retrieves session chat history

## api/cookbooks/

### api/cookbooks/index.php
- **Description**: Lists user's cookbooks
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: CookbooksPage.jsx, UserProfile.jsx cookbooks tab, api/cookbooks.js getCookbooks()

### api/cookbooks/create.php
- **Description**: Creates a new cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../utils/uuidHelper.php
- **Frontend Consumers**: CookbooksPage.jsx create button, api/cookbooks.js createCookbook()

### api/cookbooks/show.php
- **Description**: Retrieves detailed information about a specific cookbook
- **Required Imports**: ../../config/database.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: Cookbook detail views, api/cookbooks.js getCookbookRecipes()

### api/cookbooks/add-recipe.php
- **Description**: Adds a recipe to a cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: RecipeDetail.jsx "Add to Cookbook", api/cookbooks.js addRecipeToCookbook()

### api/cookbooks/remove-recipe.php
- **Description**: Removes a recipe from a cookbook
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: Cookbook management, api/cookbooks.js removeRecipeFromCookbook()

## api/upload/

### api/upload/image.php
- **Description**: Handles image uploads for various types (profile, recipe, step)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../utils/fileUpload.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: UserProfile.jsx profile picture, RecipeForm.jsx images, upload.js utility, api/upload image functions

## api/inventory/

### api/inventory/list.php
- **Description**: Lists user's purchased inventory items
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php
- **Frontend Consumers**: InventoryList.jsx, InventoryItem.jsx, ShopPage.jsx inventory, api/inventory.js getUserInventory()
- **Functions**:
  - `getUserInventory(user_id, category) -> array`: Gets user's inventory items
  - `getEquippedItems(user_id) -> array`: Gets currently equipped items
  - `getItemDetails(item_id) -> array`: Gets detailed information about an inventory item

### api/inventory/use.php
- **Description**: Uses a consumable item from inventory
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../classes/UserCalculations.php
- **Frontend Consumers**: InventoryItem.jsx use button, api/inventory.js useConsumable()
- **Functions**:
  - `validateConsumableUse(user_id, inventory_id) -> bool`: Validates if item can be used
  - `applyConsumableEffect(user_id, inventory_id) -> array`: Applies consumable effect and updates stats
  - `consumeItem(user_id, inventory_id) -> bool`: Reduces quantity or removes item
  - `getConsumableEffects() -> array`: Returns list of possible consumable effects

## api/shop/

### api/shop/items.php
- **Description**: Lists available shop items
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../../config/cors.php
- **Frontend Consumers**: ShopPage.jsx, ShopItem.jsx, DiscoverPage.jsx shop items, api/shop.js getShopItems()

**Functions**:
- `getAuthorizationToken() -> string|null`: Extracts Bearer token from Authorization header

### api/shop/purchase.php
- **Description**: Handles shop item purchases (redirects to /api/purchase/item.php)
- **Required Imports**: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php, ../purchase/item.php
- **Frontend Consumers**: ShopItem.jsx purchase, PurchaseModal.jsx, api/shop.js purchaseItem()
- **Functions**:
  - `validateShopPurchase(user_id, item_id) -> bool`: Validates purchase request
  - `getAuthorizationToken() -> string|null`: Extracts Bearer token

## uploads/
- **Description**: Directory for uploaded files
- **Subdirectories**:
  - `profile-pictures/`: User profile pictures
  - `recipe-images/`: Recipe cover images
  - `step-images/`: Cooking step images

## .htaccess
- **Description**: URL rewriting for clean API endpoints
- **Content**: Rewrites all requests to index.php

## index.php
- **Description**: Main entry point that routes requests to appropriate endpoints
- **Required Imports**: config/cors.php
- **Functionality**: Routes requests to appropriate endpoints

---

# ✨ Frontend Files

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

---

# 📄 Layouts

## Public Layouts

### **public/index.html** - Main App Template
```
┌────────────────────────────────────────────┐
│ Header.jsx                                 │
│  🍳 CookTogether | 🔍 Search | 👤 Profile │
├────────────────────────────────────────────┤
│                                            │
│         Router Content Area               │
│   (varies by current route)               │
│                                            │
├────────────────────────────────────────────┤
│ Footer.jsx                                 │
│  © CookTogether • Level up your cooking!  │
└────────────────────────────────────────────┘
```

## Component Layouts

### **src/components/common/**
- **Header.jsx**: App header with navigation, user stats, quick actions
- **Navigation.jsx**: Main navigation menu with icons
- **Footer.jsx**: App footer with links and copyright
- **LoadingSpinner.jsx**: Animated loading indicator
- **ErrorBoundary.jsx**: Error handling wrapper

### **src/components/auth/**
- **LoginForm.jsx**: Email/password form with login streak bonus
- **RegisterForm.jsx**: Registration form with welcome bonuses
- **ProtectedRoute.jsx**: Authentication guard wrapper

### **src/components/recipes/**
- **RecipeCard.jsx**: Compact recipe preview card
- **RecipeDetail.jsx**: Full recipe view with tabs
- **RecipeForm.jsx**: Multi-section recipe creation/editing
- **RecipeList.jsx**: Filterable, paginated recipe grid
- **IngredientList.jsx**: Checkable ingredient display
- **StepList.jsx**: Timer-enabled cooking steps

### **src/components/cooking/**
- **CookingSession.jsx**: Main cooking interface with split panel
- **SessionTimer.jsx**: Countdown timer controls
- **ParticipantList.jsx**: Session participants display
- **StepProgress.jsx**: Visual step completion tracker
- **SessionChat.jsx**: Real-time chat panel

### **src/components/users/**
- **UserCard.jsx**: Compact user profile card
- **UserProfile.jsx**: Detailed profile with tabs
- **StatsDisplay.jsx**: Gamification stats dashboard
- **FollowButton.jsx**: Follow/unfollow toggle

### **src/components/gamification/**
- **CurrencyDisplay.jsx**: Gold/Gem balance indicator
- **LevelProgress.jsx**: EXP progress bar
- **RewardNotification.jsx**: Animated reward alerts
- **ShopItem.jsx**: Purchasable item card

### **src/components/inventory/**
- **InventoryItem.jsx**: Consumable item card with usage
- **InventoryList.jsx**: Filterable inventory grid

### **src/components/purchase/**
- **PurchaseModal.jsx**: Currency selection purchase dialog

## Page Layouts (Component Composition)

### **src/pages/LoginPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx (minimal)                │
├─────────────────────────────────────┤
│                                     │
│      LoginForm.jsx (centered)       │
│                                     │
├─────────────────────────────────────┤
│ Footer.jsx                          │
└─────────────────────────────────────┘
```

### **src/pages/RegisterPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx (minimal)                │
├─────────────────────────────────────┤
│                                     │
│    RegisterForm.jsx (centered)      │
│                                     │
├─────────────────────────────────────┤
│ Footer.jsx                          │
└─────────────────────────────────────┘
```

### **src/pages/HomePage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ Hero Section                        │
│ [🎮 Start Cooking] [📖 Browse]      │
├─────────────────────────────────────┤
│ Featured Sections (3-column)        │
│ 🔥 Trending | 🏪 Shop | 👥 Community│
├─────────────────────────────────────┤
│ RecipeList.jsx (featured recipes)   │
│ (grid of RecipeCard.jsx)            │
├─────────────────────────────────────┤
│ Activity Feed                       │
│ • User actions & achievements       │
└─────────────────────────────────────┘
```

### **src/pages/RecipesPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ Search & Filter Controls            │
│ [🔍 Search] [🔽 Filter] [🔼 Sort]   │
├─────────────────────────────────────┤
│ RecipeList.jsx (full recipe grid)   │
│ (pagination enabled)                │
└─────────────────────────────────────┘
```

### **src/pages/RecipeDetailPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ RecipeDetail.jsx (full recipe view) │
│ - Hero image & metadata             │
│ - Tabbed content (ingredients/steps)│
│ - Interaction buttons               │
│ - Start cooking session button      │
└─────────────────────────────────────┘
```

### **src/pages/CreateRecipePage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ RecipeForm.jsx (multi-section form) │
│ - Basic info                        │
│ - Ingredients (dynamic list)        │
│ - Steps (dynamic list)              │
│ - Rewards preview                   │
└─────────────────────────────────────┘
```

### **src/pages/ProfilePage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ UserProfile.jsx                     │
│ - Profile header with stats         │
│ - Tabbed content area:              │
│   1. Recipes (RecipeList.jsx)       │
│   2. Cookbooks                      │
│   3. Following/Followers            │
│   4. Session History                │
└─────────────────────────────────────┘
```

### **src/pages/CookingSessionPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ CookingSession.jsx                  │
│ - Left: Ingredients & Participants  │
│ - Right: Current step & timer       │
│ - Bottom: SessionChat.jsx           │
└─────────────────────────────────────┘
```

### **src/pages/ShopPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ Shop Header                         │
│ 💰 Balance | Categories             │
├─────────────────────────────────────┤
│ Grid of ShopItem.jsx (3×3)          │
│ - Item image                        │
│ - Price in Gold/Gems                │
│ - Purchase button                   │
├─────────────────────────────────────┤
│ Special Offers Section              │
└─────────────────────────────────────┘
```

### **src/pages/DiscoverPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ Discovery Tabs                      │
│ 🔥 Trending | 👑 Top Chefs | ⭐ New│
├─────────────────────────────────────┤
│ Top Chefs Section                   │
│ (grid of UserCard.jsx)              │
├─────────────────────────────────────┤
│ Trending Recipes                    │
│ (grid of RecipeCard.jsx)            │
├─────────────────────────────────────┤
│ New Shop Items                      │
│ (grid of ShopItem.jsx)              │
└─────────────────────────────────────┘
```

### **src/pages/CookbooksPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ Cookbook Management Header          │
│ [➕ Create Cookbook]                 │
├─────────────────────────────────────┤
│ Grid of Cookbook Cards              │
│ - Cover image                       │
│ - Title & recipe count              │
│ - Privacy status                    │
└─────────────────────────────────────┘
```

### **src/pages/SessionHistoryPage.jsx**
```
┌─────────────────────────────────────┐
│ Header.jsx                          │
├─────────────────────────────────────┤
│ StatsDisplay.jsx (session stats)    │
├─────────────────────────────────────┤
│ Filter Controls                     │
│ [📅 Month] [🔥 All] [✅ Completed]  │
├─────────────────────────────────────┤
│ Session History List                │
│ - Session card with metadata        │
│ - Recipe, duration, rewards         │
│ - Date & status                     │
└─────────────────────────────────────┘
```

## Layout Composition Rules

1. **All Pages Include**: `Header.jsx` (except minimal auth pages)
2. **Content Areas**: Use appropriate component compositions
3. **Grid Layouts**: Use component grids (RecipeList, UserCard grids)
4. **Modal Overlays**: PurchaseModal for transactions
5. **Loading States**: LoadingSpinner during data fetching
6. **Error Handling**: ErrorBoundary wraps main content

## Component Import Hierarchy

```
App.jsx
├── Header.jsx (all pages)
├── Router Content
│   ├── LoginPage.jsx → LoginForm.jsx
│   ├── RegisterPage.jsx → RegisterForm.jsx
│   ├── HomePage.jsx → RecipeList.jsx
│   ├── RecipesPage.jsx → RecipeList.jsx
│   ├── RecipeDetailPage.jsx → RecipeDetail.jsx
│   ├── CreateRecipePage.jsx → RecipeForm.jsx
│   ├── ProfilePage.jsx → UserProfile.jsx + RecipeList.jsx
│   ├── CookingSessionPage.jsx → CookingSession.jsx + SessionChat.jsx
│   ├── ShopPage.jsx → ShopItem.jsx grid
│   ├── DiscoverPage.jsx → UserCard.jsx + RecipeCard.jsx grids
│   ├── CookbooksPage.jsx → Cookbook components
│   └── SessionHistoryPage.jsx → StatsDisplay.jsx
└── Footer.jsx (all pages)
```

---

# 🎨 Styles

## 1. Design Philosophy
**Core Concept:** A warm, inviting kitchen environment overlaid with playful, high-energy RPG interface elements.
**Vibe:** Appetizing, Encouraging, Social, and Rewarding.

## 2. Color Palette

### 🍳 Cooking Primary (Warmth & Action)
Used for main buttons, headers, and "Call to Cook" actions.
- **Chef's Red:** `#FF6B6B` (Primary Brand Color - Buttons, Highlights)
- **Sizzling Orange:** `#FF9F43` (Secondary - Hover states, Alerts)
- **Creamy White:** `#F9F9F9` (Main Background)
- **Warm Gray:** `#2D3436` (Primary Text)

### 🎮 Gamification Accents (Rewards & Status)
Used exclusively for XP bars, currency, levels, and achievements to make them pop.
- **Gold Coin:** `#FFD93D` (Currency: Gold)
- **Rare Gem:** `#6C5CE7` (Currency: Gems/Premium)
- **XP Purple:** `#A55EEA` (Experience Points & Level Up)
- **Success Green:** `#2ECC71` (Completed Steps / Success Messages)

## 3. Typography
**Headings & Game Stats:** `Poppins` (Rounded, friendly, geometric)
**Body Text & Instructions:** `Rubik` (Highly readable)

## 4. Component Styling Guide

### Buttons (RPG Style)
Buttons should feel "pressable" with a slight 3D effect.
- **Class:** `.btn-rpg`
- **Style:** - `border-bottom: 4px solid [darker-shade]`
  - Active state: `transform: translateY(4px); border-bottom: 0;`

### Cards (Recipe & Shop Items)
White cards on off-white background with soft shadows.
- **Border Radius:** `16px`
- **Shadow:** `0 4px 15px rgba(0,0,0,0.05)`
- **Hover:** Lift up slightly (`transform: translateY(-5px)`)

### Icons (React Icons)
To style imports like `<FaFire />`:
- **CSS Selector:** Target the `svg` or use a specific class.
- **Effect:** Add `filter: drop-shadow(...)` for glowing effects on game elements.

## 5. Animation Strategy (Animate.css)
- **Page Load:** `animate__fadeIn`
- **Purchase/Reward:** `animate__bounceIn` or `animate__heartBeat`
- **Hover:** `transform: scale(1.05)`
---