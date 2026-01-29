// ============================================================================
// Development Server
// ============================================================================
// A simple Express server for previewing the documentation site locally.
//
// Usage:
//   npm run serve     → Starts server at http://localhost:3000
//
// The server serves static files from the project root, which includes:
//   - /site/          → Documentation HTML pages
//   - /dist/civic/    → Compiled theme CSS, fonts, images
//   - /dist/uswds/    → USWDS assets (fonts, icons, JS)
//
// ============================================================================

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Redirect root URL to the documentation homepage
app.get('/', (req, res) => {
    res.redirect('/site/pages/home.html');
});

// Serve static files from the project root
app.use(express.static(path.join(__dirname, './')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('This page cannot be located.');
});