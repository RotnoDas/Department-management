# 🎨 Quick UI Reference Card

## 🚀 Getting Started

```bash
npm install
npm run seed
npm run dev
# Open http://localhost:5173
```

---

## 🎨 Role Colors

| Role        | Gradient      | Badge Class       |
| ----------- | ------------- | ----------------- |
| 👑 Admin    | Purple → Pink | `badge-primary`   |
| 👨‍🏫 Teacher  | Blue → Purple | `badge-info`      |
| 👷 Employee | Green → Blue  | `badge-success`   |
| 👨‍🎓 Student  | Pink → Purple | `badge-secondary` |

---

## 🎯 Status Colors

| Status      | Color | Class           |
| ----------- | ----- | --------------- |
| ✅ Approved | Green | `badge-success` |
| ⏳ Pending  | Amber | `badge-warning` |
| ❌ Rejected | Red   | `badge-error`   |
| ℹ️ Info     | Blue  | `badge-info`    |

---

## 🎨 Common Gradients

```html
<!-- Primary (Purple → Pink) -->
<div class="from-primary to-secondary bg-gradient-to-r">
  <!-- Info (Blue → Purple) -->
  <div class="from-info to-primary bg-gradient-to-r">
    <!-- Success (Green → Blue) -->
    <div class="from-success to-info bg-gradient-to-r">
      <!-- Warning (Amber → Green) -->
      <div class="from-warning to-success bg-gradient-to-r"></div>
    </div>
  </div>
</div>
```

---

## ✨ Utility Classes

```html
<!-- Glass Effect -->
<div class="glass-effect">
  <!-- Card Hover -->
  <div class="card card-hover">
    <!-- Animated Gradient -->
    <div class="animated-gradient">
      <!-- Pulse Glow (for pending items) -->
      <div class="pulse-glow">
        <!-- Page Transition -->
        <div class="page-transition"></div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎯 Stat Card Template

```jsx
<div className="card card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
  <div className="card-body p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="mb-2 text-sm font-medium text-white/80">Title</p>
        <p className="mb-2 text-4xl font-bold">123</p>
        <p className="text-xs text-white/70">Trend info</p>
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-lg backdrop-blur">
        🎯
      </div>
    </div>
  </div>
</div>
```

---

## 📝 Form Input with Icon

```jsx
<div className="form-control">
  <label className="label py-1">
    <span className="label-text font-semibold">Email</span>
  </label>
  <div className="relative">
    <input
      type="email"
      className="input input-bordered focus:input-primary w-full pl-11"
      placeholder="your@email.com"
    />
    <svg className="text-base-content/40 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2">
      {/* Icon SVG */}
    </svg>
  </div>
</div>
```

---

## 🔘 Button Variants

```html
<!-- Primary -->
<button class="btn btn-primary shadow-lg">Click Me</button>

<!-- With Icon -->
<button class="btn btn-success gap-2">
  <svg>...</svg>
  Approve
</button>

<!-- Loading -->
<button class="btn btn-primary" disabled>
  <span class="loading loading-spinner loading-sm"></span>
  Loading...
</button>

<!-- Outline -->
<button class="btn btn-outline btn-error">Reject</button>
```

---

## 📊 Chart Colors

### Bar Chart

```javascript
const barData = [
  { name: "Approved", value: 10, fill: "#10b981" },
  { name: "Pending", value: 5, fill: "#f59e0b" },
  { name: "Rejected", value: 2, fill: "#ef4444" },
];
```

### Pie Chart

```javascript
const PIE_COLORS = ["#6366f1", "#ec4899", "#10b981"];
```

---

## 🎭 Animations

```css
/* Hover Scale */
.hover: scale-110 /* Transition All */ .transition-all /* Animate In */
  .animate-in .fade-in .slide-in-from-top /* Duration */ .duration-300;
```

---

## 📱 Responsive Classes

```html
<!-- Mobile First -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <!-- Hide on Mobile -->
  <span class="hidden sm:block">Desktop Only</span>

  <!-- Show on Mobile -->
  <button class="lg:hidden">Mobile Menu</button>
</div>
```

---

## 🎨 Spacing Scale

| Class | Size |
| ----- | ---- |
| `p-1` | 4px  |
| `p-2` | 8px  |
| `p-3` | 12px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

---

## 🔲 Shadow Scale

```html
<div class="shadow-sm">
  <!-- Subtle -->
  <div class="shadow-md">
    <!-- Medium -->
    <div class="shadow-lg">
      <!-- Large -->
      <div class="shadow-xl">
        <!-- Extra Large -->
        <div class="shadow-2xl"><!-- Huge --></div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎯 Border Radius

```html
<div class="rounded-lg">
  <!-- 12px -->
  <div class="rounded-xl">
    <!-- 16px -->
    <div class="rounded-2xl">
      <!-- 24px -->
      <div class="rounded-3xl">
        <!-- 32px -->
        <div class="rounded-full"><!-- Circle --></div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Text Colors

```html
<p class="text-primary">Primary</p>
<p class="text-secondary">Secondary</p>
<p class="text-success">Success</p>
<p class="text-warning">Warning</p>
<p class="text-error">Error</p>
<p class="text-info">Info</p>
<p class="text-base-content/60">Muted (60%)</p>
```

---

## 🎯 Alert Variants

```html
<!-- Info -->
<div class="alert alert-info">
  <svg>...</svg>
  <span>Information message</span>
</div>

<!-- Success -->
<div class="alert alert-success">
  <svg>...</svg>
  <span>Success message</span>
</div>

<!-- Warning -->
<div class="alert alert-warning">
  <svg>...</svg>
  <span>Warning message</span>
</div>

<!-- Error -->
<div class="alert alert-error">
  <svg>...</svg>
  <span>Error message</span>
</div>
```

---

## 🎨 Badge Variants

```html
<span class="badge badge-primary">Admin</span>
<span class="badge badge-info">Teacher</span>
<span class="badge badge-success">Employee</span>
<span class="badge badge-secondary">Student</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-error">Rejected</span>
<span class="badge badge-outline">Outline</span>
<span class="badge badge-lg">Large</span>
<span class="badge badge-sm">Small</span>
```

---

## 📊 Table Template

```jsx
<div className="bg-base-100 overflow-x-auto rounded-xl">
  <table className="table">
    <thead className="bg-base-200">
      <tr>
        <th className="font-bold">Name</th>
        <th className="font-bold">Email</th>
        <th className="text-right font-bold">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-base-200/50 transition-colors">
        <td>John Doe</td>
        <td>john@example.com</td>
        <td className="text-right">
          <button className="btn btn-sm btn-primary">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎯 Loading States

```jsx
// Spinner
<span className="loading loading-spinner loading-lg text-primary" />

// Dots
<span className="loading loading-dots loading-lg" />

// Ring
<span className="loading loading-ring loading-lg" />

// Ball
<span className="loading loading-ball loading-lg" />
```

---

## 🎨 Avatar

```jsx
<div className="avatar placeholder">
  <div className="from-primary to-secondary h-10 w-10 rounded-full bg-gradient-to-br text-white shadow-md">
    <span className="text-sm font-bold">JD</span>
  </div>
</div>
```

---

## 📝 Quick Tips

1. ✅ Use `card-hover` for elevation effects
2. ✅ Add `transition-all` for smooth animations
3. ✅ Use gradients for important elements
4. ✅ Implement loading states
5. ✅ Test on mobile devices
6. ✅ Maintain consistent spacing
7. ✅ Follow the color guide
8. ✅ Add hover states to buttons

---

## 🔗 Documentation Links

- **UI_IMPROVEMENTS.md** - Full UI documentation
- **COLOR_GUIDE.md** - Complete color reference
- **THEME_SUMMARY.md** - Theme overview
- **tailwind.config.js** - Theme configuration

---

**Keep this card handy while developing! 🎨**
