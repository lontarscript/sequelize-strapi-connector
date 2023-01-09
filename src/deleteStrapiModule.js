const path = require('path');
const fs = require('fs');

/**
 * Handle Throw Error
 * @param {Object} e Error Object
 * @returns {Object} Error Object
 */
const handleThrowError = (e) =>
  new Error(`failed to delete strapi module causes : \n${e.message}`);

/**
 * Delete Strapi Module base on collection name
 * @param {string} filePath path of root strapi directory
 * @param {string} collectionName collection/folder name
 */
module.exports = (filePath, collectionName) => {
  try {
    if (!filePath || !collectionName)
      throw new Error('filepath or collection name must be provided');

    if (typeof filePath !== 'string' || typeof collectionName !== 'string')
      throw new Error('filepath or collection name has wrong data type');

    const STRAPI_DIR = path.resolve(`${filePath}/src/api/${collectionName}`);

    if (!fs.existsSync(STRAPI_DIR))
      throw new Error('strapi file path is not found or valid');

    fs.rmSync(STRAPI_DIR, { recursive: true, force: true });

    console.log(`success delete strapi module ${STRAPI_DIR}`);
  } catch (error) {
    throw handleThrowError(error);
  }
};
