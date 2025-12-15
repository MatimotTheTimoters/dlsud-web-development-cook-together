# Styles

## Feature 1: User Registration

### RegisterPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🍳 CookTogether                     │
├─────────────────────────────────────┤
│                                     │
│        CREATE ACCOUNT               │
│        ──────────────────           │
│                                     │
│  [RegisterForm component]           │
│                                     │
│  Already have account? [Login]      │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFFAF0 (Floral White), Header: #E63946 (Imperial Red), Form container: #FFFFFF (White), Accents: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Typography, Container, Box, Link), `@mui/icons-material` (LocalDining), `react-router-dom` (Link), `framer-motion` (for page transitions)

### RegisterForm.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Username: [____________]            │
│ Email:    [____________]            │
│ Password: [____________]            │
│                                     │
│ [🍳 CREATE ACCOUNT button]          │
│                                     │
│ ─── or continue with ───            │
│                                     │
│ [Google button] [Facebook button]   │
│                                     │
│ Terms: [✓] I agree to terms        │
└─────────────────────────────────────┘
```

**Theme**: Input border: #A8DADC (Powder Blue), Button: #E63946 (Imperial Red), Social buttons: #457B9D (Queen Blue), Text: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (TextField, Button, Checkbox, FormControlLabel, Divider), `@mui/icons-material` (Google, Facebook), `react-hook-form` (for form management), `axios` (for API calls), `notistack` (for success/error notifications)

## Feature 2: User Login

### LoginPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🍳 CookTogether                     │
├─────────────────────────────────────┤
│                                     │
│         WELCOME BACK!               │
│        ──────────────────           │
│                                     │
│  [LoginForm component]              │
│                                     │
│  New here? [Create Account]         │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F1FAEE (Honeydew), Header: #457B9D (Queen Blue), Form container: #FFFFFF (White), Links: #E63946 (Imperial Red)
**Imports**: `@mui/material` (Typography, Container, Box, Link), `@mui/icons-material` (LocalDining), `react-router-dom` (Link), `framer-motion` (for page transitions)

### LoginForm.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Username/Email: [____________]      │
│ Password:       [____________]       │
│                                     │
│ [🔐 Remember me checkbox]           │
│ [Forgot Password?]                  │
│                                     │
│ [🍳 LOGIN button]                   │
│                                     │
│ ─── or continue with ───            │
│                                     │
│ [Google button] [Facebook button]   │
└─────────────────────────────────────┘
```

**Theme**: Input focus: #A8DADC (Powder Blue), Button: #457B9D (Queen Blue), Checkbox: #E63946 (Imperial Red), Social buttons: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (TextField, Button, Checkbox, FormControlLabel, Divider), `@mui/icons-material` (Google, Facebook, Lock), `react-hook-form`, `axios`, `notistack`

## Feature 3: View User Profile

### ProfilePage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [Back button]        [Settings icon]│
├─────────────────────────────────────┤
│                                     │
│     [UserAvatar component]          │
│     Chef John                       │
│     @chefjohn                       │
│     🏆 Level 15 | 📍 New York       │
│                                     │
│  [StatsTabs component]              │
│  ┌────┬────┬────┐                   │
│  │ 50 │ 12 │ 8  │                   │
│  │Recipes│Created│Completed│        │
│  └────┴────┴────┘                   │
│                                     │
│  [EditProfileButton component]      │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F1FAEE (Honeydew), Header: #457B9D (Queen Blue), Avatar border: #E63946 (Imperial Red), Stats cards: #A8DADC (Powder Blue), Text: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (Container, Typography, IconButton, Paper, Grid), `@mui/icons-material` (ArrowBack, Settings, LocationOn), `react-router-dom` (useNavigate), `axios`, `react-circular-progressbar` (for level progress), `date-fns` (format join date)

## Feature 4: Create Recipe

### CreateRecipePage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [Back button]  CREATE NEW RECIPE    │
├─────────────────────────────────────┤
│                                     │
│  [RecipeForm component]             │
│                                     │
│  [ImageUpload component]            │
│                                     │
│  [SaveRecipeButton component]       │
│  [CancelButton component]           │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFFAF0 (Floral White), Header: #E63946 (Imperial Red), Form sections: #FFFFFF (White), Buttons: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Container, AppBar, Toolbar, IconButton, Typography), `@mui/icons-material` (ArrowBack), `react-router-dom` (useNavigate), `framer-motion` (for page transitions)

### RecipeForm.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Recipe Title: [____________________]│
│                                     │
│ Description:  [____________________]│
│               [____________________]│
│                                     │
│ ┌──────┬──────┬──────┬────────┐     │
│ │ Prep:│ Cook:│ Serves│Difficulty│  │
│ │[15]  │[30]  │[4]    │[Medium▼]│  │
│ └──────┴──────┴──────┴────────┘     │
│                                     │
│ Category: [Main Dish▼]              │
│                                     │
│ INGREDIENTS                         │
│ [IngredientList component]          │
│                                     │
│ STEPS                               │
│ [StepList component]                │
│                                     │
│ [➕ Add Ingredient] [➕ Add Step]   │
└─────────────────────────────────────┘
```

**Theme**: Input border: #A8DADC (Powder Blue), Section headers: #1D3557 (Prussian Blue), Add buttons: #E63946 (Imperial Red), Select dropdowns: #457B9D (Queen Blue)
**Imports**: `@mui/material` (TextField, Select, MenuItem, Button, FormControl, InputLabel, Box, Typography), `@mui/icons-material` (Add, Timer, Restaurant), `react-hook-form`, `axios`, `notistack`, `framer-motion` (for adding items)

## Feature 5: View Recipe List

### RecipesPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🍳 Recipes        [SearchBar]       │
├─────────────────────────────────────┤
│                                     │
│  [RecipeFilters component]          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [RecipeCard component]      │    │
│  │ [RecipeCard component]      │    │
│  │ [RecipeCard component]      │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  [CreateRecipeButton component]     │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F1FAEE (Honeydew), Header: #457B9D (Queen Blue), Card grid: #FFFFFF (White), Create button: #E63946 (Imperial Red)
**Imports**: `@mui/material` (Container, Grid, Typography, Fab), `@mui/icons-material` (Add, Search), `react-router-dom` (Link), `framer-motion` (for card animations), `axios` (for fetching recipes)

### RecipeCard.jsx

**Layout**:

```
┌─────────────────────────┐
│ [Recipe Image]          │
│                         │
│ 🍝 Spaghetti Carbonara  │
│ 👤 Chef John            │
│ ⏱️ 45min 🍽️ 4          │
│ 🏷️ Pasta                │
│                         │
│ [👍 24] [👁️ 120]       │
└─────────────────────────┘
```

**Theme**: Card background: #FFFFFF (White), Title: #1D3557 (Prussian Blue), Meta info: #457B9D (Queen Blue), Stats: #E63946 (Imperial Red), Border: #A8DADC (Powder Blue)
**Imports**: `@mui/material` (Card, CardMedia, CardContent, CardActions, Typography, IconButton), `@mui/icons-material` (Favorite, Visibility, Timer, Restaurant, Person), `framer-motion` (for hover effects), `react-router-dom` (Link for navigation)

## Feature 6: View Single Recipe

### RecipeDetailPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [Back button]                       │
├─────────────────────────────────────┤
│                                     │
│  [RecipeHeader component]           │
│                                     │
│  [RecipeImage component]            │
│                                     │
│  [IngredientList component]         │
│  [StepList component]               │
│                                     │
│  [StartCookingButton component]     │
│  [SaveRecipeButton component]       │
│                                     │
│  [CommentSection component]         │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFFAF0 (Floral White), Sections: #FFFFFF (White), Action buttons: #E63946 (Imperial Red), Secondary buttons: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Container, IconButton, Typography, Box, Divider), `@mui/icons-material` (ArrowBack, Favorite, Bookmark, PlayArrow), `react-router-dom` (useNavigate, useParams), `axios`, `framer-motion` (for section transitions)

## Feature 7: Start Cooking Session

### CookingSessionPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 👨‍🍳 Cooking Session #123           │
├─────────────────────────────────────┤
│                                     │
│  [SessionTimer component]           │
│                                     │
│  [CurrentStep component]            │
│                                     │
│  [StepNavigation component]         │
│                                     │
│  [IngredientChecklist component]    │
│                                     │
│  [SessionNotes component]           │
│                                     │
│  [CompleteSessionButton component]  │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFF8E1 (Cornsilk), Header: #E63946 (Imperial Red), Timer: #457B9D (Queen Blue), Current step: #A8DADC (Powder Blue)
**Imports**: `@mui/material` (Container, Typography, Box, Paper), `@mui/icons-material` (Timer, NavigateNext, NavigateBefore), `react-router-dom` (useParams), `axios`, `framer-motion` (for step transitions), `react-confetti` (for session completion)

### SessionTypeModal.jsx (Feature 7.1)

**Layout**:

```
┌─────────────────────────────────────┐
│    Start Cooking Session            │
│        ──────────────────           │
│                                     │
│  Choose session type:               │
│                                     │
│  [👤 SOLO button]                   │
│  Cook by yourself                   │
│                                     │
│  [👥 MULTIPLAYER button]            │
│  Cook with friends                  │
│                                     │
│  [Cancel button]                    │
└─────────────────────────────────────┘
```

**Theme**: Modal background: #FFFFFF (White), Solo button: #457B9D (Queen Blue), Multiplayer button: #E63946 (Imperial Red), Text: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (Modal, Box, Button, Typography), `@mui/icons-material` (Person, Group), `framer-motion` (for modal animation), `axios` (for creating session)

## Feature 8: Join Cooking Session

### JoinSessionButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [👥 JOIN SESSION button]            │
│                                     │
│  When clicked:                      │
│  ┌─────────────────────────────┐    │
│  │ Enter Session Code:         │    │
│  │ [__________]                │    │
│  │                             │    │
│  │ [Join] [Cancel]             │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Button: #E63946 (Imperial Red), Modal: #FFFFFF (White), Input: #A8DADC (Powder Blue), Join button: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Button, Modal, Box, TextField), `@mui/icons-material` (Group), `framer-motion` (for modal animation), `axios`, `notistack` (for join status)

### SessionsPage.jsx (Feature 8.1)

**Layout**:

```
┌─────────────────────────────────────┐
│ 👥 Active Sessions   [Refresh]      │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Session #123                │    │
│  │ 🍝 Spaghetti Carbonara      │    │
│  │ 👤 Host: Chef John          │    │
│  │ 👥 3/6 players              │    │
│  │ [JoinSessionButton]         │    │
│  └─────────────────────────────┘    │
│                                     │
│  [CreateSessionButton]              │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F1FAEE (Honeydew), Session cards: #FFFFFF (White), Card border: #A8DADC (Powder Blue), Join buttons: #E63946 (Imperial Red)
**Imports**: `@mui/material` (Container, Grid, Typography, IconButton, Card, CardContent), `@mui/icons-material` (Refresh, Add), `react-router-dom` (Link), `axios`, `framer-motion` (for card animations)

### SessionDetailPage.jsx (Feature 8.2)

**Layout**:

```
┌─────────────────────────────────────┐
│ [Back] Session Lobby #ABC123        │
├─────────────────────────────────────┤
│                                     │
│  Recipe: 🍝 Spaghetti Carbonara     │
│  Host: 👤 Chef John                 │
│                                     │
│  PLAYERS (3/6):                     │
│  ┌─────────────────────────────┐    │
│  │ 👤 Chef John (Host) ✅      │    │
│  │ 👤 Baker Mary      ✅       │    │
│  │ 👤 Cook Max        ❌       │    │
│  │ [Empty slot]               │    │
│  │ [Empty slot]               │    │
│  │ [Empty slot]               │    │
│  └─────────────────────────────┘    │
│                                     │
│  [KickButton] (host only)           │
│                                     │
│  [StartSessionButton] (host only)   │
│  [LeaveSessionButton]               │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFF8E1 (Cornsilk), Player list: #FFFFFF (White), Ready status (✅): #4CAF50 (Green), Not ready (❌): #E63946 (Red), Host controls: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Container, Typography, List, ListItem, ListItemText, Chip, Box), `@mui/icons-material` (ArrowBack, CheckCircle, Cancel, Person), `react-router-dom` (useParams, useNavigate), `axios`, `framer-motion` (for player list updates)

### ReadyButton.jsx (Feature 8.3)

**Layout**:

```
┌─────────────────────────────────────┐
│ When not ready:                     │
│ [👤 READY? button]                  │
│                                     │
│ When ready:                         │
│ [✅ READY! button]                  │
│                                     │
│ Toggle between states               │
└─────────────────────────────────────┘
```

**Theme**: Not ready: #FF9800 (Orange), Ready: #4CAF50 (Green), Hover: #45a049 (Dark Green)
**Imports**: `@mui/material` (Button), `@mui/icons-material` (Person, CheckCircle), `axios`, `framer-motion` (for toggle animation)

### KickButton.jsx (Feature 8.4)

**Layout**:

```
┌─────────────────────────────────────┐
│ [❌ KICK button]                    │
│                                     │
│  Only visible to host               │
│  Next to player name in list        │
└─────────────────────────────────────┘
```

**Theme**: Button: #E63946 (Imperial Red), Hover: #d32f2f (Dark Red)
**Imports**: `@mui/material` (IconButton), `@mui/icons-material` (Close), `axios`, `notistack` (for confirmation)

### StartSessionButton.jsx (Feature 8.5)

**Layout**:

```
┌─────────────────────────────────────┐
│ [▶️ START SESSION button]           │
│                                     │
│  Enabled when all players ready     │
│  or host forces start               │
└─────────────────────────────────────┘
```

**Theme**: Enabled: #4CAF50 (Green), Disabled: #CCCCCC (Gray), Hover: #45a049 (Dark Green)
**Imports**: `@mui/material` (Button), `@mui/icons-material` (PlayArrow), `axios`, `react-router-dom` (useNavigate), `framer-motion` (for pulsing animation when ready)

## Feature 9: Complete Cooking Step

### CompleteStepButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [✅ MARK COMPLETE button]           │
│                                     │
│  Next to each step in               │
│  cooking session                    │
│                                     │
│  Changes to:                        │
│  [✓ COMPLETED] after clicking       │
└─────────────────────────────────────┘
```

**Theme**: Incomplete: #457B9D (Queen Blue), Complete: #4CAF50 (Green), Hover: #45a049 (Dark Green)
**Imports**: `@mui/material` (Button), `@mui/icons-material` (CheckCircle), `framer-motion` (for checkmark animation), `axios`

## Feature 10: Like Recipe

### LikeButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [🤍 LIKE] (not liked)               │
│                                     │
│ [❤️ LIKED] (liked)                  │
│                                     │
│ Shows count: [🤍 24] or [❤️ 25]     │
└─────────────────────────────────────┘
```

**Theme**: Not liked: #757575 (Gray), Liked: #E63946 (Red), Hover: #d32f2f (Dark Red)
**Imports**: `@mui/material` (IconButton, Typography), `@mui/icons-material` (Favorite, FavoriteBorder), `framer-motion` (for heart animation), `axios`

## Feature 11: Save Recipe to Cookbook

### SaveRecipeButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [📖 SAVE] (not saved)               │
│                                     │
│ [📚 SAVED] (saved)                  │
│                                     │
│ Add to cookbook                     │
└─────────────────────────────────────┘
```

**Theme**: Not saved: #457B9D (Queen Blue), Saved: #4CAF50 (Green), Hover: #45a049 (Dark Green)
**Imports**: `@mui/material` (Button), `@mui/icons-material` (Bookmark, BookmarkBorder), `framer-motion` (for bookmark animation), `axios`, `notistack` (for save confirmation)

## Feature 12: View Cookbook

### CookbookPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 📚 My Cookbook       [Search]       │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┬──────┬──────┐             │
│  │All   │Main  │Dessert│ [Filters]  │
│  └──────┴──────┴──────┘             │
│                                     │
│  [RecipeCard component] grid        │
│                                     │
│  [CreateRecipeButton component]     │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFF8E1 (Cornsilk), Header: #1D3557 (Prussian Blue), Filter tabs: #A8DADC (Powder Blue), Active tab: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Container, Tabs, Tab, Box, Grid), `@mui/icons-material` (Book, Search), `axios`, `framer-motion` (for page transition)

## Feature 13: Purchase Recipe

### PurchaseButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [💰 PURCHASE button]                │
│                                     │
│  Shows price: [💰 50 gold]          │
│                                     │
│  Modal appears on click:            │
│  ┌─────────────────────────────┐    │
│  │ Confirm Purchase?           │    │
│  │ Recipe: Spaghetti Carbonara │    │
│  │ Price: 50 gold              │    │
│  │                             │    │
│  │ [Confirm] [Cancel]          │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Button: #FF9800 (Orange), Price: #FFD700 (Gold), Modal: #FFFFFF (White), Confirm button: #4CAF50 (Green)
**Imports**: `@mui/material` (Button, Modal, Box, Typography), `@mui/icons-material` (AttachMoney), `framer-motion` (for modal animation), `axios`, `notistack` (for purchase confirmation)

## Feature 14: Shop Item Purchase

### ShopPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🏪 Shop         Gold: 💰 150        │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┬──────┬──────┐             │
│  │Tools │Icons │Themes│ [Categories]│
│  └──────┴──────┴──────┘             │
│                                     │
│  [ShopItem component] grid          │
│                                     │
│  [InventoryButton component]        │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #E3F2FD (Light Blue), Header: #1D3557 (Prussian Blue), Category tabs: #90CAF9 (Blue 200), Active category: #2196F3 (Blue 500)
**Imports**: `@mui/material` (Container, Tabs, Tab, Grid, Typography), `@mui/icons-material` (Store, AttachMoney), `axios`, `framer-motion` (for page transition)

### ShopItem.jsx

**Layout**:

```
┌─────────────────────────┐
│ [Item Icon]             │
│                         │
│ Golden Whisk            │
│                         │
│ +10% cooking speed      │
│                         │
│ 💰 200 gold             │
│                         │
│ [BUY]                   │
└─────────────────────────┘
```

**Theme**: Card: #FFFFFF (White), Title: #1D3557 (Prussian Blue), Price: #FFD700 (Gold), Buy button: #4CAF50 (Green)
**Imports**: `@mui/material` (Card, CardContent, CardActions, Typography, Button), `@mui/icons-material` (Kitchen, AttachMoney), `framer-motion` (for hover effect), `axios`, `notistack` (for purchase feedback)

## Feature 15: Send Chat Message

### ChatInput.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [Message input____________] [➤ Send]│
│                                     │
│  Typing indicator when active       │
└─────────────────────────────────────┘
```

**Theme**: Input: #FFFFFF (White), Border: #A8DADC (Powder Blue), Send button: #457B9D (Queen Blue), Hover: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (TextField, IconButton, Box), `@mui/icons-material` (Send, EmojiEmotions), `@emoji-mart/react` (for emoji picker), `axios`, `framer-motion` (for typing indicator)

### ChatMessage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 👤 Chef John                        │
│ Hello team! Ready to cook?          │
│ 10:30 AM                            │
│                                     │
│ (Different styles for self vs others)│
└─────────────────────────────────────┘
```

**Theme**: Self message: #E3F2FD (Light Blue), Other message: #F5F5F5 (Light Gray), Sender name: #457B9D (Queen Blue), Time stamp: #757575 (Gray)
**Imports**: `@mui/material` (Box, Typography, Avatar), `date-fns` (for formatting timestamp), `framer-motion` (for message entrance)

## Feature 16: View Activity Feed

### ActivityPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 📋 Activity Feed     [Filter]       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 👤 Chef John                │    │
│  │ created recipe "Pasta"      │    │
│  │ 2 hours ago                 │    │
│  └─────────────────────────────┘    │
│                                     │
│  [LoadMoreButton component]         │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F9F9F9 (Light Gray), Activity cards: #FFFFFF (White), Card border: #E0E0E0 (Gray 300), Text: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (Container, Card, CardContent, Typography, Button), `@mui/icons-material` (RssFeed, FilterList), `date-fns` (for relative time), `axios`, `framer-motion` (for feed animations)

## Feature 17: Follow User

### FollowButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [➕ FOLLOW] (not following)         │
│                                     │
│ [✓ FOLLOWING] (following)           │
│                                     │
│ Toggle between states               │
└─────────────────────────────────────┘
```

**Theme**: Not following: #457B9D (Queen Blue), Following: #4CAF50 (Green), Hover: #45a049 (Dark Green)
**Imports**: `@mui/material` (Button), `@mui/icons-material` (PersonAdd, PersonAddDisabled), `framer-motion` (for toggle animation), `axios`

## Feature 18: Level Up Notification

### LevelUpNotification.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│        🎉 LEVEL UP!                 │
│        ──────────────               │
│                                     │
│  You reached Level 15!              │
│                                     │
│  Rewards:                           │
│  💰 +100 gold                       │
│  💎 +5 gems                         │
│                                     │
│  [Awesome! button]                  │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFF3E0 (Orange 50), Header: #FF9800 (Orange), Rewards: #FFD700 (Gold) / #E040FB (Purple), Button: #4CAF50 (Green)
**Imports**: `@mui/material` (Modal, Box, Typography, Button), `@mui/icons-material` (TrendingUp, AttachMoney, Diamond), `react-confetti` (for celebration effect), `lottie-react` (for level up animation), `framer-motion` (for modal animation)

## Feature 19: Daily Login Bonus

### DailyBonusModal.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│        🎁 DAILY BONUS!              │
│        ───────────────              │
│                                     │
│  Day 7 Streak! 🏆                   │
│                                     │
│  You earned:                        │
│  💰 50 gold                         │
│  💎 2 gems                          │
│                                     │
│  [Claim button]                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #E8F5E9 (Green 50), Header: #4CAF50 (Green), Rewards: #FFD700 (Gold) / #E040FB (Purple), Claim button: #FF9800 (Orange)
**Imports**: `@mui/material` (Modal, Box, Typography, Button), `@mui/icons-material` (CardGiftcard, EmojiEvents, AttachMoney, Diamond), `lottie-react` (for gift animation), `react-confetti` (for celebration), `framer-motion` (for modal animation)

## Feature 20: View Home Page

### HomePage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🍳 CookTogether                     │
├─────────────────────────────────────┤
│                                     │
│  Welcome back, Chef!                │
│                                     │
│  [QuickActions component]           │
│  ┌─────┬─────┬─────┐               │
│  │🍳   │📚   │👥   │               │
│  │Cook │Cook-│Join │               │
│  │Now  │book │Session              │
│  └─────┴─────┴─────┘               │
│                                     │
│  Featured Recipes:                  │
│  [RecipeCard component] carousel    │
│                                     │
│  Recent Activity:                   │
│  [ActivityFeed component]           │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F1FAEE (Honeydew), Header: #E63946 (Imperial Red), Quick actions: #A8DADC (Powder Blue), Sections: #FFFFFF (White)
**Imports**: `@mui/material` (Container, Grid, Typography, Paper, Button), `@mui/icons-material` (LocalDining, Book, Group), `react-router-dom` (Link), `axios`, `framer-motion` (for page animations), `lottie-react` (for welcome animation)

## Feature 21: Edit User Profile

### EditProfileForm.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Edit Profile                        │
│ ──────────────                      │
│                                     │
│ [UserAvatar component] [Change]     │
│                                     │
│ Username: [chefjohn_________]       │
│ Bio: [Professional chef_________]   │
│ Location: [New York_________]       │
│                                     │
│ [Save Changes button]               │
│ [Cancel button]                     │
└─────────────────────────────────────┘
```

**Theme**: Form: #FFFFFF (White), Input border: #A8DADC (Powder Blue), Save button: #4CAF50 (Green), Cancel button: #757575 (Gray)
**Imports**: `@mui/material` (TextField, Button, Box, Avatar), `@mui/icons-material` (Edit, Save, Cancel), `react-hook-form`, `axios`, `notistack` (for save confirmation)

## Feature 22: Delete Recipe

### DeleteRecipeButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [🗑️ DELETE button]                  │
│                                     │
│  Shows confirmation modal:          │
│  ┌─────────────────────────────┐    │
│  │ Delete Recipe?              │    │
│  │ "Spaghetti Carbonara"       │    │
│  │ This cannot be undone.      │    │
│  │                             │    │
│  │ [Delete] [Cancel]           │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Button: #E63946 (Red), Modal: #FFFFFF (White), Delete button: #E63946 (Red), Cancel button: #757575 (Gray)
**Imports**: `@mui/material` (Button, Modal, Box, Typography), `@mui/icons-material` (Delete), `framer-motion` (for modal animation), `axios`, `notistack` (for deletion feedback)

## Feature 23: Search Recipes

### SearchBar.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [🔍 Search recipes...____________]  │
│                                     │
│  Shows dropdown with results:       │
│  ┌─────────────────────────────┐    │
│  │ Spaghetti Carbonara         │    │
│  │ Chicken Tikka Masala        │    │
│  │ Avocado Toast               │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Input: #FFFFFF (White), Border: #A8DADC (Powder Blue), Dropdown: #FFFFFF (White), Highlight: #E3F2FD (Light Blue)
**Imports**: `@mui/material` (TextField, Paper, List, ListItem, ListItemText), `@mui/icons-material` (Search), `framer-motion` (for dropdown animation), `axios` (for search API)

## Feature 24: Filter Recipes

### RecipeFilters.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🔍 Filters                          │
│ ──────────                          │
│                                     │
│ Difficulty:                         │
│ [○ Easy] [● Medium] [○ Hard]       │
│                                     │
│ Time: [30min▼]                     │
│                                     │
│ Category: [All▼]                   │
│                                     │
│ [Apply Filters] [Reset]            │
└─────────────────────────────────────┘
```

**Theme**: Container: #FFFFFF (White), Active filter: #457B9D (Queen Blue), Inactive filter: #E0E0E0 (Gray 300), Apply button: #4CAF50 (Green)
**Imports**: `@mui/material` (Paper, FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Button, Box), `@mui/icons-material` (FilterList), `framer-motion` (for filter transitions)

## Feature 25: Rate Recipe

### RatingStars.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Rate this recipe:                   │
│                                     │
│ [☆][☆][☆][☆][☆] (0 stars)          │
│                                     │
│ [★][★][★][☆][☆] (3 stars)          │
│                                     │
│ Shows on hover                      │
└─────────────────────────────────────┘
```

**Theme**: Empty star: #E0E0E0 (Gray 300), Filled star: #FFD700 (Gold), Hover: #FFC107 (Amber)
**Imports**: `@mui/material` (Rating), `@mui/icons-material` (Star, StarBorder), `framer-motion` (for star hover effects), `axios`

## Feature 26: Add Recipe Comment

### CommentForm.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Add a comment:                      │
│ [_____________________________]     │
│                                     │
│ [Post Comment button]               │
└─────────────────────────────────────┘
```

**Theme**: Input: #FFFFFF (White), Border: #A8DADC (Powder Blue), Button: #457B9D (Queen Blue), Hover: #1D3557 (Prussian Blue)
**Imports**: `@mui/material` (TextField, Button, Box), `@emoji-mart/react` (for emoji picker), `react-hook-form`, `axios`, `framer-motion` (for form animation)

### CommentItem.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 👤 Chef John                        │
│ Great recipe! Loved it.             │
│                                     │
│ 2 hours ago  [Reply] [Like]        │
└─────────────────────────────────────┘
```

**Theme**: Background: #F9F9F9 (Light Gray), Border: #E0E0E0 (Gray 300), Author: #457B9D (Queen Blue), Actions: #757575 (Gray)
**Imports**: `@mui/material` (Box, Typography, Avatar, IconButton), `@mui/icons-material` (Reply, ThumbUp), `date-fns` (for relative time), `axios`, `framer-motion` (for comment entrance)

## Feature 27: Upload Recipe Image

### ImageUpload.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [📷 Upload Image button]            │
│                                     │
│  or drag & drop here                │
│                                     │
│  Preview shows when image selected  │
└─────────────────────────────────────┘
```

**Theme**: Upload area: #F5F5F5 (Light Gray), Border: #A8DADC (Powder Blue), Hover: #E3F2FD (Light Blue), Button: #457B9D (Queen Blue)
**Imports**: `@mui/material` (Button, Box), `@mui/icons-material` (CloudUpload), `react-dropzone` (for drag-and-drop), `axios` (for image upload), `framer-motion` (for preview animation)

## Feature 28: Share Recipe

### ShareButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [📤 SHARE button]                   │
│                                     │
│  Opens modal:                       │
│  ┌─────────────────────────────┐    │
│  │ Share Recipe                │    │
│  │                             │    │
│  │ [Facebook][Twitter][Copy]   │    │
│  │                             │    │
│  │ Link: cooktogether.com/123  │    │
│  │ [Copy Link]                 │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Button: #2196F3 (Blue), Modal: #FFFFFF (White), Social buttons: respective brand colors, Copy button: #4CAF50 (Green)
**Imports**: `@mui/material` (Button, Modal, Box, IconButton, Typography), `@mui/icons-material` (Share, Facebook, Twitter, ContentCopy), `framer-motion` (for modal animation), `notistack` (for copy confirmation)

## Feature 29: View Recipe Statistics

### RecipeStats.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 📊 Statistics                       │
│ ─────────────                       │
│                                     │
│ 👁️ 1,245 views                     │
│ 👨‍🍳 89 cooks                       │
│ 📚 42 saves                         │
│ 👍 78 likes                         │
│ ⭐ 4.5 rating                       │
└─────────────────────────────────────┘
```

**Theme**: Container: #FFFFFF (White), Icons: #457B9D (Queen Blue), Numbers: #1D3557 (Prussian Blue), Rating: #FFD700 (Gold)
**Imports**: `@mui/material` (Paper, Grid, Typography, Box), `@mui/icons-material` (Visibility, Restaurant, Bookmark, Favorite, Star), `framer-motion` (for counter animations)

## Feature 30: Session Timer

### SessionTimer.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ ⏱️ Timer: 45:23                    │
│                                     │
│ [⏸️ Pause] [▶️ Resume]              │
│                                     │
│ Progress: [=======------] 70%      │
└─────────────────────────────────────┘
```

**Theme**: Timer: #1D3557 (Prussian Blue), Pause button: #FF9800 (Orange), Resume button: #4CAF50 (Green), Progress bar: #A8DADC (Powder Blue)
**Imports**: `@mui/material` (Box, Typography, IconButton, LinearProgress), `@mui/icons-material` (Pause, PlayArrow), `react-circular-progressbar` (for circular timer option), `framer-motion` (for timer animations)

## Feature 31: Ingredient Checklist

### IngredientChecklist.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 📝 Ingredients                      │
│ ─────────────                       │
│                                     │
│ [ ] 400g spaghetti                  │
│ [✓] 200g pancetta                   │
│ [ ] 4 eggs                          │
│ [ ] 100g Pecorino cheese            │
│                                     │
│ 1/4 completed                       │
└─────────────────────────────────────┘
```

**Theme**: Unchecked: #E0E0E0 (Gray 300), Checked: #4CAF50 (Green), Text: #1D3557 (Prussian Blue), Progress: #A8DADC (Powder Blue)
**Imports**: `@mui/material` (List, ListItem, Checkbox, Typography, LinearProgress), `@mui/icons-material` (CheckBox, CheckBoxOutlineBlank), `framer-motion` (for checkmark animation)

## Feature 32: Session Notes

### SessionNotes.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 📝 Notes                            │
│ ───────                             │
│                                     │
│ [_____________________________]     │
│ [_____________________________]     │
│ [_____________________________]     │
│                                     │
│ [Save] [Clear]                      │
└─────────────────────────────────────┘
```

**Theme**: Textarea: #FFFFFF (White), Border: #A8DADC (Powder Blue), Save button: #4CAF50 (Green), Clear button: #757575 (Gray)
**Imports**: `@mui/material` (TextField, Button, Box), `@mui/icons-material` (Note, Save, Clear), `axios`, `framer-motion` (for textarea expansion)

## Feature 33: Cooking Session Voting

### VoteButtons.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ Vote on next step:                  │
│                                     │
│ [👍 Continue] [👎 Change]           │
│                                     │
│ Results: 3 👍 | 1 👎                │
└─────────────────────────────────────┘
```

**Theme**: Yes button: #4CAF50 (Green), No button: #E63946 (Red), Results: #1D3557 (Prussian Blue), Disabled: #E0E0E0 (Gray 300)
**Imports**: `@mui/material` (ButtonGroup, Button, Typography), `@mui/icons-material` (ThumbUp, ThumbDown), `framer-motion` (for vote animation), `axios`

## Feature 34: Session Completion Rewards

### SessionComplete.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│        🎉 SESSION COMPLETE!         │
│        ────────────────────         │
│                                     │
│  Time: 45:23                        │
│  Accuracy: 92%                      │
│                                     │
│  Rewards earned:                    │
│  💰 +150 gold                       │
│  ⭐ +50 XP                          │
│  🏆 "Speed Chef" achievement        │
│                                     │
│  [Continue button]                  │
└─────────────────────────────────────┘
```

**Theme**: Background: #FFF3E0 (Orange 50), Header: #FF9800 (Orange), Rewards: #FFD700 (Gold) / #4CAF50 (Green), Continue button: #2196F3 (Blue)
**Imports**: `@mui/material` (Modal, Box, Typography, Button), `@mui/icons-material` (EmojiEvents, AttachMoney, TrendingUp), `react-confetti`, `lottie-react` (for celebration animation), `framer-motion` (for modal animation)

## Feature 35: Inventory Management

### InventoryPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🎒 Inventory     Gold: 💰 250       │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┬──────┬──────┐             │
│  │All   │Tools │Cosmetic│[Tabs]     │
│  └──────┴──────┴──────┘             │
│                                     │
│  [InventoryItem component] grid     │
│                                     │
│  [EquipButton] [UseButton]          │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F3E5F5 (Purple 50), Header: #7B1FA2 (Purple 700), Tabs: #E1BEE7 (Purple 200), Active tab: #9C27B0 (Purple 500)
**Imports**: `@mui/material` (Container, Tabs, Tab, Grid, Typography), `@mui/icons-material` (Backpack, AttachMoney), `axios`, `framer-motion` (for page transition)

## Feature 36: User Notifications

### NotificationBell.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [🔔 NotificationBell]               │
│                                     │
│  Shows badge with count: [3]        │
│                                     │
│  Click opens dropdown:              │
│  ┌─────────────────────────────┐    │
│  │ 👤 Chef John liked your     │    │
│  │ recipe                      │    │
│  │ 10 min ago                  │    │
│  │                             │    │
│  │ [Mark all read] [View all]  │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Bell: #457B9D (Queen Blue), Badge: #E63946 (Red), Dropdown: #FFFFFF (White), New notification: #E3F2FD (Light Blue)
**Imports**: `@mui/material` (IconButton, Badge, Menu, MenuItem, Box), `@mui/icons-material` (Notifications, Circle), `date-fns` (for relative time), `axios`, `framer-motion` (for menu animation)

## Feature 37: User Settings

### SettingsPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ ⚙️ Settings       [Save]            │
├─────────────────────────────────────┤
│                                     │
│  Notifications: [ON/OFF toggle]     │
│  Email updates: [ON/OFF toggle]     │
│  Privacy: [Public/Private toggle]   │
│                                     │
│  [Change Password button]           │
│  [Delete Account button]            │
│                                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #F9F9F9 (Light Gray), Section: #FFFFFF (White), Toggle ON: #4CAF50 (Green), Toggle OFF: #E0E0E0 (Gray 300)
**Imports**: `@mui/material` (Container, Switch, FormControlLabel, Button, Typography, Box), `@mui/icons-material` (Settings, Password, Delete), `react-hook-form`, `axios`, `framer-motion` (for page transition)

## Feature 38: Password Reset

### ForgotPasswordPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 🔒 Forgot Password                  │
│ ────────────────────                │
│                                     │
│  Enter your email:                  │
│  [___________________]              │
│                                     │
│  [Send Reset Link button]           │
│                                     │
│  [Back to Login]                    │
└─────────────────────────────────────┘
```

**Theme**: Background: #F1FAEE (Honeydew), Form: #FFFFFF (White), Input: #A8DADC (Powder Blue), Button: #E63946 (Imperial Red)
**Imports**: `@mui/material` (Container, TextField, Button, Typography, Box), `@mui/icons-material` (Lock), `react-hook-form`, `axios`, `notistack`, `react-router-dom` (Link)

## Feature 39: Email Verification

### VerifyEmailPage.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ 📧 Verify Email                     │
│ ─────────────────                  │
│                                     │
│  Check your email for               │
│  verification link                  │
│                                     │
│  [Resend Email button]              │
│  [Change Email button]              │
│                                     │
│  [Skip for now]                     │
└─────────────────────────────────────┘
```

**Theme**: Background: #E3F2FD (Light Blue), Content: #FFFFFF (White), Text: #1D3557 (Prussian Blue), Buttons: #2196F3 (Blue)
**Imports**: `@mui/material` (Container, Button, Typography, Box), `@mui/icons-material` (Email, Refresh, AlternateEmail), `react-router-dom` (Link), `axios`, `notistack`, `lottie-react` (for email animation)

## Feature 40: Recipe Export/Print

### ExportRecipeButton.jsx

**Layout**:

```
┌─────────────────────────────────────┐
│ [📄 EXPORT button]                  │
│                                     │
│  Opens menu:                        │
│  ┌─────────────────────────────┐    │
│  │ [Print]                     │    │
│  │ [PDF]                       │    │
│  │ [Text]                      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Theme**: Button: #757575 (Gray), Menu: #FFFFFF (White), Menu items: #1D3557 (Prussian Blue), Hover: #F5F5F5 (Light Gray)
**Imports**: `@mui/material` (Button, Menu, MenuItem), `@mui/icons-material` (Print, PictureAsPdf, TextFields), `framer-motion` (for menu animation)