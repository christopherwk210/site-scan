#! /usr/bin/env node

// Modules
const argv      = require('minimist')(process.argv.slice(2));
const puppeteer = require('puppeteer');
const chalk     = require('chalk');

// Local
const pkg       = require('../package.json');
const help      = require('./help-message');
const options   = require('./options.js');

// Show help message
if (argv.h || argv['help']) {
  help(pkg.name, pkg.version, pkg.bin, options.definitions);
  return;
}

// Loop through each definition
options.definitions.forEach(definition => {
  // Loop through each field
  definition.fields.some(field => {
    // Remove the hyphens from the field
    let fixedField = field.replace(/-/g, '');

    // Test presence
    if (argv[fixedField]) {
      // Call action if found
      if (definition.action) {
        definition.action(argv[fixedField]);
      }

      // Don't continue to other fields
      return true;
    }
  });
});

// Stop on no URL provided
if (argv._.length < 1) {
  console.log(chalk`{red No URL provided. Stopping...}`);
  return;
}

// Take screenshots
(async () => {
  console.log(chalk`{yellow • Launching chrome...}`);

  let browser, page;

  try {
    // Launch chrome
    browser = await puppeteer.launch();

    // Create a new page
    page = await browser.newPage();

    // Set the viewport
    await page.setViewport({
      width: options.width,
      height: options.height
    });
  } catch(e) {
    console.log(chalk`{red Error launching chrome:`);
    throw e;
  }

  console.log(chalk`{green ✔ Done.}`);

  // Screenshot each website provided
  for (let i = 0; i < argv._.length; i++) {
    // Insert new line
    console.log('');

    // Take the pic
    await takeScreenshot(argv._[i], page);
  }

  // Close the browser
  await browser.close();

  console.log('');
  console.log(chalk`{green ✔ Done. Have a great day!}`);
})();

/**
 * Takes a screenshot of the site at the URL provided
 * @param {string} url Website URL to screenshot
 * @param {*} page Puppeteer page
 */
async function takeScreenshot(url, page) {
  if (typeof url !== 'string') {
    return;
  }

  // Ensure there's a scheme on the URL
  if (url.indexOf('http://') !== 0 || url.indexOf('https://') !== 0) {
    url = `http://${url}`;
  }

  console.log(chalk`{yellow • Loading ${url}...}`);

  // Navigate to the url
  try {
    await page.goto(url);
  } catch(e) {
    console.log(chalk`{red • Error loading ${url}}`);
    throw e;
  }

  // Create a proper filename
  let fileName = sanitizeFilename(url);

  // Sleep
  if (options.sleep > 0) {
    console.log(chalk`{yellow • Sleeping for ${options.sleep}ms...}`);
    await new Promise(res => {
      setTimeout(() => res(), options.sleep);
    });
  }

  console.log(chalk`{yellow • Taking screenshot of ${url}...}`);

  // Take the screen shot
  try {
    await page.screenshot({
      path: `${options.path}${fileName}.png`,
      fullPage: options.full,
      omitBackground: options.transparent,
      type: options.jpeg ? 'jpeg' : 'png',
      quality: options.quality
    });  
  } catch(e) {
    console.log(chalk`{red • Error taking screenshot of ${url}}`);
    throw e;
  }

  console.log(chalk`{green ✔ Screenshot saved to ${fileName}.png}`);
}

/**
 * Cleans a URL to be used as a filename
 * @param {string} url Website URL to clean
 */
function sanitizeFilename(url) {
  // Remove scheme
  let fileName = url
    .replace('http://', '')
    .replace('https://', '');

  // Remove final slash
  if (fileName[fileName.length - 1] === '/') {
    fileName = fileName.substring(0, fileName.length - 1);
  }

  return fileName;
}
