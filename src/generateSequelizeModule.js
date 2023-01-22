/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { default: generate } = require('@babel/generator');
const translateStrapiModule = require('./translateStrapiModule');

module.exports = (sourcePath, collectionName, targetPath) => {
  if (!fs.existsSync(sourcePath)) throw new Error('source path not exists');
  if (!fs.existsSync(targetPath)) throw new Error('target path not exists');
  if (!collectionName || typeof collectionName !== 'string')
    throw new Error('collection name not provided or not valid');

  const STRAPI_SCHEMA_DIR = path.resolve(
    `${sourcePath}/src/api/${collectionName}/content-types/${collectionName}/schema.json`
  );

  if (!fs.existsSync(STRAPI_SCHEMA_DIR))
    throw new Error('strapi schema.json files not found');

  const sequelizeObjTranslated = translateStrapiModule(
    fs.readFileSync(STRAPI_SCHEMA_DIR)
  );

  // write migration files
  if (!fs.existsSync(path.resolve(targetPath, 'migrations')))
    fs.mkdirSync(path.resolve(targetPath, 'migrations'));
  fs.writeFileSync(
    path.resolve(
      targetPath,
      'migrations',
      `${Math.floor(Date.now() / 1000)}-${collectionName}.js`
    ),
    generate(sequelizeObjTranslated.migration).code
  );

  // write model files
  if (!fs.existsSync(path.resolve(targetPath, 'models')))
    fs.mkdirSync(path.resolve(targetPath, 'models'));
  fs.writeFileSync(
    path.resolve(targetPath, 'models', `${collectionName}.js`),
    generate(sequelizeObjTranslated.model).code
  );

  console.log('finish generate sequelize module');
};
