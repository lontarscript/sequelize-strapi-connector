const helper = require('../../../src/helper');

describe('test function helper', () => {
  it('should return certain value when passing non valid arguments', () => {
    // Given
    const textExample = false;
    const textExample1 = {};
    const textExample2 = [];
    const textExample3 = true;
    const textExample4 = 1;
    const textExample5 = 2;
    const textExample6 = 'non json string';
    const textExample7 = null;

    // When
    const isPlural = helper.isPlural(textExample);
    const singular = helper.makeSingular(textExample1);
    const plural = helper.makePlural(textExample2);
    const capitalize = helper.capitalizeFirstLetter(textExample3);
    const removePattern = helper.removePattern(textExample4);
    const addPattern = helper.removePattern(textExample5);
    const jsonParse = helper.safeJSONParse(textExample6);
    const jsonParse2 = helper.safeJSONParse(textExample7);

    // Then
    expect(isPlural).toStrictEqual(false);
    expect(singular).toStrictEqual('');
    expect(plural).toStrictEqual('');
    expect(capitalize).toStrictEqual('');
    expect(removePattern).toStrictEqual('');
    expect(addPattern).toStrictEqual('');
    expect(jsonParse).toStrictEqual(false);
    expect(jsonParse2).toStrictEqual(false);
  });

  it('should return certain value when passing valid arguments', () => {
    // Given
    const textExample = 'doctors';
    const textExample1 = 'users';
    const textExample2 = 'patient';
    const textExample3 = 'hello';
    const textExample4 = 'hello worlds!';
    const textExample5 = 'strapiType strapiMediaType';
    const textExample6 = 'allowedStrapiMediaType';
    const textExample7 = 'allowedMediaType type dataType';
    const textExample8 = '{"name": "JohnDoe", "age": 10}';

    // When
    const isPlural = helper.isPlural(textExample);
    const singular = helper.makeSingular(textExample1);
    const plural = helper.makePlural(textExample2);
    const capitalize = helper.capitalizeFirstLetter(textExample3);
    const capitalize2 = helper.capitalizeFirstLetter(textExample4);
    const removePattern = helper.removePattern(textExample5, 'strapi');
    const removePattern2 = helper.removePattern(textExample6, 'strapi');
    const addPattern = helper.addPattern(textExample7, 'strapi');
    const jsonParse = helper.safeJSONParse(textExample8);

    // Then
    expect(isPlural).toStrictEqual(true);
    expect(singular).toStrictEqual('user');
    expect(plural).toStrictEqual('patients');
    expect(capitalize).toStrictEqual('Hello');
    expect(capitalize2).toStrictEqual('Hello Worlds!');
    expect(removePattern).toStrictEqual('type mediaType');
    expect(removePattern2).toStrictEqual('allowedMediaType');
    expect(addPattern).toStrictEqual(
      'strapiAllowedMediaType strapiType strapiDataType'
    );
    expect(jsonParse).toMatchObject({ name: 'JohnDoe', age: 10 });
  });

  it('test function extractArgs', () => {
    // Given
    const exampleArgs = [null, null, '--help'];
    const exampleArgs2 = [
      null,
      null,
      '--strapi_to_sequelize',
      '--input',
      'example/strapi_dir',
      '--output',
      'example/sequelize_dir'
    ];

    // When
    const args = helper.extractArgs(exampleArgs);
    const args2 = helper.extractArgs(exampleArgs2);

    // Then
    expect(args).toMatchObject({ '--help': true });
    expect(args2).toMatchObject({
      '--strapi_to_sequelize': true,
      '--input': 'example/strapi_dir',
      '--output': 'example/sequelize_dir'
    });
  });
});
