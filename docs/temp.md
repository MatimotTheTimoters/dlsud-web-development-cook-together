# 🏛️ Directory Structure

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
| **interaction_type** | `ENUM('like','dislike','save','purchase')` | `NOT NULL` | Type of interaction |
| **metadata** | `JSON` | `NULL` | Additional interaction data |
| **UNIQUE KEY** | `(user_id, recipe_id, interaction_type)` | `UNIQUE` | Prevent duplicate interactions |

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

## User_Purchases Table

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

## User_Recipe_Access Table

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Access entry ID |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE` | User who has access |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id) ON DELETE CASCADE` | Accessible recipe |
| **access_type** | `ENUM('purchased','created','gifted','free')` | `NOT NULL` | How access was obtained |
| **purchased_at** | `DATETIME` | `NULL` | When recipe was purchased |
| **currency_used** | `ENUM('gold','gem')` | `NULL` | Currency used for purchase |
| **price_paid** | `INT` | `NULL` | Amount paid |
| **expires_at** | `DATETIME` | `NULL` | When access expires (NULL for permanent) |
| **UNIQUE KEY** | `(user_id, recipe_id)` | `UNIQUE` | Prevent duplicate access |

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

# 📂 Files
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

#### **src/components/cooking/SessionChat.jsx**
- **Description**: Real-time chat for multiplayer cooking sessions
- **Required Imports**: React, useState, useEffect, useRef, { FaPaperPlane, FaUser } from 'react-icons/fa'
- **Backend Endpoint**: api/chat/messages.php
- **Layout**:
┌─────────────────────────────────────┐
│ SESSION CHAT │
├─────────────────────────────────────┤
│ 👤 Chef John: Let's start step 3 │
│ 👤 Sarah: Timer set for 5 min │
│ 👤 You: Adding sauce now │
│ 👤 Mike: Vote to skip? │
├─────────────────────────────────────┤
│ [💬 Type message...] [📤 Send] │
└─────────────────────────────────────┘
- **Functions**:
- `sendMessage(message) -> void`: Sends chat message
- `receiveMessages() -> void`: Polls for new messages
- `formatMessageTime(timestamp) -> string`: Formats message timestamp

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
- **Required Imports**: React, useState, useEffect, useParams from 'react-router-dom', api from '../../api/users', { FaEdit, FaCamera, FaChartLine, FaCrown, FaBook, FaUsers } from 'react-icons/fa'
- **Backend Endpoint**: api/users/profile.php, api/users/update.php, api/users/stats.php, api/upload/image.php
- **Layout**:

```
┌─────────────────────────────────────┐
│ [✏️ Edit] [➕ Follow] [📩 Message] │
├─────────────────────────────────────┤
│ [PROFILE PICTURE LARGE] │
│ 👨‍🍳 John Doe | Level 15 Chef│
│ 🔥 7-Day Login Streak │
│ ⭐ 4.8 Average Rating │
├─────────────────────────────────────┤
│ TABS: 📖 Recipes | 📚 Cookbooks │
│ 👥 Following | 👤 Followers │
│ ⏱️ Session History │
├─────────────────────────────────────┤
│ CONTENT AREA (Grid/List of items) │
└─────────────────────────────────────┘
```

- **Functions**:
  - `loadUserProfile() -> void`: Loads user profile data
  - `loadUserRecipes() -> void`: Loads user's recipes
  - `loadUserStats() -> void`: Loads user statistics
  - `calculateNextLevelProgress() -> object`: Calculates progress to next level
  - `loadSessionHistory() -> void`: Loads user's cooking session history

---

#### **src/components/users/StatsDisplay.jsx**
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

### **src/components/inventory/**

---

### **src/components/inventory/**

---

#### **src/components/inventory/InventoryItem.jsx**
- **Description**: Displays inventory item with use functionality for consumables
- **Required Imports**: React, useState, api from '../../api/inventory', { FaCheck, FaTimes, FaBox, FaFire } from 'react-icons/fa'
- **Backend Endpoint**: api/inventory/use.php
- **Layout**:
┌─────────────────────────────┐
│   [ITEM IMAGE]              │
│   ⚡ EXP Booster (50%)      │
│   📦 Quantity: 3            │
│   ⏱️ Duration: 60 min       │
│   [🔥 Use Now]              │
└─────────────────────────────┘
- **Functions**:
  - `useItem() -> void`: Uses consumable item
  - `getEffectDescription() -> string`: Returns effect description
  - `getTimeRemaining() -> string`: Calculates time until expiration

---

#### **src/components/inventory/InventoryList.jsx**
- **Description**: Displays user's inventory with filtering
- **Required Imports**: React, useState, InventoryItem from './InventoryItem', { FaFilter, FaSort } from 'react-icons/fa'
- **Backend Endpoint**: api/inventory/list.php
- **Functions**:
  - `loadInventory() -> void`: Loads user inventory
  - `filterByType(type) -> array`: Filters items by type (consumable, etc.)
  - `sortItems(sortBy) -> array`: Sorts inventory items

---

### src/components/purchase/

---

#### **src/components/purchase/PurchaseModal.jsx**
- **Description**: Modal for purchasing recipes or shop items
- **Required Imports**: React, useState, api from '../../api/purchase', { FaCoins, FaGem, FaLock, FaCheck } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/purchase.php, api/shop/purchase.php
- **Layout**:
┌─────────────────────────────────────┐
│ PURCHASE CONFIRMATION │
│ 🍕 Recipe: Margherita Pizza │
│ --------------------------------- │
│ Price: 💰 50 Gold OR 💎 5 Gems │
│ Your Balance: 💰 1250 | 💎 45 │
│ --------------------------------- │
│ [💰 Purchase with Gold] │
│ [💎 Purchase with Gems] │
│ [❌ Cancel] │
└─────────────────────────────────────┘
- **Functions**:
- `checkAffordability() -> boolean`: Checks if user can afford
- `processPurchase(currencyType) -> void`: Handles purchase transaction
- `showSuccessMessage() -> void`: Shows purchase confirmation

---

### **src/pages/**

#### **src/pages/HomePage.jsx**
- **Description**: Main landing page with featured content and quick actions
- **Required Imports**: React, Link from 'react-router-dom', RecipeList from '../components/recipes/RecipeList', { FaFire, FaNewspaper, FaUsers, FaStore } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php, api/cooking-sessions/index.php
- **Layout**:

```
┌─────────────────────────────────────┐
│ HERO SECTION │
│ 🍳 CookTogether │
│ Level up your cooking skills! │
│ [🎮 Start Cooking] [📖 Browse] │
├─────────────────────────────────────┤
│ FEATURED SECTIONS │
│ ┌──────────┬──────────┬──────────┐│
│ │ 🔥Trending│ 🏪 Shop Deals │ 👥Community││
│ │ Recipes │ Daily Offers │ Top Chefs││
│ └──────────┴──────────┴──────────┘│
├─────────────────────────────────────┤
│ QUICK ACTIONS │
│ [🍳 Create Recipe] [👥 Find Friends]│
│ [📊 View Stats] [🏪 Visit Shop] │
├─────────────────────────────────────┤
│ RECENT ACTIVITY FEED │
│ • Chef Mario cooked Carbonara +50XP│
│ • Sarah reached Level 20! 🎉 │
│ • New recipe: Vegan Lasagna │
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
- **Required Imports**: React, useState, UserCard from '../components/users/UserCard', RecipeCard from '../components/recipes/RecipeCard', { FaCompass, FaFire, FaUsers, FaStar } from 'react-icons/fa'
- **Backend Endpoint**: api/recipes/index.php, api/users/search.php, api/users/profile.php
- **Layout**:

```
┌─────────────────────────────────────┐
│ DISCOVER │
│ 🔥 Trending | 👑 Top Chefs | ⭐ New│
├─────────────────────────────────────┤
│ TOP CHEFS THIS WEEK │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │ 👨│ │ 👩│ │ 🧑│ │ 👨│ │ 👩│ │
│ │Level││Level││Level││Level││Level││
│ │ 25 ││ 22 ││ 20 ││ 18 ││ 17 │ │
│ └───┘ └───┘ └───┘ └───┘ └───┘ │
├─────────────────────────────────────┤
│ TRENDING RECIPES │
│ [🍕] [🥗] [🍣] [🌮] [🍰] │
│ +125 +98 +76 +64 +52 │
├─────────────────────────────────────┤
│ NEW IN SHOP │
│ 👑 Golden Spoon - 500 Gold │
│ 🎩 Chef Hat - 300 Gold │
│ 🔪 Sharp Knife - 750 Gold │
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

#### **src/pages/SessionHistoryPage.jsx**
- **Description**: Displays user's past cooking sessions with statistics
- **Required Imports**: React, useState, useEffect, api from '../api/cooking-sessions', { FaHistory, FaChartBar, FaClock, FaCalendar } from 'react-icons/fa'
- **Backend Endpoint**: api/sessions/history.php
- **Layout**:
┌─────────────────────────────────────┐
│ COOKING HISTORY │
│ 📊 Stats: 42 Sessions | 65h Total │
├─────────────────────────────────────┤
│ FILTERS: [📅 This Month] [🔥 All] │
│ [✅ Completed] [❌ Failed] │
├─────────────────────────────────────┤
│ SESSION LIST: │
│ ┌─────────────────────────────┐ │
│ │ 🍕 Pizza | ⏱️ 45min | ✅ │ │
│ │ 📅 Jan 15 | 🏆 +150 EXP │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 🍝 Pasta | ⏱️ 30min | ✅ │ │
│ │ 📅 Jan 14 | 🏆 +120 EXP │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────────┘
- **Functions**:
- `loadSessionHistory() -> void`: Loads user's cooking history
- `filterSessions(filterType) -> array`: Filters sessions by criteria
- `calculateStatistics() -> object`: Calculates cooking stats

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
  - `getShopCategories() -> array`: Returns shop item categories
  - `getSessionStatusLabels() -> object`: Returns cooking session status labels
- **Removed**: All challenge and achievement related constants

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
  - `calculateSessionRewards(session_data) -> object`: Calculates rewards for completed session

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

#### **src/api/inventory.js**
- **Description**: API functions for inventory operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/inventory/list.php, api/inventory/use.php
- **Functions**:
  - `getUserInventory() -> promise`: Gets user's inventory items
  - `useConsumable(inventoryId) -> promise`: Uses a consumable item
  - `getItemCategories() -> promise`: Gets inventory item categories

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

#### **src/api/purchase.js**
- **Description**: API functions for purchase operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/purchase/recipe.php, api/purchase/item.php
- **Functions**:
  - `purchaseRecipe(recipeId, currencyType) -> promise`: Purchases a recipe
  - `purchaseItem(itemId, currencyType) -> promise`: Purchases a shop item
  - `getPurchaseHistory() -> promise`: Gets user's purchase history
  - `checkRecipeAccess(recipeId) -> promise`: Checks if user has access to recipe

---

#### **src/api/chat.js**
- **Description**: API functions for chat operations
- **Required Imports**: api from '../utils/api'
- **Backend Endpoint**: api/chat/messages.php
- **Functions**:
  - `sendChatMessage(sessionId, message) -> promise`: Sends chat message
  - `getChatMessages(sessionId, limit) -> promise`: Gets chat history
  - `markMessagesAsRead(sessionId) -> promise`: Marks messages as read

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
<details> 
<summary>Frontend</summary>

</details>

<details> 
<summary>Backend</summary>

</details> 

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

# ✨ Features

---

# 🎨 Styles

---