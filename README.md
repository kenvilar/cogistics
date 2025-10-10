# Cogistics Website

> Using Data Intelligence to Cut Costs and Recover Lost Dollars in Freight Spend

A modern, static website for Cogistics - a freight audit and payment services company. Built with vanilla HTML, Tailwind CSS, and JavaScript, featuring a component-based architecture with a custom HTML include system.

## 🚀 Features

- **Static Site Architecture** - Fast, lightweight, and easy to deploy
- **Component-Based Structure** - Reusable HTML components using custom include system
- **Tailwind CSS 4** - Utility-first CSS framework (CLI build)
- **Responsive Design** - Mobile-first approach with custom breakpoints
- **Asset Caching** - Optimized caching configuration for images, CSS, and JavaScript
- **Version Control** - Cache-busting with query string versioning (`?v=1.0.0`)
- **Custom Fonts** - Barlow Semi Condensed and Roboto
- **Mobile Navigation** - Dynamic mobile menu with JavaScript
- **Form Integration** - Contact form with Formspree integration
- **Carousel Slider** - Splide.js integration for featured content

## 📁 Project Structure

```
cogistics/
├── index.html              # Homepage
├── blog/
│   └── index.html         # Blog listing page
├── contact/
│   └── index.html         # Contact page with form
├── components/
│   ├── layout/
│   │   ├── header.html    # Site header with navigation
│   │   └── footer.html    # Site footer
│   ├── sections/          # Page sections
│   ├── forms/             # Form components
│   ├── ui/                # UI components
│   ├── modals/            # Modal dialogs
│   └── partials/          # Partial components
├── assets/
│   ├── css/
│   │   ├── tailwindcss/
│   │   │   ├── input.css  # Tailwind source
│   │   │   └── output.css # Compiled Tailwind
│   │   ├── custom.css     # Custom styles
│   │   ├── layout/        # Layout-specific styles
│   │   ├── components/    # Component styles
│   │   ├── pages/         # Page-specific styles
│   │   ├── fonts/         # Font definitions
│   │   └── vendor/        # Third-party CSS (Splide)
│   ├── js/
│   │   ├── layout/
│   │   │   └── header.js  # Header/navigation logic
│   │   ├── components/    # Component scripts
│   │   ├── utils/         # Utility functions
│   │   ├── pages/         # Page-specific scripts
│   │   └── vendor/        # Third-party JS (Splide)
│   ├── images/
│   │   ├── home/          # Homepage images
│   │   ├── blog/          # Blog images
│   │   ├── contact/       # Contact page images
│   │   ├── logos/         # Brand logos
│   │   └── placeholders/  # Placeholder images
│   ├── svg/               # SVG icons
│   ├── icons/             # Icon files
│   ├── fonts/
│   │   ├── barlow-semi-condensed/
│   │   └── roboto/
│   └── media/
│       ├── video/
│       ├── audio/
│       └── docs/
├── dev/
│   └── docs/              # Development documentation
├── include.js             # Custom HTML include system
├── .htaccess              # Apache caching configuration
├── _headers               # Netlify/Cloudflare caching config
├── valet-nginx.conf       # Nginx caching configuration
├── CACHING.md             # Caching setup documentation
└── package.json           # Project dependencies

```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS 4** - Utility-first CSS framework (CLI build)
- **Vanilla JavaScript** - ES modules, no framework dependencies
- **Splide.js** - Carousel/slider library
- **Formspree** - Form handling service
- **Finsweet Attributes** - Mirror click functionality for custom carousel controls

## 📋 Prerequisites

- Node.js 16+ and npm
- Web server (Apache, Nginx, or Valet for local development)

## 🚦 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cogistics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Development

**Option 1: Development with Tailwind watch mode (recommended)**
```bash
npm run dev
```
This runs both the HTTP server (port 3000) and Tailwind in watch mode.

**Option 2: HTTP Server only**
```bash
npm run http-server
```
Opens at `http://localhost:3000`

**Option 3: Live Server with auto-reload**
```bash
npm run live-dev
```
Opens at `http://localhost:3000` with live reload

**Tailwind CSS only (watch mode)**
```bash
npm run tailwind
```

### Access the site
Open your browser and navigate to:
- `http://localhost:3000` (for npm scripts)
- `http://cogistics.test` (if using Laravel Valet)

## 🎨 Component System

This project uses a custom HTML include system (`include.js`) that allows you to break down HTML into reusable components.

### Usage

Include components in your HTML:

```html
<div data-include="@layout/header.html"></div>
<div data-include="@layout/footer.html"></div>
```

The `@` symbol refers to predefined path aliases:
- `@components/` → `components/`
- `@layout/` → `components/layout/`
- `@ui/` → `components/ui/`
- `@sections/` → `components/sections/`
- `@forms/` → `components/forms/`
- `@partials/` → `components/partials/`
- `@modals/` → `components/modals/`

### How it works

1. Add the include script to your HTML:
   ```html
   <script type="module">
     import { include } from "/include.js?v=1.0.0";
     include();
   </script>
   ```

2. Use `data-include` attribute to reference components
3. Components are loaded and rendered on page load

### Passing Parameters

Parameters can be provided in three ways:

**1. Query string:**
```html
<div data-include="@ui/button.html?text=Buy&href=%23"></div>
```

**2. JSON object via `data-include-params`:**
```html
<div
  data-include="@ui/button.html"
  data-include-params='{
    "text": "Buy now",
    "href": "/checkout"
  }'
></div>
```

**3. Individual `data-include-*` attributes:**
```html
<div
  data-include="@ui/button.html"
  data-include-text="Download"
  data-include-className="primary"
></div>
```

### Templating Tokens

Inside components, insert values with double curly braces with optional defaults:

```html
<a href="{{ href | # }}" class="btn {{ className | primary }}">
  {{ text | Button }}
</a>
```

## 📱 Responsive Design

The site uses a mobile-first approach with Tailwind's responsive prefixes:

- `sm:` - 640px and up (small screens)
- `md:` - 768px and up (medium screens)
- `lg:` - 1024px and up (large screens)
- `xl:` - 1280px and up (extra large screens)

### Mobile Navigation

The mobile navigation system (`assets/js/layout/header.js`) handles:
- Dynamic nav movement to mobile menu container on screens ≤767px
- Toggle mobile menu visibility
- Click-to-expand dropdowns on mobile (hover on desktop)

**Features:**
- Moves navigation to `.nav_menu__mobile` on mobile screens
- Toggle button (`.nav__btn`) shows/hides mobile menu
- Dropdown menus use click instead of hover on mobile
- Smart initialization that runs whether DOM is loaded or loading

## 🎯 Key Features Implementation

### Asset Caching & Versioning

Static assets use query string versioning for cache busting:
```html
<link rel="stylesheet" href="/assets/css/custom.css?v=1.0.0" />
<script src="/assets/js/layout/header.js?v=1.0.0"></script>
<img src="/assets/images/logo.svg?v=1.0.0" />
```

**Cache durations:**
- Images, CSS, JS, Fonts: 1 year (immutable)
- HTML files: No cache (always fresh)

See `CACHING.md` for detailed caching configuration instructions.

### Contact Form

The contact form (`contact/index.html`) integrates with Formspree:
- Client-side validation with HTML5 `required` attributes
- 2-column grid layout (responsive)
- Custom styled checkboxes
- Success/error message styling with color-coded backgrounds
- Async form submission without page reload

**Form fields:**
- First Name, Last Name
- Phone, Email
- Company Name, Job Title
- Best way to Contact You (dropdown)
- How Can We Help You? (textarea)
- How Did You Hear About Us? (textarea)
- Terms & Conditions checkbox

### Blog Carousel

Featured blog posts use Splide.js with custom controls:
- Custom arrow buttons using Finsweet mirror click attributes
- Responsive layout (horizontal on desktop, vertical on mobile)
- Loop mode enabled
- Single item per page

**Configuration:**
```javascript
{
  type: "loop",
  rewind: true,
  perPage: 1,
  perMove: 1,
  arrows: true,
  pagination: false,
  updateOnMove: true
}
```

## 🎨 Styling

### Custom CSS Variables

Defined in `assets/css/tailwindcss/input.css`:
```css
--font-barlow-semi-condensed
--font-roboto
--color-primary
--color-secondary
--color-tertiary
--text-base
```

### Utility Classes

Custom spacing scale using 1px base unit:
```html
<div class="mb-23">  <!-- margin-bottom: 23px -->
<div class="pt-80">  <!-- padding-top: 80px -->
<div class="gap-[45px]"> <!-- gap: 45px -->
```

### Custom Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Layout Classes

- `.site-padding` - Standard horizontal padding
- `.site-max-width` - Maximum content width (1200px)
- `.header-max-width` - Header content width

## 🚀 Deployment

### For Apache Servers

The `.htaccess` file is included and will automatically configure:
- Asset caching (1 year for static files)
- GZIP compression
- Proper cache-control headers

### For Nginx (Production)

Add the contents of `valet-nginx.conf` to your server block configuration:

```nginx
server {
    # ... your existing configuration ...

    include /path/to/cogistics/valet-nginx.conf;
}
```

Then reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### For Netlify / Cloudflare Pages

The `_headers` file is included for automatic cache header configuration. No additional setup needed.

### For Laravel Valet (Local)

```bash
cp valet-nginx.conf ~/.config/valet/Nginx/cogistics.conf
valet restart
```

## 📦 Build & Optimization

### Compile Tailwind CSS

**Production build (minified):**
```bash
npx @tailwindcss/cli -i ./assets/css/tailwindcss/input.css -o ./assets/css/tailwindcss/output.css --minify
```

**Development build (with watch):**
```bash
npm run tailwind
```

### Update Version Numbers

When deploying, update version numbers in HTML files:
```html
<!-- Update from ?v=1.0.0 to ?v=1.0.1 -->
<link rel="stylesheet" href="/assets/css/custom.css?v=1.0.1" />
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Tailwind CSS configuration |
| `prettier.config.js` | Code formatting rules |
| `package.json` | Project metadata and scripts |
| `.gitignore` | Git ignore patterns |
| `.htaccess` | Apache caching rules |
| `_headers` | Netlify/Cloudflare caching |
| `valet-nginx.conf` | Nginx caching configuration |

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run HTTP server + Tailwind watch mode |
| `npm run http-server` | Start HTTP server on port 3000 |
| `npm run live-dev` | Start live-server with auto-reload |
| `npm run tailwind` | Watch and compile Tailwind CSS |

## 🌐 Pages

- **/** - Homepage with hero, feature sections, and CTAs
- **/blog** - Blog listing with featured carousel and grid layout
- **/contact** - Contact form with validation

## 🔍 SEO & Meta

Each page includes optimized meta tags:
- Page-specific titles and descriptions
- Open Graph tags (ready to be added)
- Semantic HTML structure
- Proper heading hierarchy

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES modules support
- Graceful degradation for older browsers

## 🤝 Development Tips

### Creating New Pages

1. Create a folder (e.g., `about/`) with an `index.html`
2. Import `include.js` via module script
3. Use `data-include` to pull in header/footer
4. Add page-specific styles if needed

### Creating New Components

1. Add HTML file under `components/` subdirectory
2. Use `{{ key | Default }}` tokens for parameters
3. Reference via alias (e.g., `@ui/your-comp.html`)

### Code Formatting

```bash
npx prettier . --write
```

## 📄 License

[Specify your license here]

## 🤝 Contributing

[Specify contribution guidelines if applicable]

## 📧 Contact

For questions or support regarding this website, visit the [contact page](/contact) or reach out through the contact form.

---

**Built with ❤️ for Cogistics - Freight Audit & Payment Services**
