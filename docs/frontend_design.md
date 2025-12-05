# CookTogether Frontend Design System

## 🎨 Color Theme

### Primary Palette
```
Primary (Warm Red): #FF6B6B
Secondary (Fresh Green): #4CAF50
Accent (Golden Yellow): #FFC107
Neutral (Warm Gray): #8D8D8D
```

### Extended Palette
```
Background Light: #FFF8F0 (Cream white)
Background Dark: #1A1A1A (Dark mode)
Text Primary: #2C3E50 (Dark slate)
Text Secondary: #546E7A (Medium slate)
Success: #4CAF50
Warning: #FF9800
Error: #F44336
Info: #2196F3
```

### Usage Guidelines
```css
/* Primary Brand Colors */
--primary-main: #FF6B6B;      /* Buttons, active states */
--primary-light: #FF8A8A;     /* Hover states */
--primary-dark: #E53935;      /* Pressed states */

/* Secondary Colors */
--secondary-main: #4CAF50;    /* Success, cooking actions */
--secondary-light: #81C784;   /* Light success states */

/* Background Colors */
--bg-primary: #FFF8F0;        /* Main background */
--bg-secondary: #FFFFFF;      /* Cards, modals */
--bg-tertiary: #F5F5F5;       /* Inputs, disabled */

/* Text Colors */
--text-primary: #2C3E50;      /* Headings, body text */
--text-secondary: #546E7A;    /* Captions, helper text */
--text-disabled: #B0BEC5;     /* Disabled text */

/* Semantic Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;
```

## 🎯 UI Layout Principles

### Overall Layout Structure
```
┌─────────────────────────────────────┐
│           HEADER (Fixed)            │
├─────────────────────────────────────┤
│                                     │
│  SIDEBAR  │      MAIN CONTENT      │  ← For desktop
│  (Collapsible)   (Scrollable)      │
│                                     │
├─────────────────────────────────────┤
│           FOOTER (Fixed)            │
└─────────────────────────────────────┘
```

### Component-Specific Layouts

#### 1. Recipe Cards
```
┌─────────────────────────────┐
│   [Recipe Image]            │
├─────────────────────────────┤
│ ⭐⭐⭐⭐⭐ (4.5)              │
│ 🍳 Recipe Title             │
│ ⏱️ 30 min | 🔥 Medium      │
│ 👤 John Doe                 │
│ 🏷️ Italian, Pasta, Dinner  │
│ 💰 25 Gold | 💎 2 Gems     │
└─────────────────────────────┘
```

#### 2. Cooking Session View
```
┌─────────────────────────────────────┐
│ [Back] Recipe Title     [Timer]     │
├─────────────────────────────────────┤
│  STEP PROGRESS BAR (70%)            │
├─────────────┬───────────────────────┤
│             │                       │
│ INGREDIENTS │   STEP INSTRUCTIONS   │
│ List        │   with timer          │
│             │                       │
│             ├───────────────────────┤
│ PARTICIPANTS│   [Complete Step]     │
│ Avatars     │   [Skip Timer]        │
│             │   [Vote Skip]         │
└─────────────┴───────────────────────┘
```

#### 3. User Profile
```
┌─────────────────────────────────────┐
│ [Edit]         [Follow] [Message]   │
├─────────────────────────────────────┤
│  PROFILE PICTURE (Large)            │
│  John Doe | Level 15 Chef           │
│  🏆 Achievements | 📊 Stats         │
├─────────────────────────────────────┤
│  TAB NAVIGATION                     │
│  Recipes | Cookbooks | Following    │
├─────────────────────────────────────┤
│  CONTENT AREA (Grid of cards)       │
└─────────────────────────────────────┘
```

## 🔤 Typography

### Font Family
```css
/* Primary Font (UI & Headings) */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;

/* Secondary Font (Body Text) */
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (Code, timers) */
font-family: 'Roboto Mono', monospace;
```

### Font Scale
```
h1: 2.5rem (40px) - Page titles
h2: 2rem (32px) - Section headers
h3: 1.5rem (24px) - Card titles
h4: 1.25rem (20px) - Subheaders
h5: 1.125rem (18px) - Emphasis text
Body: 1rem (16px) - Main content
Small: 0.875rem (14px) - Captions, labels
Tiny: 0.75rem (12px) - Helper text
```

## 🎭 Component Design

### Buttons
```css
/* Primary Button */
background: var(--primary-main);
color: white;
border-radius: 8px;
padding: 12px 24px;

/* Secondary Button */
background: transparent;
border: 2px solid var(--primary-main);
color: var(--primary-main);

/* Icon Button */
background: transparent;
border-radius: 50%;
padding: 8px;
```

### Cards
```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
```

### Forms
```css
.input-field {
  border: 2px solid var(--bg-tertiary);
  border-radius: 8px;
  padding: 12px;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: var(--primary-main);
  outline: none;
}
```

## 📱 Responsive Design Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile Navigation
```
Hamburger Menu → Full-screen Drawer
┌─────────────────┐
│ × Close         │
├─────────────────┤
│ 🏠 Home         │
│ 📖 Recipes      │
│ 👥 Sessions     │
│ 📚 Cookbooks    │
│ 👤 Profile      │
│ ⚙️ Settings     │
└─────────────────┘
```

## 🎮 Gamification Elements

### Level Badges
```
Level 1-5:   🥚 Beginner Chef (Green)
Level 6-10:  🍳 Home Cook (Blue)
Level 11-20: 👨‍🍳 Chef de Partie (Purple)
Level 21-30: 👩‍🍳 Executive Chef (Gold)
Level 31+:   🏆 Master Chef (Rainbow)
```

### Progress Bars
```css
.exp-bar {
  height: 8px;
  background: linear-gradient(90deg, #4CAF50, #FFC107);
  border-radius: 4px;
  transition: width 0.3s ease;
}
```

## 🖼️ Imagery Guidelines

### Image Ratios
- Recipe Cards: 4:3 (800x600px)
- Profile Pictures: 1:1 (200x200px)
- Step Images: 16:9 (800x450px)
- Cover Images: 21:9 (1680x720px)

### Image Placeholders
```css
/* Food-themed placeholder backgrounds */
.placeholder-recipe {
  background: linear-gradient(135deg, #FF6B6B, #FFC107);
}

.placeholder-profile {
  background: linear-gradient(135deg, #4CAF50, #2196F3);
}
```

## 🎪 Animation & Transitions

### Micro-interactions
```css
/* Button hover */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Card hover */
transition: transform 0.3s ease, box-shadow 0.3s ease;

/* Page transitions */
.fade-enter { opacity: 0; }
.fade-enter-active { opacity: 1; transition: opacity 300ms; }
```

### Loading States
```css
/* Skeleton loading */
@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
```

## 📋 Implementation Priorities

### Phase 1 (This Weekend)
1. Set up base theme in `styles/themes.css`
2. Implement responsive grid system
3. Create Header, Footer, Navigation components
4. Build basic RecipeCard component

### Phase 2 (Next Week)
1. Complete all common components (buttons, forms, modals)
2. Implement gamification components (level badges, progress bars)
3. Create page layouts (Home, Recipes, Profile)
4. Add animations and polish

### Phase 3 (Polish)
1. Dark mode implementation
2. Performance optimizations
3. Accessibility improvements
4. Browser compatibility testing

## 🎯 Design Tokens (CSS Variables)

Create in `styles/themes.css`:
```css
:root {
  /* Color System */
  --color-primary: #FF6B6B;
  --color-secondary: #4CAF50;
  --color-accent: #FFC107;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.15);
}
```