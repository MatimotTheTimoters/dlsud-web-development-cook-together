CookTogether 🍳 - Gamified Cooking Web App

CookTogether is an interactive, gamified web application where users can create, share, and cook recipes together in real-time. The platform combines cooking with social gaming elements like leveling up, achievements, and virtual currency.

---

🌟 Live Demo

· Frontend: http://localhost:3000
· Backend API: http://localhost:8080/dlsud-web-development-cook-together/backend/api/
· Database: MySQL on localhost:3306

---

🚀 Quick Start

Prerequisites

· Node.js (v14+)
· PHP (v7.4+)
· MySQL (v5.7+)
· XAMPP/WAMP (for local development)

Installation

1. Clone & Setup

```bash
git clone <repository-url>
cd cooktogether
```

1. Backend Setup

```bash
# Copy backend files to your web server directory (e.g., htdocs)
cp -r backend/ /path/to/htdocs/cooktogether/
```

1. Frontend Setup

```bash
cd frontend
npm install
npm start
```

1. Database Setup

```sql
-- Import the schema
mysql -u root -p < database/schema.sql
```

1. Start Development

· Start XAMPP/WAMP (Apache + MySQL)
· Run npm start in frontend/
· Visit http://localhost:3000

---

📁 Project Structure

```
cooktogether/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── api/             # API configuration
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS styles
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
├── backend/                 # PHP Backend
│   ├── api/                # API endpoints
│   │   ├── auth/           # Authentication
│   │   ├── recipe/         # Recipe operations
│   │   ├── session/        # Cooking sessions
│   │   └── user/           # User management
│   └── db/                 # Database connection
├── database/               # Database schema
└── documentation/          # Project docs
```

---

🎮 Key Features (40 Total)

👤 User Features

1. User Registration - Create account with profile
2. User Login - Secure authentication
3. User Profile - View/edit profile with stats
4. Follow Users - Social connections
5. User Settings - Customize preferences
6. Password Reset - Secure recovery
7. Email Verification - Account confirmation

📝 Recipe Management

1. Create Recipe - Add recipes with ingredients/steps
2. View Recipe List - Browse all recipes
3. View Single Recipe - Detailed recipe view
4. Edit Recipe - Modify existing recipes
5. Delete Recipe - Remove recipes
6. Search Recipes - Find by name/ingredients
7. Filter Recipes - Sort by category/difficulty/time
8. Rate Recipe - 1-5 star ratings
9. Like Recipe - Heart reactions
10. Save to Cookbook - Personal recipe collection
11. Upload Recipe Image - Add photos
12. Share Recipe - Social sharing
13. Export Recipe - Print/PDF export
14. Recipe Statistics - Views, cooks, saves

👨‍🍳 Cooking Experience

1. Start Cooking Session - Begin cooking
2. Join Cooking Session - Multiplayer mode
3. Complete Cooking Steps - Track progress
4. Session Timer - Cooking timer
5. Ingredient Checklist - Track ingredients
6. Session Notes - Add cooking notes
7. Session Voting - Group decisions
8. Session Completion - Finish cooking
9. Session Rewards - Earn XP/gold

🛒 Gamification & Shop

1. Purchase Recipe - Buy premium recipes
2. Shop Items - Virtual goods store
3. Level Up System - Progress levels
4. Daily Login Bonus - Streak rewards
5. Achievements - Earn badges
6. Inventory Management - User items
7. Notifications - Activity alerts

💬 Social Features

1. Chat Messages - Real-time chat
2. Comments - Recipe discussions
3. Activity Feed - Friend activities

---

🎨 Design System

Color Palette

```css
--primary-blue: #457B9D;     /* Queen Blue */
--accent-red: #E63946;       /* Imperial Red */
--light-blue: #A8DADC;       /* Powder Blue */
--dark-blue: #1D3557;        /* Prussian Blue */
--cream: #F1FAEE;            /* Honeydew */
```

Typography

· Primary: 'Roboto', sans-serif
· Headings: 'Montserrat', sans-serif
· Monospace: 'Courier New' (for recipes)

Components

· Cards: Recipe cards, user cards
· Buttons: Primary, Secondary, Icon buttons
· Modals: Confirmation, settings, forms
· Forms: Input fields, dropdowns, toggles

---

🔧 Technical Stack

Frontend

· React - UI library
· Material-UI - Component library
· Framer Motion - Animations
· Axios - HTTP client
· React Router - Navigation
· Notistack - Notifications

Backend

· PHP 7.4+ - Server-side logic
· MySQL - Database
· REST API - JSON endpoints

Development Tools

· XAMPP/WAMP - Local server
· Postman - API testing
· Git - Version control

---

📱 Pages & Routes

Page Route Description
Home / Dashboard with quick actions
Login /login User authentication
Register /register Create new account
Recipes /recipes Browse all recipes
Recipe Detail /recipe/:id View single recipe
Create Recipe /create-recipe Add new recipe
Cooking Session /cooking/:sessionId Active cooking
Cookbook /cookbook Saved recipes
Profile /profile/:username User profile
Shop /shop Virtual store
Activity /activity Recent activities
Settings /settings User preferences

---

🗄️ Database Schema

Core Tables

```sql
users                # User accounts
recipes              # Recipe data
recipe_ingredients   # Recipe ingredients  
recipe_steps         # Cooking steps
cooking_sessions     # Active sessions
session_participants # Session users
likes                # Recipe likes
comments             # Recipe comments
cookbooks           # Saved recipes
```

Gamification Tables

```sql
user_stats          # XP, levels, currency
user_achievements   # Earned badges
shop_items          # Virtual goods
inventory           # User items
activities          # User activities
```

---

🔌 API Endpoints

Authentication

· POST /api/register.php - Register user
· POST /api/login.php - User login
· POST /api/logout.php - User logout

Recipes

· GET /api/recipe/list.php - List recipes
· GET /api/recipe/get.php?id=:id - Get recipe
· POST /api/recipe/create.php - Create recipe
· PUT /api/recipe/update.php - Update recipe
· DELETE /api/recipe/delete.php - Delete recipe
· POST /api/recipe/like.php - Like recipe
· POST /api/recipe/comment.php - Add comment

Cooking Sessions

· POST /api/session/create.php - Create session
· POST /api/session/join.php - Join session
· POST /api/session/complete-step.php - Complete step
· GET /api/session/:id - Get session details

Users

· GET /api/user/profile.php - User profile
· PUT /api/user/update.php - Update profile
· GET /api/user/followers.php - Get followers
· POST /api/user/follow.php - Follow user

---

🎯 Development Workflow

1. Set Up Environment

```bash
# Start MySQL and Apache
# Import database schema
# Install frontend dependencies
npm install
```

2. Run Development

```bash
# Frontend (React)
npm start

# Backend (PHP)
# Run via XAMPP/WAMP
```

3. Test Features

```bash
# Run specific feature test
npm run test:like-button
npm run test:cooking-session
```

4. Build for Production

```bash
npm run build
```

---

🧪 Testing

Manual Testing Routes

```
http://localhost:3000/test-like        # Test Like Button
http://localhost:3000/test-cooking     # Test Cooking Session
http://localhost:3000/test-recipe      # Test Recipe Display
```

API Testing

```bash
# Test Like API
curl -X GET "http://localhost:8080/api/recipe/like.php?recipe_id=1"
curl -X POST "http://localhost:8080/api/recipe/like.php" \
  -H "Content-Type: application/json" \
  -d '{"recipe_id":1,"user_id":1}'
```

---

🤝 Contribution Guidelines

Branch Strategy

· main - Production ready
· develop - Development branch
· feature/* - New features
· bugfix/* - Bug fixes

Commit Convention

```
feat: Add like button component
fix: Resolve session join error
docs: Update README.md
style: Format CSS files
refactor: Improve API structure
test: Add button tests
```

Code Standards

· Components under 50 lines
· One feature per commit
· Meaningful variable names
· Comments for complex logic
· Mobile-first responsive design

---

📚 Learning Resources

For Beginners

1. React Basics: Components, Props, State
2. PHP Fundamentals: Variables, Arrays, Functions
3. MySQL Basics: SELECT, INSERT, UPDATE, DELETE
4. API Concepts: REST, JSON, HTTP methods

Project-Specific

· features.md - All 40 features with flows
· styles.md - Design specifications
· imports.md - Package documentation
· Component examples in /src/components/

---

🚨 Troubleshooting

Issue Solution
CORS Errors Check backend headers in connection.php
Database Connection Verify MySQL credentials
API 404 Errors Ensure files are in correct directory
React Build Errors Clear node_modules and reinstall
Session Not Starting Check PHP session configuration

---

📈 Roadmap

Phase 1 (Completed)

· ✅ User authentication
· ✅ Recipe CRUD operations
· ✅ Basic cooking session

Phase 2 (In Progress)

· 🔄 Multiplayer sessions
· 🔄 Gamification system
· 🔄 Social features

Phase 3 (Planned)

· 📅 Mobile app
· 📅 Advanced analytics
· 📅 Recipe video integration

---

📞 Support

Documentation

· Features Documentation
· Design System
· API Reference

Common Issues

1. Port Conflicts: Change ports in package.json and .env
2. Database Errors: Check connection.php settings
3. Build Failures: Update Node.js and dependencies

---

🏆 Achievements System

Achievement Requirement Reward
First Recipe Create first recipe 🏅 Beginner Chef
Cooking Master Complete 50 sessions 👨‍🍳 Master Chef
Social Butterfly Follow 20 users 🦋 Social Star
Speed Cooker Complete recipe in <30min ⚡ Speed Demon
Collector Save 100 recipes 📚 Recipe Hoarder

---

💰 Virtual Economy

· Gold: Earn by cooking, daily login
· Gems: Premium currency for special items
· XP: Gain levels (100 XP per level)
· Items: Purchase from shop

---

🎉 Success Stories

"As a cooking newbie, CookTogether made learning fun with its game-like approach!" - Maria, Home Cook

"The multiplayer feature let me cook with friends during lockdown. Amazing!" - John, Food Blogger

---

📊 Project Stats

· 40 Features complete
· 30+ Components built
· 15+ API Endpoints
· 10 Database Tables
· 5 Gamification Systems
· 100% Mobile Responsive

---

🔐 Security Features

· Password hashing (bcrypt)
· SQL injection prevention
· XSS protection
· CORS configuration
· Input validation
· Session management

---

🌐 Browser Support

· Chrome (latest)
· Firefox (latest)
· Safari (latest)
· Edge (latest)
· Mobile browsers

---

📄 License

This project is developed for educational purposes as part of DLSU-D Web Development course.

---

🙏 Acknowledgements

· React Team - UI Framework
· Material-UI - Design System
· PHP Community - Backend Support
· MySQL - Database System
· All Contributors - Feature Development

---

Happy Cooking! 👨‍🍳👩‍🍳

Made with ❤️ by the CookTogether Development Team
