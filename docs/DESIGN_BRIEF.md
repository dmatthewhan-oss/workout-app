# Design Brief
## Workout Tracker — iOS App

**Version:** 1.0
**Last updated:** 2026-04-01
**Status:** Approved

---

## 1. Design Direction

**Aesthetic:** Clean, approachable, calm. Warm and earthy without being heavy.

**Mode:** Light mode only (MVP)

**Inspiration (design quality and simplicity — not features):**
- Airbnb — clean, modern, warm, generous spacing, easy navigation
- Belly LI — simple, modern, uncluttered layout

**Core principle:** Pure white base. Warmth comes from the accent palette and typography, not the background. No visual noise. Every element earns its place on screen.

---

## 2. Color Palette

### Base

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FFFFFF` | App background — pure white |
| `surface` | `#FFFFFF` | Cards, modals — separated by border and subtle shadow |
| `surface-subtle` | `#FAF8F4` | Input backgrounds, secondary surfaces — warm off-white |
| `border` | `#E8DDD0` | Input and card outlines |
| `divider` | `#F0E8DF` | Row separators within cards |

### Text

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#2A1F14` | Main text — deep warm brown, not pure black |
| `text-secondary` | `#9A8878` | Labels, secondary info, descriptions |
| `text-placeholder` | `#C4B5A8` | Input placeholder text |

### Accent

| Token | Hex | Usage |
|---|---|---|
| `accent` | `#B07545` | Primary CTAs, active states, interactive elements — warm caramel |
| `accent-light` | `#F5E9DA` | Accent tint backgrounds, highlighted rows |
| `success` | `#6B8F71` | Completed sets, finished exercises — muted sage green |
| `success-light` | `#E8F2EA` | Success state backgrounds |

### Semantic (use sparingly)

| Token | Hex | Usage |
|---|---|---|
| `destructive` | `#C0392B` | Delete confirmations only |
| `destructive-light` | `#FBEAEA` | Destructive action backgrounds |

---

## 3. Typography

**Font:** DM Sans (via `expo-google-fonts`)

DM Sans is a geometric sans-serif with slightly rounded letterforms. Approachable and modern without being casual. Excellent readability at small sizes. Used by apps like Linear and Notion. Free and open source.

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display` | 32px | Bold 700 | 40px | Large numbers (rep counts, volume totals) |
| `heading-xl` | 28px | Bold 700 | 36px | Screen titles |
| `heading-lg` | 22px | SemiBold 600 | 30px | Section headers, workout names |
| `heading-md` | 18px | SemiBold 600 | 26px | Exercise names, card titles |
| `body` | 15px | Regular 400 | 22px | Descriptions, body text |
| `body-medium` | 15px | Medium 500 | 22px | Active labels, secondary headings |
| `caption` | 13px | Regular 400 | 18px | Timestamps, helper text, metadata |

### Rules
- Never use more than 2 type sizes on a single card
- Use weight variation (not size) to create hierarchy within a card
- Avoid all-caps except for very short labels (e.g., tab bar labels)

---

## 4. Shadows

One shadow level only. Applied to cards and modals — not buttons, not inputs, not list rows.

```
shadowColor: '#2A1F14'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.06
shadowRadius: 8
elevation: 2
```

The warm brown shadow tint (`#2A1F14`) reads as intentional and atmospheric rather than generic. At 6% opacity it is barely visible — just enough lift to distinguish the card from the background.

**Pressed state:** Remove shadow. The element "sinks in" on tap, giving tactile feedback without animation complexity.

---

## 5. Component Specifications

### Border Radius

| Component | Radius |
|---|---|
| Cards | 16px |
| Primary buttons | 12px |
| Text inputs | 12px |
| Chips / tags | 8px |
| Set checkmark circles | 50% (fully round) |
| Bottom sheet / modal | 24px (top corners only) |

### Spacing System

| Name | Value | Usage |
|---|---|---|
| `xs` | 4px | Icon-to-label gap, internal chip padding |
| `sm` | 8px | Between related elements within a card |
| `md` | 12px | Between cards in a list |
| `lg` | 16px | Card internal padding, between sections |
| `xl` | 20px | Screen edge margins |
| `2xl` | 32px | Between major sections |

**Default rule:** When in doubt, use more space. Generous spacing is the primary tool for visual calm.

### Cards

```
background: surface (#FFFFFF)
border: 1px solid border (#E8DDD0)
border-radius: 16px
padding: 16–20px
shadow: see Section 4
```

### Primary Button

```
background: accent (#B07545)
text: white, body-medium, 15px
height: 52px
border-radius: 12px
padding-horizontal: 24px
```

### Secondary Button

```
background: accent-light (#F5E9DA)
text: accent (#B07545), body-medium, 15px
height: 52px
border-radius: 12px
```

### Text Input

```
background: surface-subtle (#FAF8F4)
border: 1px solid border (#E8DDD0)
border-radius: 12px
height: 48px
padding-horizontal: 16px
font: body, text-primary
placeholder: text-placeholder
focus-border: accent (#B07545)
```

### Set Checkmark

```
size: 28px × 28px
shape: circle (border-radius: 50%)

Unchecked state:
  border: 2px solid border (#E8DDD0)
  background: transparent

Checked state:
  background: success (#6B8F71)
  icon: white checkmark
  animation: brief scale pulse (scale 1 → 1.15 → 1, 150ms)
```

### Exercise Row (within active workout)

```
Default:
  background: surface (#FFFFFF)
  exercise name: heading-md, text-primary

All sets complete:
  background: success-light (#E8F2EA)
  exercise name: heading-md, success (#6B8F71)
  transition: smooth, 200ms
```

---

## 6. Navigation

### Bottom Tab Bar

3 tabs:

| Tab | Icon | Label |
|---|---|---|
| Home | House icon | Home |
| Workout | Dumbbell icon | Workout |
| Progress | Chart icon | Progress |

```
background: surface (#FFFFFF)
border-top: 1px solid border (#E8DDD0)
active tab: accent (#B07545) icon + label
inactive tab: text-secondary (#9A8878) icon + label
height: 83px (including safe area)
```

### Screen Headers

```
title: heading-xl, text-primary
background: background (#FFFFFF)
border-bottom: none (use spacing to separate from content)
```

---

## 7. Iconography

Use **Phosphor Icons** (via `phosphor-react-native`). Reasons:
- Large, consistent library with warm/rounded icon style
- "Regular" weight icons complement DM Sans well
- MIT licensed, free

Icon sizes:
- Navigation bar: 24px
- In-card actions: 20px
- Inline with text: 16px

---

## 8. Motion & Interaction

Keep animations minimal and purposeful. Two rules:

1. **Feedback animations** (confirming a tap happened): fast, 150ms, scale or opacity
2. **Transition animations** (screen changes, modals): 250–300ms, Expo's built-in slide/fade

Never animate for decoration. Every animation must communicate state change.

---

## 9. Implementation Notes

**Styling library:** NativeWind v4 (Tailwind CSS for React Native)

All color tokens above are defined in `tailwind.config.js` under `theme.extend.colors` so they can be used as class names:

```js
// Example usage in component:
<View className="bg-surface border border-border rounded-2xl p-5 shadow-card">
  <Text className="font-heading-md text-text-primary">Bench Press</Text>
</View>
```

This ensures every screen uses the same token names consistently. Never hardcode hex values in component files — always use the token name.
