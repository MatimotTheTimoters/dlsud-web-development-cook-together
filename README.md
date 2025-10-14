# Cook Together 🍳🎮

A gamified cooking website where you can share recipes, create challenges, and earn rewards for your culinary adventures!

## Description

Cook Together transforms cooking into an exciting game experience! 
- **Add your favorite recipes** and discover new ones from the community
- **Create cooking challenges** to test your skills and compete with friends
- **Earn rewards** including EXP, Gold, and Gems by cooking recipes and completing challenges
- **Spend your hard-earned currencies** in the shop to unlock special items and upgrades

## Features

### 🔐 Authentication
- **Registration** - Create your chef profile
- **Login** - Access your cooking account
- **Logout** - Secure session management

### 📝 Content Creation
- **Add Recipe** - Share your culinary creations with detailed instructions
- **Add Challenge** - Create exciting cooking challenges for the community

### 👥 Social Features
- **View Recipes from Followed Users** - See what your friends are cooking
- **View Challenges from Followed Users** - Take on challenges from chefs you follow
- **View Followed Users** - Manage your network of cooking buddies
- **View All Users** - Discover new chefs to follow

### 📚 Browsing
- **View All Recipes** - Explore the entire recipe collection
- **View All Challenges** - Browse all available cooking challenges

### 🎮 Gamification
- **Display Current User Fields** - Track your EXP, Gold, Gems, and progress
- **Currency System** - Earn and spend virtual currencies
- **Shop** - Purchase items with your accumulated wealth

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Data Storage**: SheetDB.io with multiple individual sheets

## API Integration

This project uses **SheetDB.io** with multiple individual sheets to manage:
- users
- users-relationships
- users-friend-requests
- recipes
- recipes-ingredients
- recipes-steps
- user-recipes
- recipes-interactions
- recipes-comments
- recipes-comments-interactions
- challenges-cook-quota
- challenges-cook-quota-participants
- user-cookbooks

## Getting Started

1. Clone the repository
2. Run `npm run start` in your console
3. Register a new account or login to start cooking!

## Optimization

### Centralized API Configuration
- All API sheet endpoints are centralized in `src\constants\api.js` for easy management and updates
- Single source of truth for all external data connections

### Efficient Data Fetching
- **Bulk Data Retrieval**: All sheet data is retrieved at once upon login using `src\hooks\useSheetData.js`
- **Optimized API Calls**: Minimizes GET requests by fetching data in bulk rather than per-component
- **Smart Caching**: Implements 1-minute cache duration to reduce redundant API calls

### Global State Management
- **Centralized Data Storage**: All retrieved data is stored in `src\contexts\DataContext.js`
- **Cross-Component Sharing**: Data is shared across all components through React Context
- **Real-time Updates**: Components access fresh data without individual API calls

### Styling Architecture
- **Aggregated Styles**: All CSS styles are consolidated in `src\styles\index.css`
- **Single Import**: Styles are imported only once in `src\App.js` for optimal performance
- **Modular Design**: Component-specific styles can be imported as needed while maintaining central management

## Misc Backend Features

### Unique Identifier System
- **UUID Generation**: Unique record IDs are generated using `src\hooks\uuidHelper.js`
- **Collision Prevention**: Ensures no duplicate IDs across all data entities
- **Consistent Formatting**: Standardized ID format for users, recipes, challenges, and interactions

### Data Integrity
- **Relationship Management**: Robust user relationships and follow system
- **Transaction Tracking**: Comprehensive logging of user interactions and progress
- **Error Handling**: Graceful fallbacks for failed API requests with cached data usage

### Performance Enhancements
- **Memoized Calculations**: User reward limits and progress calculations are memoized for performance
- **Conditional Rendering**: Components only render when necessary data is available
- **Optimized Re-renders**: Context updates are optimized to prevent unnecessary component updates

## Coming Soon 🚀

We're constantly cooking up new features! Here's what's in development:

### 🎯 Gamification & Progression
- [ ] **Leveling System** - Progress through chef ranks with increasing difficulty
- [ ] **Reward System** - Earn EXP, Gold, and Gems from cooking and completing challenges
- [ ] **User Achievements** - Unlock badges and trophies for culinary milestones
- [ ] **Login Streak Feature** - Daily login bonuses and streak multipliers
- [ ] **Reward Multipliers** - Boost your earnings with special modifiers

### 📱 Enhanced User Experience
- [ ] **Expanded Detail Pages** - Full-page views for recipes, challenges, and user profiles
- [ ] **Shop & Inventory** - Spend currencies on cosmetics, boosts, and kitchen upgrades
- [ ] **Cookbooks** - Create custom folders to organize and group your favorite recipes
- [ ] **Add Cookbook Modal** - Easy interface for creating new recipe collections

### 👥 Social & Community
- [ ] **Friends System** - Add friends and build your cooking network
- [ ] **Enhanced Following** - Improved user discovery and relationship management
- [ ] **Challenge Progress Tracking** - Monitor your progress in ongoing challenges

### 🔍 Advanced Discovery
- [ ] **Search Sorting** - Sort results by popularity, difficulty, date, and more
- [ ] **Enhanced Filters** - Advanced filtering by cuisine, ingredients, cook time, and dietary restrictions
- [ ] **Smart Recommendations** - Personalized recipe and challenge suggestions

### ⚙️ Account Management
- [ ] **User Settings** - Update account details, preferences, and privacy settings
- [ ] **Profile Customization** - Personalize your chef profile with themes and layouts

---

**Start your culinary journey today and become the ultimate master chef!** 🏆👨‍🍳👩‍🍳

## Contributors
- Reganit, John
- Sta. Ana Matthew

## References
- [🎨 Project Color Theme](./colors.md)