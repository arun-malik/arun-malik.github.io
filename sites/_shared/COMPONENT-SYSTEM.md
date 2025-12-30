# Reusable Component System

This site uses a **dynamic component system** for header and footer, making it easy to maintain consistent navigation across all pages.

## How It Works

### 1. Component Files
- **`sites/_shared/header.html`** - Global header/navigation
- **`sites/_shared/footer.html`** - Global footer
- **`sites/_shared/components.js`** - Loads components dynamically

### 2. Using Components in Pages

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Page</title>
  <link rel="stylesheet" href="../_shared/styles.css" />
</head>
<body>
  <!-- Header placeholder -->
  <div id="header-placeholder"></div>

  <main>
    <!-- Your page content -->
  </main>

  <!-- Footer placeholder -->
  <div id="footer-placeholder"></div>

  <!-- Load components first, then other scripts -->
  <script src="../_shared/components.js"></script>
  <script src="../_shared/scroll-nav.js"></script>
  <script src="../_shared/theme.js"></script>
</body>
</html>
```

### 3. Path Resolution

The component loader automatically adjusts paths based on page location:
- **Root** (`/index.html`): Uses `./sites/_shared/`
- **Sub-sites** (`/sites/learn/`): Uses `../_shared/`
- **Nested pages** (`/sites/learn/lessons/`): Uses `../../_shared/`

## Benefits

✅ **Single source of truth** - Update header/footer once, changes reflect everywhere  
✅ **Clean HTML** - Pages are simpler and more maintainable  
✅ **Consistent navigation** - Same UI/UX across all pages  
✅ **Theme support** - Dark/light theme toggle works everywhere  
✅ **Scroll behavior** - Compact navigation on scroll (all pages)

## Viki-Inspired Theme

The new theme is inspired by `viki-index.html` with:
- Smooth transitions (0.3s cubic-bezier)
- Modern card designs with hover effects
- Clean typography (Segoe UI)
- Professional light/dark themes
- Microsoft-style shadows and borders

## Adding a New Page

1. Create your HTML file
2. Link to shared stylesheet: `<link rel="stylesheet" href="../_shared/styles.css" />`
3. Add header placeholder: `<div id="header-placeholder"></div>`
4. Add footer placeholder: `<div id="footer-placeholder"></div>`
5. Load components: `<script src="../_shared/components.js"></script>`

That's it! Header, footer, theme toggle, and scroll behavior work automatically.

## Local Testing

```bash
# Start local server
npx http-server -p 8080 -o

# Visit http://localhost:8080
```

## Deployment

On GitHub Pages, the workflow copies `sites/*` to the root of `_site/`, so:
- `sites/_shared/` → `/_shared/`
- `sites/learn/` → `/learn/`
- `sites/hello/` → `/hello/`

The component loader handles both local and deployed paths automatically.
