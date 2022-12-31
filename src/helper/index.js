module.exports = {
  /**
   * Check text is singular or not base on last characters
   * @param {String} txt
   * @returns {Boolean}
   */
  isPlural: (txt) =>
    typeof txt === 'string'
      ? txt.split('')[txt.split('')?.length - 1]?.toLowerCase() === 's' || false
      : false,
  /**
   * Make text becoming plural with adding letter 's' on the last characters
   * @param {String} txt
   * @returns {String}
   */
  makePlural: (txt) => (typeof txt === 'string' ? `${txt}s` : ''),
  /**
   * Make text becoming singular with removing last characters
   * @param {String} txt
   * @returns {String}
   */
  makeSingular: (txt) =>
    typeof txt === 'string' ? txt.substring(0, txt.split('').length - 1) : '',
  /**
   * Capitalize first letter of each word that separated by spaces
   * @param {*} txt
   * @returns {String}
   */
  capitalizeFirstLetter: (txt) =>
    typeof txt === 'string'
      ? txt
          .split(' ')
          .map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
          .join(' ')
      : ''
};
