# Database Schema

<details>
<summary>Users Table</summary>

___

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

</details>

<details>
<summary>User_Stats Table</summary>

___

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

</details>

<details>
<summary>User_Relationships Table</summary>

___

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

</details>

<details>
<summary>Recipes Table</summary>

___

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

</details>

<details>
<summary>Recipe_Metadata Table</summary>

___

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

</details>

<details>
<summary>Recipe_Ingredients Table</summary>

___

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

</details>

<details>
<summary>Recipe_Steps Table</summary>

___

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

</details>

<details>
<summary>Recipe_Interactions Table</summary>

___

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Interaction entry ID |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Interaction timestamp |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who interacted |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id)` | Recipe interacted with |
| **interaction_type** | `ENUM('like','dislike','save','purchase')` | `NOT NULL` | Type of interaction |
| **metadata** | `JSON` | `NULL` | Additional interaction data |
| **UNIQUE KEY** | `(user_id, recipe_id, interaction_type)` | `UNIQUE` | Prevent duplicate interactions |

</details>

<details>
<summary>Cooking_Sessions Table</summary>

___

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

</details>

<details>
<summary>Cooking_Session_Details Table</summary>

___

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

</details>

<details>
<summary>Cooking_Session_Participants Table</summary>

___

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

</details>

<details>
<summary>Cooking_Step_Completions Table</summary>

___

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

</details>

<details>
<summary>Cooking_Session_Votes Table</summary>

___

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Vote ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to cooking session |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who voted |
| **vote_type** | `ENUM('skip_read_timer','skip_step','other')` | `NOT NULL` | Type of vote |
| **vote_value** | `BOOLEAN` | `NOT NULL` | Vote value (true/false) |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Vote timestamp |
| **UNIQUE KEY** | `(cooking_session_id, user_id, vote_type)` | `UNIQUE` | One vote per user per type per session |

</details>

<details>
<summary>Cookbooks Table</summary>

___

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Cookbook ID |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| **updated_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last update timestamp |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | Cookbook owner |
| **name** | `VARCHAR(255)` | `NOT NULL` | Cookbook name |
| **description** | `TEXT` | `NULL` | Cookbook description |
| **is_public** | `BOOLEAN` | `DEFAULT FALSE` | Whether cookbook is public |

</details>

<details>
<summary>Cookbook_Recipes Table</summary>

___

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Entry ID |
| **cookbook_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cookbooks(id) ON DELETE CASCADE` | Reference to cookbook |
| **recipe_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES recipes(id)` | Recipe in cookbook |
| **added_by** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | User who added the recipe |
| **notes** | `TEXT` | `NULL` | Personal notes about recipe |
| **added_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Addition timestamp |
| **UNIQUE KEY** | `(cookbook_id, recipe_id)` | `UNIQUE` | Prevent duplicate additions |

</details>

<details>
<summary>Shop_Items Table</summary>

___

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Item unique identifier |
| **name** | `VARCHAR(255)` | `NOT NULL` | Item name |
| **description** | `TEXT` | `NULL` | Item description |
| **item_type** | `ENUM('cosmetic','tool','recipe','boost','other')` | `NOT NULL` | Type of shop item |
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

</details>

<details>
<summary>User_Purchases Table</summary>

___

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

</details>

<details>
<summary>Session_Chat_Messages Table</summary>

___

| **Column Name** | **Data Type** | **Constraint** | **Description** |
|-----------------|---------------|----------------|-----------------|
| **id** | `VARCHAR(255)` | `PRIMARY KEY` | Message ID |
| **cooking_session_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES cooking_sessions(id) ON DELETE CASCADE` | Reference to session |
| **user_id** | `VARCHAR(255)` | `FOREIGN KEY REFERENCES users(id)` | Message sender |
| **message** | `TEXT` | `NOT NULL` | Chat message content |
| **message_type** | `ENUM('text','system','vote')` | `DEFAULT 'text'` | Type of message |
| **created_at** | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Message timestamp |
| **is_read** | `BOOLEAN` | `DEFAULT FALSE` | Whether message was read |

</details>

<details>
<summary>User_Recipe_Access Table</summary>

___

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

</details>

<details>
<summary>User_Inventory Table</summary>

___

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

</details>