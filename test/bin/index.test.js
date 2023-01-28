const path = require('path');
const { exec } = require('child_process');

describe('test bin/index.js', () => {
  test('should print certain message when get wrong arguments', async () => {
    // Given
    const EXPECTED_MESSAGE =
      'not valid arguments, see: `sequelize-strapi-connector --help`';

    // When
    const command = exec(
      `node ${path.resolve(__dirname, '../../bin/index.js')} --false-arguments`
    );
    const getCommandOuput = (child) =>
      new Promise((resolve) =>
        child.stderr.on('data', (data) => resolve(data.toString().trim()))
      );
    const output = await getCommandOuput(command);

    // Then
    expect(output).toBe(EXPECTED_MESSAGE);
  });

  test('should print help message', async () => {
    // Given
    const EXPECTED_MESSAGE_HELPER = `Usage: sequelize-strapi-connector [TYPE_COMMAND] [INPUT_ARGUMENTS] [INPUT_FILE_PATH] [OUTPUT_ARGUMENTS] [OUTPUT_FILE_PATH]
Example: sequelize-strapi-connector --strapi_to_sequelize --input /project/strapi --output /project/sequelize
Arguments: 
    --helper                  print example command and list of arguments
    --sequelize_to_strapi     convert sequelize migration file to strapi api module
    --strapi_to_sequelize     convert strapi schema object to sequelize file migration and model
    --input                   define location input source directory/files
    --output                  define location output source directory/files`;

    // When
    const command = exec(
      `node ${path.resolve(__dirname, '../../bin/index.js')} --help`
    );
    const getCommandOuput = (child) =>
      new Promise((resolve) =>
        child.stdout.on('data', (data) => resolve(data.toString().trim()))
      );
    const output = await getCommandOuput(command);

    // Then
    expect(output).toBe(EXPECTED_MESSAGE_HELPER);
  });
});
