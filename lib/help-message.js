const chalk = require('chalk');

/**
 * Logs a formatted help message to the console
 * @param {String} name Package name
 * @param {number} version Package version
 * @param {Object} bin Package executable object
 * @param {Array<Object>} options CLI options object
 */
function helpMessage(name, version, bin, options) {
  let binArray = [];

  // Get all of the bin props
  for (let property in bin) {
    if (bin.hasOwnProperty(property)) {
      binArray.push(property);
    }
  }

  // Package name
  let packageName = chalk`{cyan ${name}} {gray ${version}}`;

  /**
   * Returns a bold, white, uppercase chalk-styled console text
   * @param {String} header Text to use for header
   * @return {String}
   */
  let header = header => chalk`{white.bold ${header.toUpperCase()}}`;

  // Usage bin
  let binOut = '';
  binArray.forEach((bin, index, array) => {
    binOut += '    ' + chalk`{italic ${bin}}` + chalk` {yellow [options] }` + chalk`{green [url(s)]}` + (index === array.length - 1 ? '' : '\n');
  });

  // Options
  let optionsTable = [];
  options.forEach(option => {
    let optionRow = [];

    // Add option data
    let fields = '';
    option.fields.forEach((field, index, array) => {
      fields += chalk`{green ${field}}` + (index === array.length - 1 ? '' : ', ');
    });
    optionRow.push(fields);
    optionRow.push(`${option.description}`);

    // Push row
    optionsTable.push(optionRow);
  });

  /**
   * Returns a formatted string from a given option table array
   * @param {Array<Array>} optTable Option table array
   * @param {number} padding Space between columns
   * @return {String}
   */
  let parseOptionsTable = (optTable, padding) => {
    let result = '';
    let maxLength = 0;

    // Determine max length of option strings
    optTable.forEach(row => maxLength = (row[0].length > maxLength ? row[0].length : maxLength));

    // Create help table row strings
    optTable.forEach((row, index, array) => {
      let rowString = row[0];
      while (rowString.length < maxLength + padding) {
        rowString += ' ';
      }
      rowString += row[1];
      result += '    ' + rowString + (index === array.length - 1 ? '' : '\n');
    });
    return result;
  };

  // Log the formatted help message
  console.log(`
  ${packageName}
  
  ${header('usage')}

${binOut}

  ${header('options')}

${parseOptionsTable(optionsTable, 3)}
  `);
}

module.exports = helpMessage;
