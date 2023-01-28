/**
 * Check text is singular or not base on last characters
 * @param {String} txt
 * @returns {Boolean}
 */
const isPlural = (txt) =>
  typeof txt === 'string'
    ? txt.split('')[txt.split('')?.length - 1]?.toLowerCase() === 's' || false
    : false;

/**
 * Make text becoming plural with adding letter 's' on the last characters
 * @param {String} txt
 * @returns {String}
 */
const makePlural = (txt) => (typeof txt === 'string' ? `${txt}s` : '');

/**
 * Make text becoming singular with removing last characters
 * @param {String} txt
 * @returns {String}
 */
const makeSingular = (txt) =>
  typeof txt === 'string' ? txt.substring(0, txt.split('').length - 1) : '';

/**
 * Capitalize first letter of each word that separated by spaces
 * @param {*} txt
 * @returns {String}
 */
const capitalizeFirstLetter = (txt) =>
  typeof txt === 'string'
    ? txt
        .split(' ')
        .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
        .join(' ')
    : '';

/**
 * Remove spesific incase sensitive text pattern from string value
 * @param {String} txt
 * @param {String} pattern
 * @returns {String}
 */
const removePattern = (txt, pattern) =>
  typeof txt === 'string' && typeof pattern === 'string'
    ? txt
        .split(' ')
        .map((item) =>
          item
            .split(new RegExp(pattern, 'gi'))
            .filter((item) => item)
            .map((item, index) =>
              index
                ? capitalizeFirstLetter(item)
                : `${item.charAt(0).toLowerCase()}${item.slice(1)}`
            )
            .join('')
        )
        .join(' ')
    : '';

/**
 * Add spesific text pattern to string value
 * @param {String} txt
 * @param {String} pattern
 * @returns {String}
 */
const addPattern = (txt, pattern) =>
  typeof txt === 'string' && typeof pattern === 'string'
    ? txt
        .split(' ')
        .map((item) => `${pattern}${capitalizeFirstLetter(item)}`)
        .join(' ')
    : '';

/**
 * Safe parse JSON with catching error
 * @param {String} jsonString
 * @returns {Object | Boolean}
 */
const safeJSONParse = (jsonString) => {
  try {
    if (!jsonString || typeof jsonString !== 'string') return false;
    return JSON.parse(jsonString);
  } catch (_) {
    return false;
  }
};

/**
 * Check is next array item argument exists and defined as arguments
 * @param {String} itemArr
 * @returns {String | Boolean}
 */
const isExistsAndNotMatch = (itemArr) =>
  itemArr && !/^--\w+$/.test(itemArr) ? itemArr : true;

/**
 * Reduce and build object arguments
 * @param {Object} prev
 * @param {String} curr
 * @param {Number} i
 * @param {Object} arr
 * @returns {Object}
 */
const reduceArgs = (prev, curr, i, arr) =>
  /^--\w+$/.test(curr)
    ? { ...prev, [curr]: isExistsAndNotMatch(arr[i + 1]) }
    : prev;

/**
 * Extract arguments from process.argv
 * @param {Object} argv
 * @returns {Object}
 */
const extractArgs = (argv) =>
  argv?.length > 2 ? argv.slice(2).reduce(reduceArgs, {}) : null;

/**
 * Validate arguments object based on rules boject
 * @param {Object} args
 * @param {Object} allowedArgs
 * @returns {Boolean}
 */
const validateArgs = (args, allowedArgs) =>
  /*  eslint-disable valid-typeof */
  Object.entries(args)?.length
    ? Object.entries(args).every(
        (item) =>
          allowedArgs?.[item[0]] && typeof item[1] === allowedArgs?.[item[0]]
      )
    : false;

module.exports = {
  isPlural,
  makePlural,
  makeSingular,
  capitalizeFirstLetter,
  removePattern,
  addPattern,
  safeJSONParse,
  extractArgs,
  validateArgs
};
