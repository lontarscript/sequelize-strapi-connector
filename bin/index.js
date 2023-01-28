#!/usr/bin/env node
// const path = require('path');
// const fs = require('fs');
// const { parse } = require('@babel/parser');
// const { default: generate } = require('@babel/generator');
const helper = require('../src/helper');

const ALLOWED_ARGS = {
  '--help': 'boolean',
  '--sequelize_to_strapi': 'boolean',
  '--strapi_to_sequelize': 'boolean',
  '--input': 'string',
  '--output': 'string'
};

const HELPER_DISPLAY_MESSAGE = `Usage: sequelize-strapi-connector [TYPE_COMMAND] [INPUT_ARGUMENTS] [INPUT_FILE_PATH] [OUTPUT_ARGUMENTS] [OUTPUT_FILE_PATH]
Example: sequelize-strapi-connector --strapi_to_sequelize --input /project/strapi --output /project/sequelize
Arguments: 
    --helper                  print example command and list of arguments
    --sequelize_to_strapi     convert sequelize migration file to strapi api module
    --strapi_to_sequelize     convert strapi schema object to sequelize file migration and model
    --input                   define location input source directory/files
    --output                  define location output source directory/files`;

const main = async () => {
  // extract args
  const args = helper.extractArgs(process.argv);

  // validate args
  if (!helper.validateArgs(args, ALLOWED_ARGS))
    console.log(
      'not valid arguments, see: `sequelize-strapi-connector --help`'
    );

  // display help message
  if (args?.['--help']) {
    console.log(HELPER_DISPLAY_MESSAGE);
    process.exit(0);
  }

  // sequelize to strapi process
  if (args?.['--sequelize_to_strapi']) console.log('under maintenance');

  // strapi to sequelize prcoess
  if (args?.['--strapi_to_sequelize']) console.log('under maintenance');
};

main();
