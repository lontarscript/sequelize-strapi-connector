const helper = require('./helper');
const strapiDataTypes = require('./schemas/sequelizeToStrapiDataTypes.json');

const DEFAULT_STRAPI_COLLECTION_OBJECT = {
  kind: 'collectionType',
  collectionName: false,
  info: {
    singularName: false,
    pluralName: false,
    displayName: false
  },
  options: {
    draftAndPublish: true
  },
  pluginOptions: {},
  attributes: {}
};

/**
 * Convert and Generate Strapi Collection Object
 * @param {Object} obj Sequelize Object
 * @param {Object} info Info Object
 * @returns {Object} Strapi Collection Object
 */
module.exports = (obj, info) => {
  if (!info?.tableName || !info?.database)
    throw new Error('table name and database info should provided');

  // initialize new object with deep copy
  const newObj = JSON.parse(JSON.stringify(DEFAULT_STRAPI_COLLECTION_OBJECT));

  newObj.info.singularName = helper.isPlural(info.tableName)
    ? helper.makeSingular(info.tableName)
    : info.tableName;
  newObj.info.pluralName = helper.isPlural(info.tableName)
    ? info.tableName
    : helper.makePlural(info.tableName);
  newObj.collectionName = newObj.info.pluralName;
  newObj.info.displayName = helper.capitalizeFirstLetter(info.tableName);

  for (const item in obj) {
    const field = obj[item];
    if (typeof field === 'function') {
      if (strapiDataTypes?.[info.database]?.[field?.name])
        newObj.attributes[item] = {
          type: strapiDataTypes?.[info.database]?.[field?.name]
        };
    } else {
      for (const key in field)
        if (key.includes('strapi'))
          newObj.attributes[item] = {
            ...newObj.attributes[item],
            [helper.removePattern(key, 'strapi')]: field[key]
          };

      if (!newObj.attributes[item])
        if (strapiDataTypes?.[info.database]?.[field?.type?.name])
          newObj.attributes[item] = {
            type: strapiDataTypes?.[info.database]?.[field?.type?.name]
          };
    }
  }

  return newObj;
};
