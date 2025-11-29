# Cook Together — Color Theme

This document lists the project's color tokens (HEX) grouped by component. Use these tokens consistently across the UI. Where helpful I include recommended usages and small accessibility notes (contrast reminders).

---

## Global palette (tokens)

* `--ct-primary` : `#FF7043` — Brand / primary action (buttons, highlights)
* `--ct-secondary` : `#2BC1A9` — Secondary accent (gems, positive highlights)
* `--ct-gold` : `#F2C94C` — Gold currency, badges, attention
* `--ct-ink` : `#0F172A` — Primary dark text
* `--ct-muted` : `#64748B` — Secondary text / metadata
* `--ct-surface` : `#F4F6F8` — Page surface / cards background
* `--ct-paper` : `#FFFFFF` — White paper / modal background
* `--ct-border` : `#E6E9EE` — Borders and separators
* `--ct-danger` : `#E85959` — Errors, destructive actions
* `--ct-success` : `#2ECC71` — Success state
* `--ct-shadow` : `rgba(15, 23, 42, 0.06)` — Soft shadow color

> Tip: keep global tokens in a single place (e.g. `:root` or `component-override.css`) so they are easy to change later.

---

## Navbar

* Background: `#FFFFFF` (`--ct-paper`)
* Brand text: `#0F172A` (`--ct-ink`)
* Icon / small controls: `#64748B` (`--ct-muted`)
* Border / bottom stroke: `#E6E9EE` (`--ct-border`)
* Primary CTA in navbar (Inventory/Shop button): `--ct-primary` / text `#FFFFFF`
* Currency chips: gold background `#F2C94C` (text `#0F172A`), gem background `#2BC1A9` (text `#0F172A`)

## Hero

* Background: `#F4F6F8` (`--ct-surface`) or a subtle gradient using `#FFFFFF → #F4F6F8`
* Headline text: `#0F172A` (`--ct-ink`)
* Lead/description: `#64748B` (`--ct-muted`)
* Primary hero CTA: `--ct-primary` (text `#FFFFFF`)

## Aside (left menu)

* Card background: `#FFFFFF` (`--ct-paper`)
* Active item background: `#EEF8F5` (light tint of `--ct-secondary`) — example `#E8FBF6`
* Active text / badge: `--ct-primary` or `--ct-ink` depending on contrast
* Inactive text: `#64748B` (`--ct-muted`)
* List item border: `#E6E9EE` (`--ct-border`)

## Body (cards / content)

* Page background: `#FFFFFF` or `#F4F6F8` depending on layout
* Card background: `#FFFFFF` (`--ct-paper`)
* Card surface (large container seen in prototype): `#F0F2F4` (slightly darker than `--ct-surface`)
* Card title text: `#0F172A` (`--ct-ink`)
* Meta / small text: `#64748B` (`--ct-muted`)
* Card border: `#E6E9EE` (`--ct-border`)
* Primary action button on card: `--ct-primary` (text `#FFFFFF`)
* Secondary action button on card: `#FFFFFF` background with `--ct-primary` outline or `btn-outline` style

## Footer

* Background: `#F4F6F8` (`--ct-surface`)
* Text: `#0F172A` / `#64748B` for links
* Border top: `#E6E9EE` (`--ct-border`)

## ActionMenu (floating)

* Main toggle background: `#0F172A` (dark circle) / icon `#FFFFFF`
* Floating card background: `#FFFFFF` (`--ct-paper`)
* Floating item buttons: use semantic colors:

  * Build Challenge: `#E85959` (`--ct-danger` variant) or primary red tone
  * New Kitchen: `#F2994A` (warm orange / variant of primary)
  * Create Recipe: `#2BC1A9` (`--ct-secondary`)
  * Add Friends: `#56CCF2` (light-blue accent for social)

## ModalBuildChallenge

* Modal background: `#FFFFFF` (`--ct-paper`)
* Header title text: `#0F172A` (`--ct-ink`)
* Form labels: `#64748B` (`--ct-muted`)
* Input background: `#FFFFFF` with border `#E6E9EE`
* Primary submit: `--ct-primary` (text `#FFFFFF`)
* Secondary/cancel: `#64748B` outline or `btn-secondary`

## ModalCreateRecipe

* Modal background: `#FFFFFF` (`--ct-paper`)
* Header: `#0F172A`
* Field labels: `#64748B`
* Primary submit: `--ct-primary` (text `#FFFFFF`)
* Disabled reward fields: `#F4F6F8` background with `#64748B` text

## ModalMakeFriends

* Modal background: `#FFFFFF`
* Action buttons: primary `--ct-primary`, secondary `btn-outline` or `--ct-muted`

## ModalNewKitchen

* Modal background: `#FFFFFF`
* Header text: `#0F172A`
* Accent buttons: `--ct-secondary` for creation, `--ct-muted` for cancel

---

## Accessibility notes

* Ensure buttons and primary text meet WCAG AA contrast ratios against their background. `--ct-ink` on `--ct-paper` is high contrast.
* For small text (below 18px), prefer contrast ratio >= 4.5:1.
* When using `--ct-gold` (#F2C94C) on light backgrounds, provide a dark text (`#0F172A`) to maintain legibility.

---

## Example CSS token block (copy into `component-override.css`)

```css
:root {
  --ct-primary: #FF7043;
  --ct-secondary: #2BC1A9;
  --ct-gold: #F2C94C;
  --ct-ink: #0F172A;
  --ct-muted: #64748B;
  --ct-surface: #F4F6F8;
  --ct-paper: #FFFFFF;
  --ct-border: #E6E9EE;
  --ct-danger: #E85959;
  --ct-success: #2ECC71;
  --ct-shadow: rgba(15, 23, 42, 0.06);
}