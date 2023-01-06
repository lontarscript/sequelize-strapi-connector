const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const validate = require('./validateSequelizeObject');
const generate = require('./generateStrapiObject');

/**
 * Handle Throw Error
 * @param {Object} e Error Object
 * @returns {Object} Error Object
 */
const handleThrowError = (e) =>
  new Error(`failed to create strapi module causes : \n${e.message}`);

/**
 * Create Strapi Module
 * @param {Object} info Object Info
 * @param {Object} sequelizeObj SequelizeObject
 */
module.exports = (sequelizeObj, info) => {
  try {
    if (!info?.tableName || !info?.database)
      throw new Error('table name and database info should provided');

    if (info?.database?.toLowerCase() !== 'postgres')
      throw new Error('only postgresql database supported');

    if (!process.env?.STRAPI_DIR)
      throw new Error('environment variable STRAPI_DIR not defined');

    const obj = validate(sequelizeObj);
    const strapiObject = generate(obj, info);

    const STRAPI_API_DIR = path.resolve(
      `${process.env.STRAPI_DIR}/src/api/${strapiObject.info.singularName}`
    );

    // Check and create related directory
    if (!fs.existsSync(STRAPI_API_DIR)) {
      fs.mkdirSync(path.resolve(STRAPI_API_DIR), { recursive: true });
      fs.mkdirSync(
        path.resolve(
          `${STRAPI_API_DIR}/content-types/${strapiObject.info.singularName}`
        ),
        { recursive: true }
      );
      fs.mkdirSync(path.resolve(`${STRAPI_API_DIR}/controllers`));
      fs.mkdirSync(path.resolve(`${STRAPI_API_DIR}/routes`));
      fs.mkdirSync(path.resolve(`${STRAPI_API_DIR}/services`));
    }

    // Create schema.json
    fs.writeFileSync(
      path.resolve(
        `${STRAPI_API_DIR}/content-types/${strapiObject.info.singularName}/schema.json`
      ),
      JSON.stringify(strapiObject)
    );

    // Create controller
    execSync(
      `sed 's/COLLECTION/${
        strapiObject.info.singularName
      }/g;s/TYPEFUNCTION/controller/g;s/FUNCTION/createCoreController/g' ${path.resolve(
        __dirname,
        'templates/strapi.js'
      )} > ${path.resolve(
        STRAPI_API_DIR,
        'controllers',
        strapiObject.info.singularName + '.js'
      )}`
    );

    // Create routes
    execSync(
      `sed 's/COLLECTION/${
        strapiObject.info.singularName
      }/g;s/TYPEFUNCTION/router/g;s/FUNCTION/createCoreRouter/g' ${path.resolve(
        __dirname,
        'templates/strapi.js'
      )} > ${path.resolve(
        STRAPI_API_DIR,
        'routes',
        strapiObject.info.singularName + '.js'
      )}`
    );

    // Create services
    execSync(
      `sed 's/COLLECTION/${
        strapiObject.info.singularName
      }/g;s/TYPEFUNCTION/service/g;s/FUNCTION/createCoreService/g' ${path.resolve(
        __dirname,
        'templates/strapi.js'
      )} > ${path.resolve(
        STRAPI_API_DIR,
        'services',
        strapiObject.info.singularName + '.js'
      )}`
    );

    console.log('success generate strapi module on directory', STRAPI_API_DIR);
  } catch (error) {
    throw handleThrowError(error);
  }
};
