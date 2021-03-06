#! /usr/bin/env node

// Modules
const argv      = require('minimist')(process.argv.slice(2));
const puppeteer = require('puppeteer');
const chalk     = require('chalk');

// Node
const fs        = require('fs');
const util      = require('util');
const readFile  = util.promisify(fs.readFile);

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
if (argv._.length < 1 && !options.list) {
  console.log(chalk`{red No URL provided. Stopping...}`);
  return;
}

// Take screenshots
(async () => {
  console.log(chalk`{yellow • Launching chrome...}`);

  let browser, page;

  try {
    // Launch chrome
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true
    });

    // Create a new page
    page = await browser.newPage();

    // Set the viewport
    await page.setViewport({
      width: options.width,
      height: options.height,
      deviceScaleFactor: options.scale
    });
  } catch(e) {
    console.log(chalk`{red Error launching chrome:}`);
    throw e;
  }

  console.log(chalk`{green ✔ Done.}`);

  if (options.list) {
    let listFileContents;

    // Load website list from local text file
    try {
      listFileContents = await readFile(options.list, 'utf8');
    } catch(e) {
      console.log(chalk`{red • Error reading from list file ${options.list}.}`);
    }

    // Parse list by space character
    const parsedList = listFileContents ? listFileContents.split(' ') : [];
    argv._ = parsedList;
  }
  
  // Screenshot each website provided
  let i = 0;
  for (let v of argv._) {
    // Insert new line
    console.log('');

    // Create a proper filename
    let fileName;
    if (options.name && options.name.length > 0) {
      fileName = options.name;

      if (argv._.length > 1) {
        fileName += `_${i}`;
      }
    }

    // Take the pic
    await takeScreenshot(v, page, fileName);

    i++;
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
 * @param {string} fileName Screenshot file name
 */
async function takeScreenshot(url, page, fileName, waitForRedirect) {
  if (typeof url !== 'string') return;

  // Remove newline characters
  url = url.replace(/\n/g, '');

  // Ensure there's a scheme on the URL
  if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
    url = `http://${url}`;
  }

  console.log(chalk`{yellow • Loading ${url}...}`);

  // Navigate to the url
  try {
    await page.goto(url);
  } catch(e) {
    console.log(chalk`{red • Error loading ${url}. Skipping...}`);
    return;
  }

  // Sleep
  if (options.sleep > 0) {
    console.log(chalk`{yellow • Sleeping for ${options.sleep}ms...}`);
    await new Promise(res => {
      setTimeout(() => res(), options.sleep);
    });
  }

  // Get location host
  let host;
  try {
    host = waitForRedirect ? await waitForHost(page, true) : await waitForHost(page);
  } catch(e) {
    if (waitForRedirect) {
      console.log(chalk`{red • Could not read from ${url}, even with a navigation timeout. Skipping...}`);
      return;
    }

    console.log(chalk`{yellow • Error reading from ${url}, possibly because of a redirect.\n}`);
    console.log(chalk`{yellow Trying again with a longer timeout... (this could take up to 30 seconds)\n}`)

    await takeScreenshot(url, page, fileName, true);
    return;
  }

  // Use default file name if no name was provided
  if (!fileName || fileName.length < 1) fileName = sanitizeFilename(host);

  console.log(chalk`{yellow • Taking screenshot of ${url}...}`);

  // Take the screenshot
  try {
    await page.screenshot({
      path: `${options.path}${fileName}.png`,
      fullPage: options.full,
      omitBackground: options.transparent,
      type: options.jpeg ? 'jpeg' : 'png',
      quality: options.quality
    });  
  } catch(e) {
    console.log(chalk`{red • Error taking screenshot of ${url}. Skipping...}`);
    return;
  }

  console.log(chalk`{green ✔ Screenshot saved to ${fileName}.png}`);
}

/**
 * Resolves the window hostname, will wait for navigation on failure
 * @param {*} page Puppeteer page
 * @param {boolean} waitForNavigation Whether to wait up to 30 seconds for a navigation to occur, such as a redirect
 */
async function waitForHost(page, waitForNavigation) {
  if (waitForNavigation) {
    await page.waitForNavigation();
    return await page.evaluate(() => Promise.resolve(window.location.host));
  } else {
    return await page.evaluate(() => Promise.resolve(window.location.host));
  }
}

/**
 * Cleans a URL to be used as a filename
 * @param {string} url Website URL to clean
 */
function sanitizeFilename(url) {
  // Remove scheme
  let fileName = url
    .replace(/http:\/\//g, '')
    .replace(/https:\/\//g, '')
    .replace(/\//g, '');

  // Remove final slash
  if (fileName[fileName.length - 1] === '/') {
    fileName = fileName.substring(0, fileName.length - 1);
  }

  return fileName;
}
