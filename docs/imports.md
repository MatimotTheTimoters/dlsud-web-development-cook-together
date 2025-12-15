# Imports

## Gamified & Feedback

### react-confetti

**Description**: Lightweight, customizable confetti explosion component for celebratory moments.
**Use Case**: Perfect for **Feature 18 (Level Up)**, **Feature 34 (Session Rewards)**, and **Feature 19 (Daily Bonus)** to create a joyful, celebratory feeling that matches your playful theme colors (#FFD700 Gold, #FF9800 Orange).

### framer-motion

**Description**: A powerful, production-ready motion library for creating declarative animations in React. Highly performant and flexible.
**Use Case**: Bring your ASCII layouts to life. Animate the entrance of **RecipeCards (Feature 5)**, the sliding of **Modals (Feature 7.1, 13)**, the toggling of **Like/Follow buttons (Features 10, 17)**, and cooking step progress. It complements your clean, component-based layouts perfectly.

### notistack

**Description**: A highly customizable notification (snackbar) system that allows stacking, positioning, and rich content.
**Use Case**: Provide immediate, non-intrusive feedback for user actions like saving a recipe (**Feature 11**), joining a session (**Feature 8**), or updating a profile (**Feature 21**). Style them to match your accent colors (#457B9D, #4CAF50).

### lottie-react

**Description**: A wrapper to render Lottie animations (JSON-based) in React. Great for small, engaging animations.
**Use Case**: Add delightful micro-interactions, like a pulsing **"Start Cooking" button (Feature 7)**, a cooking pot animation on load, or a simple fire animation for a login streak (**Feature 19**).

## UI Components & Layout

### @mui/material (Material-UI)

**Description**: A comprehensive, customizable React component library implementing Google's Material Design. It's themable, accessible, and has a vast component set.
**Use Case**: This is your foundational UI kit. Use `Card` for **RecipeCard (Feature 5)**, `Modal` for **SessionTypeModal (Feature 7.1)**, `Tabs` for **Cookbook filters (Feature 12)**, `TextField` for forms, and `IconButton` for all your action buttons. It will bring immense consistency and reduce custom CSS. You can **override its default theme** with your exact color palette (#1D3557, #457B9D, #E63946, #A8DADC, #F1FAEE).

### @mui/icons-material

**Description**: The official Material Design icon set as React components. Includes thousands of icons.
**Use Case**: Directly provides high-quality icons for your UI: `LocalDining` (🍳), `Timer`, `Group` (👥), `Favorite` (❤️), `Inventory`, `Notifications`. This is better than using emojis or custom SVGs for a polished look that matches MUI components.

### react-circular-progressbar

**Description**: A simple circular progress bar component that's easy to customize.
**Use Case**: Ideal for visualizing **XP progress towards the next level (Feature 3 Profile)**, **cooking session timer (Feature 30)**, or **recipe completion percentage**. Style the stroke with your theme's #E63946 (red) or #4CAF50 (green).

## Forms, Inputs & Interaction

### react-hook-form

**Description**: A performant library for managing form state with minimal re-renders. Easy validation integration.
**Use Case**: Perfect for all your forms: **Register/Login (Features 1-2)**, **CreateRecipe (Feature 4)**, **EditProfile (Feature 21)**, and **CommentForm (Feature 26)**. It reduces boilerplate and manages complex forms like the multi-field recipe form elegantly.

### @emoji-mart/react

**Description**: A customizable emoji picker component that is more modern and feature-rich than many alternatives.
**Use Case**: Integrate into the **ChatInput (Feature 15)** and **CommentForm (Feature 26)** to let users express themselves playfully, enhancing the social, gamified feel of cooking together.

### react-dropzone

**Description**: A React hook for creating drag-and-drop file upload zones with full customization.
**Use Case**: Implement the drag-and-drop area for the **ImageUpload component (Feature 27)**. It provides a better UX than a basic file input and can be styled to match your upload area theme (#F5F5F5, #A8DADC).

## Utilities & Data

### date-fns

**Description**: A modern, lightweight JavaScript date utility library. It's modular and tree-shakeable.
**Use Case**: Format timestamps throughout the app: **"2 hours ago" in ActivityFeed (Feature 16)**, **comment times (Feature 26)**, **session start times**, and **cooking durations**. Much lighter than Moment.js.

### axios

**Description**: A promise-based HTTP client for the browser and Node.js. (You likely already have this).
**Use Case**: **Critical for all features**. It's the standard for making API calls from your React frontend to your PHP backend (registration, fetching recipes, session management).

### react-router-dom

**Description**: The standard library for declarative routing in React apps. (You likely already have this).
**Use Case**: **Essential for all page-based features (1, 2, 3, 5, 6, 7, 8.1, 8.2, 12, 14, 16, 20, 35, 37, 38, 39)**. It manages navigation between the different views you've laid out.

## How to Import

Run this command in your `frontend/` directory to install the complete, complementary suite of packages:

```bash
npm install react-confetti framer-motion notistack lottie-react @mui/material @mui/icons-material @emotion/react @emotion/styled react-circular-progressbar react-hook-form @emoji-mart/react react-dropzone date-fns axios react-router-dom
```

**Post-Installation Setup for MUI**: To use MUI with your custom theme, you'll need to wrap your app in a `ThemeProvider`. Here is a basic setup using your color palette:

```jsx
// In your main App.js or index.js file
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const cookTogetherTheme = createTheme({
  palette: {
    primary: {
      main: '#457B9D', // Queen Blue
    },
    secondary: {
      main: '#E63946', // Imperial Red
    },
    background: {
      default: '#F1FAEE', // Honeydew
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#1D3557', // Prussian Blue
    },
    success: {
      main: '#4CAF50', // Green for ready/saved states
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={cookTogetherTheme}>
      <CssBaseline /> {/* Normalizes CSS and applies background */}
      {/* Your Router and App content here */}
    </ThemeProvider>
  );
}
```
