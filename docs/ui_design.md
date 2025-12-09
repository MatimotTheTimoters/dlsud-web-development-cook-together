# Frontend Design System: "Savory Quest" (Cozy RPG Kitchen)

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