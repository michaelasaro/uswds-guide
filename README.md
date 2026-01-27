# uswds-guide

Learn to build accessible, mobile-friendly websites with the U.S. Web Design System. Clear documentation, practical examples, and step-by-step guidance for designers and developers of all skill levels. Start here, then take it wherever you need to go.

Built on [uswds-starter](https://github.com/michaelasaro/uswds-starter).

## Getting Started

```bash
npm install
npm run build
npm run serve
```

## Scripts

- `npm run build` - Clean and build all assets
- `npm run build:styles` - Compile SCSS only
- `npm run serve` - Start local development server
- `npm run clean` - Remove dist and work folders

## Structure

```
uswds-guide/
├── src/               # Core USWDS styles/fonts/images
│   ├── styles/        # SCSS source files
│   │   └── tokens/    # Design tokens
│   ├── fonts/         # Web fonts
│   └── images/        # Logo and image assets
├── site/              # Documentation site
│   ├── pages/         # Content pages
│   ├── page-templates/# Layout templates
│   ├── images/        # Site images
│   ├── styles/        # Site-specific CSS
│   └── scripts/       # Site-specific JS
├── dist/              # Compiled output (generated)
└── index.html         # Landing page
```

## Documentation Sections

- **Style Guide** — Typography, colors, layout, visual styles
- **Component Library** — UI components, patterns, templates
- **Guidelines** — Design principles, accessibility, development guidance

## License

CC0 1.0 Universal
