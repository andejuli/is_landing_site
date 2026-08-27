const fs = require("fs");
const path = require("path");
const { minify: minifyHtml } = require("html-minifier-terser");
const CleanCSS = require("clean-css");
const { minify: minifyJs } = require("terser");

const rootDir = __dirname;
const distDir = path.join(rootDir, "dist");

// Files we want to process
const htmlFiles = [
  "index.html",
  "degree-map.html",
  "accelerated-degree.html"
];

const cssFiles = [
  "styles.css"
];

const jsFiles = [
  "script.js"
];

async function build() {
  console.log("Building static website...");

  // ---------------------------------------------
  // 1. Remove old dist directory
  // ---------------------------------------------
  fs.rmSync(distDir, {
    recursive: true,
    force: true
  });

  // ---------------------------------------------
  // 2. Create new dist directory
  // ---------------------------------------------
  fs.mkdirSync(distDir, {
    recursive: true
  });

  // ---------------------------------------------
  // 3. Minify HTML
  // ---------------------------------------------
  for (const file of htmlFiles) {
    const sourcePath = path.join(rootDir, file);
    const destinationPath = path.join(distDir, file);

    const html = fs.readFileSync(sourcePath, "utf8");

    const minified = await minifyHtml(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true
    });

    fs.writeFileSync(destinationPath, minified);

    console.log(`HTML: ${file}`);
  }

  // ---------------------------------------------
  // 4. Minify CSS
  // ---------------------------------------------
  for (const file of cssFiles) {
    const sourcePath = path.join(rootDir, file);
    const destinationPath = path.join(distDir, file);

    const css = fs.readFileSync(sourcePath, "utf8");

    const result = new CleanCSS({
      level: 2
    }).minify(css);

    if (result.errors.length > 0) {
      throw new Error(
        `CSS minification failed:\n${result.errors.join("\n")}`
      );
    }

    fs.writeFileSync(destinationPath, result.styles);

    console.log(`CSS:  ${file}`);
  }

  // ---------------------------------------------
  // 5. Minify JavaScript
  // ---------------------------------------------
  for (const file of jsFiles) {
    const sourcePath = path.join(rootDir, file);
    const destinationPath = path.join(distDir, file);

    const javascript = fs.readFileSync(sourcePath, "utf8");

    const result = await minifyJs(javascript, {
      compress: true,
      mangle: true
    });

    if (!result.code) {
      throw new Error(`JavaScript minification failed: ${file}`);
    }

    fs.writeFileSync(destinationPath, result.code);

    console.log(`JS:   ${file}`);
  }

  // ---------------------------------------------
  // 6. Copy assets directory
  // ---------------------------------------------
  const assetsSource = path.join(rootDir, "assets");
  const assetsDestination = path.join(distDir, "assets");

  fs.cpSync(assetsSource, assetsDestination, {
    recursive: true
  });

  console.log("Assets copied.");

  // ---------------------------------------------
  // Done
  // ---------------------------------------------
  console.log("\nBuild complete.");
  console.log(`Output: ${distDir}`);
}

build().catch((error) => {
  console.error("\nBuild failed:");
  console.error(error);
  process.exit(1);
});
