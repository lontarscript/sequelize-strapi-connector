const path = require('path');
const fs = require('fs');
const { parse } = require('@babel/parser');
const helper = require('./helper');
const sequelizeDataTypes = require('./schemas/strapiToSequelizeDataTypes.json');

const memberExpression = ({ objectName = '', methodName = '' }) => ({
  type: 'MemberExpression',
  object: { type: 'Identifier', name: objectName },
  property: { type: 'Identifier', name: methodName }
});

const objectExpression = (properties = []) => ({
  type: 'ObjectExpression',
  properties
});

const arrayExpression = (elements = []) => ({
  type: 'ArrayExpression',
  elements
});

const objectProperty = ({ key = '', value = null }) => ({
  type: 'ObjectProperty',
  key: { type: 'Identifier', name: key },
  value
});

const stringLiteral = (value) => ({ type: 'StringLiteral', value });

const booleanLiteral = (value) => ({ type: 'BooleanLiteral', value });

const isStrapiCustomProperties = function ([propertyKey, propertyValue]) {
  if (
    ['allowedTypes', 'multiple'].includes(propertyKey) ||
    propertyValue === 'media'
  ) {
    if (this?.skipStrapiCustomProperties) return false;

    const newProperty = {
      key: helper.addPattern(propertyKey, 'strapi'),
      value: null
    };

    if (typeof propertyValue === 'object' && propertyValue?.length)
      newProperty.value = arrayExpression(
        propertyValue.map((item) => stringLiteral(item))
      );

    if (typeof propertyValue === 'string')
      newProperty.value = stringLiteral(propertyValue);

    if (typeof propertyValue === 'boolean')
      newProperty.value = booleanLiteral(propertyValue);

    return objectProperty(newProperty);
  }

  return objectProperty({
    key: propertyKey,
    value: memberExpression({
      objectName: this.memberKey,
      methodName: sequelizeDataTypes?.[propertyValue] || 'STRING'
    })
  });
};

module.exports = (jsonBuffer) => {
  const schemaObj = helper.safeJSONParse(jsonBuffer?.toString());
  if (!schemaObj) throw new Error('invalid json buffer/format');

  const tableNames = schemaObj?.info?.pluralName;
  if (!tableNames) throw new Error('cannot get table names from json');

  const attributes = Object.entries(schemaObj?.attributes || '');
  if (!attributes?.length)
    throw new Error('attributes length must more than zero');

  // init sequelize migration ast object template
  const migrationTemplates = parse(
    fs
      .readFileSync(path.resolve(__dirname, 'templates/sequelizeMigration.js'))
      .toString()
  );

  // init sequelize model ast object template
  const modelTemplates = parse(
    fs
      .readFileSync(path.resolve(__dirname, 'templates/sequelizeModel.js'))
      .toString()
  );

  // alias sequelize ast expression
  const createTableExpression = migrationTemplates.program.body
    .at(0)
    .expression.right.properties.at(0)
    .body.body.at(0).expression.argument;
  const dropTableExpresson = migrationTemplates.program.body
    .at(0)
    .expression.right.properties.at(1)
    .body.body.at(0).expression.argument;
  const modelClassExpression = modelTemplates.program.body
    .at(1)
    .expression.right.body.body.at(0);
  const modelInitExpression = modelTemplates.program.body
    .at(1)
    .expression.right.body.body.at(1).expression;

  // inject migration table name
  createTableExpression.arguments.at(0).value = tableNames;
  dropTableExpresson.arguments.at(0).value = tableNames;

  // inject model and table name
  modelClassExpression.id.name = helper.capitalizeFirstLetter(
    helper.makeSingular(tableNames)
  );
  modelInitExpression.callee.object.name = helper.capitalizeFirstLetter(
    helper.makeSingular(tableNames)
  );
  modelInitExpression.arguments.at(1).properties.at(3).value.value =
    helper.capitalizeFirstLetter(helper.makeSingular(tableNames));
  modelInitExpression.arguments.at(1).properties.at(4).value.value = tableNames;

  // looping strapi attributes
  for (const [attributeKey, attributeValue] of Object.entries(
    schemaObj.attributes
  )) {
    // inject migration table column details
    createTableExpression.arguments.at(1).properties.push(
      objectProperty({
        key: attributeKey,
        value: objectExpression(
          Object.entries(attributeValue).map(isStrapiCustomProperties, {
            memberKey: 'Sequelize'
          })
        )
      })
    );

    // inject model table column
    modelInitExpression.arguments.at(0).properties.push(
      objectProperty({
        key: attributeKey,
        value: objectExpression(
          Object.entries(attributeValue)
            .map(isStrapiCustomProperties, {
              memberKey: 'DataTypes',
              skipStrapiCustomProperties: true
            })
            .filter((item) => item)
        )
      })
    );

    // sanitize unused columns in model
    modelInitExpression.arguments.at(0).properties =
      modelInitExpression.arguments
        .at(0)
        .properties.filter((item) => item?.value?.properties?.length);
  }

  return { migration: migrationTemplates, model: modelTemplates };
};
