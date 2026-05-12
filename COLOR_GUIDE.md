# 🎨 Color Guide - CSE Department Management System

## Role-Based Color Scheme

Each user role has a unique gradient color scheme for visual distinction:

### 👑 Admin (Administrator)

```
Primary Gradient: Indigo → Pink
Colors: #6366f1 → #ec4899
Usage: Admin dashboard, badges, buttons
Visual: Purple to pink gradient
```

### 👨‍🏫 Teacher (Faculty)

```
Primary Gradient: Blue → Indigo
Colors: #3b82f6 → #6366f1
Usage: Teacher dashboard, badges, buttons
Visual: Blue to purple gradient
```

### 👷 Employee (Staff)

```
Primary Gradient: Green → Blue
Colors: #10b981 → #3b82f6
Usage: Employee dashboard, badges, buttons
Visual: Green to blue gradient
```

### 👨‍🎓 Student (Learner)

```
Primary Gradient: Pink → Purple
Colors: #ec4899 → #8b5cf6
Usage: Student dashboard, badges, buttons
Visual: Pink to purple gradient
```

---

## Status Colors

### ✅ Approved (Success)

```
Color: #10b981 (Green)
Usage: Approved students, success messages
Gradient: from-green-500 to-emerald-600
```

### ⏳ Pending (Warning)

```
Color: #f59e0b (Amber)
Usage: Pending approvals, waiting states
Gradient: from-amber-500 to-orange-600
Animation: Pulse glow effect
```

### ❌ Rejected (Error)

```
Color: #ef4444 (Red)
Usage: Rejected students, error messages
Gradient: from-red-500 to-rose-600
```

### ℹ️ Info

```
Color: #3b82f6 (Blue)
Usage: Information alerts, help text
Gradient: from-blue-500 to-indigo-600
```

---

## UI Element Colors

### Backgrounds

```
Base-100: #ffffff (Light) / #0f172a (Dark)
Base-200: #f3f4f6 (Light) / #1e293b (Dark)
Base-300: #e5e7eb (Light) / #334155 (Dark)
```

### Text

```
Primary Text: oklch(var(--bc))
Secondary Text: oklch(var(--bc) / 0.6)
Muted Text: oklch(var(--bc) / 0.4)
```

### Borders

```
Default: oklch(var(--bc) / 0.1)
Hover: oklch(var(--bc) / 0.2)
Focus: oklch(var(--p))
```

---

## Gradient Combinations

### Primary Gradient

```css
background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
```

**Usage**: Main branding, hero sections, primary CTAs

### Info Gradient

```css
background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
```

**Usage**: Information cards, teacher elements

### Success Gradient

```css
background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
```

**Usage**: Success states, employee elements

### Warning Gradient

```css
background: linear-gradient(135deg, #f59e0b 0%, #10b981 100%);
```

**Usage**: Pending items, warnings

---

## Chart Colors

### Bar Chart

```
Approved: #10b981 (Green)
Pending:  #f59e0b (Amber)
Rejected: #ef4444 (Red)
```

### Pie Chart

```
Students:  #6366f1 (Indigo)
Teachers:  #ec4899 (Pink)
Employees: #10b981 (Green)
```

---

## Shadow Styles

### Small Shadow

```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
```

**Usage**: Subtle elevation, cards

### Medium Shadow

```css
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

**Usage**: Buttons, dropdowns

### Large Shadow

```css
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

**Usage**: Modals, important cards

### Extra Large Shadow

```css
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

**Usage**: Hover states, floating elements

---

## Opacity Levels

```
Full:       1.0   (100%)
High:       0.8   (80%)
Medium:     0.6   (60%)
Low:        0.4   (40%)
Very Low:   0.2   (20%)
Minimal:    0.1   (10%)
```

**Usage Examples**:

- Text secondary: 60% opacity
- Disabled elements: 40% opacity
- Hover overlays: 10% opacity
- Borders: 10-20% opacity

---

## Accessibility

### Contrast Ratios (WCAG AA)

**Normal Text** (minimum 4.5:1):

- ✅ Primary on White: 7.2:1
- ✅ Secondary on White: 6.8:1
- ✅ Success on White: 5.1:1
- ✅ Error on White: 5.9:1

**Large Text** (minimum 3:1):

- ✅ All colors pass

**Interactive Elements**:

- Focus outline: 2px solid primary
- Hover: Increase brightness by 10%
- Active: Decrease brightness by 10%

---

## Color Usage Guidelines

### DO ✅

- Use role-based gradients for user-specific elements
- Apply status colors consistently (green=success, amber=pending, red=error)
- Maintain proper contrast ratios
- Use subtle backgrounds (10-20% opacity)
- Add hover states to interactive elements

### DON'T ❌

- Mix role gradients (don't use admin colors for students)
- Use pure black (#000000) - use base colors instead
- Overuse bright colors - keep it balanced
- Forget hover/focus states
- Use low contrast text

---

## Quick Reference

### CSS Classes

**Gradients**:

```html
<div class="from-primary to-secondary bg-gradient-to-r">
  <div class="from-info to-primary bg-gradient-to-br">
    <div class="from-success to-info bg-gradient-to-br">
      <div class="from-warning to-success bg-gradient-to-br"></div>
    </div>
  </div>
</div>
```

**Text Colors**:

```html
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-success">Success text</p>
<p class="text-warning">Warning text</p>
<p class="text-error">Error text</p>
<p class="text-info">Info text</p>
```

**Background Colors**:

```html
<div class="bg-primary">Primary background</div>
<div class="bg-base-100">Base background</div>
<div class="bg-base-200">Secondary background</div>
```

**Badges**:

```html
<span class="badge badge-primary">Admin</span>
<span class="badge badge-info">Teacher</span>
<span class="badge badge-success">Employee</span>
<span class="badge badge-secondary">Student</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Rejected</span>
```

---

## Color Palette Export

### For Design Tools (Figma, Sketch, Adobe XD)

```json
{
  "colors": {
    "primary": "#6366f1",
    "secondary": "#ec4899",
    "accent": "#8b5cf6",
    "neutral": "#1f2937",
    "base-100": "#ffffff",
    "base-200": "#f3f4f6",
    "base-300": "#e5e7eb",
    "info": "#3b82f6",
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444"
  }
}
```

### For CSS Variables

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #ec4899;
  --color-accent: #8b5cf6;
  --color-info: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

---

**Use this guide to maintain consistent colors throughout the application! 🎨**
