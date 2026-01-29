# Civic Theme for USWDS

A customizable design system built on the [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/). This project provides comprehensive documentation, practical examples, and a modular Sass architecture that makes it easy to customize USWDS for your organization.

**Perfect for:**
- Government agencies building accessible, mobile-friendly websites
- Designers learning USWDS components and design tokens
- Developers setting up customized USWDS implementations

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/michaelasaro/uswds-guide.git
cd uswds-guide

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Start the development server
npm run serve
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Full build: clean, compile Sass, copy all assets to `dist/` |
| `npm run build:styles` | Compile Sass only (outputs to `dist/civic/styles/civic.css`) |
| `npm run serve` | Start local development server at http://localhost:3000 |
| `npm run clean` | Remove the `dist/` folder |

---

## Project Structure

```
uswds-guide/
├── src/                          # Source files
│   ├── styles/                   # Sass source files
│   │   ├── index.scss            # Main entry point
│   │   ├── _bridge.scss          # Connects settings to USWDS
│   │   ├── custom-styles.scss    # Your custom component styles
│   │   └── uswds-settings/       # Modular settings files
│   │       ├── _colors.scss      # Color tokens and themes
│   │       ├── _typography.scss  # Font settings
│   │       ├── _spacing.scss     # Spacing and layout
│   │       ├── _components.scss  # Component-specific settings
│   │       ├── _utilities.scss   # Utility class configuration
│   │       └── _general.scss     # General settings
│   ├── fonts/                    # Custom web fonts
│   ├── images/                   # Custom images (logos, branding)
│   └── docs/                     # Documentation files
│
├── site/                         # Documentation website
│   ├── pages/                    # Content pages (HTML)
│   ├── page-templates/           # Layout templates
│   ├── images/                   # Site images
│   ├── styles/                   # Site-specific CSS
│   └── scripts/                  # Site-specific JavaScript
│
├── dist/                         # Build output (generated)
│   ├── civic/                    # Your customizations
│   │   ├── styles/civic.css      # Compiled theme CSS
│   │   ├── fonts/                # Custom fonts
│   │   └── images/               # Custom images
│   └── uswds/                    # USWDS assets
│       ├── css/                  # Pre-compiled USWDS CSS
│       ├── js/                   # USWDS JavaScript
│       ├── fonts/                # USWDS fonts
│       └── img/                  # USWDS icons and images
│
├── gulpfile.js                   # Build configuration
├── server.js                     # Development server
└── package.json                  # Dependencies and scripts
```

---

## Customizing the Theme

### How It Works

This project uses a **modular Sass architecture** that makes customization simple:

1. **Settings files** (`src/styles/uswds-settings/`) contain all your customizations
2. **Bridge file** (`src/styles/_bridge.scss`) connects your settings to USWDS
3. **Entry point** (`src/styles/index.scss`) loads everything in the correct order

### Customization Workflow

To customize a USWDS setting:

1. **Find the setting** in the appropriate file under `src/styles/uswds-settings/`
2. **Uncomment it** and set your value
3. **Uncomment the matching line** in `src/styles/_bridge.scss`
4. **Run `npm run build`** to see your changes

**Example:** Changing the primary color

```scss
// In src/styles/uswds-settings/_colors.scss
$theme-color-primary: 'blue-warm-60v' !default;

// In src/styles/_bridge.scss (uncomment the matching line)
$theme-color-primary: $theme-color-primary;
```

### Settings Categories

| File | What it controls |
|------|------------------|
| `_colors.scss` | Color tokens, theme colors, state colors |
| `_typography.scss` | Font families, sizes, line heights |
| `_spacing.scss` | Spacing units, layout grid, containers |
| `_components.scss` | Component-specific settings (accordion, banner, etc.) |
| `_utilities.scss` | Utility class generation and breakpoints |
| `_general.scss` | Image paths, border radius, global defaults |

---

## Build System

This project provides two build options:

### Option 1: Custom Build (Recommended)

Uses the custom Gulp tasks defined in `gulpfile.js`:

```bash
npm run build          # Full build
npm run build:styles   # Sass only
npm run clean          # Clean dist/
```

**Benefits:**
- Selective image copying (skips 2,100+ unused Material Icons)
- Clear separation of theme assets (`dist/civic/`) and USWDS assets (`dist/uswds/`)

### Option 2: Standard USWDS Compile

For users familiar with the [official USWDS workflow](https://designsystem.digital.gov/documentation/getting-started/developers/phase-two-compile/):

```bash
npx gulp init          # First-time setup
npx gulp compile       # Compile Sass + icon sprite
npx gulp watch         # Watch for changes
npx gulp copyAll       # Copy all USWDS assets
npx gulp update        # Update after USWDS upgrade
```

---

## Documentation Sections

The documentation site includes:

- **Style Guide** — Typography, colors, layout utilities, visual styles
- **Component Library** — All USWDS components with live examples
- **Guidelines** — Design principles, accessibility, development guidance

---

## Requirements

- **Node.js** 18.x or higher (tested with v25.5.0)
- **npm** 8.x or higher

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@uswds/uswds` | 3.13.0 | U.S. Web Design System |
| `@uswds/compile` | 1.3.1 | USWDS build utilities |
| `gulp` | 5.0.0 | Task runner |
| `sass` | 1.90.0 | Dart Sass compiler |
| `express` | 5.1.0 | Development server |

---

## Browser Support

This project follows USWDS browser support:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## License

This project is released under [CC0 1.0 Universal](LICENSE) (Public Domain).

USWDS is also released under CC0 1.0 by the U.S. General Services Administration.

---

## Resources

- [USWDS Documentation](https://designsystem.digital.gov/)
- [USWDS GitHub](https://github.com/uswds/uswds)
- [USWDS Settings Reference](https://designsystem.digital.gov/documentation/settings/)
- [USWDS Components](https://designsystem.digital.gov/components/overview/)
