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
git clone https://github.com/michaelasaro/civic-guide.git
cd civic-guide

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Start the development server
npm run serve
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

---

## Guided Tour (New to this project?)

This repo includes a **CodeTour** that walks you through the entire build system step by step, assuming no prior knowledge. It explains what each file does, how they connect, and why things are set up the way they are.

**To start the tour:**

1. Install the [CodeTour extension](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) for VS Code
2. Open the Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows)
3. Type **CodeTour: Start Tour** and select **"How the Build Works"**

The tour is stored in `.tours/` and ships with the repo, so anyone who clones it gets access.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Full build: clean, compile Sass, autoprefix, minify, copy assets to `dist/` |
| `npm run build:styles` | Compile Sass only (outputs `civic.css` + `civic.min.css` + sourcemaps) |
| `npm run watch:styles` | Watch for Sass changes and recompile automatically |
| `npm run serve` | Start local development server at http://localhost:3000 |
| `npm run clean` | Remove the `dist/` folder |

**Typical development workflow:** Run `npm run serve` in one terminal and `npm run watch:styles` in another. Every time you save a style change, the CSS rebuilds automatically.

---

## Project Structure

```
civic-guide/
├── src/                          # Source files
│   ├── styles/                   # Sass source files
│   │   ├── index.scss            # Main entry point (3 layers)
│   │   ├── _bridge.scss          # Connects your settings to USWDS
│   │   ├── _packages.scss        # Choose which USWDS components to include
│   │   ├── custom-styles.scss    # Your custom CSS overrides
│   │   └── uswds-settings/       # Design token settings
│   │       ├── _colors.scss      # Brand colors and palettes
│   │       ├── _typography.scss  # Fonts, sizes, weights
│   │       ├── _spacing.scss     # Margins, padding, grid
│   │       ├── _components.scss  # Component-specific settings
│   │       ├── _utilities.scss   # Utility class configuration
│   │       └── _general.scss     # Paths, focus styles, global settings
│   ├── fonts/                    # Custom web fonts
│   └── images/                   # Custom images (logos, hero, branding)
│
├── site/                         # Documentation website
│   ├── pages/                    # Content pages (HTML)
│   ├── page-templates/           # Layout templates
│   ├── images/                   # Site images
│   ├── styles/                   # Site-specific CSS
│   └── scripts/                  # Site-specific JavaScript
│
├── dist/                         # Build output (generated)
│   ├── civic/                    # Your customized theme
│   │   ├── styles/
│   │   │   ├── civic.css         # Full compiled CSS
│   │   │   ├── civic.min.css     # Minified CSS for production
│   │   │   ├── civic.css.map     # Sourcemap (for debugging)
│   │   │   └── civic.min.css.map # Sourcemap (minified)
│   │   ├── fonts/                # Custom fonts
│   │   └── images/               # Custom images
│   └── uswds/                    # USWDS assets
│       ├── css/                  # Pre-compiled USWDS CSS
│       ├── js/                   # USWDS JavaScript
│       ├── fonts/                # USWDS fonts
│       └── img/                  # USWDS icons and images (~320 files)
│
├── .tours/                       # CodeTour guided walkthroughs
├── .browserslistrc               # Browser targets for autoprefixer
├── gulpfile.js                   # Build configuration
├── server.js                     # Development server
└── package.json                  # Dependencies and scripts
```

---

## How the Build Works

The build compiles your Sass source into production-ready CSS in 5 steps:

1. **Sass compilation** — Reads `index.scss`, follows all imports, produces raw CSS + sourcemap
2. **Autoprefixing** — Adds vendor prefixes (`-webkit-`, `-ms-`) for browser compatibility
3. **Writes `civic.css`** — Full, readable CSS with sourcemap for debugging
4. **Minification** — Compresses the CSS (removes whitespace, shortens colors)
5. **Writes `civic.min.css`** — Compressed CSS with sourcemap for production

Browser targets are defined in `.browserslistrc` (same as USWDS: `> 2%, last 2 versions, not dead`).

### The Three-Layer Architecture

Styles are loaded in order through `index.scss`:

```
Layer 1: BRIDGE          Your settings → passed to USWDS core
Layer 2: PACKAGES        USWDS components (you choose which ones)
Layer 3: CUSTOM STYLES   Your CSS overrides (loaded last, wins over everything)
```

---

## Customizing the Theme

### Changing Settings (Colors, Fonts, Spacing, etc.)

All USWDS settings are pre-written in two places — just uncomment to activate:

1. **Find the setting** in `src/styles/uswds-settings/` (e.g., `_colors.scss`)
2. **Uncomment it** and change the value
3. **Uncomment the matching line** in `src/styles/_bridge.scss`
4. **Run `npm run build`**

**Example:** Changing the primary color

```scss
// In src/styles/uswds-settings/_colors.scss — uncomment and set your color:
$theme-color-primary: #4D8157;

// In src/styles/_bridge.scss — uncomment the matching line:
$theme-color-primary: colors.$theme-color-primary,
```

Every button, link, and primary-colored element updates automatically.

### Settings Categories

| File | What it controls |
|------|------------------|
| `_colors.scss` | Brand colors, state colors (error, success), link colors |
| `_typography.scss` | Font families, sizes, weights, line heights |
| `_spacing.scss` | Border radius, column gaps, grid container, site margins |
| `_components.scss` | Individual component settings (banner, card, header, etc.) |
| `_utilities.scss` | Utility class generation and responsive breakpoints |
| `_general.scss` | Image paths, focus styles, compile warnings |

### Choosing Which Components to Include

By default, all USWDS components are included. To reduce CSS file size, comment out components you don't use in `src/styles/_packages.scss`:

```scss
// Comment out a component you don't need:
// @forward "usa-tooltip/src/styles";

// Keep the ones you use:
@forward "usa-button/src/styles";
@forward "usa-header/src/styles";
```

Components are grouped by purpose (Layout, Page Structure, Navigation, Content, Forms, etc.) with descriptions of what each one provides.

### Adding Custom CSS

For styles that can't be achieved with design tokens, add CSS to `src/styles/custom-styles.scss`. It loads last, so it overrides anything from USWDS.

---

## Alternative Build Option

For users familiar with the [official USWDS workflow](https://designsystem.digital.gov/documentation/getting-started/developers/phase-two-compile/), the standard compile functions are also available:

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

- **Node.js** 18.x or higher
- **npm** 8.x or higher

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@uswds/uswds` | 3.13.0 | U.S. Web Design System |
| `@uswds/compile` | ^1.3.1 | USWDS build utilities |
| `gulp` | ^5.0.0 | Task runner |
| `sass` | ^1.90.0 | Dart Sass compiler |
| `postcss` | ^8.5.6 | CSS post-processor |
| `autoprefixer` | ^10.4.24 | Adds vendor prefixes for browser compatibility |
| `cssnano` | ^7.1.2 | CSS minifier |
| `express` | ^5.1.0 | Development server |

---

## Browser Support

Defined in `.browserslistrc`, matching USWDS targets:

- Browsers with > 2% global usage
- Last 2 versions of each browser
- No discontinued browsers

In practice: Chrome, Firefox, Safari, Edge (latest versions), and most mobile browsers.

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
