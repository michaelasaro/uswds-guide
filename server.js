// ============================================================================
// Development Server
// ============================================================================
// A simple Express server for previewing the documentation site locally.
//
// Usage:
//   npm run serve     → Starts server at http://localhost:3000
//
// The server serves static files from:
//   - /site/          → Documentation HTML pages (from project root)
//   - /civic/         → Compiled theme CSS, fonts, images (from dist/)
//   - /uswds/         → USWDS assets: fonts, icons, JS (from dist/)
//
// HTML pages reference assets at /civic/ and /uswds/ (no /dist/ prefix).
// This matches the deployed structure on GitHub Pages where dist/ is the root.
//
// ============================================================================

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Serve project root first for /site/, index.html, etc.
// This ensures source file edits are reflected immediately without rebuilding
app.use(express.static(path.join(__dirname, './')));

// Serve compiled assets from dist/ as fallback (/civic/, /uswds/)
// This mirrors the GitHub Pages structure where dist/ contents are the root
app.use(express.static(path.join(__dirname, 'dist')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('This page cannot be located.');
});