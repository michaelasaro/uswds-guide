// ============================================================================
//
//   ██████╗ ██╗   ██╗██╗     ██████╗ ███████╗██╗██╗     ███████╗
//  ██╔════╝ ██║   ██║██║     ██╔══██╗██╔════╝██║██║     ██╔════╝
//  ██║  ███╗██║   ██║██║     ██████╔╝█████╗  ██║██║     █████╗
//  ██║   ██║██║   ██║██║     ██╔═══╝ ██╔══╝  ██║██║     ██╔══╝
//  ╚██████╔╝╚██████╔╝███████╗██║     ██║     ██║███████╗███████╗
//   ╚═════╝  ╚═════╝ ╚══════╝╚═╝     ╚═╝     ╚═╝╚══════╝╚══════╝
//
//  Civic Theme Build Configuration
//  A customizable design system based on USWDS
//
//  This gulpfile provides two ways to build the project:
//
//  1. Custom Build (Recommended for this project)
//     - npm run build        → Full build: clean, compile Sass, copy assets
//     - npm run build:styles → Compile Sass only
//     - npm run clean        → Remove dist/ folder
//
//  2. Standard USWDS Compile (For users familiar with USWDS workflow)
//     - npx gulp init        → First-time setup
//     - npx gulp compile     → Compile Sass + icon sprite
//     - npx gulp watch       → Watch for changes
//
//  Output Structure:
//     dist/
//       civic/               ← Your customizations (fonts, images, compiled CSS)
//       uswds/               ← USWDS assets (fonts, icons, JS, pre-compiled CSS)
//
// ============================================================================


// ============================================================================
// DEPENDENCIES
// ============================================================================

const fs = require('fs');                                         // Node.js file system
const path = require('path');                                     // Node.js path utilities
const sass = require('sass');                                     // Dart Sass compiler
const { src, dest, series, parallel, watch } = require("gulp");   // Gulp task runner
const uswds = require('@uswds/compile');                          // USWDS compile utilities

// Console logging with colors for better build output readability
const log = console.log;
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
};


// ============================================================================
// PATH CONFIGURATION
// ============================================================================

// Base output directory for all compiled/copied assets
const distFolderLocation = './dist'

// Theme output paths (where your customizations go)
const themePaths = {
  name: 'civic',                                    // Theme folder name in dist/
  styles: distFolderLocation + '/civic/styles',    // Compiled CSS destination
  fonts: distFolderLocation + '/civic/fonts',      // Custom fonts destination
  images: distFolderLocation + '/civic/images',    // Custom images destination
  docs: distFolderLocation + '/civic/docs',        // Documentation destination
}


// ============================================================================
// USWDS COMPILE SETTINGS
// ============================================================================
// These settings configure the standard uswds-compile functions (init, compile,
// watch, etc.). They tell USWDS where to find source files and where to put
// compiled output.
//
// Documentation: https://designsystem.digital.gov/documentation/getting-started/developers/phase-two-compile/
// ============================================================================

// Tell USWDS we're using version 3.x (affects where it looks for source files)
uswds.settings.version = 3;

// --- Source Paths ---
// Where USWDS should look for your project's Sass files
uswds.paths.src.projectSass = './src/styles';

// --- Distribution Paths ---
// Where USWDS compile functions should output assets
uswds.paths.dist.css = distFolderLocation + '/uswds/css';      // Compiled CSS
uswds.paths.dist.fonts = distFolderLocation + '/uswds/fonts';  // Font files
uswds.paths.dist.img = distFolderLocation + '/uswds/img';      // Images and icons
uswds.paths.dist.js = distFolderLocation + '/uswds/js';        // JavaScript
uswds.paths.dist.theme = './src/styles';                       // Theme/settings files


// ============================================================================
// THEME BUILD CONFIGURATION
// ============================================================================
// This configuration defines exactly what files get copied to the dist folder
// during the custom build process (npm run build).
//
// Structure:
//   - "theme": Your custom assets (fonts, images, documentation)
//   - "@uswds/uswds": Assets from the USWDS package in node_modules
//
// Note: Compiled CSS is handled separately by doSassCompile(), not copied here.
//
// Each entry has:
//   - src:  Glob pattern for source files (relative to the package root)
//   - dest: Destination folder (relative to distFolderLocation)
// ============================================================================

let buildConfiguration = {

  // --------------------------------------------------------------------------
  // CUSTOM THEME ASSETS
  // --------------------------------------------------------------------------
  // These are your project's custom files - fonts and images.
  // Compiled CSS goes directly to dist/civic/styles/ via doSassCompile().
  // --------------------------------------------------------------------------
  "theme": {

    // Custom fonts (including any variable font upgrades)
    fonts: {
      src: "src/fonts/**",
      dest: "civic/fonts"
    },

    // Project-specific images (agency logos, branding, etc.)
    images: {
      src: "src/images/**",
      dest: "civic/images"
    }
  },

  // --------------------------------------------------------------------------
  // USWDS PACKAGE ASSETS
  // --------------------------------------------------------------------------
  // These files come from node_modules/@uswds/uswds/dist/
  // We selectively copy only what's needed, skipping the 2,500+ Material Icons
  // dump to keep the dist folder manageable.
  // --------------------------------------------------------------------------
  "@uswds/uswds": {

    // Web Components (usa-banner, etc.)
    components: {
      src: "dist/components/**",
      dest: "uswds/components"
    },

    // Pre-compiled USWDS CSS (for users who don't customize)
    css: {
      src: "dist/css/**",
      dest: "uswds/css"
    },

    // USWDS fonts (Public Sans, Source Sans Pro, Merriweather, Roboto Mono)
    fonts: {
      src: "dist/fonts/**",
      dest: "uswds/fonts"
    },

    // USWDS JavaScript (component behaviors, accordion, modal, etc.)
    js: {
      src: "dist/js/**",
      dest: "uswds/js"
    },

    // ----------------------------------------------------------------------
    // IMAGES: Selective Copy Strategy
    // ----------------------------------------------------------------------
    // USWDS ships with 2,400+ icons in their img folder, but most are from
    // the full Material Icons library that few projects actually use.
    //
    // We selectively copy only:
    //   - Root-level images (us_flag_small.png, icon-dot-gov.svg, etc.)
    //   - usa-icons/ (238 curated government-focused icons)
    //   - usa-icons-bg/ (background variants)
    //   - uswds-icons/ (24 custom USWDS icons: social media, pictograms)
    //   - favicons/ (favicon assets)
    //
    // This reduces the img folder from ~2,400 files to ~320 files.
    // ----------------------------------------------------------------------

    // Root-level images used by core components (banner flag, https icon, etc.)
    "img-root": {
      src: "dist/img/*.{png,jpg,webp,gif,svg}",
      dest: "uswds/img"
    },

    // USA Icons: Curated subset of Material Icons for government use
    // These are the icons USWDS recommends and documents
    "img-usa-icons": {
      src: "dist/img/usa-icons/**",
      dest: "uswds/img/usa-icons"
    },

    // USA Icons with background variants (for use on colored backgrounds)
    "img-usa-icons-bg": {
      src: "dist/img/usa-icons-bg/**",
      dest: "uswds/img/usa-icons-bg"
    },

    // Custom USWDS icons (social media logos, custom pictograms)
    // These are icons USWDS created that aren't in Material Icons
    "img-uswds-icons": {
      src: "dist/img/uswds-icons/**",
      dest: "uswds/img/uswds-icons"
    },

    // Favicon assets for government websites
    "img-favicons": {
      src: "dist/img/favicons/**",
      dest: "uswds/img/favicons"
    }

    // ----------------------------------------------------------------------
    // INTENTIONALLY SKIPPED:
    //   - material-icons/ (~2,100 files) - Full Material Icons dump
    //   - material-icons-deprecated/ - Legacy icons for backwards compatibility
    //
    // If you need the full Material Icons library, either:
    //   1. Add an entry here to copy them
    //   2. Use a CDN like https://fonts.googleapis.com/icon?family=Material+Icons
    //   3. Install @material-design-icons/svg separately
    // ----------------------------------------------------------------------
  }
}


// ============================================================================
// SASS COMPILATION CONFIGURATION
// ============================================================================
// Settings for compiling the theme Sass into CSS.
// The compiled CSS is written directly to dist/civic/styles/
// ============================================================================

const sassConfig = {
  src: 'src/styles/index.scss',   // Main Sass entry point
  filename: 'civic.css',          // Output filename
  dest: themePaths.styles         // Output directory (dist/civic/styles/)
}


// ============================================================================
// BUILD HELPER FUNCTIONS
// ============================================================================

/**
 * Copy files from a source pattern to a destination folder
 * @param {string} folder - Base folder path (e.g., './node_modules/@uswds/uswds')
 * @param {object} group - Object with 'src' (glob pattern) and 'dest' (target folder)
 */
function copyFiles(folder, group) {
  let srcFiles = folder + '/' + group.src
  let target = distFolderLocation + '/' + group.dest
  log(colors.blue, `        ${srcFiles} → ${target}`);
  return src(`${srcFiles}`.replace("//", "/")).pipe(
    dest(target)
  );
}

/**
 * Copy all file groups for a given package
 * @param {string} folder - Base folder path
 * @param {object} groupList - Object containing multiple file groups
 */
function copyGroups(folder, groupList) {
  for (const groupName in groupList) {
    let group = groupList[groupName]
    log(colors.blue, `    Group: ${groupName}`);
    copyFiles(folder, group)
  }
}


// ============================================================================
// THEME BUILD TASKS
// ============================================================================

/**
 * Copy custom theme assets (docs, fonts, images)
 * Source: Project root (./src/*)
 * Note: Compiled CSS is handled by doSassCompile(), not copied here
 */
async function copyThemeAssets() {
  log(colors.blue, `\nCopying theme assets...`);
  copyGroups('.', buildConfiguration['theme'])
}

/**
 * Copy third-party assets (USWDS fonts, icons, JS, etc.)
 * Source: node_modules/@uswds/uswds/dist/*
 */
async function copyThirdParty() {
  for (const dependencyName in buildConfiguration) {
    if (dependencyName != 'theme') {
      log(colors.blue, `\nCopying dependency: ${dependencyName}`);
      copyGroups(`./node_modules/${dependencyName}`, buildConfiguration[dependencyName])
    }
  }
}

/**
 * Build the complete dist folder
 * Copies both custom theme assets and USWDS third-party assets
 */
async function buildDist() {
  copyThemeAssets()
  copyThirdParty()
}

/**
 * Main build task: Clean → Compile Sass → Copy all assets
 * This is what runs when you execute: npm run build
 */
async function doBuildAll () {
  log(colors.blue, `Creating folder and copying configured filesets to: ${distFolderLocation}`);
  series(doClean, doSassCompile, buildDist)()
}

/**
 * Compile theme Sass into CSS
 *
 * This uses the Dart Sass compiler directly (not uswds-compile) for more
 * control over the compilation process. The compiled CSS is written directly
 * to dist/civic/styles/ - no intermediate staging folder needed.
 *
 * Load paths tell Sass where to find USWDS packages when you use
 * @use or @forward statements like: @forward "uswds"
 */
async function doSassCompile () {
    const inputFile = sassConfig.src;
    const outputDir = sassConfig.dest;
    const outputFile = path.join(outputDir, sassConfig.filename);

    // Ensure the output directory exists (creates parent dirs if needed)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    // Clean up any existing output file
    if (fs.existsSync(outputFile)) {
        console.info('Cleaning target file location: ' + outputFile)
        fs.rmSync(outputFile);
    }

    console.info('Sass compilation starting...')

    // Compile Sass to CSS
    let compiledSass = sass.compile(inputFile, {
        // Suppress USWDS deprecation warnings (they're noisy but not actionable)
        logger: {
            warn (message, options) {
                // Silently ignore warnings
                // To see warnings, replace with: console.warn(message)
            }
        },
        // Tell Sass where to find USWDS packages
        loadPaths: [
            './node_modules/@uswds/uswds',
            './node_modules/@uswds/uswds/packages'
        ]
    });

    console.info('Sass compilation done!')

    // Write compiled CSS directly to dist folder
    console.info('Writing compiled css to: ' + outputFile)
    fs.writeFileSync(outputFile, compiledSass.css)
    await Promise.resolve(outputFile)
}

/**
 * Clean build artifacts
 * Removes the dist/ folder (final output)
 */
async function doClean() {
    cleanFolder('./dist')
}

/**
 * Recursively delete a folder and all its contents
 * @param {string} foldername - Path to folder to delete
 */
async function cleanFolder(foldername) {
    try {
        if (fs.existsSync(foldername)) {
            fs.rmSync(foldername, { force: true, recursive: true, maxRetries: 3, retryDelay: 300 }, (err) => {
                if (err) {
                    console.error(`Error deleting folder: ${err.message}`);
                    return;
                }
                console.log(`${foldername} and its contents have been successfully deleted.`);
            });
        }
    return true;
  } catch (error) {
    console.error(`Error deleting folder: ${error.message}`);
    throw error;
  }
}


// ============================================================================
// EXPORTS
// ============================================================================
// These exports make functions available as Gulp tasks.
// Run them with: npx gulp <taskname>
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ OPTION 1: Custom Build (Recommended)                                    │
// │                                                                         │
// │   npm run build          → Full build (clean + compile + copy)          │
// │   npm run build:styles   → Compile Sass only                            │
// │   npm run clean          → Remove dist/ folder                          │
// │                                                                         │
// │ These commands are defined in package.json and use the custom functions │
// │ below. They give you more control over what gets copied to dist/.       │
// └─────────────────────────────────────────────────────────────────────────┘
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │ OPTION 2: Standard USWDS Compile Functions                              │
// │                                                                         │
// │   npx gulp init          → First-time setup (copies theme + compiles)   │
// │   npx gulp compile       → Compile Sass + build icon sprite             │
// │   npx gulp watch         → Watch for Sass changes and recompile         │
// │   npx gulp copyAll       → Copy all USWDS assets                        │
// │   npx gulp update        → Update assets + recompile (after upgrade)    │
// │                                                                         │
// │ These are the standard USWDS functions for users familiar with the      │
// │ official USWDS workflow. They use the uswds.paths.dist.* settings.      │
// └─────────────────────────────────────────────────────────────────────────┘
// ============================================================================

// --- Standard USWDS Compile Functions ---
exports.init = uswds.init;
exports.compile = uswds.compile;
exports.compileSass = uswds.compileSass;
exports.update = uswds.updateUswds;
exports.watch = uswds.watch;
exports.copyAll = uswds.copyAll;

// --- Custom Build Functions ---
exports.buildAll = doBuildAll
exports.clean = doClean
exports.sassCompile = doSassCompile
