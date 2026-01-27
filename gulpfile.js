const fs = require('fs');
const sass = require('sass');
const { src, dest, series, parallel, watch } = require("gulp");
const uswds = require('@uswds/compile');
const log = console.log;
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
};

let distFolderLocation = './dist'

// ----------------------------------------------------------------
// Configure USWDS settings
uswds.settings.version = 3;
// src location(s)
uswds.paths.src.projectSass = './src/styles';
// dist (output) location(s) - USWDS pattern and configuration - CopyAll task uses these
// See more at: https://github.com/uswds/uswds-compile
uswds.paths.dist.components = distFolderLocation + '/uswds/components';
uswds.paths.dist.fonts = distFolderLocation + '/uswds/fonts';
uswds.paths.dist.img = distFolderLocation + '/uswds/images';
uswds.paths.dist.js = distFolderLocation + '/uswds/js';
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// Define what the dist folder should contain
// 
let buildConfiguration = {
  "@fpac/style": {
    components: {
      src: "src/components/**",
      dest: "fpac-style/components"
    },
    docs: {
      src: "src/docs/**",
      dest: "fpac-style/docs"
    },
    fonts: {
      src: "src/fonts/**",
      dest: "fpac-style/fonts"
    },
    images: {
      src: "src/images/**",
      dest: "fpac-style/images"
    },
    js: {
      src: "src/js/**",
      dest: "fpac-style/js"
    },
    styles: {
      // don't copy direct from src folder
      // src should come from wherever the .scss was compiled to
      src: "work/fpac-design-system.css",
      dest: "fpac-style/styles"
    }
  },
  "@uswds/uswds": {
      components: {
        src: "dist/components/**",
        dest: "uswds/js"
      },
      css: {
        src: "dist/css/**",
        dest: "uswds/css"
      },
      fonts: {
        src: "dist/fonts/**",
        dest: "uswds/fonts"
      },
      images: {
        src: "dist/img/**",
        dest: "uswds/img"
      },
      js: {
        src: "dist/js/**",
        dest: "uswds/js"
      },
  }
}
// ----------------------------------------------------------------


// ----------------------------------------------------------------
// Setup FPAC config for sass compliation
let fpacSassConfig = {
  src: 'src/styles/index.scss',
  filename: 'fpac-design-system.css',
  workFolderName: 'work'
}
// ----------------------------------------------------------------

// A 'group' is a javascript object that has 2 fields:
//    src - a regex pattern to match files
//    dest - a target foldername to copy matched files into
function copyFiles(folder, group) {
  let srcFiles = folder + '/' + group.src
  let target = distFolderLocation + '/' + group.dest
  log(colors.blue, `        ${srcFiles} → ${target}`);
  return src(`${srcFiles}`.replace("//", "/")).pipe(
    dest(target)
  );
}

function copyGroups(folder, groupList) {
  for (const groupName in groupList) {
    let group = groupList[groupName]
    log(colors.blue, `    Group: ${groupName}`);
    copyFiles(folder, group)
  }
}

// only copy the @fpac/style file sets
async function copyFpacStyles() {
  log(colors.blue, `\nCopying @fpac/style module...`);
  // copy from the root of the workspace
  copyGroups('.', buildConfiguration['@fpac/style'])
}

// copy everything EXCEPT @fpac/style file sets
async function copyThirdParty() {
  for (const dependencyName in buildConfiguration) {
    if (dependencyName != '@fpac/style') {
      log(colors.blue, `\nCopying thirdParty dependency: ${dependencyName}`);
      // copy from this thirdParty dependency's root folder within node_modules
      copyGroups(`./node_modules/${dependencyName}`, buildConfiguration[dependencyName])
    }
  }
}

async function buildDist() {
  copyFpacStyles()
  copyThirdParty()
}

async function doBuildAll () {
  log(colors.blue, `Creating folder and copying configured filesets to: ${distFolderLocation}`);
  series(doClean, doSassCompile, buildDist)()
}

async function doSassCompile () {
    let inputFile = fpacSassConfig.src;
    let outputFile = fpacSassConfig.workFolderName + "/" + fpacSassConfig.filename;

    // delete the target file, just in case
    if (fs.existsSync(outputFile)) {
        console.info('Cleaning target file location: ' + outputFile)
        fs.rmSync(outputFile);
    }

    console.info('Sass compilation starting...')
    let compiledSass = sass.compile(inputFile, {
        logger: {
            warn (message, options) {
                // do nothing
            }
        },
        loadPaths: [
            './node_modules/@uswds/uswds',
            './node_modules/@uswds/uswds/packages'
        ]
    });
    console.info('Sass compilation done!')

    console.info('Writing compiled css to: ' + outputFile)
    if (!fs.existsSync(fpacSassConfig.workFolderName)) {
        fs.mkdirSync(fpacSassConfig.workFolderName, { recursive: true})
    }
    fs.writeFileSync(outputFile, compiledSass.css)
    await Promise.resolve(outputFile)
}

async function doClean() {
    cleanFolder('./work')
    cleanFolder('./dist')
}

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
    return true; // Success
  } catch (error) {
    console.error(`Error deleting folder: ${error.message}`);
    throw error; // Rethrow error to maintain similar behavior to the original
  }  
}

// USWDS functions
exports.init = uswds.init;
exports.compile = uswds.compile;
exports.compileSass = uswds.compileSass;
exports.update = uswds.updateUswds; // copies all assets and compiles all sass
exports.watch = uswds.watch;
exports.copyAll = uswds.copyAll;

// FPAC functions
exports.buildAll = doBuildAll
exports.clean = doClean
exports.sassCompile = doSassCompile
